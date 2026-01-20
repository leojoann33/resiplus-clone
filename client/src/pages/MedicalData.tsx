import { useState } from "react";
import ResiPlusModernLayout from "@/components/ResiPlusModernLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, Search } from "lucide-react";

export default function MedicalData() {
  const [activeTab, setActiveTab] = useState("pathologies");
  const [selectedResident, setSelectedResident] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Mock data para demostración
  const [pathologies] = useState([
    {
      id: 1,
      code: "E10.9",
      description: "Diabetes mellitus tipo 1 sin complicaciones",
      status: "Activa",
    },
    {
      id: 2,
      code: "I10",
      description: "Hipertensión esencial (primaria)",
      status: "Activa",
    },
  ]);

  const [allergies] = useState([
    {
      id: 1,
      code: "CIE-10, Z91.0",
      description: "Alergia al huevo",
      severity: "Moderada",
    },
  ]);

  const [medications] = useState([
    {
      id: 1,
      name: "Metformina",
      dosage: "500mg",
      frequency: "2 veces al día",
      route: "Oral",
      days: "L, M, X, J, V, S, D",
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "1 vez al día",
      route: "Oral",
      days: "L, M, X, J, V, S, D",
    },
  ]);

  return (
    <ResiPlusModernLayout currentModule="residentes" title="Datos Médicos del Residente">
      <div className="space-y-6">
        {/* Selector de Residente */}
        <Card className="p-6 bg-white shadow-sm border border-gray-200">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Residente
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Código o nombre del residente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs de Datos Médicos */}
        <Card className="p-6 bg-white shadow-sm border border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="pathologies">Patologías</TabsTrigger>
              <TabsTrigger value="allergies">Alergias</TabsTrigger>
              <TabsTrigger value="antecedents">Antecedentes</TabsTrigger>
              <TabsTrigger value="medications">Medicamentos</TabsTrigger>
              <TabsTrigger value="procedures">Procedimientos</TabsTrigger>
            </TabsList>

            {/* Tab: Patologías */}
            <TabsContent value="pathologies" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Patologías del Residente</h3>
                <Button onClick={() => setShowForm(!showForm)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Patología
                </Button>
              </div>

              {showForm && (
                <Card className="p-4 bg-blue-50 border border-blue-200">
                  <div className="space-y-3">
                    <Input placeholder="Código CIE-10" />
                    <Textarea placeholder="Descripción de la patología" rows={3} />
                    <div className="flex gap-2">
                      <Button size="sm">Guardar</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-3">
                {pathologies.map((pathology) => (
                  <Card key={pathology.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{pathology.code}</Badge>
                          <Badge variant="secondary">{pathology.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{pathology.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Alergias */}
            <TabsContent value="allergies" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Alergias Conocidas</h3>
                <Button onClick={() => setShowForm(!showForm)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Alergia
                </Button>
              </div>

              <div className="space-y-3">
                {allergies.map((allergy) => (
                  <Card key={allergy.id} className="p-4 hover:shadow-md transition-shadow border-orange-200 bg-orange-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">{allergy.severity}</Badge>
                          <span className="text-xs text-gray-600">{allergy.code}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{allergy.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Antecedentes */}
            <TabsContent value="antecedents" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Antecedentes Médicos</h3>
                <Button onClick={() => setShowForm(!showForm)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Antecedente
                </Button>
              </div>
              <p className="text-sm text-gray-600">No hay antecedentes registrados</p>
            </TabsContent>

            {/* Tab: Medicamentos */}
            <TabsContent value="medications" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tratamiento Actual</h3>
                <Button onClick={() => setShowForm(!showForm)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Medicamento
                </Button>
              </div>

              <div className="space-y-3">
                {medications.map((med) => (
                  <Card key={med.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{med.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Dosis:</span> {med.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frecuencia:</span> {med.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Vía:</span> {med.route}
                          </div>
                          <div>
                            <span className="font-medium">Días:</span> {med.days}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Procedimientos */}
            <TabsContent value="procedures" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Procedimientos Médicos</h3>
                <Button onClick={() => setShowForm(!showForm)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Procedimiento
                </Button>
              </div>
              <p className="text-sm text-gray-600">No hay procedimientos registrados</p>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </ResiPlusModernLayout>
  );
}
