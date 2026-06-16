import { useState } from "react";
import { FileText, Search, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function AgenteAduanaDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-secondary tracking-tight font-sansita uppercase">
          Portal Agente de Aduana
        </h1>
        <p className="text-foreground-muted font-mono mt-1 text-sm">
          {user?.razonSocial} | RIF: {user?.rif}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-4 border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-foreground-muted font-mono tracking-widest uppercase mb-2">DECLARACIONES</p>
            <h3 className="text-2xl font-black text-secondary">42</h3>
         </div>
         <div className="bg-emerald-50 p-4 border border-emerald-200 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-emerald-800 font-mono tracking-widest uppercase mb-2">CANAL VERDE</p>
            <h3 className="text-2xl font-black text-emerald-600">30</h3>
         </div>
         <div className="bg-yellow-50 p-4 border border-yellow-200 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-yellow-800 font-mono tracking-widest uppercase mb-2">CANAL AMARILLO</p>
            <h3 className="text-2xl font-black text-yellow-600">8</h3>
         </div>
         <div className="bg-red-50 p-4 border border-red-200 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-red-800 font-mono tracking-widest uppercase mb-2">CANAL ROJO</p>
            <h3 className="text-2xl font-black text-red-600">4</h3>
         </div>
      </div>

      <div className="bg-white border border-border shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm">DESPACHOS Y SELECTIVIDAD (SIDUNEA)</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar DUA, Contenedor..."
              className="pl-9 pr-4 py-2 border border-border rounded text-sm w-full font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
             <thead className="text-[10px] text-foreground-muted uppercase tracking-widest bg-slate-50 border-b border-border font-mono">
                <tr>
                   <th className="px-6 py-4 font-bold">Documentos</th>
                   <th className="px-6 py-4 font-bold">Cliente Final</th>
                   <th className="px-6 py-4 font-bold">Estado SIDUNEA</th>
                   <th className="px-6 py-4 font-bold text-right">Acción</th>
                </tr>
             </thead>
             <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                   <td className="px-6 py-4">
                     <p className="font-bold text-secondary font-mono">DUA-987123</p>
                     <p className="text-xs text-foreground-muted">1 x 40' HC (MRKU1234567)</p>
                   </td>
                   <td className="px-6 py-4 font-mono text-xs">IMPORTADORA ANDINA C.A.</td>
                   <td className="px-6 py-4">
                     <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded w-fit text-[10px] font-bold font-mono tracking-widest uppercase">
                        <AlertTriangle size={12} /> ROJO - PENDIENTE AFORO
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button className="text-xs font-bold text-primary hover:underline font-mono uppercase tracking-widest">
                        COORDINAR INSAI
                     </button>
                   </td>
                </tr>
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
