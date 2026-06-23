import { useState, useEffect } from "react";
import { FileText, Download, ShieldCheck, Check, Loader2 } from "lucide-react";

export function FDABuilderDashboard() {
  const [pdas, setPdas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchPdas = async () => {
         try {
            const res = await fetch('/api/sql/pda_armador?filters=' + JSON.stringify([{ type: 'where', field: 'tipo', value: 'FDA' }]));
            if (res.ok) setPdas(await res.json());
         } catch (e) {
            console.error(e);
         } finally {
            setLoading(false);
         }
     };
     fetchPdas();
  }, []);

  if (loading) {
     return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-slate-500" size={32} /></div>;
  }

  if (pdas.length === 0) {
      return (
         <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50 p-8 text-center space-y-4">
                 <FileText size={48} />
                 <p className="font-mono uppercase tracking-widest font-bold text-sm">Sin FDA Disponibles</p>
                 <p className="text-[10px]">No se encontraron Disbursement Accounts finales generados en la base de datos.</p>
             </div>
         </div>
      );
  }

  const pda = pdas[0]; // Mostramos el primero o podríamos tener una lista lateral

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
               <FileText /> Builder: Final Disbursement Account (FDA)
            </h1>
            <p className="text-slate-400 font-mono mt-1 text-sm">
               Generación automatizada de liquidaciones para Armadores.
            </p>
         </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8 overflow-y-auto shadow-2xl relative">
          <div className="max-w-3xl mx-auto bg-white text-slate-900 p-10 rounded shadow-lg min-h-full">
             <div className="flex justify-between items-start border-b-2 border-slate-300 pb-6 mb-6">
                 <div>
                     <h2 className="text-4xl font-black font-sansita tracking-tighter uppercase text-slate-800">ServiPort</h2>
                     <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mt-1">Terminal Operator & Shipping Hub</p>
                 </div>
                 <div className="text-right">
                     <h3 className="text-2xl font-black uppercase text-slate-800">FINAL DISBURSEMENT ACCOUNT</h3>
                     <p className="font-mono text-sm uppercase font-bold text-slate-500">REF: {pda.id}</p>
                     <p className="font-mono text-xs uppercase text-slate-400 mt-1">Date: {new Date(pda.createdAt || new Date()).toLocaleDateString()}</p>
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                 <div>
                     <h4 className="font-bold border-b border-slate-300 pb-1 mb-2 uppercase text-xs tracking-widest">Principals</h4>
                     <p className="font-bold">AGENCIA NAVIERA</p>
                     <p>Vendor Ref: {pda.navieraId || 'N/A'}</p>
                 </div>
                 <div>
                     <h4 className="font-bold border-b border-slate-300 pb-1 mb-2 uppercase text-xs tracking-widest">Vessel & Call Details</h4>
                     <p><strong>Vessel ID:</strong> {pda.escalaId}</p>
                     <p><strong>Port:</strong> Puerto Local</p>
                     <p><strong>Status:</strong> {pda.estado}</p>
                 </div>
             </div>

             <table className="w-full text-sm font-mono mb-8 border-collapse">
                 <thead>
                     <tr className="bg-slate-100 border-y-2 border-slate-300 text-left">
                         <th className="p-2 py-3">Description</th>
                         <th className="p-2 py-3 text-right">Amount (USD)</th>
                     </tr>
                 </thead>
                 <tbody>
                     <tr className="border-b border-slate-200 text-emerald-700">
                         <td className="p-2 py-3 pl-6 font-bold">↳ Fondos Pre-Aprobados (Recibidos)</td>
                         <td className="p-2 py-3 text-right">${parseFloat(pda.fondosRecibidosUsd || "0").toFixed(2)}</td>
                     </tr>
                     <tr className="border-b border-slate-200">
                         <td className="p-2 py-3 text-red-700 font-bold">↳ Total Gastado (Disbursements)</td>
                         <td className="p-2 py-3 text-right text-red-700">-${parseFloat(pda.totalGastadoUsd || "0").toFixed(2)}</td>
                     </tr>
                 </tbody>
                 <tfoot>
                     <tr className="font-bold text-lg text-emerald-600">
                         <td className="p-2 pb-4 text-right">BALANCE:</td>
                         <td className="p-2 pb-4 text-right">${(parseFloat(pda.fondosRecibidosUsd || "0") - parseFloat(pda.totalGastadoUsd || "0")).toFixed(2)}</td>
                     </tr>
                 </tfoot>
             </table>
             
             <div className="mt-16 flex justify-between items-end">
                 <div className="text-xs text-slate-500">
                     <p className="flex items-center gap-1 font-bold"><ShieldCheck size={14}/> Digitally signed and audited via ServiPort ERP.</p>
                     <p>Errors & Omissions Excepted.</p>
                 </div>
                 <div className="text-center w-64 border-t border-slate-800 pt-2 font-bold uppercase tracking-widest text-xs">
                     Authorized Signature
                 </div>
             </div>
          </div>

          <div className="absolute top-10 right-10 flex flex-col gap-3">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105 group">
                  <Check size={28} />
                  <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold font-mono opacity-0 group-hover:opacity-100 uppercase whitespace-nowrap">Aprobar y Enviar (Naviera)</span>
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105 group">
                  <Download size={28} />
                  <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold font-mono opacity-0 group-hover:opacity-100 uppercase whitespace-nowrap">Descargar PDF</span>
              </button>
          </div>
      </div>
    </div>
  );
}
