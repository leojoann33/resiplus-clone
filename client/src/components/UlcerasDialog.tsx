import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save } from "lucide-react";
import { useState } from "react";

interface UlcerasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residentName: string;
  residentId: number;
}

interface CuraRecord {
  id: number;
  fechaHora: string;
  estado: string;
  largo: string;
  ancho: string;
  profundidad: string;
  cultivo: string;
  germen: string;
  foto: boolean;
  tratamiento: string;
  observaciones: string;
}

const factoresRiesgo = [
  "Factor Riesgo",
  "Inmovilidad",
  "Incontinencia", 
  "Desnutrición",
  "Diabetes",
  "Enfermedad vascular",
  "Edad avanzada",
  "Medicación",
];

export default function UlcerasDialog({
  open,
  onOpenChange,
  residentName,
}: UlcerasDialogProps) {
  const [fechaAparicion, setFechaAparicion] = useState(new Date().toISOString().split("T")[0]);
  const [fechaCuracion, setFechaCuracion] = useState("");
  const [codigo, setCodigo] = useState("0011");
  const [procedencia, setProcedencia] = useState("");
  const [tipo, setTipo] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [escNortonFecha] = useState("21/01/2021");
  const [escNortonPuntos] = useState("13");
  const [escNortonGrado, setEscNortonGrado] = useState("GRADO MEDIO");
  const [observaciones, setObservaciones] = useState("");
  const [factoresSeleccionados, setFactoresSeleccionados] = useState<string[]>([]);
  const [curas] = useState<CuraRecord[]>([]);
  const [showNuevaCura, setShowNuevaCura] = useState(false);

  const toggleFactor = (factor: string) => {
    setFactoresSeleccionados(prev =>
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-6xl !h-[85vh] p-0 gap-0 flex flex-col">
        {/* Header azul estilo ResiPlus */}
        <div className="bg-[#0066cc] text-white px-4 py-2 flex items-center justify-between text-sm flex-shrink-0">
          <span className="font-medium">Control de úlceras del residente {residentName}</span>
          <div className="flex items-center gap-6 text-xs">
            <span>12 de 12</span>
            <span>Fecha Aparición ▼</span>
          </div>
        </div>

        {/* Contenido principal - layout flex */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {/* Parte superior: Formulario + Factores de Riesgo */}
          <div className="flex gap-4">
            {/* Panel izquierdo - Formulario */}
            <div className="flex-1 space-y-3">
              {/* Fila 1: Fechas y Usuario */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-28 shrink-0">Fecha Aparición:</Label>
                  <Input
                    type="date"
                    value={fechaAparicion}
                    onChange={(e) => setFechaAparicion(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-28 shrink-0">Fecha Curación:</Label>
                  <Input
                    type="date"
                    value={fechaCuracion}
                    onChange={(e) => setFechaCuracion(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-20 shrink-0">Usuario R+:</Label>
                  <Input value="Emi Expósito" disabled className="h-7 text-xs bg-muted" />
                </div>
              </div>

              {/* Fila 2: Código */}
              <div className="flex items-center gap-2">
                <Label className="text-xs w-28 shrink-0">Código:</Label>
                <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} className="h-7 text-xs w-24" />
              </div>

              {/* Fila 3: Procedencia y Tipo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-28 shrink-0">Procedencia:</Label>
                  <Select value={procedencia} onValueChange={setProcedencia}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Domicilio">Domicilio</SelectItem>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Centro">Otro centro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-20 shrink-0">Tipo:</Label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPP">UPP</SelectItem>
                      <SelectItem value="Vascular">Vascular</SelectItem>
                      <SelectItem value="Diabética">Diabética</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Fila 4: Localización */}
              <div className="flex items-center gap-2">
                <Label className="text-xs w-28 shrink-0">Localización:</Label>
                <Select value={localizacion} onValueChange={setLocalizacion}>
                  <SelectTrigger className="h-7 text-xs w-48">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sacro">Sacro</SelectItem>
                    <SelectItem value="Talón derecho">Talón derecho</SelectItem>
                    <SelectItem value="Talón izquierdo">Talón izquierdo</SelectItem>
                    <SelectItem value="Trocánter">Trocánter</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fila 5: Esc. Norton */}
              <div className="flex items-center gap-2">
                <Label className="text-xs w-28 shrink-0">Esc. Norton:</Label>
                <Input value={escNortonFecha} className="h-7 text-xs w-28" readOnly />
                <span className="text-xs">▼</span>
                <Input value={escNortonPuntos} className="h-7 text-xs w-12 text-center" readOnly />
                <Select value={escNortonGrado} onValueChange={setEscNortonGrado}>
                  <SelectTrigger className="h-7 text-xs w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RIESGO BAJO">RIESGO BAJO</SelectItem>
                    <SelectItem value="GRADO MEDIO">GRADO MEDIO</SelectItem>
                    <SelectItem value="RIESGO ALTO">RIESGO ALTO</SelectItem>
                    <SelectItem value="RIESGO MUY ALTO">RIESGO MUY ALTO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fila 6: Observaciones */}
              <div>
                <Label className="text-xs">Observaciones:</Label>
                <Textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="text-xs h-16 resize-none mt-1"
                />
              </div>
            </div>

            {/* Panel derecho - FACTORES DE RIESGO */}
            <div className="w-52 shrink-0">
              <div className="border rounded bg-white h-full">
                <div className="bg-muted/50 px-3 py-1.5 text-xs font-semibold border-b">
                  FACTORES DE RIESGO
                </div>
                <div className="p-3 space-y-2">
                  {factoresRiesgo.map((factor) => (
                    <div key={factor} className="flex items-center gap-2">
                      <Checkbox
                        id={factor}
                        checked={factoresSeleccionados.includes(factor)}
                        onCheckedChange={() => toggleFactor(factor)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor={factor} className="text-xs cursor-pointer">
                        {factor}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sección CURAS - ocupa el espacio restante */}
          <div className="flex-1 flex flex-col border rounded">
            <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b">
              <span className="text-xs font-semibold">CURAS</span>
              <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setShowNuevaCura(!showNuevaCura)}>
                <Plus className="w-3 h-3 mr-1" />
                Nuevo registro
              </Button>
            </div>

            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="text-xs px-2 py-1">Fecha / Hora</TableHead>
                    <TableHead className="text-xs px-2 py-1">Estado</TableHead>
                    <TableHead className="text-xs px-2 py-1">Largo</TableHead>
                    <TableHead className="text-xs px-2 py-1">Ancho</TableHead>
                    <TableHead className="text-xs px-2 py-1">Profundidad</TableHead>
                    <TableHead className="text-xs px-2 py-1">Cultivo</TableHead>
                    <TableHead className="text-xs px-2 py-1">Germen</TableHead>
                    <TableHead className="text-xs px-2 py-1">Foto</TableHead>
                    <TableHead className="text-xs px-2 py-1">Ver Foto</TableHead>
                    <TableHead className="text-xs px-2 py-1">Tratamiento</TableHead>
                    <TableHead className="text-xs px-2 py-1">Observaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {curas.length === 0 && !showNuevaCura && (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-xs text-muted-foreground py-8">
                        
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t bg-muted/30 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="h-8">
            Cancelar
          </Button>
          <Button size="sm" className="h-8 bg-[#0066cc] hover:bg-[#0055aa]">
            <Save className="w-4 h-4 mr-1" />
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
