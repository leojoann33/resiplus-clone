import { useState } from "react";
import ResiPlusLayout from "@/components/ResiPlusLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function VitalSignsHistory() {
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>("blood_pressure");

  const { data: residents = [] } = trpc.residents.list.useQuery();
  const { data: vitalSigns = [] } = trpc.nursing.getVitalSignsByResident.useQuery(
    { residentId: selectedResidentId! },
    { enabled: !!selectedResidentId }
  );

  const selectedResident = residents.find((r) => r.id === selectedResidentId);

  // Filtrar y preparar datos para el gráfico
  const chartData = vitalSigns
    .filter((vs: any) => vs.type === selectedType)
    .sort((a: any, b: any) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    .map((vs: any) => ({
      date: format(new Date(vs.recordedAt), "dd/MM HH:mm", { locale: es }),
      valor: vs.value,
      sistolica: vs.systolic,
      diastolica: vs.diastolic,
    }));

  const typeLabels: Record<string, string> = {
    blood_pressure: "Tensión Arterial",
    heart_rate: "Frecuencia Cardíaca",
    respiratory_rate: "Frecuencia Respiratoria",
    weight: "Peso",
    oxygen_saturation: "Saturación de Oxígeno",
    temperature: "Temperatura",
    glucose: "Glucosa",
  };

  return (
    <ResiPlusLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Historial de Constantes Vitales</h1>
        </div>

        {/* Selector de Residente */}
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Residente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedResidentId?.toString() || ""}
              onValueChange={(value) => setSelectedResidentId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un residente" />
              </SelectTrigger>
              <SelectContent>
                {residents.map((resident) => (
                  <SelectItem key={resident.id} value={resident.id.toString()}>
                    {resident.code} - {resident.firstName} {resident.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedResident && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Código:</span> {selectedResident.code}
                  </div>
                  <div>
                    <span className="font-semibold">NIF:</span> {selectedResident.nif}
                  </div>
                  <div>
                    <span className="font-semibold">Nombre:</span> {selectedResident.firstName} {selectedResident.lastName}
                  </div>
                  <div>
                    <span className="font-semibold">Habitación:</span> {selectedResident.roomId || "Sin asignar"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedResidentId && (
          <>
            {/* Selector de Tipo de Constante */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Constante</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood_pressure">Tensión Arterial</SelectItem>
                    <SelectItem value="heart_rate">Frecuencia Cardíaca</SelectItem>
                    <SelectItem value="respiratory_rate">Frecuencia Respiratoria</SelectItem>
                    <SelectItem value="weight">Peso</SelectItem>
                    <SelectItem value="oxygen_saturation">Saturación de Oxígeno</SelectItem>
                    <SelectItem value="temperature">Temperatura</SelectItem>
                    <SelectItem value="glucose">Glucosa</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Gráfico de Evolución */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución de {typeLabels[selectedType]}</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedType === "blood_pressure" ? (
                        <>
                          <Line
                            type="monotone"
                            dataKey="sistolica"
                            stroke="#ef4444"
                            name="Sistólica"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="diastolica"
                            stroke="#3b82f6"
                            name="Diastólica"
                            strokeWidth={2}
                          />
                        </>
                      ) : (
                        <Line
                          type="monotone"
                          dataKey="valor"
                          stroke="#10b981"
                          name={typeLabels[selectedType]}
                          strokeWidth={2}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay datos registrados para esta constante
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabla de Registros */}
            <Card>
              <CardHeader>
                <CardTitle>Registros Detallados</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Fecha y Hora</th>
                          {selectedType === "blood_pressure" ? (
                            <>
                              <th className="border border-gray-300 px-4 py-2 text-left">Sistólica</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Diastólica</th>
                            </>
                          ) : (
                            <th className="border border-gray-300 px-4 py-2 text-left">Valor</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {chartData.reverse().map((data: any, index: number) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                            <td className="border border-gray-300 px-4 py-2">{data.date}</td>
                            {selectedType === "blood_pressure" ? (
                              <>
                                <td className="border border-gray-300 px-4 py-2">{data.sistolica}</td>
                                <td className="border border-gray-300 px-4 py-2">{data.diastolica}</td>
                              </>
                            ) : (
                              <td className="border border-gray-300 px-4 py-2">{data.valor}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No hay registros para mostrar
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ResiPlusLayout>
  );
}
