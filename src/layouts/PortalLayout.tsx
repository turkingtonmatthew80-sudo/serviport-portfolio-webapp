import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Ship, Package, Navigation, LayoutDashboard, FileText, Anchor, Settings, LogOut, Search, Clock, PlusCircle, CheckCircle, ArrowRightLeft, FileSearch, Truck, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export function PortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  
  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return <div className="min-h-[100dvh] flex items-center justify-center">Cargando...</div>;
  }

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };
  
  // Group nav items by role
  const groups: { title: string; items: any[] }[] = [];
  
  if (user.roles.includes('naviera')) {
    groups.push({
      title: "NAVIERA",
      items: [
        { name: "Dashboard Naviera", path: "/portal/naviera/dashboard", icon: LayoutDashboard },
        { name: "Port Calls", path: "/portal/naviera/port-calls", icon: Ship },
        { name: "Proformas", path: "/portal/naviera/proformas", icon: FileText },
      ]
    });
  }
  
  if (user.roles.includes('armador')) {
    groups.push({
      title: "ARMADOR",
      items: [
        { name: "Dashboard Armador", path: "/portal/armador/dashboard", icon: LayoutDashboard },
        { name: "Cuentas Liquidación", path: "/portal/armador/disbursements", icon: FileText },
        { name: "Husbandry", path: "/portal/armador/husbandry", icon: PlusCircle },
      ]
    });
  }
  
  if (user.roles.includes('importador')) {
    groups.push({
      title: "IMPORTADOR",
      items: [
        { name: "Dashboard Importador", path: "/portal/importador/dashboard", icon: LayoutDashboard },
        { name: "Trazabilidad AGD", path: "/portal/importador/tracking", icon: Search },
        { name: "Retiros", path: "/portal/importador/retiros", icon: ArrowRightLeft },
      ]
    });
  }

  if (user.roles.includes('exportador')) {
    groups.push({
      title: "EXPORTADOR",
      items: [
        { name: "Dashboard Exportador", path: "/portal/exportador/dashboard", icon: LayoutDashboard },
        { name: "Ingreso Almacén", path: "/portal/exportador/ingresos", icon: ArrowRightLeft },
        { name: "Estatus Embarque", path: "/portal/exportador/embarque", icon: Ship },
      ]
    });
  }

  if (user.roles.includes('agente_aduana')) {
    groups.push({
      title: "AGENTE ADUANA",
      items: [
        { name: "Dashboard Aduana", path: "/portal/aduana/dashboard", icon: LayoutDashboard },
        { name: "Consultas Operativas", path: "/portal/aduana/consultas", icon: FileSearch },
        { name: "Estatus Despacho", path: "/portal/aduana/despachos", icon: CheckCircle },
      ]
    });
  }

  if (user.roles.includes('transportista')) {
    groups.push({
      title: "TRANSPORTISTA",
      items: [
        { name: "Dashboard Transportista", path: "/portal/transportista/dashboard", icon: LayoutDashboard },
        { name: "Órdenes de Carga", path: "/portal/transportista/ordenes", icon: Truck },
        { name: "Mis EIRs", path: "/portal/transportista/eirs", icon: FileText },
      ]
    });
  }
  
  groups.push({
    title: "GENERAL",
    items: [
      { name: "Mi Suscripción", path: "/portal/suscripcion", icon: Settings },
    ]
  });

  const SidebarContent = ({ isCollapsed = false }) => (
    <>
      <div className="h-16 flex items-center px-4 border-b border-white/10 shrink-0">
        <div className={cn("font-bold text-xl flex items-center gap-2", isCollapsed ? "justify-center w-full" : "")}>
          <Anchor className="text-[#00A9CE] shrink-0" size={24} />
          {!isCollapsed && <span className="truncate">Serviport OS</span>}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <nav className="py-6 flex flex-col gap-6 px-3">
          {groups.map((group, idx) => (
            <div key={idx}>
              {!isCollapsed && <p className="text-xs font-bold text-gray-500 mb-2 px-3 tracking-wider">{group.title}</p>}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                        isActive
                          ? "bg-[#F7941D] text-white font-medium shadow-sm" 
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon size={20} className="shrink-0" />
                      {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-colors w-full",
            isCollapsed ? "justify-center" : ""
          )}
          title={isCollapsed ? "Cerrar sesión" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0b1a2e]/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 bg-[#0b1a2e] text-white z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out md:hidden shadow-xl",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent isCollapsed={false} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "bg-[#0b1a2e] text-white transition-all duration-300 z-30 hidden md:flex flex-col relative shrink-0",
        isDesktopSidebarOpen ? "w-64" : "w-20"
      )}>
        <SidebarContent isCollapsed={!isDesktopSidebarOpen} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="text-gray-500 hover:text-[#00A9CE] transition-colors md:hidden p-1 -ml-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A9CE]"
            >
              <Menu size={24} />
            </button>
            {/* Desktop Toggle */}
            <button 
              onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
              className="text-gray-500 hover:text-[#00A9CE] transition-colors hidden md:block p-1 -ml-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A9CE]"
            >
              <Navigation size={20} />
            </button>
            <h1 className="text-lg font-bold text-[#0b1a2e] tracking-tight hidden sm:block">Portal B2B</h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
             <div className="text-sm text-right hidden sm:block">
               <p className="font-bold text-[#0b1a2e] truncate max-w-[200px]">{user.razonSocial}</p>
               <p className="text-gray-500 text-xs font-medium truncate max-w-[200px]">Roles: {user.roles.join(', ')}</p>
             </div>
             <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#00A9CE] text-white flex justify-center items-center font-bold shadow-md border-2 border-white">
               {user.razonSocial.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
