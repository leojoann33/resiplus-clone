import { useState } from "react";
import { useParams } from "wouter";
import ResiPlusLayout from "@/components/ResiPlusLayout";
import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ResidentProfile() {
  const params = useParams();
  const residentId = parseInt(params.id || "0");

  const { data: resident } = trpc.residents.getById.useQuery({ id: residentId });
  const { data: vitalSigns = [] } = trpc.nursing.getVitalSignsByResident.useQuery(
    { residentId },
    { enabled: !!residentId }
  );
  const { data: medications = [] } = trpc.medications.listByResident.useQuery(
    { residentId },
    { enabled: !!residentId }
  );
  const { data: scales = [] } = trpc.nursing.getScalesByResident.useQuery(
    { residentId },
    { enabled: !!residentId }
  );
  const { data: notes = [] } = trpc.nursingNotes.listByResident.useQuery(
    { residentId },
    { enabled: !!residentId }
  );

  if (!resident) {
    return (
      <ResiPlusLayout>
        <div className="p-6">
          <p>Cargando información del residente...</p>
        </div>
      </ResiPlusLayout>
    );
  }

  const calculateAge = (birthDate: Date | null) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Preparar datos para gráfico de TA
  const taData = vitalSigns
    .filter((vs: any) => vs.measurementType === "blood_pressure")
    .sort((a: any, b: any) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime())
    .slice(-10)
    .map((vs: any) => {
      const date = new Date(vs.measurementDate);
      return {
        fecha: isNaN(date.getTime()) ? "--" : format(date, "dd/MM", { locale: es }),
        sistólica: vs.systolicBP,
        diastólica: vs.diastolicBP,
      };
    });

  return (
    <ResiPlusLayout>
      <div className="p-6">
        {/* Cabecera con datos del residente */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-100">
            <CardTitle className="text-xl">
              {resident.firstName} {resident.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold">Código:</span> {resident.code}
              </div>
              <div>
                <span className="font-semibold">NIF:</span> {resident.nif || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Edad:</span> {resident.birthDate ? calculateAge(resident.birthDate) : 0} años
              </div>
              <div>
                <span className="font-semibold">Habitación:</span> {resident.roomId || "Sin asignar"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pestañas principales */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Datos Personales</TabsTrigger>
            <TabsTrigger value="vitals">Constantes</TabsTrigger>
            <TabsTrigger value="medications">Medicamentos</TabsTrigger>
            <TabsTrigger value="scales">Escalas</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>

          {/* Pestaña: Datos Personales */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-700">Datos Básicos</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-semibold">Código:</span> {resident.code}</div>
                      <div><span className="font-semibold">NIF:</span> {resident.nif || "N/A"}</div>
                      <div><span className="font-semibold">NSS:</span> {resident.nss || "N/A"}</div>
                      <div><span className="font-semibold">NSIP:</span> {resident.nsip || "N/A"}</div>
                      <div><span className="font-semibold">Nombre:</span> {resident.firstName}</div>
                      <div><span className="font-semibold">Apellidos:</span> {resident.lastName}</div>
                      <div><span className="font-semibold">Fecha de Nacimiento:</span> {resident.birthDate ? format(new Date(resident.birthDate), "dd/MM/yyyy", { locale: es }) : "N/A"}</div>
                      <div><span className="font-semibold">Edad:</span> {calculateAge(resident.birthDate)} años</div>
                      <div><span className="font-semibold">Género:</span> {resident.gender === "male" ? "Masculino" : resident.gender === "female" ? "Femenino" : "Otro"}</div>
                      <div><span className="font-semibold">Lugar de Nacimiento:</span> {resident.birthPlace || "N/A"}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-blue-700">Datos de Admisión</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-semibold">Fecha de Admisión:</span> {resident.admissionDate ? format(new Date(resident.admissionDate), "dd/MM/yyyy", { locale: es }) : "N/A"}</div>
                      <div><span className="font-semibold">Habitación:</span> {resident.roomId || "Sin asignar"}</div>
                      <div><span className="font-semibold">Número de Cama:</span> {resident.bedNumber || "N/A"}</div>
                      <div><span className="font-semibold">Estado:</span> {resident.status === "active" ? "Activo" : resident.status === "discharged" ? "Baja" : "Fallecido"}</div>
                    </div>

                    <h3 className="font-semibold mb-3 mt-6 text-blue-700">Contacto</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-semibold">Teléfono:</span> {resident.contactPhone || "N/A"}</div>
                      <div><span className="font-semibold">Email:</span> {resident.contactEmail || "N/A"}</div>
                      <div><span className="font-semibold">Contacto de Emergencia:</span> {resident.emergencyContactName || "N/A"}</div>
                      <div><span className="font-semibold">Teléfono de Emergencia:</span> {resident.emergencyContactPhone || "N/A"}</div>
                      <div><span className="font-semibold">Relación:</span> {resident.emergencyContactRelation || "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3 text-blue-700">Información Médica</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-semibold">Notas Médicas:</span> {resident.medicalNotes || "Ninguna"}</div>
                    <div><span className="font-semibold">Alergias:</span> {resident.allergies || "Ninguna"}</div>
                    <div><span className="font-semibold">Necesidades Especiales:</span> {resident.specialNeeds || "Ninguna"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña: Constantes Vitales */}
          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <CardTitle>Constantes Vitales</CardTitle>
              </CardHeader>
              <CardContent>
                {taData.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Evolución de Tensión Arterial (últimos 10 registros)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={taData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sistólica" stroke="#ef4444" name="Sistólica" />
                        <Line type="monotone" dataKey="diastólica" stroke="#3b82f6" name="Diastólica" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <h3 className="font-semibold mb-3">Últimos Registros</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Fecha/Hora</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Valor</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vitalSigns.slice(0, 10).map((vs: any, index: number) => {
                        const date = new Date(vs.measurementDate);
                        const dateStr = isNaN(date.getTime()) ? "Fecha inválida" : format(date, "dd/MM/yyyy HH:mm", { locale: es });
                        return (
                          <tr key={vs.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                            <td className="border border-gray-300 px-4 py-2">
                              {dateStr}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {vs.measurementType === "blood_pressure" ? "Tensión Arterial" :
                               vs.measurementType === "heart_rate" ? "Frecuencia Cardíaca" :
                               vs.measurementType === "respiratory_rate" ? "Frecuencia Respiratoria" :
                               vs.measurementType === "weight" ? "Peso" :
                               vs.measurementType === "oxygen_saturation" ? "Saturación O2" :
                               vs.measurementType === "temperature" ? "Temperatura" :
                               vs.measurementType === "glucose" ? "Glucosa" : vs.measurementType}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {vs.measurementType === "blood_pressure" ? `${vs.systolicBP}/${vs.diastolicBP} mmHg` :
                               vs.measurementType === "heart_rate" ? `${vs.heartRate} lpm` :
                               vs.measurementType === "temperature" ? `${vs.temperature} °C` :
                               vs.measurementType === "oxygen_saturation" ? `${vs.oxygenSaturation}%` :
                               vs.measurementType === "glucose" ? `${vs.glucose} mg/dL` :
                               vs.measurementType === "weight" ? `${vs.weight} kg` :
                               vs.measurementType === "respiratory_rate" ? `${vs.respiratoryRate} rpm` : "-"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{vs.notes || "-"}</td>
                          </tr>
                        );
                      })}
                      {vitalSigns.length === 0 && (
                        <tr>
                          <td colSpan={4} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                            No hay registros de constantes vitales
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña: Medicamentos */}
          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Medicamentos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Medicamento</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Principio Activo</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Dosis</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Vía</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Horarios</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medications.filter((m: any) => m.isActive).map((med: any, index: number) => {
                        let times = "-";
                        try {
                          times = JSON.parse(med.administrationTimes).join(", ");
                        } catch (e) {
                          times = med.administrationTimes || "-"; 
                        }
                        return (
                          <tr key={med.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                            <td className="border border-gray-300 px-4 py-2 font-medium">{med.medicationName}</td>
                            <td className="border border-gray-300 px-4 py-2">{med.activeIngredient || "-"}</td>
                            <td className="border border-gray-300 px-4 py-2">{med.dosage} {med.unit}</td>
                            <td className="border border-gray-300 px-4 py-2">{med.administrationRoute}</td>
                            <td className="border border-gray-300 px-4 py-2">{times}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              {med.scheduleType === "chronic" ? "Crónica" : "Aguda"}
                            </td>
                          </tr>
                        );
                      })}
                      {medications.filter((m: any) => m.isActive).length === 0 && (
                        <tr>
                          <td colSpan={6} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                            No hay medicamentos activos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña: Escalas */}
          <TabsContent value="scales">
            <Card>
              <CardHeader>
                <CardTitle>Escalas de Valoración</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                    {scales.map((scale: any) => {
                      const assessDate = new Date(scale.assessmentDate);
                      const dateStr = isNaN(assessDate.getTime()) ? "Fecha inválida" : format(assessDate, "dd/MM/yyyy HH:mm", { locale: es });
                      return (
                        <div key={scale.id} className="border border-gray-300 p-4 rounded">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {scale.scaleType === "barthel" ? "Escala de Barthel" : "Escala de Norton"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {dateStr}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-700">{scale.totalScore}</div>
                              <div className="text-sm text-gray-600">
                                {scale.scaleType === "barthel" 
                                  ? scale.totalScore === 100 ? "Independiente" 
                                    : scale.totalScore >= 91 ? "Dependencia leve"
                                    : scale.totalScore >= 61 ? "Dependencia moderada"
                                    : scale.totalScore >= 21 ? "Dependencia grave"
                                    : "Dependencia total"
                                  : scale.totalScore <= 12 ? "Riesgo alto"
                                    : scale.totalScore <= 14 ? "Riesgo medio"
                                    : "Riesgo bajo"}
                              </div>
                            </div>
                          </div>
                          {scale.notes && (
                            <p className="text-sm text-gray-700 mt-2">
                              <span className="font-semibold">Observaciones:</span> {scale.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  {scales.length === 0 && (
                    <p className="text-center text-gray-500">No hay escalas de valoración registradas</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña: Notas */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notas de Enfermería</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notes.map((note: any) => {
                    const noteDate = new Date(note.noteDate || note.createdAt);
                    const dateStr = isNaN(noteDate.getTime()) ? "Fecha inválida" : format(noteDate, "dd/MM/yyyy HH:mm", { locale: es });
                    return (
                      <div key={note.id} className="border border-gray-300 p-4 rounded bg-yellow-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-semibold">{note.title}</span>
                            <span className="text-xs text-gray-500 ml-2">({note.category})</span>
                          </div>
                          <span className="text-xs text-gray-600">{dateStr}</span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                        {note.priority && note.priority !== "normal" && (
                          <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                            note.priority === "urgent" ? "bg-red-100 text-red-700" :
                            note.priority === "high" ? "bg-orange-100 text-orange-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {note.priority === "urgent" ? "Urgente" : note.priority === "high" ? "Alta" : "Baja"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {notes.length === 0 && (
                    <p className="text-center text-gray-500">No hay notas de enfermería registradas</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResiPlusLayout>
  );
}
