import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, Users, Pill, Building2, UserCog, Package, 
  DollarSign, ClipboardCheck, Settings, Shield, 
  Calendar, Wrench, HelpCircle, ChevronDown, ChevronRight,
  Stethoscope, Activity, Scale, ClipboardList, FileText,
  Heart, Syringe, Thermometer, UserPlus, MessageSquare,
  FileSearch, FileCheck, List, FolderOpen, ArrowRightLeft,
  Mic, Presentation, AlertCircle, Bus, User, CalendarDays,
  ListTree, Layers, DoorOpen, Calculator
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";

interface ResiPlusLayoutProps {
  children: ReactNode;
  currentModule?: string;
}

const modules = [
  { id: "residentes", label: "RESIDENTES", icon: Users },
  { id: "farmacia", label: "FARMACIA", icon: Pill },
  { id: "comercial", label: "COMERCIAL", icon: Building2 },
  { id: "personal", label: "PERSONAL", icon: UserCog },
  { id: "proveedores", label: "PROVEEDORES", icon: Package },
  { id: "almacenes", label: "ALMACENES", icon: Package },
  { id: "economico", label: "ECONÓMICO", icon: DollarSign },
  { id: "calidad", label: "CALIDAD", icon: ClipboardCheck },
  { id: "configuracion", label: "CONFIGURACIÓN", icon: Settings },
  { id: "seguridad", label: "SEGURIDAD", icon: Shield },
  { id: "planificador", label: "PLANIFICADOR", icon: Calendar },
  { id: "servicios", label: "SERVICIOS GENERALES", icon: Wrench },
  { id: "ayuda", label: "AYUDA", icon: HelpCircle },
];

interface NavSection {
  id: string;
  label: string;
  icon?: any;
  children?: NavSection[];
  path?: string;
}

const sidebarSections: NavSection[] = [
  // Navegación principal según ResiPlus original
  { id: "general", label: "General", path: "/residents" },
  { id: "economico", label: "Económico" },
  { id: "farmacia", label: "Farmacia" },
  { id: "acp", label: "ACP" },
  { id: "medico", label: "Médico" },
  {
    id: "enfermeria",
    label: "Enfermería",
    children: [
      { id: "controles", label: "Controles", path: "/nursing/controls" },
      { id: "escalas", label: "Escalas", path: "/assessment-scales" },
      { id: "seguimiento", label: "Seguimiento" },
      { id: "valoracion-cuidado", label: "Valoración de Cuidados", path: "/nursing/care-plans" },
      { id: "valoraciones", label: "Valoraciones" },
      { id: "informes-enf", label: "Informes" },
      { id: "documentos-enf", label: "Documentos" },
      { id: "observaciones-enf", label: "Observaciones", path: "/nursing-notes" },
      { id: "medicamentos", label: "Medicamentos", path: "/medications" },
    ],
  },
  { id: "trabajador-social", label: "Trabajador Social" },
  { id: "psicologo", label: "Psicólogo" },
  { id: "animador", label: "Animador Sociocultural" },
  { id: "fisioterapeuta", label: "Fisioterapeuta" },
  { id: "dietista", label: "Dietista" },
  { id: "terapeuta", label: "Terapeuta Ocupacional" },
];

export default function ResiPlusLayout({ children, currentModule = "residentes" }: ResiPlusLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(["enfermeria"]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar - ResiPlus style */}
      <div className="bg-primary text-primary-foreground h-8 flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          <span className="font-semibold">ResiPlus Clone - Sistema de Gestión de Residencias</span>
        </div>
        <div className="flex items-center gap-4">
          <span>resiplus1.emera.cloud</span>
          <span>{user?.name || "Usuario"}</span>
        </div>
      </div>

      {/* Module bar */}
      <div className="bg-background border-b border-border h-7 flex items-center px-2 text-xs">
        {modules.map((module) => (
          <Button
            key={module.id}
            variant="ghost"
            size="sm"
            className={`h-6 px-3 text-xs font-normal ${
              currentModule === module.id ? "bg-accent" : ""
            }`}
          >
            {module.label}
          </Button>
        ))}
      </div>

      {/* Ribbon Menu - Residentes */}
      <div className="bg-background border-b border-border p-1 flex items-stretch gap-1 overflow-x-auto h-[90px]">
        {/* GRUPO: Residentes */}
        <div className="flex flex-col items-center justify-between px-2 min-w-[70px] border-r border-border/50 group hover:bg-muted/50 rounded-sm cursor-pointer transition-colors">
          <Link href="/residents">
            <div className="flex flex-col items-center justify-center h-full pt-1">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm mb-1">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] font-medium text-center leading-tight">Residentes</span>
            </div>
          </Link>
          <div className="text-[9px] text-muted-foreground mt-1 mb-0.5 w-full text-center border-t border-transparent group-hover:border-border/50">Residentes</div>
        </div>

        {/* GRUPO: Reuniones y asambleas */}
        <div className="flex flex-col px-1 min-w-[120px] border-r border-border/50">
          <div className="flex-1 flex flex-col justify-center gap-1">
             <Link href="/meetings/interdisciplinary">
               <Button variant="ghost" size="sm" className="h-6 justify-start px-1 text-[11px] font-normal w-full">
                  <Users className="w-4 h-4 mr-2 text-slate-600" />
                  Interdisciplinares
               </Button>
             </Link>
             <Link href="/meetings/assemblies">
               <Button variant="ghost" size="sm" className="h-6 justify-start px-1 text-[11px] font-normal w-full">
                  <MessageSquare className="w-4 h-4 mr-2 text-slate-600" />
                  Asambleas residentes
               </Button>
             </Link>
          </div>
          <div className="text-[10px] text-muted-foreground text-center bg-muted/20 pb-0.5">Reuniones y asambleas</div>
        </div>

        {/* GRUPO: Ingresos y valoraciones */}
        <div className="flex flex-col px-1 border-r border-border/50">
          <div className="flex-1 flex flex-row gap-1">
             {/* Asistente */}
             <Link href="/admissions/assistant">
               <div className="flex flex-col items-center justify-center px-2 hover:bg-muted/50 rounded-sm cursor-pointer">
                  <UserPlus className="w-8 h-8 text-slate-700 mb-1" />
                  <span className="text-[11px] font-medium text-center leading-tight w-16">Asistente de ingreso</span>
               </div>
             </Link>
             {/* Lista pequeña */}
             <div className="flex flex-col justify-center gap-1 min-w-[130px]">
               <Link href="/admissions/overview">
                 <Button variant="ghost" size="sm" className="h-6 justify-start px-1 text-[11px] font-normal w-full">
                    <FileSearch className="w-4 h-4 mr-2 text-slate-600" />
                    Visión global
                 </Button>
               </Link>
               <Link href="/admissions/assessments">
                 <Button variant="ghost" size="sm" className="h-6 justify-start px-1 text-[11px] font-normal w-full">
                    <FileCheck className="w-4 h-4 mr-2 text-slate-600" />
                    Valoraciones unificadas
                 </Button>
               </Link>
             </div>
          </div>
          <div className="text-[10px] text-muted-foreground text-center bg-muted/20 pb-0.5">Ingresos y valoraciones</div>
        </div>

        {/* GRUPO: Planificación de Cuidados */}
        <div className="flex flex-col px-1 border-r border-border/50 bg-blue-50/30">
          <div className="flex-1 flex flex-row gap-1">
             {/* Tareas de Cuidados (Grande) */}
             <Link href="/nursing/controls">
               <div className="flex flex-col items-center justify-center px-2 hover:bg-blue-100/50 rounded-sm cursor-pointer h-full">
                  <ClipboardList className="w-8 h-8 text-slate-800 mb-1" />
                  <span className="text-[11px] font-semibold text-center leading-tight w-16">Tareas de Cuidados</span>
               </div>
             </Link>
             
             {/* Sub-opciones Planificación */}
             <div className="flex flex-col justify-center gap-0.5 min-w-[140px]">
               <Link href="/nursing/care-plans?tab=planificacion">
                  <Button variant="ghost" size="sm" className="h-[22px] justify-start px-1 text-[11px] font-normal w-full hover:bg-blue-100/50">
                      <CalendarDays className="w-4 h-4 mr-2 text-slate-600" />
                      Planificación
                  </Button>
               </Link>
               <Link href="/nursing/care-plans?tab=tipos">
                 <Button variant="ghost" size="sm" className="h-[22px] justify-start px-1 text-[11px] font-normal w-full hover:bg-blue-100/50">
                    <ListTree className="w-4 h-4 mr-2 text-slate-600" />
                    Tipos de Cuidados
                 </Button>
               </Link>
               <Link href="/nursing/care-plans?tab=grupos">
                 <Button variant="ghost" size="sm" className="h-[22px] justify-start px-1 text-[11px] font-normal w-full hover:bg-blue-100/50">
                    <Layers className="w-4 h-4 mr-2 text-slate-600" />
                    Grupos de Planificación
                 </Button>
               </Link>
             </div>
          </div>
          <div className="text-[10px] text-blue-700/80 font-medium text-center bg-blue-100/20 pb-0.5">Planificación de Cuidados</div>
        </div>

        {/* GRUPO: Seguimientos */}
        <div className="flex flex-col items-center justify-between px-2 min-w-[70px] border-r border-border/50 group hover:bg-muted/50 rounded-sm cursor-pointer">
           <Link href="/follow-ups">
             <div className="flex flex-col items-center justify-center h-full pt-1">
                <FolderOpen className="w-8 h-8 text-orange-600 mb-1 stroke-[1.5]" />
                <span className="text-[11px] font-medium text-center leading-tight">Seguimientos</span>
             </div>
           </Link>
           <div className="text-[9px] text-muted-foreground mt-1 mb-0.5 w-full text-center border-t border-transparent group-hover:border-border/50">Seguimientos</div>
        </div>

        {/* GRUPO: Actividades */}
        <div className="flex flex-col px-1 border-r border-border/50">
          <div className="flex-1 flex flex-row gap-1">
             <Link href="/activities/in-out">
               <div className="flex flex-col items-center justify-center px-1 hover:bg-muted/50 rounded-sm cursor-pointer">
                  <DoorOpen className="w-8 h-8 text-slate-700 mb-1" />
                  <span className="text-[10px] font-medium text-center leading-tight w-14">Entradas y salidas</span>
               </div>
             </Link>
             <div className="flex flex-col justify-center gap-1 min-w-[100px]">
               <Link href="/activities/intro">
                 <Button variant="ghost" size="sm" className="h-6 justify-start px-1 text-[11px] font-normal w-full">
                    <Mic className="w-4 h-4 mr-2 text-slate-600" />
                    Introducción
                 </Button>
               </Link>
               <Link href="/activities/organization">
                 <Button variant="ghost" size="sm" className="h-6 justify-start px-1 text-[11px] font-normal w-full">
                    <Presentation className="w-4 h-4 mr-2 text-slate-600" />
                    Organización
                 </Button>
               </Link>
             </div>
          </div>
          <div className="text-[10px] text-muted-foreground text-center bg-muted/20 pb-0.5">Actividades</div>
        </div>

        {/* GRUPO: Incidencias */}
        <div className="flex flex-col items-center justify-between px-2 min-w-[60px] border-r border-border/50 group hover:bg-muted/50 rounded-sm cursor-pointer">
           <Link href="/incidents">
             <div className="flex flex-col items-center justify-center h-full pt-1">
                <AlertCircle className="w-9 h-9 text-orange-500 mb-1 fill-orange-100" />
                <span className="text-[11px] font-medium text-center leading-tight">Incidencias</span>
             </div>
           </Link>
           <div className="text-[9px] text-muted-foreground mt-1 mb-0.5 w-full text-center border-t border-transparent group-hover:border-border/50">Incidencias</div>
        </div>

        {/* GRUPO: Transporte */}
        <div className="flex flex-col items-center justify-between px-2 min-w-[60px] border-r border-border/50 group hover:bg-muted/50 rounded-sm cursor-pointer">
           <Link href="/transport">
             <div className="flex flex-col items-center justify-center h-full pt-1">
                <Bus className="w-8 h-8 text-slate-600 mb-1" />
                <span className="text-[11px] font-medium text-center leading-tight">Transporte</span>
             </div>
           </Link>
           <div className="text-[9px] text-muted-foreground mt-1 mb-0.5 w-full text-center border-t border-transparent group-hover:border-border/50">Transporte</div>
        </div>

        {/* GRUPO: Listados */}
        <div className="flex flex-col items-center justify-between px-2 min-w-[60px] group hover:bg-muted/50 rounded-sm cursor-pointer">
           <Link href="/reports">
             <div className="flex flex-col items-center justify-center h-full pt-1">
                <FileText className="w-8 h-8 text-orange-400 mb-1" />
                <span className="text-[11px] font-medium text-center leading-tight">Listados</span>
             </div>
           </Link>
           <div className="text-[9px] text-muted-foreground mt-1 mb-0.5 w-full text-center border-t border-transparent group-hover:border-border/50">Listados</div>
        </div>

      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar navigation */}
        <div className="w-56 bg-muted border-r border-border flex flex-col">
          <div className="p-2 border-b border-border">
            <h3 className="text-xs font-semibold">Navegación</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-1">
              {sidebarSections.map((section) => (
                <div key={section.id} className="mb-1">
                  <div className="flex items-center">
                    {section.children ? (
                      <div 
                        className="w-4 h-4 flex items-center justify-center border border-slate-400 bg-white mr-1 cursor-pointer z-10"
                        onClick={() => toggleSection(section.id)}
                      >
                         <span className="text-[10px] font-bold leading-none -mt-0.5">
                           {expandedSections.includes(section.id) ? "-" : "+"}
                         </span>
                      </div>
                    ) : (
                      <span className="w-5" />
                    )}
                    <span 
                      className={`text-xs font-semibold cursor-pointer ${section.id === "enfermeria" ? "text-black" : "text-slate-700"}`}
                      onClick={() => section.children && toggleSection(section.id)}
                    >
                      {section.label}
                    </span>
                  </div>

                  {section.children && expandedSections.includes(section.id) && (
                    <div className="relative ml-[7px] border-l border-dotted border-slate-500 pl-4 pt-0.5 pb-1">
                      {section.children.map((child, index) => (
                        <div key={child.id} className="relative flex items-center h-5">
                          {/* Horizontal connector */}
                          <div className="absolute -left-4 top-1/2 w-4 border-t border-dotted border-slate-500" />
                          
                          {/* Item content */}
                          <Link href={child.path || "#"}>
                            <div className={`
                                px-1 text-[11px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 w-full select-none
                                ${child.label === "Controles" ? "bg-blue-700 text-white hover:bg-blue-800 hover:text-white font-medium px-2" : "text-slate-800"}
                                ${child.path && location === child.path && child.label !== "Controles" ? "bg-blue-100 text-blue-800 font-medium" : ""}
                              `}>
                              {child.label}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto bg-background">
          {children}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-primary text-primary-foreground h-6 flex items-center justify-between px-4 text-xs">
        <span>USUARIO R+: {user?.name?.toUpperCase() || "USUARIO"}</span>
        <div className="flex items-center gap-4">
          <span>{new Date().toLocaleDateString("es-ES")}</span>
        </div>
      </div>
    </div>
  );
}
