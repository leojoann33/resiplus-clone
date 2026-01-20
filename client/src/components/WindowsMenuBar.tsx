import { useState } from "react";
import { useLocation } from "wouter";
import {
  FileText,
  Users,
  Activity,
  Home as HomeIcon,
  Pill,
  ClipboardList,
  FileEdit,
  Settings,
  HelpCircle,
  Plus,
  Search,
  Save,
  Printer,
  LogOut,
} from "lucide-react";

interface MenuItem {
  label: string;
  items: {
    label: string;
    icon?: React.ReactNode;
    action?: () => void;
    divider?: boolean;
  }[];
}

export default function WindowsMenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const menuItems: MenuItem[] = [
    {
      label: "Archivo",
      items: [
        {
          label: "Nuevo Residente",
          icon: <Plus className="h-4 w-4" />,
          action: () => setLocation("/residents/new"),
        },
        {
          label: "Guardar",
          icon: <Save className="h-4 w-4" />,
          action: () => {},
        },
        { divider: true, label: "" },
        {
          label: "Imprimir",
          icon: <Printer className="h-4 w-4" />,
          action: () => {},
        },
        { divider: true, label: "" },
        {
          label: "Salir",
          icon: <LogOut className="h-4 w-4" />,
          action: () => {},
        },
      ],
    },
    {
      label: "Residentes",
      items: [
        {
          label: "Nuevo Residente",
          icon: <Plus className="h-4 w-4" />,
          action: () => setLocation("/residents/new"),
        },
        {
          label: "Listado de Residentes",
          icon: <Users className="h-4 w-4" />,
          action: () => setLocation("/residents"),
        },
        {
          label: "Buscar Residente",
          icon: <Search className="h-4 w-4" />,
          action: () => setLocation("/residents"),
        },
      ],
    },
    {
      label: "Enfermería",
      items: [
        {
          label: "Constantes Vitales",
          icon: <Activity className="h-4 w-4" />,
          action: () => {},
        },
        {
          label: "Escalas de Valoración",
          icon: <ClipboardList className="h-4 w-4" />,
          action: () => {},
        },
        {
          label: "Medicamentos",
          icon: <Pill className="h-4 w-4" />,
          action: () => {},
        },
        {
          label: "Notas de Enfermería",
          icon: <FileEdit className="h-4 w-4" />,
          action: () => {},
        },
      ],
    },
    {
      label: "Habitaciones",
      items: [
        {
          label: "Gestión de Habitaciones",
          icon: <HomeIcon className="h-4 w-4" />,
          action: () => setLocation("/rooms"),
        },
        {
          label: "Asignación de Camas",
          icon: <Users className="h-4 w-4" />,
          action: () => {},
        },
      ],
    },
    {
      label: "Herramientas",
      items: [
        {
          label: "Configuración",
          icon: <Settings className="h-4 w-4" />,
          action: () => {},
        },
      ],
    },
    {
      label: "Ayuda",
      items: [
        {
          label: "Manual de Usuario",
          icon: <FileText className="h-4 w-4" />,
          action: () => {},
        },
        {
          label: "Acerca de",
          icon: <HelpCircle className="h-4 w-4" />,
          action: () => {},
        },
      ],
    },
  ];

  const handleMenuClick = (menuLabel: string) => {
    setActiveMenu(activeMenu === menuLabel ? null : menuLabel);
  };

  const handleItemClick = (action?: () => void) => {
    if (action) action();
    setActiveMenu(null);
  };

  return (
    <div className="windows-menubar">
      {/* Barra de Menú */}
      <div className="flex items-center bg-[#f0f0f0] border-b border-[#a0a0a0] h-[24px] text-[13px]">
        {menuItems.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              className={`px-3 py-0.5 hover:bg-[#e5f3ff] hover:border hover:border-[#0078d7] transition-colors ${
                activeMenu === menu.label ? "bg-[#e5f3ff] border border-[#0078d7]" : ""
              }`}
              onClick={() => handleMenuClick(menu.label)}
            >
              {menu.label}
            </button>

            {/* Menú Desplegable */}
            {activeMenu === menu.label && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveMenu(null)}
                />
                <div className="absolute left-0 top-full mt-0 z-50 min-w-[200px] bg-[#f0f0f0] border border-[#a0a0a0] shadow-lg">
                  {menu.items.map((item, idx) => {
                    if (item.divider) {
                      return (
                        <div
                          key={`divider-${idx}`}
                          className="h-[1px] bg-[#d4d4d4] my-1 mx-2"
                        />
                      );
                    }
                    return (
                      <button
                        key={item.label}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#0078d7] hover:text-white flex items-center gap-2 text-[13px]"
                        onClick={() => handleItemClick(item.action)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Barra de Herramientas */}
      <div className="flex items-center gap-1 bg-[#f0f0f0] border-b border-[#d4d4d4] px-2 py-1">
        <button
          className="flex items-center gap-1 px-2 py-1 hover:bg-[#e5f3ff] hover:border hover:border-[#0078d7] rounded text-[12px]"
          onClick={() => setLocation("/residents/new")}
          title="Nuevo Residente"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
        <button
          className="flex items-center gap-1 px-2 py-1 hover:bg-[#e5f3ff] hover:border hover:border-[#0078d7] rounded text-[12px]"
          title="Guardar"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Guardar</span>
        </button>
        <div className="w-[1px] h-5 bg-[#d4d4d4] mx-1" />
        <button
          className="flex items-center gap-1 px-2 py-1 hover:bg-[#e5f3ff] hover:border hover:border-[#0078d7] rounded text-[12px]"
          onClick={() => setLocation("/residents")}
          title="Buscar"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Buscar</span>
        </button>
        <button
          className="flex items-center gap-1 px-2 py-1 hover:bg-[#e5f3ff] hover:border hover:border-[#0078d7] rounded text-[12px]"
          title="Imprimir"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Imprimir</span>
        </button>
      </div>
    </div>
  );
}
