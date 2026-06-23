import React, { useState } from "react";
import { Package, Search, ChevronDown, ChevronRight, FileText, Anchor, Truck, LogOut, ShieldAlert, CheckCircle } from "lucide-react";

const BL_DATA = [
  {
    blNumber: "MEDU1234567",
    vessel: "M/N Horizon",
    eta: "15 Oct 2026",
    status: "En Patio",
    containers: [
      { bic: "MSKU9081232", type: "40HC", status: "Canal Rojo", location: "Bloque A-14" },
      { bic: "MEDU8910011", type: "20ST", status: "Levante", location: "Bloque B-05" },
      { bic: "TEMU1122334", type: "40RH", status: "Levante", location: "Bloque C-01" },
    ]
  },
  {
    blNumber: "HLCU7654321",
    vessel: "M/N Sea Trader",
    eta: "12 Oct 2026",
    status: "Retirado",
    containers: [
      { bic: "HLXU4455667", type: "40HC", status: "Gate Out", location: "Fuera de Puerto" }
    ]
  }
];

export function ImportadorTracking() {
  const [expandedRow, setExpandedRow] = useState<string | null>("MEDU1234567");
  const [selectedContainer, setSelectedContainer] = useState<string | null>("MSKU9081232");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
           Trazabilidad Documental y Física (AGD)
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
           Master Conocimientos de Embarque (B/L) y Contenedores.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Master Detail Table */}
        <div className="lg:w-2/3 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
           <div className="p-4 border-b flex justify-between items-center bg-muted/20">
              <div className="relative w-64 text-sm">
                 <Search className="absolute left-2.5 top-2 text-muted-foreground w-4 h-4" />
                 <input className="w-full bg-background border px-3 py-1.5 pl-8 rounded-md outline-none focus:ring-1 focus:ring-primary" placeholder="Buscar BL o Contenedor..." />
              </div>
           </div>
           <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                 <thead className="bg-muted text-xs uppercase text-muted-foreground">
                    <tr>
                       <th className="px-4 py-3 w-10"></th>
                       <th className="px-4 py-3">Master B/L</th>
                       <th className="px-4 py-3">Buque</th>
                       <th className="px-4 py-3">Estado B/L</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                    {BL_DATA.map(bl => (
                       <React.Fragment key={bl.blNumber}>
                          {/* Padre */}
                          <tr className={`hover:bg-muted/30 cursor-pointer ${expandedRow === bl.blNumber ? 'bg-muted/10' : ''}`} onClick={() => setExpandedRow(expandedRow === bl.blNumber ? null : bl.blNumber)}>
                             <td className="px-4 py-3">
                                {expandedRow === bl.blNumber ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                             </td>
                             <td className="px-4 py-3 font-semibold font-mono text-primary flex items-center gap-2">
                                <FileText className="w-4 h-4" /> {bl.blNumber}
                             </td>
                             <td className="px-4 py-3">{bl.vessel}</td>
                             <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-secondary/10 text-xs font-semibold">{bl.status}</span></td>
                          </tr>
                          
                          {/* Hijas */}
                          {expandedRow === bl.blNumber && bl.containers.map(cont => (
                             <tr key={cont.bic} className={`bg-muted/20 hover:bg-muted/40 cursor-pointer ${selectedContainer === cont.bic ? 'bg-primary/10 border-l-2 border-primary' : ''}`} onClick={() => setSelectedContainer(cont.bic)}>
                                <td></td>
                                <td className="px-4 py-2 font-mono flex items-center gap-2 text-xs">
                                   <div className="w-2 h-2 rounded-full border border-current"></div>
                                   {cont.bic} <span className="text-muted-foreground">({cont.type})</span>
                                </td>
                                <td className="px-4 py-2 text-xs font-mono">{cont.location}</td>
                                <td className="px-4 py-2">
                                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cont.status === 'Canal Rojo' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30'}`}>
                                      {cont.status}
                                   </span>
                                </td>
                             </tr>
                          ))}
                       </React.Fragment>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Right: Forensics Stepper */}
        <div className="lg:w-1/3 bg-card border border-border rounded-xl shadow-sm p-6 relative overflow-hidden">
           {selectedContainer ? (
              <>
                 <h3 className="font-bold mb-6 pb-4 border-b flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary"/> Lupa Forense: <span className="font-mono text-primary">{selectedContainer}</span>
                 </h3>
                 <div className="relative space-y-6">
                    {/* Stepper Line */}
                    <div className="absolute left-3 top-2 w-[2px] h-[80%] bg-border"></div>
                    
                    {/* Step 1 */}
                    <div className="relative flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <Anchor className="w-3 h-3" />
                       </div>
                       <div>
                          <p className="font-semibold text-sm">Descargado del Buque</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Operación STS completada.</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-1">15 Oct 2026, 08:30 AM</p>
                       </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <Truck className="w-3 h-3" />
                       </div>
                       <div>
                          <p className="font-semibold text-sm">Ubicado en Patio (Reach Stacker)</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Bloque A-14, Tier 3.</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-1">15 Oct 2026, 11:15 AM</p>
                       </div>
                    </div>

                    {/* Step 3 (Red) */}
                    <div className="relative flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 z-10 shadow-sm ring-4 ring-red-500/20 animate-pulse">
                          <ShieldAlert className="w-3 h-3" />
                       </div>
                       <div>
                          <p className="font-bold text-sm text-red-600">Canal Rojo Asignado (SIDUNEA)</p>
                          <p className="text-xs text-red-500/80 mt-0.5">Aforo físico requerido por SIDUNEA.</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-1">16 Oct 2026, 09:00 AM</p>
                       </div>
                    </div>

                    {/* Step 4 (Future) */}
                    <div className="relative flex gap-4 opacity-50">
                       <div className="w-6 h-6 rounded-full bg-background border-2 border-muted-foreground flex items-center justify-center shrink-0 z-10">
                          <CheckCircle className="w-3 h-3 text-muted-foreground" />
                       </div>
                       <div>
                          <p className="font-medium text-sm text-muted-foreground">Esperando Pago Local</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-1">Pendiente facturación</p>
                       </div>
                    </div>

                    {/* Step 5 (Future) */}
                    <div className="relative flex gap-4 opacity-50">
                       <div className="w-6 h-6 rounded-full bg-background border-2 border-muted-foreground flex items-center justify-center shrink-0 z-10">
                          <LogOut className="w-3 h-3 text-muted-foreground" />
                       </div>
                       <div>
                          <p className="font-medium text-sm text-muted-foreground">Gate Out (Salida)</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-1">Pendiente</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-4 border-t border-border">
                    <button className="w-full bg-secondary text-secondary-foreground font-medium py-2 rounded-md text-sm hover:bg-secondary/90 transition-colors">
                      Delegar DUA a Agente Aduanal
                    </button>
                    <p className="text-[10px] text-center text-muted-foreground mt-2">Permite que el Agente de Aduanas vinculado pueda ver y declarar estos contenedores.</p>
                 </div>
              </>
           ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                 <Package className="w-12 h-12 mb-2" />
                 <p className="text-sm">Seleccione un contenedor para ver su historia</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
