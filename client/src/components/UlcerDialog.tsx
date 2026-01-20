import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Calendar, Syringe, Trash2 } from "lucide-react";

interface UlcerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residentId: number;
  ulcerId?: number; // If provided, edit mode
}

const ULCER_LOCATIONS = [
  "Sacro", "Talón derecho", "Talón izquierdo", "Isquion derecho", "Isquion izquierdo",
  "Trocánter derecho", "Trocánter izquierdo", "Maléolo externo derecho", "Maléolo externo izquierdo",
  "Maléolo interno derecho", "Maléolo interno izquierdo", "Occipucio", "Omóplato derecho",
  "Omóplato izquierdo", "Codo derecho", "Codo izquierdo", "Oreja derecha", "Oreja izquierda",
  "Columna vertebral", "Rodilla derecha", "Rodilla izquierda", "Pie derecho (dorso)", "Pie izquierdo (dorso)",
  "Dedos pie derecho", "Dedos pie izquierdo"
];

const ULCER_STAGES = [
  "Estadío I", "Estadío II", "Estadío III", "Estadío IV", "Necrosis", "Sin clasificar", "Dermatitis", "Humedad"
];

const RISK_FACTORS = [
  "Inmovilidad", "Incontinencia", "Nutrición deficiente", "Alteración conciencia", "Edad avanzada", "Piel seca/frágil"
];

export default function UlcerDialog({ open, onOpenChange, residentId, ulcerId }: UlcerDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [newCureOpen, setNewCureOpen] = useState(false);
  
  // Queries
  const ulcerQuery = trpc.ulcers.listByResident.useQuery(
    { residentId, activeOnly: false },
    { enabled: !!residentId }
  );
  
  const curesQuery = trpc.ulcers.getCures.useQuery(
    { ulcerId: ulcerId || 0 },
    { enabled: !!ulcerId }
  );

  // Mutation
  const createUlcerMutation = trpc.ulcers.create.useMutation();
  const updateUlcerMutation = trpc.ulcers.update.useMutation();
  const addCureMutation = trpc.ulcers.addCure.useMutation();

  const currentUlcer = ulcerId 
    ? ulcerQuery.data?.find(u => u.id === ulcerId) 
    : undefined;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const riskFactors = RISK_FACTORS.filter(rf => formData.get(`risk_${rf}`) === "on");
    
    const data = {
      residentId,
      code: formData.get("code") as string,
      onsetDate: formData.get("onsetDate") as string,
      healDate: formData.get("healDate") as string || undefined,
      location: formData.get("location") as string,
      stage: formData.get("stage") as string,
      size: formData.get("size") as string,
      observations: formData.get("observations") as string,
      riskFactors: JSON.stringify(riskFactors),
    };

    if (ulcerId) {
      await updateUlcerMutation.mutateAsync({ id: ulcerId, ...data });
    } else {
      await createUlcerMutation.mutateAsync(data);
    }
    onOpenChange(false);
    ulcerQuery.refetch();
  };

  const handleAddCure = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ulcerId) return;
    
    const formData = new FormData(e.currentTarget);
    await addCureMutation.mutateAsync({
      ulcerId,
      treatment: formData.get("treatment") as string,
      observations: formData.get("observations") as string,
      nextCure: formData.get("nextCure") as string || undefined,
    });
    setNewCureOpen(false);
    curesQuery.refetch();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ulcerId ? "Control de Úlcera" : "Nueva Úlcera"}
          </DialogTitle>
        </DialogHeader>

        <form id="ulcer-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Aparición</Label>
                  <Input 
                    type="date" 
                    name="onsetDate" 
                    required 
                    defaultValue={currentUlcer?.onsetDate ? new Date(currentUlcer.onsetDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Curación</Label>
                  <Input 
                    type="date" 
                    name="healDate" 
                    defaultValue={currentUlcer?.healDate ? new Date(currentUlcer.healDate).toISOString().split('T')[0] : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input name="code" defaultValue={currentUlcer?.code || ""} placeholder="Ej: 001" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Localización</Label>
                  <Select name="location" defaultValue={currentUlcer?.location || ""} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar localización..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {ULCER_LOCATIONS.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo / Estadío</Label>
                  <Select name="stage" defaultValue={currentUlcer?.stage || ""} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ULCER_STAGES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tamaño (cm x cm)</Label>
                  <Input name="size" defaultValue={currentUlcer?.size || ""} placeholder="Ej: 3x2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observaciones</Label>
                <Textarea 
                  name="observations" 
                  defaultValue={currentUlcer?.observations || ""} 
                  className="h-20"
                />
              </div>
            </div>

            <div className="col-span-4 border-l pl-6 space-y-4">
              <Label className="text-base font-semibold">Factores de Riesgo</Label>
              <div className="space-y-2">
                {RISK_FACTORS.map(factor => {
                  const savedRisks = currentUlcer?.riskFactors ? JSON.parse(currentUlcer.riskFactors) : [];
                  return (
                    <div key={factor} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`risk_${factor}`} 
                        name={`risk_${factor}`} 
                        defaultChecked={savedRisks.includes(factor)}
                      />
                      <Label htmlFor={`risk_${factor}`} className="font-normal">{factor}</Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </form>

        {ulcerId && (
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Syringe className="w-5 h-5" /> Registro de Curas
              </h3>
              <Button size="sm" onClick={() => setNewCureOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Nueva Cura
              </Button>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Tratamiento</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead>Realizado Por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {curesQuery.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                        No hay curas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    curesQuery.data?.map(cure => (
                      <TableRow key={cure.id}>
                        <TableCell>
                          {new Date(cure.performedAt).toLocaleString("es-ES")}
                        </TableCell>
                        <TableCell>{cure.treatment || "—"}</TableCell>
                        <TableCell>{cure.observations || "—"}</TableCell>
                        <TableCell>Usuario Actual (ID: {cure.performedBy})</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button type="submit" form="ulcer-form">
            <Save className="w-4 h-4 mr-2" /> Guardar Ficha
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Sub-dialog: Nueva Cura */}
      <Dialog open={newCureOpen} onOpenChange={setNewCureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nueva Cura</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCure}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tratamiento Aplicado</Label>
                <Textarea name="treatment" placeholder="Ej: Limpieza con suero, apósito..." required />
              </div>
              <div className="space-y-2">
                <Label>Observaciones</Label>
                <Textarea name="observations" />
              </div>
              <div className="space-y-2">
                <Label>Próxima Cura (Planificación)</Label>
                <Input type="date" name="nextCure" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewCureOpen(false)}>Cancelar</Button>
              <Button type="submit">Guardar Cura</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
