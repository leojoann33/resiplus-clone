import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

interface VitalSignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residentId: number;
  controlType: string;
  onSuccess?: () => void;
}

export default function VitalSignDialog({
  open,
  onOpenChange,
  residentId,
  controlType,
  onSuccess,
}: VitalSignDialogProps) {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weight, setWeight] = useState("");
  const [glucose, setGlucose] = useState("");
  const [notes, setNotes] = useState("");
  const [measurementDate, setMeasurementDate] = useState(
    new Date().toISOString().slice(0, 16)
  );

  const utils = trpc.useUtils();
  const createVitalSign = trpc.vitalSigns.create.useMutation({
    onSuccess: () => {
      toast.success("Constante vital registrada correctamente");
      utils.nursing.getVitalSignsByResident.invalidate({ residentId });
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Error al registrar: ${error.message}`);
    },
  });

  const resetForm = () => {
    setSystolic("");
    setDiastolic("");
    setHeartRate("");
    setRespiratoryRate("");
    setOxygenSaturation("");
    setTemperature("");
    setWeight("");
    setGlucose("");
    setNotes("");
    setMeasurementDate(new Date().toISOString().slice(0, 16));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let measurementType: any = "";
    const data: any = {
      residentId,
      measurementDate,
      notes,
    };

    switch (controlType) {
      case "Tensión":
      case "Control TA":
        measurementType = "blood_pressure";
        data.systolicBP = parseInt(systolic);
        data.diastolicBP = parseInt(diastolic);
        break;
      case "Frecuencia Cardíaca":
      case "Control FC":
        measurementType = "heart_rate";
        data.heartRate = parseInt(heartRate);
        break;
      case "Frecuencia Respiratoria":
      case "Control FR":
        measurementType = "respiratory_rate";
        data.respiratoryRate = parseInt(respiratoryRate);
        break;
      case "Saturación de Oxígeno":
      case "Control SatO2":
        measurementType = "oxygen_saturation";
        data.oxygenSaturation = parseInt(oxygenSaturation);
        break;
      case "Temperatura":
      case "Control tª":
        measurementType = "temperature";
        data.temperature = parseFloat(temperature);
        break;
      case "Peso":
      case "Control peso":
        measurementType = "weight";
        data.weight = parseFloat(weight);
        break;
      case "Glucemia":
      case "Control Glucosa":
        measurementType = "glucose";
        data.glucose = parseInt(glucose);
        break;
      default:
        toast.error("Tipo de control no soportado");
        return;
    }

    data.measurementType = measurementType;
    createVitalSign.mutate(data);
  };

  const getDialogTitle = () => {
    const titles: Record<string, string> = {
      "Tensión": "Registrar Tensión Arterial",
      "Control TA": "Registrar Tensión Arterial",
      "Frecuencia Cardíaca": "Registrar Frecuencia Cardíaca",
      "Control FC": "Registrar Frecuencia Cardíaca",
      "Frecuencia Respiratoria": "Registrar Frecuencia Respiratoria",
      "Control FR": "Registrar Frecuencia Respiratoria",
      "Saturación de Oxígeno": "Registrar Saturación de Oxígeno",
      "Control SatO2": "Registrar Saturación de Oxígeno",
      "Temperatura": "Registrar Temperatura",
      "Control tª": "Registrar Temperatura",
      "Peso": "Registrar Peso",
      "Control peso": "Registrar Peso",
      "Glucemia": "Registrar Glucemia",
      "Control Glucosa": "Registrar Glucemia",
    };
    return titles[controlType] || "Registrar Control";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              Introduzca los valores del control y la fecha/hora de medición
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="measurementDate" className="text-right text-xs">
                Fecha/Hora
              </Label>
              <Input
                id="measurementDate"
                type="datetime-local"
                value={measurementDate}
                onChange={(e) => setMeasurementDate(e.target.value)}
                className="col-span-3 text-xs"
                required
              />
            </div>

            {(controlType === "Tensión" || controlType === "Control TA") && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="systolic" className="text-right text-xs">
                    TA Sistólica (mmHg)
                  </Label>
                  <Input
                    id="systolic"
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="col-span-3 text-xs"
                    placeholder="120"
                    required
                    min="50"
                    max="250"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diastolic" className="text-right text-xs">
                    TA Diastólica (mmHg)
                  </Label>
                  <Input
                    id="diastolic"
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="col-span-3 text-xs"
                    placeholder="80"
                    required
                    min="30"
                    max="150"
                  />
                </div>
              </>
            )}

            {(controlType === "Frecuencia Cardíaca" || controlType === "Control FC") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="heartRate" className="text-right text-xs">
                  Frecuencia Cardíaca (lpm)
                </Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="col-span-3 text-xs"
                  placeholder="70"
                  required
                  min="30"
                  max="200"
                />
              </div>
            )}

            {(controlType === "Frecuencia Respiratoria" || controlType === "Control FR") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="respiratoryRate" className="text-right text-xs">
                  Frecuencia Respiratoria (rpm)
                </Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(e.target.value)}
                  className="col-span-3 text-xs"
                  placeholder="16"
                  required
                  min="8"
                  max="40"
                />
              </div>
            )}

            {(controlType === "Saturación de Oxígeno" || controlType === "Control SatO2") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="oxygenSaturation" className="text-right text-xs">
                  Saturación O2 (%)
                </Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  value={oxygenSaturation}
                  onChange={(e) => setOxygenSaturation(e.target.value)}
                  className="col-span-3 text-xs"
                  placeholder="98"
                  required
                  min="70"
                  max="100"
                />
              </div>
            )}

            {(controlType === "Temperatura" || controlType === "Control tª") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="temperature" className="text-right text-xs">
                  Temperatura (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="col-span-3 text-xs"
                  placeholder="36.5"
                  required
                  min="34"
                  max="42"
                />
              </div>
            )}

            {(controlType === "Peso" || controlType === "Control peso") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right text-xs">
                  Peso (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="col-span-3 text-xs"
                  placeholder="70.5"
                  required
                  min="20"
                  max="200"
                />
              </div>
            )}

            {(controlType === "Glucemia" || controlType === "Control Glucosa") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="glucose" className="text-right text-xs">
                  Glucosa (mg/dL)
                </Label>
                <Input
                  id="glucose"
                  type="number"
                  value={glucose}
                  onChange={(e) => setGlucose(e.target.value)}
                  className="col-span-3 text-xs"
                  placeholder="100"
                  required
                  min="40"
                  max="500"
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right text-xs pt-2">
                Observaciones
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3 text-xs"
                placeholder="Observaciones adicionales..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button type="submit" className="text-xs" disabled={createVitalSign.isPending}>
              {createVitalSign.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
