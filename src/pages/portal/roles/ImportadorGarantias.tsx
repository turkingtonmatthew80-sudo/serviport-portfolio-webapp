import React, { useState } from "react";
import { Shield, CheckCircle, AlertOctagon, Undo2, ArrowRightLeft, FileText, Search, CreditCard } from "lucide-react";

const GUARANTEES = [
  { bic: "MEDU8910011", bl: "MEDU1234567", amount: 1500, status: "RETENIDA", type: "20ST", line: "MSC" },
  { bic: "MSKU9081232", bl: "MEDU1234567", amount: 2000, status: "EN_EVALUACION", type: "40HC", line: "Maersk" },
  { bic: "TEMU1122334", bl: "MEDU1234567", amount: 2000, status: "REEMBOLSADA", type: "40RH", line: "CMA CGM", refundAmount: 2000 },
  { bic: "HLXU4455667", bl: "HLCU7654321", amount: 1500, status: "PENALIZADA", type: "40HC", line: "Hapag-Lloyd", refundAmount: 1200, damageCost: 300 },
];

export function ImportadorGarantias() {
  const [filter, setFilter] = useState("TODAS");

  const filtered = filter === "TODAS" ? GUARANTEES : GUARANTEES.filter(g => g.status === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
           Garantías de Contenedores Vacíos
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
           Gestión de depósitos y reembolsos según condiciones del EIR.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex flex-col justify-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Retenido</p>
            <p className="text-2xl font-black text-foreground">$3,500.00</p>
         </div>
         <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex flex-col justify-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">En Evaluación (EIR)</p>
            <p className="text-2xl font-black text-blue-600">$2,000.00</p>
         </div>
         <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex flex-col justify-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Reembolsado (YTD)</p>
            <p className="text-2xl font-black text-green-600">$2,000.00</p>
         </div>
         <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex flex-col justify-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Penalizaciones (YTD)</p>
            <p className="text-2xl font-black text-red-600">$300.00</p>
         </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex flex-col">
         <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
               <button onClick={() => setFilter("TODAS")} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === 'TODAS' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted text-foreground'}`}>Todas</button>
               <button onClick={() => setFilter("RETENIDA")} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === 'RETENIDA' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted text-foreground'}`}>Retenidas</button>
               <button onClick={() => setFilter("EN_EVALUACION")} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === 'EN_EVALUACION' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted text-foreground'}`}>En Evaluación</button>
               <button onClick={() => setFilter("REEMBOLSADA")} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === 'REEMBOLSADA' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted text-foreground'}`}>Reembolsadas</button>
            </div>
            <div className="relative w-full sm:w-64 text-sm">
               <Search className="absolute left-2.5 top-2 text-muted-foreground w-4 h-4" />
               <input className="w-full bg-background border px-3 py-1.5 pl-8 rounded-md outline-none focus:ring-1 focus:ring-primary" placeholder="Buscar BL o Contenedor..." />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                     <th className="px-6 py-3">Contenedor / B/L</th>
                     <th className="px-6 py-3">Naviera</th>
                     <th className="px-6 py-3">Garantía ($)</th>
                     <th className="px-6 py-3">Estatus</th>
                     <th className="px-6 py-3 text-right">Liquidación</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {filtered.map(row => {
                     let StatusIcon = Shield;
                     let statusColor = "bg-muted text-foreground";
                     if (row.status === "RETENIDA") {
                        statusColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
                     } else if (row.status === "EN_EVALUACION") {
                        StatusIcon = Search;
                        statusColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
                     } else if (row.status === "REEMBOLSADA") {
                        StatusIcon = CheckCircle;
                        statusColor = "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
                     } else if (row.status === "PENALIZADA") {
                        StatusIcon = AlertOctagon;
                        statusColor = "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
                     }

                     return (
                        <tr key={row.bic} className="hover:bg-muted/30 transition-colors">
                           <td className="px-6 py-4">
                              <p className="font-mono font-bold text-primary">{row.bic} <span className="text-muted-foreground text-xs font-sans">({row.type})</span></p>
                              <p className="text-xs text-muted-foreground mt-0.5"><FileText className="inline w-3 h-3 mr-1"/>BL: {row.bl}</p>
                           </td>
                           <td className="px-6 py-4 font-semibold text-xs">{row.line}</td>
                           <td className="px-6 py-4 font-mono font-bold">${row.amount.toFixed(2)}</td>
                           <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${statusColor}`}>
                                 <StatusIcon className="w-3 h-3"/>
                                 {row.status.replace("_", " ")}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              {row.status === "REEMBOLSADA" && (
                                 <p className="font-mono text-green-600 font-bold">+${row.refundAmount?.toFixed(2)}</p>
                              )}
                              {row.status === "PENALIZADA" && (
                                 <div>
                                    <p className="font-mono text-green-600 font-bold">+${row.refundAmount?.toFixed(2)}</p>
                                    <p className="font-mono text-red-500 text-xs">-${row.damageCost?.toFixed(2)} (EIR)</p>
                                 </div>
                              )}
                              {row.status === "EN_EVALUACION" && (
                                 <button className="text-primary hover:underline text-xs font-semibold flex items-center justify-end w-full gap-1">
                                    <FileText className="w-3 h-3"/> Ver EIR In
                                 </button>
                              )}
                              {row.status === "RETENIDA" && (
                                 <span className="text-xs text-muted-foreground">-</span>
                              )}
                           </td>
                        </tr>
                     );
                  })}
                  {filtered.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                           <Shield className="mx-auto w-12 h-12 mb-3 opacity-20" />
                           <p>No se encontraron registros para este filtro.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
