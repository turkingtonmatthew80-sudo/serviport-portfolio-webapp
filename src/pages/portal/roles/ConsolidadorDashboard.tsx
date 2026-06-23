import { useState } from "react";
import { Package, Search, Box, BarChart3, ArrowRight, Activity, Clock } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";

interface ContainerPending {
   bic: string;
   mbl: string;
   status: string;
   fechaArribo: string;
}

export function ConsolidadorDashboard() {
  const { user } = useAuth();
  
  // Mock data for UI demonstration based on blueprint
  const [pendientes] = useState<ContainerPending[]>([
     { bic: "HLBU9876543", mbl: "MBL-HL-998123", status: "EN_PATIO_ESPERANDO_VACIADO", fechaArribo: "2024-05-18" },
     { bic: "MSKU1092281", mbl: "MBL-MS-110022", status: "EN_TRANSITO", fechaArribo: "2024-05-22" },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black rounded-lg text-secondary tracking-tight font-sansita uppercase">
            Panel de Control | NVOCC
          </h1>
          <p className="text-foreground-muted font-mono mt-1 text-sm">
            {user?.razonSocial || "Allyo Global Logistics C.A."} | RIF: {user?.rif || "J-400000000"} | Reg. Aduana: NVOCC-992
          </p>
        </div>
        <div className="flex gap-3">
           <Link to="/portal/consolidador/vaciado" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <Package size={18} /> Consola de Vaciado
           </Link>
           <Link to="/portal/consolidador/liberacion" className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <Box size={18} /> Módulo de Liberación
           </Link>
        </div>
      </div>

      {/* METRICS WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#0b1424] p-6 rounded-lg border border-slate-800 shadow-sm relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Package size={100} className="text-blue-500" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">MBLS PENDIENTES DE VACIADO</p>
             <h3 className="text-4xl font-black relative z-10 text-blue-400">{pendientes.filter(p => p.status === 'EN_PATIO_ESPERANDO_VACIADO').length}</h3>
         </div>
         <div className="bg-[#0b1424] p-6 rounded-lg border border-slate-800 shadow-sm relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Box size={100} className="text-emerald-500" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">HBLS EN ALMACÉN (AGD)</p>
             <h3 className="text-4xl font-black relative z-10 text-emerald-400">142</h3>
         </div>
         <div className="bg-[#0b1424] p-6 rounded-lg border border-slate-800 shadow-sm relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <BarChart3 size={100} className="text-purple-500" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">VOLUMEN MES (CBM / TON)</p>
             <div className="flex items-end gap-2 relative z-10">
                <h3 className="text-4xl font-black text-purple-400">850</h3>
                <span className="text-sm font-mono text-purple-200 mb-1">CBM</span>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg border-border shadow-sm">
               <div className="p-5 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold text-secondary font-mono tracking-widest text-sm uppercase flex items-center gap-2">
                     <Activity size={16} className="text-primary" /> Contenedores Master Llegando
                  </h3>
                  <Link to="/portal/consolidador/desconsolidacion" className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">Ver Todos</Link>
               </div>
               <div className="divide-y divide-border">
                  {pendientes.map(p => (
                     <div key={p.mbl} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                           <p className="font-bold text-secondary text-lg mb-1">{p.bic}</p>
                           <p className="text-xs font-mono text-foreground-muted">MBL: {p.mbl}</p>
                        </div>
                        <div className="text-right">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest font-mono ${p.status === 'EN_PATIO_ESPERANDO_VACIADO' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                              {p.status.replaceAll('_', ' ')}
                           </span>
                           <p className="text-xs text-foreground-muted mt-2 font-mono flex items-center justify-end gap-1"><Clock size={12}/> ETA/Arribo: {p.fechaArribo}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-slate-50 border rounded-lg border-border shadow-sm p-6">
            <h3 className="font-bold text-secondary font-mono tracking-widest text-sm uppercase mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
               <Link to="/portal/consolidador/desconsolidacion" className="block w-full bg-white border border-slate-200 hover:border-primary p-4 rounded-lg shadow-sm group">
                  <div className="flex justify-between items-center mb-1">
                     <p className="font-bold text-secondary text-sm">Split Organizacional (MBL)</p>
                     <ArrowRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-foreground-muted">Distribuir HBLs antes de vaciar</p>
               </Link>
               <Link to="/portal/consolidador/liberacion" className="block w-full bg-white border border-slate-200 hover:border-primary p-4 rounded-lg shadow-sm group">
                  <div className="flex justify-between items-center mb-1">
                     <p className="font-bold text-secondary text-sm">Liberar House B/Ls</p>
                     <ArrowRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-foreground-muted">Emitir Cúmplase a importadores</p>
               </Link>
            </div>
         </div>

      </div>
    </div>
  );
}
