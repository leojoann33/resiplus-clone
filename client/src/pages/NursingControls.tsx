import ResiPlusLayout from "@/components/ResiPlusLayout";
import UlcerDialog from "@/components/UlcerDialog";
import VitalSignDialog from "@/components/VitalSignDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

// Mapeo entre tipos de control y measurementType de la BD (controles con soporte)
const measurementTypeMap: Record<string, string> = {
  "Tensión": "blood_pressure",
  "Control TA": "blood_pressure",
  "Pulso": "heart_rate",
  "Control FC": "heart_rate",
  "Control FR": "respiratory_rate",
  "Saturación de Oxígeno": "oxygen_saturation",
  "Control SatO2": "oxygen_saturation",
  "Temperatura": "temperature",
  "Peso": "weight",
  "Control peso": "weight",
  "Glucemia": "glucose",
  "Glucemia capilar": "glucose",
};

// ============================================
// CONTROLES - Lista principal (26 controles)
// ============================================
const mainControls = [
  "Acetona",
  "Administración de Oxígeno",
  "Caídas",
  "Cambios Posturales",
  "Conductas Disruptivas",
  "Curas",
  "Deposiciones",
  "Diuresis",
  "Glucemia",
  "Ingesta Líquidos",
  "Ingesta Sólidos",
  "Inyectables",
  "Movilizaciones",
  "Peso",
  "Pulso",
  "Recogida de Fístulas",
  "Saturación de Oxígeno",
  "Sintrom",
  "Sondas Gástricas",
  "Sondas Nasogástricas",
  "Sondas Vesicales",
  "Talla",
  "Temperatura",
  "Tensión",
  "Úlceras",
  "Vacunaciones",
];

// ============================================
// CONTROLES Y REGISTROS PROPIOS (74 registros)
// ============================================
const ownControls = [
  "Aerosolterapia",
  "Afeitado",
  "Analítica de esputo",
  "Analítica de heces",
  "Analítica de orina",
  "Analítica de sangre",
  "Aplicación de crema/pomada",
  "Aplicación de enema",
  "Aplicación de supositorio",
  "Aseo",
  "Aspiración de secreciones",
  "Baño",
  "Caída",
  "Cambio cánula traqueostomía",
  "Cambio de Sonda Vesical",
  "Cambio pañal",
  "Cambio postural",
  "Cambio Sonda Nasogástrica",
  "Circunferencia abdominal",
  "Circunferencia braquial",
  "Circunferencia pantorrilla",
  "Colirio",
  "Control deposición",
  "Control diuresis",
  "Control FC",
  "Control FR",
  "Control INR",
  "Control peso",
  "Control SatO2",
  "Control TA",
  "Corte uñas",
  "Cuidados colostomía",
  "Cura",
  "ECG",
  "Extracción tapón cerumen",
  "Frotis absceso",
  "Frotis conjuntival",
  "Frotis faríngeo",
  "Frotis herida quirúrgica",
  "Frotis lingual",
  "Frotis nasal",
  "Frotis ótico",
  "Frotis úlcera",
  "Frotis uretral",
  "Frotis vaginal",
  "Glucemia capilar",
  "Hidratación cutánea",
  "Higiene bucal",
  "Ingesta líquida",
  "Ingesta sólida",
  "Inyecciones",
  "Lavado ojos con suero",
  "Lavado sonda vesical",
  "Nebulizaciones",
  "Nutrición Enteral",
  "Otros",
  "Oxigenoterapia",
  "Parche",
  "Protección prominencias óseas",
  "Retirada grapas/puntos",
  "Revisión mensual de medicación",
  "Revisión uñas pies",
  "Sondaje rectal",
  "Sondaje vesical",
  "Sondaje vesical intermitente",
  "Sueroterapia",
  "Suplemento proteico",
  "Tallar",
  "Tira reactiva de orina",
  "Tratamiento ótico",
  "Vacuna gripe",
  "Vacuna hepatitis B",
  "Vacuna neumocócica",
  "Vacuna tétanos",
];

// Función para verificar si un valor está fuera de rango
const isOutOfRange = (type: string, value: any, value2?: any): boolean => {
  switch (type) {
    case "blood_pressure":
      return value > 140 || value < 90 || value2 > 90 || value2 < 60;
    case "heart_rate":
      return value > 100 || value < 50;
    case "respiratory_rate":
      return value > 20 || value < 12;
    case "oxygen_saturation":
      return value < 92;
    case "temperature":
      return value > 37.5 || value < 35.5;
    case "glucose":
      return value > 180 || value < 70;
    default:
      return false;
  }
};

export default function NursingControls() {
  const [selectedControl, setSelectedControl] = useState("Tensión");
  const [dateFilter, setDateFilter] = useState<"range" | "last10" | "last25">("last10");
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ulcerasDialogOpen, setUlcerasDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const [ulcerIdToEdit, setUlcerIdToEdit] = useState<number | null>(null);

  const { data: residents } = trpc.residents.list.useQuery();
  const { data: vitalSigns, refetch } = trpc.nursing.getVitalSignsByResident.useQuery(
    { residentId: selectedResidentId! },
    { enabled: !!selectedResidentId }
  );
  
  const ulcersQuery = trpc.ulcers.listByResident.useQuery(
    { residentId: selectedResidentId || 0, activeOnly: false },
    { enabled: !!selectedResidentId && selectedControl === "Úlceras" }
  );

  const utils = trpc.useUtils();

  const selectedResident = residents?.find(r => r.id === selectedResidentId);
  const isVitalSignControl = measurementTypeMap[selectedControl] !== undefined;

  // Filtrar datos según el tipo de control seleccionado y el rango de fechas
  const filteredData = useMemo(() => {
    if (!vitalSigns || !isVitalSignControl) return [];

    const measurementType = measurementTypeMap[selectedControl];
    
    // Filtrar por tipo de medición
    let filtered = vitalSigns.filter((vs: any) => vs.measurementType === measurementType);

    // Aplicar filtro de fechas
    if (dateFilter === "range") {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter((vs: any) => {
        const date = new Date(vs.measurementDate);
        return date >= from && date <= to;
      });
    } else if (dateFilter === "last10") {
      filtered = filtered.slice(0, 10);
    } else if (dateFilter === "last25") {
      filtered = filtered.slice(0, 25);
    }

    return filtered;
  }, [vitalSigns, selectedControl, dateFilter, fromDate, toDate, isVitalSignControl]);

  const handleDelete = (id: number) => {
    setRecordToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      toast.info("Funcionalidad de eliminar en desarrollo");
      // TODO: Implementar eliminación cuando se agregue el endpoint
    }
    setDeleteConfirmOpen(false);
    setRecordToDelete(null);
  };

  const handleControlSelect = (control: string) => {
    setSelectedControl(control);
    // Controles con soporte en BD o con modal especial
    const supportedControls = [
      ...Object.keys(measurementTypeMap),
      "Úlceras", // Modal especial
    ];
    if (!supportedControls.includes(control)) {
      toast.info(`"${control}" - Registro manual disponible próximamente`);
    }
  };

  // Función para manejar el botón de nuevo registro
  const handleNewRecord = () => {
    if (!selectedResidentId) return;
    
    if (selectedControl === "Úlceras") {
      setUlcerIdToEdit(null); // Reset for new record
      setUlcerasDialogOpen(true);
    } else if (measurementTypeMap[selectedControl]) {
      setDialogOpen(true);
    } else {
      toast.info(`"${selectedControl}" - Formulario en desarrollo`);
    }
  };

  // Función para obtener el valor de visualización
  const getDisplayValue = (sign: any): string => {
    const type = sign.measurementType;
    switch (type) {
      case "blood_pressure":
        return `${sign.systolicBP}/${sign.diastolicBP} mmHg`;
      case "heart_rate":
        return `${sign.heartRate} lpm`;
      case "respiratory_rate":
        return `${sign.respiratoryRate} rpm`;
      case "oxygen_saturation":
        return `${sign.oxygenSaturation}%`;
      case "temperature":
        return `${sign.temperature} °C`;
      case "weight":
        return `${sign.weight} kg`;
      case "glucose":
        return `${sign.glucose} mg/dL`;
      default:
        return "-";
    }
  };

  // Verificar si el valor está fuera de rango
  const isValueOutOfRange = (sign: any): boolean => {
    const type = sign.measurementType;
    switch (type) {
      case "blood_pressure":
        return isOutOfRange(type, sign.systolicBP, sign.diastolicBP);
      case "heart_rate":
        return isOutOfRange(type, sign.heartRate);
      case "respiratory_rate":
        return isOutOfRange(type, sign.respiratoryRate);
      case "oxygen_saturation":
        return isOutOfRange(type, sign.oxygenSaturation);
      case "temperature":
        return isOutOfRange(type, sign.temperature);
      case "glucose":
        return isOutOfRange(type, sign.glucose);
      default:
        return false;
    }
  };

  return (
    <ResiPlusLayout currentModule="residentes">
      <div className="flex flex-col h-full">
        {/* Resident info header */}
        {selectedResident && (
          <div className="bg-muted/30 border-b border-border p-3">
            <div className="grid grid-cols-6 gap-4 text-xs">
              <div>
                <span className="font-semibold">Código:</span> {selectedResident.code}
              </div>
              <div>
                <span className="font-semibold">N.I.F.:</span> {selectedResident.nif || "-"}
              </div>
              <div>
                <span className="font-semibold">Nombre:</span> {selectedResident.firstName} {selectedResident.lastName}
              </div>
              <div>
                <span className="font-semibold">F. Nacimiento:</span>{" "}
                {selectedResident.birthDate ? new Date(selectedResident.birthDate).toLocaleDateString("es-ES") : "-"}
              </div>
              <div>
                <span className="font-semibold">Sexo:</span> {selectedResident.gender === "male" ? "Hombre" : selectedResident.gender === "female" ? "Mujer" : "Otro"}
              </div>
              <div>
                <span className="font-semibold">F. Ingreso:</span>{" "}
                {new Date(selectedResident.admissionDate).toLocaleDateString("es-ES")}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Control type selector */}
          <div className="w-64 border-r border-border bg-background flex flex-col overflow-hidden">
            <div className="p-2 border-b border-border flex gap-1 bg-background flex-shrink-0 min-h-[44px]">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={handleNewRecord}
                disabled={!selectedResidentId}
                title="Nuevo registro"
              >
                <Plus className="w-4 h-4 text-green-600" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0"
                disabled={!selectedResidentId}
                title="Editar registro"
              >
                <Edit className="w-4 h-4 text-yellow-600" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0"
                disabled={!selectedResidentId}
                title="Eliminar registro"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-1">
                {/* CONTROLES - Lista principal (26 controles) */}
                <div className="mb-2">
                  <h4 className="text-[10px] font-bold text-white bg-blue-600 px-2 py-1 mb-1 uppercase tracking-wide">
                    Controles
                  </h4>
                  {mainControls.map((control) => {
                    const isSupported = measurementTypeMap[control] !== undefined;
                    return (
                      <Button
                        key={control}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start text-xs h-6 mb-0 px-2 ${
                          selectedControl === control 
                            ? "bg-accent font-medium" 
                            : isSupported ? "" : "text-muted-foreground"
                        }`}
                        onClick={() => handleControlSelect(control)}
                      >
                        {control}
                      </Button>
                    );
                  })}
                </div>

                {/* CONTROLES Y REGISTROS PROPIOS (74 registros) */}
                <div>
                  <h4 className="text-[10px] font-bold text-white bg-blue-600 px-2 py-1 mb-1 uppercase tracking-wide">
                    Controles y Registros Propios
                  </h4>
                  {ownControls.map((control) => {
                    const isSupported = measurementTypeMap[control] !== undefined;
                    return (
                      <Button
                        key={control}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start text-xs h-6 mb-0 px-2 ${
                          selectedControl === control 
                            ? "bg-accent font-medium" 
                            : isSupported ? "" : "text-muted-foreground"
                        }`}
                        onClick={() => handleControlSelect(control)}
                      >
                        {control}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Main content area */}
          <div className="flex-1 p-4 overflow-auto">
            {!selectedResident ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-muted-foreground">Seleccione un residente para ver sus controles</p>
                <Select onValueChange={(value) => setSelectedResidentId(parseInt(value))}>
                  <SelectTrigger className="w-80">
                    <SelectValue placeholder="Seleccionar residente" />
                  </SelectTrigger>
                  <SelectContent>
                    {residents?.map((resident) => (
                      <SelectItem key={resident.id} value={resident.id.toString()}>
                        {resident.code} - {resident.firstName} {resident.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                {/* Filter options */}
                <div className="mb-4 p-4 border border-border rounded bg-background">
                  <RadioGroup value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="range" id="range" />
                      <Label htmlFor="range" className="text-sm font-normal">
                        Mostrar datos entre fechas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="last10" id="last10" />
                      <Label htmlFor="last10" className="text-sm font-normal">
                        Mostrar los últimos 10 datos
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="last25" id="last25" />
                      <Label htmlFor="last25" className="text-sm font-normal">
                        Mostrar los últimos 25 datos
                      </Label>
                    </div>
                  </RadioGroup>

                  {dateFilter === "range" && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">De Fecha:</Label>
                        <Input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">A Fecha:</Label>
                        <Input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Data table */}
                {measurementTypeMap[selectedControl] && (
                <div className="border border-border rounded">
                  <div className="bg-muted/50 p-2 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      CONTROLES Y REGISTROS: {selectedControl}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {filteredData.length} registro{filteredData.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs w-[180px]">Fecha / Hora</TableHead>
                        <TableHead className="text-xs">Valor</TableHead>
                        <TableHead className="text-xs">Observaciones</TableHead>
                        <TableHead className="text-xs w-[80px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length > 0 ? (
                        filteredData.map((sign: any, index: number) => {
                          const outOfRange = isValueOutOfRange(sign);
                          const date = new Date(sign.measurementDate);
                          const dateStr = isNaN(date.getTime()) 
                            ? "Fecha inválida" 
                            : date.toLocaleString("es-ES");
                          
                          return (
                            <TableRow 
                              key={sign.id} 
                              className={`${index % 2 === 0 ? "" : "bg-accent/30"} ${outOfRange ? "bg-red-50 dark:bg-red-950/20" : ""}`}
                            >
                              <TableCell className="text-xs">
                                {dateStr}
                              </TableCell>
                              <TableCell className={`text-xs font-medium ${outOfRange ? "text-red-600 dark:text-red-400" : ""}`}>
                                {outOfRange && <AlertCircle className="w-3 h-3 inline mr-1" />}
                                {getDisplayValue(sign)}
                              </TableCell>
                              <TableCell className="text-xs">{sign.notes || "-"}</TableCell>
                              <TableCell className="text-xs">
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => toast.info("Edición próximamente")}
                                  >
                                    <Edit className="w-3 h-3 text-yellow-600" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleDelete(sign.id)}
                                  >
                                    <Trash2 className="w-3 h-3 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">
                            No hay registros de "{selectedControl}" para mostrar
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            )}

            {selectedControl === "Úlceras" && selectedResidentId && (
              <div className="space-y-4">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Registro de Úlceras</h3>
                    <span className="text-sm text-muted-foreground">
                      {ulcersQuery.data?.length || 0} registro(s)
                    </span>
                 </div>
                 
                 {ulcersQuery.isLoading ? (
                   <div className="p-4 text-center">Cargando úlceras...</div>
                 ) : ulcersQuery.data?.length === 0 ? (
                   <div className="p-8 text-center text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                     No hay úlceras registradas. Pulse "+" para añadir una.
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {ulcersQuery.data?.map((ulcer) => (
                       <div key={ulcer.id} 
                            className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
                            onClick={() => {
                              setUlcerIdToEdit(ulcer.id);
                              setUlcerasDialogOpen(true);
                            }}
                       >
                         <div className="absolute top-2 right-2">
                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ulcer.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                             {ulcer.isActive ? 'Activa' : 'Curada'}
                           </span>
                         </div>
                         <h3 className="font-bold text-lg mb-1">{ulcer.location}</h3>
                         <div className="text-sm text-gray-600 space-y-1">
                           <p><strong>Estadío:</strong> {ulcer.stage}</p>
                           <p><strong>Desde:</strong> {new Date(ulcer.onsetDate).toLocaleDateString()}</p>
                           {ulcer.healDate && <p><strong>Curada:</strong> {new Date(ulcer.healDate).toLocaleDateString()}</p>}
                           <p><strong>Curas:</strong> {ulcer.curesCount}</p>
                           {ulcer.code && <p className="text-xs text-muted-foreground mt-2">Ref: {ulcer.code}</p>}
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialog para nuevo registro */}
      {selectedResidentId && (
        <VitalSignDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          residentId={selectedResidentId}
          controlType={selectedControl}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              ¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Úlceras Dialog */}
      <UlcerDialog
        open={ulcerasDialogOpen}
        onOpenChange={(open) => {
          setUlcerasDialogOpen(open);
          if (!open) setUlcerIdToEdit(null);
        }}
        residentId={selectedResidentId || 0}
        ulcerId={ulcerIdToEdit || undefined}
      />
    </ResiPlusLayout>
  );
}
