import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginPracticeProps {
  onLoginSuccess: (username: string) => void;
}

interface PracticeCredentials {
  username: string;
  password: string;
}

export default function LoginPractice({ onLoginSuccess }: LoginPracticeProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [practiceCredentials, setPracticeCredentials] = useState<PracticeCredentials>({
    username: "hermana",
    password: "password123"
  });

  // Obtener credenciales de práctica del servidor
  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch("/api/auth/practice-credentials");
        if (response.ok) {
          const data = await response.json();
          setPracticeCredentials(data);
        }
      } catch (err) {
        console.error("Error obteniendo credenciales de práctica:", err);
      }
    };
    fetchCredentials();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Obtener credenciales del servidor
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Credenciales inválidas");
        setIsLoading(false);
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("username", username);

      // Llamar callback de éxito
      onLoginSuccess(username);
    } catch (err) {
      setError("Error al conectar con el servidor. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <div className="p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ResiPlus Clone</h1>
            <p className="text-gray-600 mt-2">Plataforma de Práctica</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Usuario
                </div>
              </label>
              <Input
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </div>
              </label>
              <Input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
                required
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Credenciales de Práctica
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-medium">Usuario:</span> {practiceCredentials.username}
              </p>
              <p>
                <span className="font-medium">Contraseña:</span> {practiceCredentials.password}
              </p>
              <p className="text-xs text-gray-600 mt-3">
                Puedes cambiar estas credenciales en el archivo .env
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Plataforma de Práctica para Residencias Geriátricas</p>
            <p>Versión 2.3.0</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
