import ResiPlusLayout from "@/components/ResiPlusLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Residents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const { data: residents, isLoading } = trpc.residents.list.useQuery({ searchTerm });

  const calculateAge = (birthDate: Date | string | null) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      discharged: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      deceased: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    const labels = {
      active: "Activo",
      discharged: "Alta",
      deceased: "Fallecido",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <ResiPlusLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Residentes</h1>
            <p className="text-muted-foreground mt-2">Gestión de residentes del centro</p>
          </div>
          <Button onClick={() => setLocation("/residents/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Residente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Residentes</CardTitle>
            <CardDescription>Busca y gestiona los residentes del centro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, código o NIF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                <p className="text-muted-foreground mt-2">Cargando residentes...</p>
              </div>
            ) : residents && residents.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Edad</TableHead>
                      <TableHead>Habitación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {residents.map((resident) => (
                      <TableRow key={resident.id}>
                        <TableCell className="font-medium">{resident.code}</TableCell>
                        <TableCell>{`${resident.firstName} ${resident.lastName}`}</TableCell>
                        <TableCell>{calculateAge(resident.birthDate)}</TableCell>
                        <TableCell>{resident.roomId ? `Hab. ${resident.roomId}` : "Sin asignar"}</TableCell>
                        <TableCell>{getStatusBadge(resident.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setLocation(`/residents/${resident.id}`)}
                            >
                              Ver Ficha
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setLocation(`/residents/${resident.id}/edit`)}
                            >
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron residentes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ResiPlusLayout>
  );
}
