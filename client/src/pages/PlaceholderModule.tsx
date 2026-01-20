import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface PlaceholderModuleProps {
  title: string;
  description?: string;
}

export default function PlaceholderModule({ title, description }: PlaceholderModuleProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center p-8">
      <div className="max-w-md space-y-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-4xl">🚧</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        
        <p className="text-gray-500 text-lg">
          {description || "Este módulo está actualmente en desarrollo como parte del proyecto ResiPlus Clone."}
        </p>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
          <strong>Nota para usuario:</strong> El botón del menú funciona correctamente, verificando la integridad de la navegación.
        </div>

        <Link href="/residents">
          <Button variant="outline" className="mt-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Residentes
          </Button>
        </Link>
      </div>
    </div>
  );
}
