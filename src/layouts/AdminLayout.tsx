import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import {
  LogOut,
  Menu,
  Shield,
  LayoutDashboard,
  Ship,
  Map,
  Truck,
  Users,
  Settings,
  DollarSign,
  Box,
  TrendingUp
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "../lib/utils";

const roleNavigation: Record<string, { name: string; path: string; icon: any }[]> = {
  GERENTE_GENERAL: [
    { name: "Dashboard Global", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Terminal Financiero", path: "/admin/contador", icon: DollarSign },
    { name: "Nómina Venezolana", path: "/admin/nomina", icon: Users },
    { name: "Monitoreo Scraper", path: "/admin/scraper-panel", icon: Map },
    { name: "Catálogo Buques", path: "/admin/catalogo-buques", icon: Ship },
    { name: "Gestión Empleados", path: "/admin/empleados", icon: Users },
    { name: "Documentos Legales", path: "/admin/documentos", icon: Box },
    { name: "Configuración", path: "/admin/configuracion", icon: Settings },
  ],
  GERENTE_OPERACIONES: [
    { name: "Dashboard Puerto", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Aprobaciones", path: "/admin/aprobaciones", icon: Shield },
    { name: "Monitoreo TOS 2D", path: "/admin/monitoreo-tos", icon: Map },
    { name: "Cuadrillas y Turnos", path: "/admin/cuadrillas", icon: Users },
    { name: "Documentos Legales", path: "/admin/documentos", icon: Box },
    { name: "Rendimiento y KPIs", path: "/admin/rendimiento", icon: TrendingUp },
  ],
  DESPACHADOR_BUQUES: [
    { name: "Atención Buques (Husbandry)", path: "/admin/buques", icon: Ship },
  ],
  OFICIAL_BUQUES: [
    { name: "Control Operaciones (TOS)", path: "/admin/buques", icon: Ship },
    { name: "Catálogo Buques Global", path: "/admin/catalogo-buques", icon: Ship },
    { name: "Monitoreo TOS 2D", path: "/admin/monitoreo-tos", icon: Map },
  ],
  AGENTE_DOCUMENTACION: [
    { name: "Gestión Documental", path: "/admin/documentos", icon: Box },
    { name: "Catálogo Buques Global", path: "/admin/catalogo-buques", icon: Ship },
  ],
  PLANIFICADOR_PATIO: [
    { name: "Planificador de Patio", path: "/admin/yard", icon: Map },
  ],
  INSPECTOR_PUERTA: [
    { name: "Control de Acceso (Gate)", path: "/admin/gate", icon: Truck },
  ],
  COORDINADOR_TRAFICO: [
    { name: "Despacho Transporte", path: "/admin/trafico", icon: Truck },
  ],
  ESTIBADOR: [
    { name: "Mis Tareas Operativas", path: "/admin/estibador", icon: Box },
  ],
  SUPERVISOR_HSE: [
    { name: "Control Incidentes HSE", path: "/admin/hse", icon: Shield },
  ],
  CONTADOR: [
    { name: "Terminal Financiero", path: "/admin/dashboard", icon: DollarSign },
    { name: "Nómina Venezolana", path: "/admin/nomina", icon: Users },
  ],
  FACTURADOR: [
    { name: "Disbursement Accounts", path: "/admin/da", icon: DollarSign },
  ],
  ANALISTA_BI: [
    { name: "Dashboards BI", path: "/admin/dashboard", icon: TrendingUp },
  ],
};

export function AdminRoleGuard({ allowedRoles, children }: { allowedRoles?: string[], children: React.ReactNode }) {
  const { adminUser, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 font-mono">Verificando sesión...</div>;
  }

  if (!adminUser) {
    return <Navigate to="/admin-login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(adminUser.role)) {
    // If not allowed, redirect to their main dashboard or a default route based on their role
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export function AdminLayout() {
  const { adminUser, isLoading, logoutAdmin } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <div className="h-screen bg-background" />;
  if (!adminUser) return <Navigate to="/admin-login" replace />;

  const navigation = roleNavigation[adminUser.role] || [];
  
  // Also provide a fallback for roles that might only have one specific route, like ESTIBADOR or CONTADOR
  if (navigation.length === 0) {
     navigation.push({ name: "Área Personal", path: "/admin/dashboard", icon: LayoutDashboard });
  }

  return (
    <div className="flex h-screen bg-background-muted font-sans text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-secondary-dark text-slate-300 transition-all duration-300 z-30 flex flex-col relative shrink-0 border-r border-secondary/50 shadow-xl",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden lg:w-20"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-secondary/50 shrink-0">
          <div
            className={cn(
              "font-bold text-xl flex items-center gap-2 text-white",
              !isSidebarOpen && "lg:justify-center lg:w-full"
            )}
          >
            <img src="/logo.png" alt="Serviport" className="w-8 h-8 shrink-0 object-contain" />
            {isSidebarOpen && <span className="truncate tracking-tight uppercase text-sm font-black text-white">SERVIPORT<span className="text-primary">OS</span></span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3 no-scrollbar">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded text-sm transition-all font-semibold",
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-slate-400 hover:bg-secondary hover:text-white border-l-4 border-transparent"
                )}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <item.icon size={20} className="shrink-0" />
                {isSidebarOpen && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-foreground-muted hover:text-primary transition-colors p-1 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-base font-bold text-secondary tracking-tight hidden sm:block uppercase">
              Área Administrativa
            </h1>
          </div>
          
          <div className="flex items-center gap-3 relative" ref={userMenuRef}>
            <div className="text-right hidden sm:block">
              <p className="font-bold text-secondary text-sm">{adminUser.name}</p>
              <p className="text-primary text-[10px] font-mono font-bold tracking-widest uppercase">
                {adminUser.role.replace('_', ' ')} • {adminUser.port}
              </p>
            </div>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-10 h-10 shrink-0 rounded-full bg-primary/10 text-primary flex justify-center items-center font-bold text-lg border border-primary/20 hover:bg-primary/20 transition-colors focus:outline-none"
            >
              {adminUser.name.charAt(0).toUpperCase()}
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-12 right-0 w-48 bg-white border border-border rounded shadow-md z-50 overflow-hidden">
                <Link
                  to="/admin/cuenta"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-secondary hover:bg-slate-50 transition-colors border-b border-border font-bold"
                >
                  <Settings size={16} /> Configuración
                </Link>
                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left font-bold"
                >
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 bg-background-muted">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
