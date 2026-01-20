import ResiPlusLayout from "@/components/ResiPlusLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, Building2, Bed, Activity } from "lucide-react";

export default function Home() {
  const { data: residents } = trpc.residents.list.useQuery();
  const { data: rooms } = trpc.rooms.list.useQuery();
  const { data: todayControls } = trpc.carePlanning.getTodayControlsCount.useQuery();

  const activeResidents = residents?.filter(r => r.status === "active").length || 0;
  const totalRooms = rooms?.length || 0;
  const occupiedBeds = rooms?.reduce((sum, room) => sum + (room.totalBeds - room.availableBeds), 0) || 0;
  const totalBeds = rooms?.reduce((sum, room) => sum + (room.totalBeds || 0), 0) || 0;

  return (
    <ResiPlusLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Residentes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeResidents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Habitaciones</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRooms}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Camas Ocupadas</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupiedBeds} / {totalBeds}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Controles Hoy</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayControls || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bienvenido a ResiPlus Clone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sistema de gestión integral para residencias de mayores. Utilice el menú de navegación lateral
              para acceder a las diferentes secciones del sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    </ResiPlusLayout>
  );
}
