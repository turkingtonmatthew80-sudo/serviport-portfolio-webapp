import { useState } from "react";
import { Truck, Search, CheckCircle, Navigation } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function TransportistaDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-secondary tracking-tight font-sansita uppercase">
          Portal Transportista
        </h1>
        <p className="text-foreground-muted font-mono mt-1 text-sm">
          {user?.razonSocial} | RIF: {user?.rif}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#0b1424] p-6 border border-slate-800 shadow-sm relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Truck size={100} className="text-primary" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">CITAS ASIGNADAS (HOY)</p>
             <h3 className="text-4xl font-black relative z-10">12</h3>
         </div>
      </div>

      <div className="bg-white border border-border shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm">ÓRDENES DE CARGA (EIR)</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar contenedor, placa..."
              className="pl-9 pr-4 py-2 border border-border rounded text-sm w-full font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        <div className="p-6">
           <div className="space-y-4">
               <div className="border border-slate-200 p-4 bg-slate-50 rounded flex items-center justify-between">
                  <div>
                     <p className="font-bold text-secondary font-mono text-sm tracking-widest">EIR-776655</p>
                     <p className="text-sm font-bold text-slate-700 mt-1">Contenedor: SUDU9988776 (40' HC)</p>
                     <p className="text-xs text-foreground-muted mt-1">Destino: Zona Industrial Valencia, Edo. Carabobo</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs tracking-widest font-mono text-slate-500 uppercase mb-1">Cita Ventana Tarde</p>
                     <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest">EN RUTA AL PUERTO</span>
                     <p className="text-xs font-bold text-secondary font-mono mt-2">Placa: A12BC3D</p>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
