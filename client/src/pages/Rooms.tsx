import ResiPlusLayout from "@/components/ResiPlusLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Bed, Plus } from "lucide-react";

export default function Rooms() {
  const { data: rooms, isLoading } = trpc.rooms.list.useQuery();

  const getRoomTypeLabel = (type: string) => {
    const labels = {
      single: "Individual",
      double: "Doble",
      triple: "Triple",
      shared: "Compartida",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getOccupancyBadge = (available: number, total: number) => {
    const occupied = total - available;
    const percentage = (occupied / total) * 100;
    
    let colorClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (percentage >= 100) {
      colorClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    } else if (percentage >= 75) {
      colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {occupied}/{total} ocupadas
      </span>
    );
  };

  return (
    <ResiPlusLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Habitaciones</h1>
            <p className="text-muted-foreground mt-2">Gestión de habitaciones y camas del centro</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Habitación
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Habitaciones</CardTitle>
            <CardDescription>Estado de ocupación de las habitaciones</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                <p className="text-muted-foreground mt-2">Cargando habitaciones...</p>
              </div>
            ) : rooms && rooms.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Planta</TableHead>
                      <TableHead>Ocupación</TableHead>
                      <TableHead>Características</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.code}</TableCell>
                        <TableCell>{room.name}</TableCell>
                        <TableCell>{getRoomTypeLabel(room.roomType)}</TableCell>
                        <TableCell>{room.floor ? `Planta ${room.floor}` : "N/A"}</TableCell>
                        <TableCell>{getOccupancyBadge(room.availableBeds, room.totalBeds)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {room.hasPrivateBathroom && (
                              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                                Baño
                              </span>
                            )}
                            {room.hasBalcony && (
                              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                                Balcón
                              </span>
                            )}
                            {room.isAccessible && (
                              <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded">
                                Accesible
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No hay habitaciones registradas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ResiPlusLayout>
  );
}
