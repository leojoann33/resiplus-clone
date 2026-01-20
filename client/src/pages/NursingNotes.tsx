import { useState } from "react";
import ResiPlusLayout from "@/components/ResiPlusLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function NursingNotes() {
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteCategory, setNoteCategory] = useState<string>("general");
  const [notePriority, setNotePriority] = useState<string>("normal");

  const { data: residents = [] } = trpc.residents.list.useQuery();
  const { data: notes = [], refetch } = trpc.nursingNotes.listByResident.useQuery(
    { residentId: selectedResidentId! },
    { enabled: !!selectedResidentId }
  );

  const createNoteMutation = trpc.nursingNotes.create.useMutation({
    onSuccess: () => {
      toast.success("Nota de enfermería registrada correctamente");
      setNoteContent("");
      setNoteTitle("");
      setNoteCategory("general");
      setNotePriority("normal");
      refetch();
    },
    onError: (error) => {
      toast.error("Error al registrar la nota: " + error.message);
    },
  });

  const selectedResident = residents.find((r) => r.id === selectedResidentId);

  const handleSubmit = () => {
    if (!selectedResidentId) {
      toast.error("Por favor, seleccione un residente");
      return;
    }
    if (!noteContent.trim()) {
      toast.error("Por favor, escriba el contenido de la nota");
      return;
    }

    createNoteMutation.mutate({
      residentId: selectedResidentId,
      category: noteCategory as any,
      title: noteTitle || "Nota de enfermería",
      content: noteContent,
      noteDate: new Date().toISOString(),
      priority: notePriority as any,
    });
  };

  return (
    <ResiPlusLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notas de Enfermería</h1>

        {/* Selector de Residente */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Seleccionar Residente</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedResidentId?.toString() || ""}
              onValueChange={(value) => setSelectedResidentId(parseInt(value))}
            >
              <SelectTrigger className="w-full">
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
          </CardContent>
        </Card>

        {selectedResident && (
          <>
            {/* Información del Residente */}
            <Card className="mb-6">
              <CardHeader className="bg-blue-100">
                <CardTitle>
                  {selectedResident.firstName} {selectedResident.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Código:</span> {selectedResident.code}
                  </div>
                  <div>
                    <span className="font-semibold">NIF:</span> {selectedResident.nif || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Habitación:</span> {selectedResident.roomId || "Sin asignar"}
                  </div>
                  <div>
                    <span className="font-semibold">Estado:</span>{" "}
                    {selectedResident.status === "active" ? "Activo" : "Inactivo"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulario de Nueva Nota */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Nueva Nota de Enfermería</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Categoría</label>
                      <Select value={noteCategory} onValueChange={setNoteCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="vital_signs">Constantes Vitales</SelectItem>
                          <SelectItem value="medication">Medicación</SelectItem>
                          <SelectItem value="nutrition">Nutrición</SelectItem>
                          <SelectItem value="hygiene">Higiene</SelectItem>
                          <SelectItem value="mobility">Movilidad</SelectItem>
                          <SelectItem value="behavior">Comportamiento</SelectItem>
                          <SelectItem value="wound_care">Cuidado de Heridas</SelectItem>
                          <SelectItem value="incident">Incidente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Prioridad</label>
                      <Select value={notePriority} onValueChange={setNotePriority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Título</label>
                    <input
                      type="text"
                      placeholder="Título de la nota"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Contenido de la Nota</label>
                    <Textarea
                      placeholder="Escriba aquí las observaciones de enfermería..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      rows={6}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={createNoteMutation.isPending}>
                      {createNoteMutation.isPending ? "Guardando..." : "Guardar Nota"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historial de Notas */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notes.length > 0 ? (
                    notes.map((note: any) => (
                      <div key={note.id} className="border border-gray-300 p-4 rounded bg-yellow-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-sm">
                            {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                          </span>
                          <span className="text-xs text-gray-600">Usuario: {note.userId}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No hay notas de enfermería registradas para este residente
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!selectedResidentId && (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-gray-500">
                Seleccione un residente para ver y registrar notas de enfermería
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ResiPlusLayout>
  );
}
