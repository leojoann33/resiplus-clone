import ResiPlusLayout from "@/components/ResiPlusLayout";
import ResidentForm from "@/components/ResidentForm";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NewResident() {
  const [, setLocation] = useLocation();

  const handleSuccess = () => {
    setLocation("/residents");
  };

  const handleCancel = () => {
    setLocation("/residents");
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Residente</h1>
          <p className="text-muted-foreground mt-2">Registra un nuevo residente en el sistema</p>
        </div>

        <ResidentForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </ResiPlusLayout>
  );
}
