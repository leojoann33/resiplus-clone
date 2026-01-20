import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NursingControls from "./pages/NursingControls";
import AssessmentScales from "./pages/AssessmentScales";
import VitalSignsHistory from "./pages/VitalSignsHistory";
import ResidentProfile from "./pages/ResidentProfile";
import NursingNotes from "./pages/NursingNotes";
import Medications from "./pages/Medications";
import Residents from "./pages/Residents";
import NewResident from "./pages/NewResident";
import EditResident from "./pages/EditResident";
import Rooms from "./pages/Rooms";
import LoginPractice from "./pages/LoginPractice";
import CarePlans from "./pages/CarePlans";
import PlaceholderModule from "./pages/PlaceholderModule";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/nursing/controls" component={NursingControls} />
      <Route path="/nursing/care-plans" component={CarePlans} />
      <Route path="/assessment-scales" component={AssessmentScales} />
      <Route path="/vital-signs-history" component={VitalSignsHistory} />
      <Route path="/nursing-notes" component={NursingNotes} />
      <Route path="/medications" component={Medications} />
      <Route path="/residents" component={Residents} />
      <Route path="/residents/new" component={NewResident} />
      <Route path="/residents/:id/edit" component={EditResident} />
      <Route path="/residents/:id" component={ResidentProfile} />
      <Route path="/rooms" component={Rooms} />
      
      {/* Placeholder Routes for Ribbon Menu */}
      <Route path="/meetings/interdisciplinary">
        {() => <PlaceholderModule title="Reuniones Interdisciplinares" />}
      </Route>
      <Route path="/meetings/assemblies">
        {() => <PlaceholderModule title="Asambleas de Residentes" />}
      </Route>
      <Route path="/admissions/assistant">
        {() => <PlaceholderModule title="Asistente de Ingreso" />}
      </Route>
      <Route path="/admissions/overview">
        {() => <PlaceholderModule title="Visión Global" />}
      </Route>
      <Route path="/admissions/assessments">
        {() => <PlaceholderModule title="Valoraciones Unificadas" />}
      </Route>
      <Route path="/follow-ups">
        {() => <PlaceholderModule title="Seguimientos" />}
      </Route>
      <Route path="/activities/in-out">
        {() => <PlaceholderModule title="Entradas y Salidas" />}
      </Route>
      <Route path="/activities/intro">
        {() => <PlaceholderModule title="Introducción (Actividades)" />}
      </Route>
      <Route path="/activities/organization">
        {() => <PlaceholderModule title="Organización (Actividades)" />}
      </Route>
      <Route path="/incidents">
        {() => <PlaceholderModule title="Incidencias" />}
      </Route>
      <Route path="/transport">
        {() => <PlaceholderModule title="Transporte" />}
      </Route>
      <Route path="/reports">
        {() => <PlaceholderModule title="Listados" />}
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string>("");

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const savedUsername = localStorage.getItem("username");
    if (token && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider defaultTheme="light">
        <LoginPractice onLoginSuccess={handleLoginSuccess} />
      </ThemeProvider>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

