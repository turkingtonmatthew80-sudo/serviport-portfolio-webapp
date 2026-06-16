import { useState } from "react";
import { Ship, Package, Navigation, Search, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function ExportadorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-secondary tracking-tight font-sansita uppercase">
          Portal Exportador
        </h1>
        <p className="text-foreground-muted font-mono mt-1 text-sm">
          {user?.razonSocial} | RIF: {user?.rif}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground-muted font-mono tracking-widest">BOOKINGS ACTIVOS</p>
            <h3 className="text-3xl font-black text-secondary mt-1">4</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <Ship className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground-muted font-mono tracking-widest">EN PATIO DE EXP.</p>
            <h3 className="text-3xl font-black text-secondary mt-1">12</h3>
          </div>
          <div className="bg-orange-50 p-3 rounded-full">
            <Package className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground-muted font-mono tracking-widest">EMBARCADOS (MES)</p>
            <h3 className="text-3xl font-black text-secondary mt-1">28</h3>
          </div>
          <div className="bg-emerald-50 p-3 rounded-full">
            <Navigation className="text-emerald-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-border shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm">BOOKINGS Y EMBARQUES</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar Booking, Contenedor..."
              className="pl-9 pr-4 py-2 border border-border rounded text-sm w-full font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
             <div className="border border-slate-200 p-4 bg-slate-50 rounded flex items-center justify-between">
               <div>
                  <p className="font-bold text-secondary font-mono text-sm">BKG-99887766</p>
                  <p className="text-xs text-foreground-muted">Destino: Róterdam, NL • Buque: MSC LISBOA</p>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest">PERMISO SENIAT LISTO</span>
                     <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest">EN PATIO</span>
                  </div>
               </div>
               <div className="text-right">
                 <p className="text-xs text-foreground-muted form-mono mb-1">Cierre Documental:</p>
                 <p className="text-sm font-bold text-orange-600 font-mono">18/06/2026 14:00</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
