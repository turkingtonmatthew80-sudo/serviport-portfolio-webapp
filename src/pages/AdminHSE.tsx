import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";

export function AdminHSE() {
  const { adminUser } = useAdminAuth();
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita flex items-center gap-3">
          <Shield className="text-emerald-600" size={32} />
          Control de Incidentes HSE
        </h2>
        <p className="text-foreground-muted font-mono mt-1">
          Seguridad industrial, salud y ambiente (ISPS / MARPOL) en {adminUser?.port}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-200 p-6 shadow-sm rounded flex flex-col items-center justify-center text-center">
            <CheckCircle className="text-emerald-500 mb-2" size={48} />
            <h3 className="font-black text-emerald-900 font-mono tracking-widest text-2xl">412 DÍAS</h3>
            <p className="text-emerald-700 text-xs font-bold uppercase mt-1">Sin accidentes con pérdida de tiempo</p>
        </div>

        <div className="bg-white p-6 border border-border shadow-sm col-span-2">
           <h3 className="font-bold text-secondary font-mono tracking-widest text-sm mb-4">REPORTE DE INCIDENCIAS</h3>
           
           <div className="space-y-4">
              <div className="border border-orange-200 bg-orange-50/30 p-4 rounded flex items-start gap-4">
                  <div className="bg-orange-100 p-2 text-orange-600 rounded">
                     <AlertTriangle size={24} />
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <h4 className="font-bold text-orange-900 font-mono">Derrame menor de combustible</h4>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 border border-orange-200 px-2 py-0.5 rounded">MARPOL</span>
                      </div>
                      <p className="text-sm text-orange-800 mt-1">Zona: Muelle 4. Controlado con barreras de contención. Reporte enviado a Capitanía.</p>
                      <p className="text-xs text-orange-500 mt-2 font-mono flex items-center gap-1"><Clock size={12}/> Reportado hace 2 horas</p>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
