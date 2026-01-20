import ResiPlusLayout from "@/components/ResiPlusLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

const barthelItems = [
  {
    id: "eating",
    name: "Comer",
    options: [
      { value: 10, label: "Independiente (10)" },
      { value: 5, label: "Necesita ayuda (5)" },
      { value: 0, label: "Dependiente (0)" },
    ],
  },
  {
    id: "bathing",
    name: "Lavarse/bañarse",
    options: [
      { value: 5, label: "Independiente (5)" },
      { value: 0, label: "Dependiente (0)" },
    ],
  },
  {
    id: "grooming",
    name: "Vestirse",
    options: [
      { value: 10, label: "Independiente (10)" },
      { value: 5, label: "Necesita ayuda (5)" },
      { value: 0, label: "Dependiente (0)" },
    ],
  },
  {
    id: "dressing",
    name: "Arreglarse",
    options: [
      { value: 5, label: "Independiente (5)" },
      { value: 0, label: "Dependiente (0)" },
    ],
  },
  {
    id: "bowels",
    name: "Deposición",
    options: [
      { value: 10, label: "Continente (10)" },
      { value: 5, label: "Accidente ocasional (5)" },
      { value: 0, label: "Incontinente (0)" },
    ],
  },
  {
    id: "bladder",
    name: "Micción",
    options: [
      { value: 10, label: "Continente (10)" },
      { value: 5, label: "Accidente ocasional (5)" },
      { value: 0, label: "Incontinente (0)" },
    ],
  },
  {
    id: "toilet",
    name: "Usar el retrete",
    options: [
      { value: 10, label: "Independiente (10)" },
      { value: 5, label: "Necesita ayuda (5)" },
      { value: 0, label: "Dependiente (0)" },
    ],
  },
  {
    id: "transfer",
    name: "Trasladarse sillón/cama",
    options: [
      { value: 15, label: "Independiente (15)" },
      { value: 10, label: "Mínima ayuda (10)" },
      { value: 5, label: "Gran ayuda (5)" },
      { value: 0, label: "Dependiente (0)" },
    ],
  },
  {
    id: "mobility",
    name: "Deambulación",
    options: [
      { value: 15, label: "Independiente (15)" },
      { value: 10, label: "Necesita ayuda (10)" },
      { value: 5, label: "Independiente en silla de ruedas (5)" },
      { value: 0, label: "Inmóvil (0)" },
    ],
  },
  {
    id: "stairs",
    name: "Subir/bajar escaleras",
    options: [
      { value: 10, label: "Independiente (10)" },
      { value: 5, label: "Necesita ayuda (5)" },
      { value: 0, label: "Dependiente (0)" },
    ],
  },
];

const nortonItems = [
  {
    id: "physical_condition",
    name: "Estado físico general",
    options: [
      { value: 4, label: "Bueno (4)" },
      { value: 3, label: "Mediano (3)" },
      { value: 2, label: "Regular (2)" },
      { value: 1, label: "Muy malo (1)" },
    ],
  },
  {
    id: "mental_state",
    name: "Estado mental",
    options: [
      { value: 4, label: "Alerta (4)" },
      { value: 3, label: "Apático (3)" },
      { value: 2, label: "Confuso (2)" },
      { value: 1, label: "Estuporoso (1)" },
    ],
  },
  {
    id: "activity",
    name: "Actividad",
    options: [
      { value: 4, label: "Ambulante (4)" },
      { value: 3, label: "Disminuida (3)" },
      { value: 2, label: "Muy limitada (2)" },
      { value: 1, label: "Inmóvil (1)" },
    ],
  },
  {
    id: "mobility",
    name: "Movilidad",
    options: [
      { value: 4, label: "Total (4)" },
      { value: 3, label: "Disminuida (3)" },
      { value: 2, label: "Muy limitada (2)" },
      { value: 1, label: "Inmóvil (1)" },
    ],
  },
  {
    id: "incontinence",
    name: "Incontinencia",
    options: [
      { value: 4, label: "Ninguna (4)" },
      { value: 3, label: "Ocasional (3)" },
      { value: 2, label: "Urinaria o fecal (2)" },
      { value: 1, label: "Urinaria y fecal (1)" },
    ],
  },
];

export default function AssessmentScales() {
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [barthelScores, setBarthelScores] = useState<Record<string, number>>({});
  const [nortonScores, setNortonScores] = useState<Record<string, number>>({});
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: residents } = trpc.residents.list.useQuery();
  const utils = trpc.useUtils();

  const createAssessment = trpc.assessmentScales.create.useMutation({
    onSuccess: () => {
      toast.success("Escala de valoración guardada correctamente");
      utils.nursing.getScalesByResident.invalidate({ residentId: selectedResidentId! });
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error al guardar: ${error.message}`);
    },
  });

  const resetForm = () => {
    setBarthelScores({});
    setNortonScores({});
    setAssessmentDate(new Date().toISOString().split("T")[0]);
  };

  const calculateBarthelTotal = () => {
    return Object.values(barthelScores).reduce((sum, score) => sum + score, 0);
  };

  const calculateNortonTotal = () => {
    return Object.values(nortonScores).reduce((sum, score) => sum + score, 0);
  };

  const getBarthelInterpretation = (score: number) => {
    if (score === 100) return "Independiente";
    if (score >= 91) return "Dependencia leve";
    if (score >= 61) return "Dependencia moderada";
    if (score >= 21) return "Dependencia grave";
    return "Dependencia total";
  };

  const getNortonInterpretation = (score: number) => {
    if (score <= 12) return "Riesgo alto de úlceras por presión";
    if (score <= 14) return "Riesgo medio de úlceras por presión";
    return "Riesgo bajo de úlceras por presión";
  };

  const handleSaveBarthel = () => {
    if (!selectedResidentId) {
      toast.error("Seleccione un residente");
      return;
    }

    if (Object.keys(barthelScores).length !== barthelItems.length) {
      toast.error("Complete todos los ítems de la escala");
      return;
    }

    const totalScore = calculateBarthelTotal();

    createAssessment.mutate({
      residentId: selectedResidentId,
      scaleType: "barthel",
      totalScore,
      assessmentData: JSON.stringify(barthelScores),
      assessmentDate,
      interpretation: getBarthelInterpretation(totalScore),
    });
  };

  const handleSaveNorton = () => {
    if (!selectedResidentId) {
      toast.error("Seleccione un residente");
      return;
    }

    if (Object.keys(nortonScores).length !== nortonItems.length) {
      toast.error("Complete todos los ítems de la escala");
      return;
    }

    const totalScore = calculateNortonTotal();

    createAssessment.mutate({
      residentId: selectedResidentId,
      scaleType: "norton",
      totalScore,
      assessmentData: JSON.stringify(nortonScores),
      assessmentDate,
      interpretation: getNortonInterpretation(totalScore),
    });
  };

  const selectedResident = residents?.find((r) => r.id === selectedResidentId);

  return (
    <ResiPlusLayout currentModule="residentes">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Escalas de Valoración</h1>
          <p className="text-muted-foreground text-sm">
            Evaluación funcional y de riesgo de los residentes
          </p>
        </div>

        {/* Resident selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Seleccionar Residente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Residente</Label>
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
              </div>
              <div>
                <Label className="text-xs">Fecha de Evaluación</Label>
                <input
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors"
                />
              </div>
            </div>

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
          <Tabs defaultValue="barthel" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="barthel">Índice de Barthel</TabsTrigger>
              <TabsTrigger value="norton">Escala de Norton</TabsTrigger>
            </TabsList>

            <TabsContent value="barthel">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Índice de Barthel</CardTitle>
                  <CardDescription className="text-xs">
                    Evaluación de las actividades básicas de la vida diaria (ABVD)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {barthelItems.map((item) => (
                      <div key={item.id} className="border-b pb-4">
                        <Label className="text-sm font-semibold mb-3 block">{item.name}</Label>
                        <RadioGroup
                          value={barthelScores[item.id]?.toString()}
                          onValueChange={(value) =>
                            setBarthelScores({ ...barthelScores, [item.id]: parseInt(value) })
                          }
                        >
                          {item.options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value.toString()} id={`${item.id}-${option.value}`} />
                              <Label
                                htmlFor={`${item.id}-${option.value}`}
                                className="text-xs font-normal cursor-pointer"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}

                    <div className="pt-4 border-t-2 border-primary">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-lg font-bold">
                            Puntuación Total: {calculateBarthelTotal()} / 100
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getBarthelInterpretation(calculateBarthelTotal())}
                          </p>
                        </div>
                        <Button
                          onClick={handleSaveBarthel}
                          disabled={
                            Object.keys(barthelScores).length !== barthelItems.length ||
                            createAssessment.isPending
                          }
                        >
                          {createAssessment.isPending ? "Guardando..." : "Guardar Evaluación"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="norton">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Escala de Norton</CardTitle>
                  <CardDescription className="text-xs">
                    Evaluación del riesgo de úlceras por presión
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {nortonItems.map((item) => (
                      <div key={item.id} className="border-b pb-4">
                        <Label className="text-sm font-semibold mb-3 block">{item.name}</Label>
                        <RadioGroup
                          value={nortonScores[item.id]?.toString()}
                          onValueChange={(value) =>
                            setNortonScores({ ...nortonScores, [item.id]: parseInt(value) })
                          }
                        >
                          {item.options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value.toString()} id={`${item.id}-${option.value}`} />
                              <Label
                                htmlFor={`${item.id}-${option.value}`}
                                className="text-xs font-normal cursor-pointer"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}

                    <div className="pt-4 border-t-2 border-primary">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-lg font-bold">
                            Puntuación Total: {calculateNortonTotal()} / 20
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getNortonInterpretation(calculateNortonTotal())}
                          </p>
                        </div>
                        <Button
                          onClick={handleSaveNorton}
                          disabled={
                            Object.keys(nortonScores).length !== nortonItems.length ||
                            createAssessment.isPending
                          }
                        >
                          {createAssessment.isPending ? "Guardando..." : "Guardar Evaluación"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!selectedResidentId && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                Seleccione un residente para comenzar la evaluación
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ResiPlusLayout>
  );
}
