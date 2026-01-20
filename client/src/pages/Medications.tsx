import ResiPlusLayout from "@/components/ResiPlusLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const weekDays = [
  { id: "monday", label: "L" },
  { id: "tuesday", label: "M" },
  { id: "wednesday", label: "X" },
  { id: "thursday", label: "J" },
  { id: "friday", label: "V" },
  { id: "saturday", label: "S" },
  { id: "sunday", label: "D" },
];

const administrationRoutes = [
  "Oral",
  "Sublingual",
  "Intravenosa",
  "Intramuscular",
  "Subcutánea",
  "Tópica",
  "Oftálmica",
  "Ótica",
  "Nasal",
  "Rectal",
  "Inhalatoria",
];

export default function Medications() {
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<number | null>(null);

  // Form state
  const [medicationName, setMedicationName] = useState("");
  const [activeIngredient, setActiveIngredient] = useState("");
  const [dosage, setDosage] = useState("");
  const [unit, setUnit] = useState("");
  const [route, setRoute] = useState<string>("");
  const [scheduleType, setScheduleType] = useState<"acute" | "chronic">("chronic");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleTimes, setScheduleTimes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const { data: residents } = trpc.residents.list.useQuery();
  const { data: medications, refetch } = trpc.medications.listByResident.useQuery(
    { residentId: selectedResidentId! },
    { enabled: !!selectedResidentId }
  );

  const utils = trpc.useUtils();

  const createMedication = trpc.medications.create.useMutation({
    onSuccess: () => {
      toast.success("Medicamento guardado correctamente");
      utils.medications.listByResident.invalidate({ residentId: selectedResidentId! });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Error al guardar: ${error.message}`);
    },
  });

  const deleteMedication = trpc.medications.delete.useMutation({
    onSuccess: () => {
      toast.success("Medicamento eliminado correctamente");
      utils.medications.listByResident.invalidate({ residentId: selectedResidentId! });
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });

  const resetForm = () => {
    setMedicationName("");
    setActiveIngredient("");
    setDosage("");
    setUnit("");
    setRoute("");
    setScheduleType("chronic");
    setSelectedDays([]);
    setScheduleTime("");
    setScheduleTimes([]);
    setNotes("");
    setEditingMedication(null);
  };

  const handleDayToggle = (dayId: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleAddTime = () => {
    if (scheduleTime && !scheduleTimes.includes(scheduleTime)) {
      setScheduleTimes([...scheduleTimes, scheduleTime]);
      setScheduleTime("");
    }
  };

  const handleRemoveTime = (time: string) => {
    setScheduleTimes(scheduleTimes.filter((t) => t !== time));
  };

  const handleSave = () => {
    if (!selectedResidentId) {
      toast.error("Seleccione un residente");
      return;
    }

    if (!medicationName || !dosage || !unit || !route) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    if (selectedDays.length === 0) {
      toast.error("Seleccione al menos un día de la semana");
      return;
    }

    if (scheduleTimes.length === 0) {
      toast.error("Añada al menos un horario");
      return;
    }

    const dayFlags: any = {};
    weekDays.forEach(day => {
      dayFlags[day.id] = selectedDays.includes(day.id);
    });

    createMedication.mutate({
      residentId: selectedResidentId,
      medicationName,
      activeIngredient: activeIngredient || undefined,
      dosage,
      unit,
      administrationRoute: route as any,
      frequency: `${scheduleTimes.length} veces al día`,
      scheduleType,
      startDate: new Date().toISOString().split('T')[0],
      ...dayFlags,
      administrationTimes: JSON.stringify(scheduleTimes),
      notes: notes || undefined,
    });
  };

  const handleDelete = (id: number) => {
    setMedicationToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (medicationToDelete) {
      deleteMedication.mutate({ id: medicationToDelete });
    }
    setDeleteConfirmOpen(false);
    setMedicationToDelete(null);
  };

  const handleEdit = (med: any) => {
    setEditingMedication(med);
    setMedicationName(med.medicationName || "");
    setActiveIngredient(med.activeIngredient || "");
    setDosage(med.dosage || "");
    setUnit(med.unit || "");
    setRoute(med.administrationRoute || "");
    setScheduleType(med.scheduleType || "chronic");
    setNotes(med.notes || "");
    
    // Set selected days
    const days: string[] = [];
    weekDays.forEach(day => {
      if (med[day.id]) days.push(day.id);
    });
    setSelectedDays(days);
    
    // Set schedule times
    try {
      const times = med.administrationTimes ? JSON.parse(med.administrationTimes) : [];
      setScheduleTimes(times);
    } catch {
      setScheduleTimes([]);
    }
    
    setDialogOpen(true);
  };

  const selectedResident = residents?.find((r) => r.id === selectedResidentId);

  return (
    <ResiPlusLayout currentModule="residentes">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Gestión de Medicamentos</h1>
          <p className="text-muted-foreground text-sm">
            Administración de pautas de medicación por residente
          </p>
        </div>

        {/* Resident selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Seleccionar Residente</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedResidentId?.toString()}
              onValueChange={(value) => setSelectedResidentId(parseInt(value))}
            >
              <SelectTrigger className="text-xs">
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

            {selectedResident && (
              <div className="mt-4 p-3 bg-muted/30 rounded-md">
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="font-semibold">Código:</span> {selectedResident.code}
                  </div>
                  <div>
                    <span className="font-semibold">Nombre:</span> {selectedResident.firstName}{" "}
                    {selectedResident.lastName}
                  </div>
                  <div>
                    <span className="font-semibold">Edad:</span>{" "}
                    {selectedResident.birthDate
                      ? new Date().getFullYear() -
                        new Date(selectedResident.birthDate).getFullYear()
                      : "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Habitación:</span>{" "}
                    {selectedResident.roomId || "Sin asignar"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedResidentId && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Medicamentos Activos</CardTitle>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={resetForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Medicamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMedication ? "Editar Medicamento" : "Nuevo Medicamento"}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Nombre del Medicamento *</Label>
                          <Input
                            value={medicationName}
                            onChange={(e) => setMedicationName(e.target.value)}
                            placeholder="Ej: Paracetamol 500mg"
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Principio Activo</Label>
                          <Input
                            value={activeIngredient}
                            onChange={(e) => setActiveIngredient(e.target.value)}
                            placeholder="Ej: Paracetamol"
                            className="text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Dosis *</Label>
                          <Input
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            placeholder="Ej: 500"
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Unidad *</Label>
                          <Input
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            placeholder="Ej: mg, ml, comprimidos"
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Vía de Administración *</Label>
                          <Select value={route} onValueChange={setRoute}>
                            <SelectTrigger className="text-xs">
                              <SelectValue placeholder="Seleccionar vía" />
                            </SelectTrigger>
                            <SelectContent>
                              {administrationRoutes.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Tipo de Pauta *</Label>
                        <Select value={scheduleType} onValueChange={(v: any) => setScheduleType(v)}>
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chronic">Crónica</SelectItem>
                            <SelectItem value="acute">Aguda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs mb-2 block">Días de la Semana *</Label>
                        <div className="flex gap-2">
                          {weekDays.map((day) => (
                            <div key={day.id} className="flex flex-col items-center">
                              <Checkbox
                                id={day.id}
                                checked={selectedDays.includes(day.id)}
                                onCheckedChange={() => handleDayToggle(day.id)}
                              />
                              <Label htmlFor={day.id} className="text-xs mt-1 cursor-pointer">
                                {day.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Horarios *</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="text-xs"
                          />
                          <Button size="sm" onClick={handleAddTime} type="button">
                            Añadir
                          </Button>
                        </div>
                        {scheduleTimes.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {scheduleTimes.map((time) => (
                              <div
                                key={time}
                                className="flex items-center gap-2 bg-accent px-3 py-1 rounded text-xs"
                              >
                                <span>{time}</span>
                                <button
                                  onClick={() => handleRemoveTime(time)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-xs">Observaciones</Label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Indicaciones adicionales..."
                          className="text-xs"
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={createMedication.isPending}>
                          {createMedication.isPending ? "Guardando..." : "Guardar"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {medications && medications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Medicamento</TableHead>
                      <TableHead className="text-xs">Principio Activo</TableHead>
                      <TableHead className="text-xs">Dosis</TableHead>
                      <TableHead className="text-xs">Vía</TableHead>
                      <TableHead className="text-xs">Tipo</TableHead>
                      <TableHead className="text-xs">Días</TableHead>
                      <TableHead className="text-xs">Horarios</TableHead>
                      <TableHead className="text-xs">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medications.map((med: any, index: number) => (
                      <TableRow key={med.id} className={index % 2 === 0 ? "" : "bg-accent/30"}>
                        <TableCell className="text-xs font-medium">{med.medicationName}</TableCell>
                        <TableCell className="text-xs">{med.activeIngredient || "-"}</TableCell>
                        <TableCell className="text-xs">{med.dosage} {med.unit}</TableCell>
                        <TableCell className="text-xs">{med.route}</TableCell>
                        <TableCell className="text-xs">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              med.scheduleType === "chronic"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {med.scheduleType === "chronic" ? "Crónica" : "Aguda"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          {weekDays.filter(d => (med as any)[d.id]).map(d => d.label).join(", ")}
                        </TableCell>
                        <TableCell className="text-xs">
                          {med.administrationTimes ? JSON.parse(med.administrationTimes).join(", ") : "-"}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleEdit(med);
                              }}
                            >
                              <Edit className="w-3 h-3 text-yellow-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(med.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No hay medicamentos registrados para este residente
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!selectedResidentId && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                Seleccione un residente para gestionar sus medicamentos
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dialog de confirmación para eliminar */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                ¿Está seguro de que desea eliminar este medicamento? Esta acción no se puede deshacer.
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
      </div>
    </ResiPlusLayout>
  );
}
