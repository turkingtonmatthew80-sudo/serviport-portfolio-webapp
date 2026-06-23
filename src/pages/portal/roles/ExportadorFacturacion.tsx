import { useState, useEffect } from "react";
import { DollarSign, FileText, Download, CheckCircle, Calculator, Building } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function ExportadorFacturacion() {
  const { user } = useAuth();
  const [facturas, setFacturas] = useState<any[]>([]);

  useEffect(() => {
    fetchFacturas();
  }, [user]);

  const fetchFacturas = async () => {
    if (!user?.rif) return;
    try {
      const empRes = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'rif', value: user.rif }])));
      const empData = await empRes.json();
      if (!empData || empData.length === 0) return;
      
      const res = await fetch(`/api/sql/facturasLocales?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'importadorId', value: empData[0].id }])));
      const data = await res.json();
      setFacturas(data);
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Facturación Local (Exportación)</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Gestione sus proformas de uso de puerto, cargos por VGM, almacenaje de exportación, y calcule el diferencial cambiario BCV.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded p-5 text-white flex flex-col justify-center">
             <div className="text-slate-400 text-xs font-mono mb-1 uppercase tracking-widest flex items-center gap-1"><DollarSign size={14}/> Total por Pagar (USD)</div>
             <div className="text-2xl font-black font-sansita tracking-wider text-emerald-400">
                ${facturas.filter(f => f.estado === 'POR_PAGAR').reduce((acc, f) => acc + parseFloat(f.montoUsd), 0).toFixed(2)}
             </div>
          </div>
          <div className="bg-white border border-border shadow-sm rounded p-5 flex flex-col justify-center">
             <div className="text-slate-500 text-xs font-mono mb-1 uppercase tracking-widest flex items-center gap-1"><Calculator size={14}/> Referencia BCV Actual</div>
             <div className="text-lg font-black text-slate-800">
                Bs. 36.42 / USD
             </div>
          </div>
       </div>

       <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-widest text-slate-500 font-mono">Factura Ref</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-widest text-slate-500 font-mono">Concepto Operativo</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-widest text-slate-500 font-mono text-right">Monto (USD)</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-widest text-slate-500 font-mono text-center">Tasa Aplicada</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-widest text-slate-500 font-mono text-center">Estado</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-widest text-slate-500 font-mono text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {facturas.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-400 text-xs font-mono">No existen proformas asociadas a su cuenta.</td></tr>
                 ) : facturas.map((f: any) => (
                    <tr key={f.id} className="hover:bg-slate-50/50">
                       <td className="px-5 py-4 font-mono font-bold text-primary">{f.id.split('-')[0].toUpperCase()}</td>
                       <td className="px-5 py-4 flex items-center gap-2">
                          <Building size={16} className="text-slate-400" />
                          <span className="font-medium text-slate-700">{
                             f.tipo === 'ALMACENAJE_BOLIPUERTOS' ? 'ALMACENAJE ZONA DE EXPORTACIÓN' :
                             f.tipo === 'MANIOBRAS_TOS' ? 'SERVICIOS DE ESTIBA Y VACIADO' : f.tipo
                          }</span>
                       </td>
                       <td className="px-5 py-4 text-emerald-600 font-black text-right">${parseFloat(f.montoUsd).toFixed(2)}</td>
                       <td className="px-5 py-4 text-center font-mono text-xs text-slate-500">Bs. {f.tasaBcvEmision}</td>
                       <td className="px-5 py-4 text-center">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded inline-flex items-center gap-1 ${
                             f.estado === 'POR_PAGAR' ? 'bg-orange-100 text-orange-700' : 
                             f.estado === 'PAGADA' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {f.estado === 'POR_PAGAR' ? 'PENDIENTE' : f.estado}
                          </span>
                          {f.saldoDiferencialVes > 0 && f.estado === 'PAGADA' && (
                             <div className="text-[10px] text-red-600 mt-1 font-bold">Dif: Bs. {f.saldoDiferencialVes}</div>
                          )}
                       </td>
                       <td className="px-5 py-4 text-right">
                          <button className="text-primary hover:text-primary-dark font-bold text-[10px] uppercase tracking-widest font-mono flex items-center justify-end gap-1 w-full">
                             Ver <CheckCircle size={14}/>
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
            </table>
         </div>
       </div>

    </div>
  );
}
