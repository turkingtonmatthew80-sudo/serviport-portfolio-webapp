import { useState, useEffect } from "react";
import { Truck, Search, CheckCircle, Navigation, CheckSquare, AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";

interface OrdenDeTrabajo {
  id: string;
  contenedor_bic: string;
  tipo_iso: string;
  cliente_razon_social: string;
  estado_tecnico: "LISTO" | "BLOQUEADO";
  razon_bloqueo?: string; // Ej: "Canal Rojo - SENIAT", "Demurrage Pendiente"
  fecha_delegacion: string;
}

export function TransportistaDashboard() {
  const { user } = useAuth();
  
  // Mock data for UI demonstration based on blueprint
  const [ordenes, setOrdenes] = useState<OrdenDeTrabajo[]>([
    {
      id: "ODT-001",
      contenedor_bic: "MSKU8091232",
      tipo_iso: "40_DRY",
      cliente_razon_social: "Importaciones C.A.",
      estado_tecnico: "LISTO",
      fecha_delegacion: "2024-05-15T10:00:00Z"
    },
    {
      id: "ODT-002",
      contenedor_bic: "HLXU7718221",
      tipo_iso: "20_REEFER",
      cliente_razon_social: "Alimentos Congelados S.A.",
      estado_tecnico: "LISTO",
      fecha_delegacion: "2024-05-15T11:30:00Z"
    },
    {
      id: "ODT-003",
      contenedor_bic: "CMAU1234567",
      tipo_iso: "40_HC",
      cliente_razon_social: "Tecnología Global",
      estado_tecnico: "BLOQUEADO",
      razon_bloqueo: "Selectividad: Canal Rojo - Requiere Aforo Físico",
      fecha_delegacion: "2024-05-14T09:15:00Z"
    },
    {
      id: "ODT-004",
      contenedor_bic: "SEGU9988776",
      tipo_iso: "20_DRY",
      cliente_razon_social: "Manufacturas VZLA",
      estado_tecnico: "BLOQUEADO",
      razon_bloqueo: "Deuda pendiente por Almacenaje Bolipuertos",
      fecha_delegacion: "2024-05-16T08:00:00Z"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrdenes = ordenes.filter(o => 
     o.contenedor_bic.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.cliente_razon_social.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const listas = filteredOrdenes.filter(o => o.estado_tecnico === "LISTO");
  const bloqueadas = filteredOrdenes.filter(o => o.estado_tecnico === "BLOQUEADO");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black rounded-lg text-secondary tracking-tight font-sansita uppercase">
            Panel de Control | Coordinador de Tráfico
          </h1>
          <p className="text-foreground-muted font-mono mt-1 text-sm">
            {user?.razonSocial || "Transportes Escudo C.A."} | RIF: {user?.rif || "J-12345678-9"}
          </p>
        </div>
        <div className="flex gap-3">
           <Link to="/portal/transportista/vbs" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <Clock size={18} /> Agendar VBS
           </Link>
           <Link to="/portal/transportista/flota" className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <Truck size={18} /> Mi Flota
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-[#0b1424] p-6 rounded-lg border border-slate-800 shadow-sm relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <CheckCircle size={100} className="text-green-500" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">CONTENEDORES LISTOS (AGENDABLES)</p>
             <h3 className="text-4xl font-black relative z-10 text-green-400">{listas.length}</h3>
         </div>
         <div className="bg-[#0b1424] p-6 rounded-lg border border-slate-800 shadow-sm relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <AlertTriangle size={100} className="text-red-500" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">CONTENEDORES BLOQUEADOS</p>
             <h3 className="text-4xl font-black relative z-10 text-red-500">{bloqueadas.length}</h3>
         </div>
      </div>

      <div className="bg-white border rounded-lg border-border shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm uppercase">Filtro de Viabilidad - Órdenes Delegadas</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar contenedor, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded text-sm w-full md:w-80 font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
           
           {/* COLUMNA 1: LISTOS */}
           <div className="p-6 bg-green-50/30">
               <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <h4 className="font-bold text-green-900 font-mono uppercase tracking-wider text-sm">🟢 Listas para Despacho</h4>
               </div>

               <div className="space-y-4">
                  {listas.length === 0 ? (
                     <p className="text-sm text-foreground-muted font-mono italic">No hay contenedores listos para agendar.</p>
                  ) : listas.map(orden => (
                     <div key={orden.id} className="bg-white border border-green-200 rounded-lg p-5 shadow-sm hover:shadow transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <p className="font-black text-secondary text-lg">{orden.contenedor_bic}</p>
                              <p className="text-xs text-foreground-muted font-mono mt-1">{orden.tipo_iso}</p>
                           </div>
                           <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                              Levante OK
                           </span>
                        </div>
                        <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between">
                            <p className="text-sm text-slate-600 truncate">{orden.cliente_razon_social}</p>
                            <Link to={`/portal/transportista/vbs?bic=${orden.contenedor_bic}`} className="text-primary hover:text-secondary flex items-center gap-1 text-sm font-bold transition-colors">
                               Agendar Cita <ArrowRight size={16} />
                            </Link>
                        </div>
                     </div>
                  ))}
               </div>
           </div>

           {/* COLUMNA 2: BLOQUEADOS */}
           <div className="p-6 bg-red-50/30">
               <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                  <h4 className="font-bold text-red-900 font-mono uppercase tracking-wider text-sm">🔴 Bloqueadas (No Agendables)</h4>
               </div>

               <div className="space-y-4">
                  {bloqueadas.length === 0 ? (
                     <p className="text-sm text-foreground-muted font-mono italic">No hay contenedores bloqueados.</p>
                  ) : bloqueadas.map(orden => (
                     <div key={orden.id} className="bg-red-50 border border-red-200 rounded-lg p-5 shadow-sm opacity-80">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <p className="font-black text-secondary text-lg">{orden.contenedor_bic}</p>
                              <p className="text-xs text-red-700/70 font-mono mt-1">{orden.tipo_iso}</p>
                           </div>
                           <AlertTriangle className="text-red-500" size={20} />
                        </div>
                        
                        <div className="bg-red-100/50 rounded p-3 mb-3 border border-red-200">
                           <p className="text-xs text-red-800 font-bold uppercase mb-1">Motivo del Bloqueo:</p>
                           <p className="text-xs text-red-700 leading-relaxed font-mono">{orden.razon_bloqueo}</p>
                        </div>

                        <div className="border-t border-red-200 pt-3 flex items-center justify-between">
                            <p className="text-sm text-red-800/80 truncate">{orden.cliente_razon_social}</p>
                            <button disabled className="text-red-400 bg-red-100 cursor-not-allowed px-3 py-1.5 rounded flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                               Bloqueado en Aduana
                            </button>
                        </div>
                     </div>
                  ))}
               </div>
           </div>

        </div>
      </div>
    </div>
  );
}
