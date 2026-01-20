import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  RefreshCw, 
  Filter, 
  ChevronDown, 
  ChevronRight,
  Check,
  X,
  Clock,
  UserX,
  CalendarDays,
  ListTodo,
  Settings,
  Users
} from "lucide-react";

// Lista de tipos de cuidados del video ResiPlus
const DEFAULT_CARE_TYPES = [
  { code: "CONTROL_TA", name: "Control TA", category: "control" as const, requiresResult: true, resultType: "text" as const, resultUnit: "mmHg" },
  { code: "CONTROL_FC", name: "Control FC", category: "control" as const, requiresResult: true, resultType: "numeric" as const, resultUnit: "lpm" },
  { code: "CONTROL_FR", name: "Control FR", category: "control" as const, requiresResult: true, resultType: "numeric" as const, resultUnit: "rpm" },
  { code: "CONTROL_SO2", name: "Saturación O2", category: "control" as const, requiresResult: true, resultType: "numeric" as const, resultUnit: "%" },
  { code: "GLUCEMIA", name: "Glucemia capilar", category: "control" as const, requiresResult: true, resultType: "numeric" as const, resultUnit: "mg/dl" },
  { code: "TEMPERATURA", name: "Temperatura", category: "control" as const, requiresResult: true, resultType: "numeric" as const, resultUnit: "°C" },
  { code: "PESO", name: "Peso", category: "control" as const, requiresResult: true, resultType: "numeric" as const, resultUnit: "kg" },
  { code: "CURA", name: "Cura", category: "control" as const },
  { code: "ECG", name: "ECG", category: "control" as const },
  { code: "INGESTA_LIQUIDA", name: "Ingesta líquida", category: "control" as const },
  { code: "INGESTA_SOLIDA", name: "Ingesta sólida", category: "control" as const },
  { code: "INYECTABLES", name: "Inyectables", category: "control" as const },
  { code: "NEBULIZACIONES", name: "Nebulizaciones", category: "control" as const },
  { code: "OXIGENOTERAPIA", name: "Oxigenoterapia", category: "control" as const },
  { code: "PARCHE", name: "Parche", category: "control" as const },
  { code: "MOVILIZACIONES", name: "Movilizaciones", category: "actividad" as const },
  { code: "TRANSFERENCIAS", name: "Transferencias", category: "actividad" as const },
  { code: "CAMBIO_POSTURAL", name: "Cambio postural", category: "actividad" as const },
  { code: "CAMBIO_PANAL", name: "Cambio pañal", category: "actividad" as const },
  { code: "BANO", name: "Baño", category: "actividad" as const },
  { code: "SONDA_VESICAL", name: "Sonda vesical", category: "control" as const },
  { code: "SONDA_NASOGASTRICA", name: "Sonda nasogástrica", category: "control" as const },
  { code: "VACUNACIONES", name: "Vacunaciones", category: "registro" as const },
  { code: "CINESITERAPIA", name: "Cinesiterapia grupal", category: "actividad" as const },
];

// Estado visual para tareas
const TASK_STATUS_CONFIG = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  completed: { label: "Realizado", color: "bg-green-100 text-green-800", icon: Check },
  not_done: { label: "No Realizado", color: "bg-red-100 text-red-800", icon: X },
  absent: { label: "Ausente", color: "bg-gray-100 text-gray-800", icon: UserX },
  cancelled: { label: "Cancelado", color: "bg-gray-200 text-gray-600", icon: X },
};

export default function CarePlans() {
  const [location, setLocation] = useLocation();
  
  // Simple logic to get tab from query param manual parsing or just default
  // Wouter doesn't have useSearchParams easily accessible in all versions, 
  // so we'll check location string search
  const getTabFromUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get("tab") || "tareas";
    }
    return "tareas";
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  // Listen for URL changes to update tab if needed
  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location]);
  const [selectedResident, setSelectedResident] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split("T")[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>({});

  // Queries
  const residentsQuery = trpc.residents.list.useQuery({});
  const careTypesQuery = trpc.carePlanning.getCareTypes.useQuery({});
  const careGroupsQuery = trpc.carePlanning.getCareGroups.useQuery({});
  const careTasksQuery = trpc.carePlanning.getCareTasksByResident.useQuery(
    { residentId: selectedResident || 0 },
    { enabled: !!selectedResident }
  );
  const scheduledTasksQuery = trpc.carePlanning.getScheduledTasks.useQuery({
    dateFrom: dateFrom,
    dateTo: dateTo,
    status: statusFilter !== "all" ? statusFilter as any : undefined,
    residentId: selectedResident || undefined,
  });

  // Mutations
  const createCareTypeMutation = trpc.carePlanning.createCareType.useMutation();
  const createCareTaskMutation = trpc.carePlanning.createCareTask.useMutation();
  const createCareGroupMutation = trpc.carePlanning.createCareGroup.useMutation();
  const executeTaskMutation = trpc.carePlanning.executeScheduledTask.useMutation();
  const updateStatusMutation = trpc.carePlanning.updateScheduledTaskStatus.useMutation();
  const updateCareTypeMutation = trpc.carePlanning.updateCareType.useMutation();

  // Inicializar tipos de cuidados si no existen
  const initializeCareTypes = async () => {
    for (const ct of DEFAULT_CARE_TYPES) {
      try {
        await createCareTypeMutation.mutateAsync(ct);
      } catch (e) {
        // Ignore duplicates
      }
    }
    
    // Force update CONTROL_TA to text if it is numeric
    const controlTa = careTypesQuery.data?.find(ct => ct.code === "CONTROL_TA");
    if (controlTa && controlTa.resultType === "numeric") {
       try {
         await updateCareTypeMutation.mutateAsync({
           id: controlTa.id,
           resultType: "text"
         });
       } catch (e) {
          console.error("Failed to update CONTROL_TA", e);
       }
    }

    careTypesQuery.refetch();
  };

  // Agrupar tareas programadas por estado
  const groupedTasks = scheduledTasksQuery.data?.reduce((acc, task) => {
    const status = task.status || "pending";
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {} as Record<string, typeof scheduledTasksQuery.data>) || {};

  const toggleGroup = (status: string) => {
    setGroupExpanded(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const [executeTaskData, setExecuteTaskData] = useState<{id: number, careName: string, unit: string, resultType: string} | null>(null);

  const handleExecuteTask = async (taskId: number, status: "completed" | "not_done" | "absent", careType?: any) => {
    if (status === "completed" && careType?.requiresResult) {
       // Open dialog for data entry
       setExecuteTaskData({
         id: taskId,
         careName: careType.name,
         unit: careType.resultUnit || "unidades",
         resultType: careType.resultType || "numeric"
       });
       return;
    }

    if (status === "completed") {
      await executeTaskMutation.mutateAsync({ id: taskId });
    } else {
      await updateStatusMutation.mutateAsync({ id: taskId, status });
    }
    scheduledTasksQuery.refetch();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Ribbon - Estilo ResiPlus */}
      <div className="bg-blue-600 text-white px-4 py-2 flex items-center gap-4 shadow-md">
        <h1 className="text-lg font-semibold">Planes de Cuidados</h1>
        <div className="flex-1" />
        <Select 
          value={selectedResident?.toString() || ""} 
          onValueChange={(v) => setSelectedResident(v ? parseInt(v) : null)}
        >
          <SelectTrigger className="w-64 bg-white text-gray-900">
            <SelectValue placeholder="Seleccionar Residente..." />
          </SelectTrigger>
          <SelectContent>
            {residentsQuery.data?.map((r) => (
              <SelectItem key={r.id} value={r.id.toString()}>
                {r.lastName}, {r.firstName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs Ribbon - Estilo ResiPlus */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-gray-100 border-b px-2">
          <TabsList className="h-10 bg-transparent">
            <TabsTrigger value="tareas" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <ListTodo className="w-4 h-4 mr-2" />
              TAREAS DE CUIDADOS
            </TabsTrigger>
            <TabsTrigger value="planificacion" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CalendarDays className="w-4 h-4 mr-2" />
              PLANIFICACIÓN
            </TabsTrigger>
            <TabsTrigger value="tipos" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4 mr-2" />
              TIPOS DE CUIDADOS
            </TabsTrigger>
            <TabsTrigger value="grupos" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              GRUPOS DE PLANIFICACIÓN
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAREAS DE CUIDADOS - Vista por residente */}
        <TabsContent value="tareas" className="flex-1 p-4 overflow-auto m-0">
          <Card>
            <CardHeader className="py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Tareas de Cuidados del Residente</CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setNewTaskDialogOpen(true)}
                  disabled={!selectedResident}
                >
                  <Plus className="w-4 h-4 mr-1" /> Nueva Tarea
                </Button>
                <Button size="sm" variant="outline" onClick={() => careTasksQuery.refetch()}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedResident ? (
                <div className="text-center py-8 text-gray-500">
                  Seleccione un residente para ver sus tareas de cuidados
                </div>
              ) : careTasksQuery.isLoading ? (
                <div className="text-center py-8">Cargando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-8">ESTADO</TableHead>
                      <TableHead>CUIDADO</TableHead>
                      <TableHead>SUBTIPO</TableHead>
                      <TableHead>DESDE</TableHead>
                      <TableHead>HASTA</TableHead>
                      <TableHead>HORA</TableHead>
                      <TableHead>RECURRENCIA</TableHead>
                      <TableHead>PROFESIONAL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {careTasksQuery.data?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-500">
                          No hay tareas de cuidados asignadas
                        </TableCell>
                      </TableRow>
                    ) : (
                      careTasksQuery.data?.map((task) => {
                        const careType = careTypesQuery.data?.find(ct => ct.id === task.careTypeId);
                        return (
                          <TableRow key={task.id} className="hover:bg-yellow-50">
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100">
                                <Check className="w-3 h-3" />
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{careType?.name || "—"}</TableCell>
                            <TableCell>{task.subtype || "—"}</TableCell>
                            <TableCell>{task.startDate ? new Date(task.startDate).toLocaleDateString("es-ES") : "—"}</TableCell>
                            <TableCell>{task.endDate ? new Date(task.endDate).toLocaleDateString("es-ES") : "Sin definir"}</TableCell>
                            <TableCell>{task.scheduledHour || "—"}</TableCell>
                            <TableCell>{task.recurrenceType === "daily" ? "Cada día" : task.recurrenceType === "weekly" ? "Semanal" : task.recurrenceType || "—"}</TableCell>
                            <TableCell>{task.professionalArea || "Enfermería"}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLANIFICACIÓN - Vista de tareas programadas por fecha */}
        <TabsContent value="planificacion" className="flex-1 p-4 overflow-auto m-0">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center gap-4">
                <CardTitle className="text-base">Planificación de Tareas</CardTitle>
                <div className="flex items-center gap-2 ml-4">
                  <Label className="text-sm">Desde:</Label>
                  <Input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-36 h-8"
                  />
                  <Label className="text-sm">Hasta:</Label>
                  <Input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-36 h-8"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 h-8">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="completed">Realizado</SelectItem>
                      <SelectItem value="not_done">No Realizado</SelectItem>
                      <SelectItem value="absent">Ausente</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => scheduledTasksQuery.refetch()}>
                    <Filter className="w-4 h-4 mr-1" /> Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-280px)]">
                {Object.entries(groupedTasks).map(([status, tasks]) => {
                  const config = TASK_STATUS_CONFIG[status as keyof typeof TASK_STATUS_CONFIG] || TASK_STATUS_CONFIG.pending;
                  const StatusIcon = config.icon;
                  const isExpanded = groupExpanded[status] !== false;
                  
                  return (
                    <div key={status} className="mb-4">
                      <button
                        onClick={() => toggleGroup(status)}
                        className={`w-full flex items-center gap-2 px-3 py-2 ${config.color} rounded-t-md font-medium text-sm`}
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <StatusIcon className="w-4 h-4" />
                        {config.label} — Total: {tasks?.length || 0}
                      </button>
                      
                      {isExpanded && tasks && tasks.length > 0 && (
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50 text-xs">
                              <TableHead>FECHA/HORA</TableHead>
                              <TableHead>RESIDENTE</TableHead>
                              <TableHead>CUIDADO</TableHead>
                              <TableHead>TIPO</TableHead>
                              <TableHead>RESULTADO</TableHead>
                              <TableHead>OBSERVACIONES</TableHead>
                              <TableHead>ACCIONES</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tasks.map((task) => {
                              const resident = residentsQuery.data?.find(r => r.id === task.residentId);
                              const careType = careTypesQuery.data?.find(ct => ct.id === task.careTypeId);
                              
                              return (
                                <TableRow key={task.id} className="text-sm">
                                  <TableCell>
                                    {task.scheduledDateTime 
                                      ? new Date(task.scheduledDateTime).toLocaleString("es-ES", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit"
                                        })
                                      : "—"}
                                  </TableCell>
                                  <TableCell>{resident ? `${resident.lastName}, ${resident.firstName}` : "—"}</TableCell>
                                  <TableCell className="font-medium">{careType?.name || "—"}</TableCell>
                                  <TableCell>{task.taskType === "group" ? "Grupal" : "Individual"}</TableCell>
                                  <TableCell>
                                    {task.resultValue ? (
                                      <span className="font-semibold text-blue-700">
                                        {task.resultValue} {careType?.resultUnit}
                                      </span>
                                    ) : "—"}
                                  </TableCell>
                                  <TableCell className="max-w-xs truncate">{task.notes || "—"}</TableCell>
                                  <TableCell>
                                    {status === "pending" && (
                                      <div className="flex gap-1">
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="h-7 px-2 bg-green-50 hover:bg-green-100"
                                          onClick={() => handleExecuteTask(task.id, "completed", careType)}
                                        >
                                          <Check className="w-3 h-3" />
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="h-7 px-2 bg-red-50 hover:bg-red-100"
                                          onClick={() => handleExecuteTask(task.id, "not_done", careType)}
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="h-7 px-2 bg-gray-50 hover:bg-gray-100"
                                          onClick={() => handleExecuteTask(task.id, "absent", careType)}
                                        >
                                          <UserX className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  );
                })}
                
                {Object.keys(groupedTasks).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay tareas programadas para el rango de fechas seleccionado
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TIPOS DE CUIDADOS */}
        <TabsContent value="tipos" className="flex-1 p-4 overflow-auto m-0">
          <Card>
            <CardHeader className="py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Tipos de Cuidados</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={initializeCareTypes} variant="outline">
                  Inicializar Tipos por Defecto
                </Button>
                <Button size="sm" variant="outline" onClick={() => careTypesQuery.refetch()}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>CÓDIGO</TableHead>
                    <TableHead>NOMBRE</TableHead>
                    <TableHead>CATEGORÍA</TableHead>
                    <TableHead>ÁREA PROFESIONAL</TableHead>
                    <TableHead>REQUIERE RESULTADO</TableHead>
                    <TableHead>UNIDAD</TableHead>
                    <TableHead>ACTIVO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {careTypesQuery.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">
                        No hay tipos de cuidados. Haga clic en "Inicializar Tipos por Defecto" para cargar la lista base.
                      </TableCell>
                    </TableRow>
                  ) : (
                    careTypesQuery.data?.map((ct) => (
                      <TableRow key={ct.id}>
                        <TableCell className="font-mono text-sm">{ct.code}</TableCell>
                        <TableCell className="font-medium">{ct.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            ct.category === "control" ? "bg-blue-50" :
                            ct.category === "actividad" ? "bg-green-50" : "bg-purple-50"
                          }>
                            {ct.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{ct.professionalArea}</TableCell>
                        <TableCell>{ct.requiresResult ? "Sí" : "No"}</TableCell>
                        <TableCell>{ct.resultUnit || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={ct.isActive ? "default" : "secondary"}>
                            {ct.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GRUPOS DE PLANIFICACIÓN */}
        <TabsContent value="grupos" className="flex-1 p-4 overflow-auto m-0">
          <Card>
            <CardHeader className="py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Grupos de Planificación</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setNewGroupDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Nuevo Grupo
                </Button>
                <Button size="sm" variant="outline" onClick={() => careGroupsQuery.refetch()}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>NOMBRE DEL GRUPO</TableHead>
                    <TableHead>TIPO</TableHead>
                    <TableHead>CUIDADO</TableHead>
                    <TableHead>PROFESIONAL</TableHead>
                    <TableHead>HORA/RECURRENCIA</TableHead>
                    <TableHead>RESIDENTES</TableHead>
                    <TableHead>ACTIVO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {careGroupsQuery.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">
                        No hay grupos de planificación. Cree uno nuevo para asignar tareas a múltiples residentes.
                      </TableCell>
                    </TableRow>
                  ) : (
                    careGroupsQuery.data?.map((group) => {
                      const careType = careTypesQuery.data?.find(ct => ct.id === group.careTypeId);
                      return (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {group.groupType}
                            </Badge>
                          </TableCell>
                          <TableCell>{careType?.name || "—"}</TableCell>
                          <TableCell>{group.professionalArea || "Enfermería"}</TableCell>
                          <TableCell>{group.scheduledHour || "—"}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="link" className="p-0 h-auto">
                              Ver residentes
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Badge variant={group.isActive ? "default" : "secondary"}>
                              {group.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: Nueva Tarea de Cuidado */}
      <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva Tarea de Cuidado</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            await createCareTaskMutation.mutateAsync({
              residentId: selectedResident!,
              careTypeId: parseInt(formData.get("careTypeId") as string),
              startDate: formData.get("startDate") as string,
              endDate: formData.get("endDate") as string || undefined,
              scheduledHour: formData.get("scheduledHour") as string || undefined,
              recurrenceType: formData.get("recurrenceType") as any || "none",
              professionalArea: "enfermeria",
            });
            setNewTaskDialogOpen(false);
            careTasksQuery.refetch();
          }}>
            <div className="space-y-4 py-4">
              <div>
                <Label>Tipo de Cuidado</Label>
                <Select name="careTypeId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {careTypesQuery.data?.map((ct) => (
                      <SelectItem key={ct.id} value={ct.id.toString()}>
                        {ct.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha Inicio</Label>
                  <Input type="date" name="startDate" required />
                </div>
                <div>
                  <Label>Fecha Fin (opcional)</Label>
                  <Input type="date" name="endDate" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hora</Label>
                  <Input type="time" name="scheduledHour" />
                </div>
                <div>
                  <Label>Recurrencia</Label>
                  <Select name="recurrenceType" defaultValue="none">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin recurrencia</SelectItem>
                      <SelectItem value="daily">Diaria</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewTaskDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog: Ejecutar Tarea de Control (Input Data) */}
      <Dialog open={!!executeTaskData} onOpenChange={(open) => !open && setExecuteTaskData(null)}>
        <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>Registrar Control: {executeTaskData?.careName}</DialogTitle>
           </DialogHeader>
           <form onSubmit={(e) => {
             e.preventDefault();
             if (!executeTaskData) return;
             const form = e.target as HTMLFormElement;
             const val = (form.elements.namedItem("value") as HTMLInputElement).value;
             const notes = (form.elements.namedItem("notes") as HTMLInputElement).value;
             
             executeTaskMutation.mutateAsync({ 
                id: executeTaskData.id,
                resultValue: val,
                resultNumeric: parseFloat(val) || undefined,
                notes: notes
             }).then(() => {
                setExecuteTaskData(null);
                scheduledTasksQuery.refetch();
             });
           }}>
             <div className="space-y-4 py-4">
               <div>
                  <Label>Valor ({executeTaskData?.unit})</Label>
                  <Input 
                    name="value" 
                    type={executeTaskData?.resultType === "numeric" ? "number" : "text"}
                    step={executeTaskData?.resultType === "numeric" ? "0.01" : undefined}
                    placeholder={`Ingrese valor en ${executeTaskData?.unit}`}
                    autoFocus
                    required
                  />
               </div>
               <div>
                  <Label>Observaciones (opcional)</Label>
                  <Input name="notes" placeholder="Alguna nota..." />
               </div>
             </div>
             <DialogFooter>
               <Button type="button" variant="outline" onClick={() => setExecuteTaskData(null)}>Cancelar</Button>
               <Button type="submit" className="bg-green-600 hover:bg-green-700">Confirmar</Button>
             </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Nuevo Grupo de Planificación */}
      <Dialog open={newGroupDialogOpen} onOpenChange={setNewGroupDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo Grupo de Planificación</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            await createCareGroupMutation.mutateAsync({
              name: formData.get("name") as string,
              groupType: formData.get("groupType") as any || "control",
              careTypeId: formData.get("careTypeId") ? parseInt(formData.get("careTypeId") as string) : undefined,
              professionalArea: "enfermeria",
              scheduledHour: formData.get("scheduledHour") as string || undefined,
            });
            setNewGroupDialogOpen(false);
            careGroupsQuery.refetch();
          }}>
            <div className="space-y-4 py-4">
              <div>
                <Label>Nombre del Grupo</Label>
                <Input name="name" placeholder="Ej: Cinesiterapia Grupal" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select name="groupType" defaultValue="control">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="control">Control</SelectItem>
                      <SelectItem value="actividad">Actividad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cuidado</Label>
                  <Select name="careTypeId">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {careTypesQuery.data?.map((ct) => (
                        <SelectItem key={ct.id} value={ct.id.toString()}>
                          {ct.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Hora Programada</Label>
                <Input type="time" name="scheduledHour" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewGroupDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Grupo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
