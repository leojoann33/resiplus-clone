import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  Bed,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Menu,
  Pill,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";

interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { title: "Inicio", href: "/", icon: <Home className="h-5 w-5" /> },
  { title: "Residentes", href: "/residents", icon: <Users className="h-5 w-5" /> },
  { title: "Habitaciones", href: "/rooms", icon: <Bed className="h-5 w-5" /> },
  { title: "Enfermería", href: "/nursing", icon: <Stethoscope className="h-5 w-5" /> },
  { title: "Constantes Vitales", href: "/vital-signs", icon: <Activity className="h-5 w-5" /> },
  { title: "Medicamentos", href: "/medications", icon: <Pill className="h-5 w-5" /> },
  { title: "Escalas de Valoración", href: "/assessments", icon: <ClipboardList className="h-5 w-5" /> },
  { title: "Notas de Enfermería", href: "/nursing-notes", icon: <FileText className="h-5 w-5" /> },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logoutMutation = trpc.auth.logout.useMutation();

  // Check for local practice auth token
  const localToken = localStorage.getItem("auth_token");
  const localUsername = localStorage.getItem("username");
  const isLocalAuthenticated = Boolean(localToken && localUsername);

  // Consider authenticated if either OAuth or local practice auth is valid
  const isAuthenticated = Boolean(user) || isLocalAuthenticated;
  const displayName = user?.name || localUsername || "Usuario";
  const displayEmail = user?.email || "";

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (e) {
      // Ignore errors from OAuth logout
    }
    // Clear local auth and reload
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  if (loading && !isLocalAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Clear local auth and reload to show login
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    window.location.href = "/";
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-border bg-sidebar">
        <div className="flex h-16 items-center justify-center border-b border-border px-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">ResiPlus Clone</h1>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </a>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <Separator />
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium">
              {displayName[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-border">
            <div className="flex h-16 items-center justify-between border-b border-border px-6">
              <h1 className="text-xl font-bold text-sidebar-foreground">ResiPlus Clone</h1>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 px-3 py-4 h-[calc(100vh-8rem)]">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <a
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {item.icon}
                        {item.title}
                      </a>
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>
            <Separator />
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium">
                  {displayName[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">ResiPlus Clone</h1>
          <div className="w-10" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
