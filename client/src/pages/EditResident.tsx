import ResiPlusLayout from "@/components/ResiPlusLayout";
import ResidentForm from "@/components/ResidentForm";
import { ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "wouter";

export default function EditResident() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const residentId = params.id ? parseInt(params.id) : undefined;

  const handleSuccess = () => {
    setLocation("/residents");
  };

  const handleCancel = () => {
    setLocation("/residents");
  };

  if (!residentId) {
    return (
      <ResiPlusLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">ID de residente no válido</p>
        </div>
      </ResiPlusLayout>
    );
  }

  return (
    <ResiPlusLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Residente</h1>
          <p className="text-muted-foreground mt-2">Modifica los datos del residente</p>
        </div>

        <ResidentForm residentId={residentId} onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </ResiPlusLayout>
  );
}
