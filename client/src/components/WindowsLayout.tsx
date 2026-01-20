import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import WindowsMenuBar from "./WindowsMenuBar";

interface WindowsLayoutProps {
  children: React.ReactNode;
}

export default function WindowsLayout({ children }: WindowsLayoutProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Check for local practice auth token
  const localToken = localStorage.getItem("auth_token");
  const localUsername = localStorage.getItem("username");
  const isLocalAuthenticated = Boolean(localToken && localUsername);

  // Consider authenticated if either OAuth or local practice auth is valid
  const isAuthenticated = Boolean(user) || isLocalAuthenticated;
  const displayName = user?.name || user?.email || localUsername || "Usuario";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLocalAuthenticated) {
      window.location.href = "/api/oauth/login";
    }
  }, [loading, isAuthenticated, isLocalAuthenticated]);

  if (loading && !isLocalAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0078d7] mx-auto mb-4" />
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0]">
      {/* Barra de Título (simulada) */}
      <div className="bg-gradient-to-r from-[#0078d7] to-[#005a9e] text-white px-3 py-1 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/20 rounded" />
          <span className="font-semibold">ResiPlus Clone - Sistema de Gestión de Residencias</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span>{displayName}</span>
        </div>
      </div>

      {/* Barra de Menú y Herramientas */}
      <WindowsMenuBar />

      {/* Área de Trabajo Principal */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="h-full p-6">{children}</div>
      </div>

      {/* Barra de Estado */}
      <div className="bg-[#f0f0f0] border-t border-[#a0a0a0] px-3 py-1 flex items-center justify-between text-xs text-gray-700">
        <div className="flex items-center gap-4">
          <span>Listo</span>
          {isAuthenticated && (
            <span>
              Usuario: <strong>{displayName}</strong>
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>{new Date().toLocaleDateString("es-ES")}</span>
          <span>{new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
}
