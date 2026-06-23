import { useState } from "react";
import { PackageOpen, Camera, CheckSquare, ScanBarcode, AlertTriangle, AlertOctagon } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function ConsolidadorVaciado() {
   const { user } = useAuth();
   const [containerId, setContainerId] = useState("HLBU9876543");
   
   const [bultos, setBultos] = useState([
      { hbl: "HBL-00912A", importador: "Importaciones C.A.", qty: 50, scanned: 50, status: "COMPLETADO", rack: "B-02" },
      { hbl: "HBL-00912B", importador: "Comercializadora Sur", qty: 30, scanned: 12, status: "EN_PROGRESO", rack: "PENDIENTE" },
      { hbl: "HBL-00912C", importador: "Tecno Global", qty: 25, scanned: 0, status: "PENDIENTE", rack: "PENDIENTE" },
   ]);

   return (
      <div className="space-y-6 max-w-5xl mx-auto">
         <div className="mb-4">
            <h1 className="text-2xl font-black rounded-lg text-secondary tracking-tight font-sansita uppercase flex items-center gap-2">
               <ScanBarcode size={28} className="text-primary"/> Consola de Vaciado y Tarja
            </h1>
            <p className="text-foreground-muted font-mono mt-1 text-sm bg-blue-50 px-3 py-1 rounded inline-block border border-blue-100">
               Almacén General de Depósito (AGD) - Tablet Industrial UI
            </p>
         </div>

         <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
               <div>
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest mb-1">Contenedor en Puerta Rampa</p>
                  <h2 className="text-3xl font-black font-mono tracking-wider">{containerId}</h2>
                  <p className="text-xs text-blue-400 mt-1 uppercase font-bold tracking-widest">Master: MBL-HL-998123</p>
               </div>
               
               <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <div className="text-right">
                     <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-0.5">Progreso Vaciado</p>
                     <p className="text-xl font-bold font-mono">62 / 105 Bultos</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-slate-700 relative flex flex-col items-center justify-center">
                     <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-emerald-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 60%)' }}></div>
                     <span className="text-sm font-bold relative z-10">59%</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <button className="bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl p-6 flex flex-col items-center justify-center h-32 gap-3 shadow-lg border border-blue-400/30 group">
                  <ScanBarcode size={32} className="text-white group-hover:scale-110 transition-transform" />
                  <span className="font-black uppercase tracking-widest text-sm">ESCANEAR BULTO</span>
               </button>
               
               <button className="bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center h-32 gap-3 shadow-inner group">
                  <AlertOctagon size={32} className="text-red-400 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                     <span className="font-black uppercase tracking-widest text-sm text-red-50">Reportar Discrepancia</span>
                     <p className="text-[10px] text-slate-400 uppercase mt-1 tracking-wider">Foto OS&D / Sobrante</p>
                  </div>
               </button>
            </div>

            <h3 className="font-bold text-slate-300 font-mono tracking-widest text-xs uppercase mb-4">Lista de Tarja (Manifiesto Fraccionado)</h3>
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden divide-y divide-slate-700/50">
               {bultos.map(b => (
                  <div key={b.hbl} className="p-4 flex items-center justify-between">
                     <div>
                        <p className="font-bold text-lg font-mono">{b.hbl}</p>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">{b.importador}</p>
                     </div>
                     
                     <div className="flex items-center gap-6">
                        <div className="text-center bg-slate-900 border border-slate-700 px-4 py-2 rounded">
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-mono">Bultos</p>
                           <p className="font-mono font-bold">
                              <span className={b.scanned === b.qty ? 'text-emerald-400' : 'text-blue-400'}>{b.scanned}</span>
                              <span className="text-slate-500"> / {b.qty}</span>
                           </p>
                        </div>
                        
                        <div className="w-32 text-right">
                           {b.status === "COMPLETADO" && (
                              <div>
                                 <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded inline-flex items-center gap-1 border border-emerald-500/30">
                                    <CheckSquare size={12}/> LISTO
                                 </span>
                                 <p className="text-xs text-slate-400 mt-2 font-mono">Rack: {b.rack}</p>
                              </div>
                           )}
                           {b.status === "EN_PROGRESO" && (
                              <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded inline-flex items-center border border-blue-500/30">
                                 EN RACK...
                              </span>
                           )}
                           {b.status === "PENDIENTE" && (
                              <span className="bg-slate-700 text-slate-400 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded inline-flex items-center border border-slate-600">
                                 EN CONTENEDOR
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="mt-8 flex justify-end">
               <button className="bg-emerald-600 hover:bg-emerald-500 transition-colors px-6 py-3 rounded-lg font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(5,150,105,0.4)]">
                  <CheckSquare size={18} /> Confirmar Vaciado Físico
               </button>
            </div>
         </div>
         
         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
               <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
               <div>
                  <p className="text-sm text-yellow-800 font-bold uppercase tracking-widest mb-1">Efecto Cascada Transaccional (ACID)</p>
                  <p className="text-xs text-yellow-800/80 leading-relaxed max-w-4xl">
                     Al hacer clic en "Confirmar Vaciado", el backend ejecutará una transacción PostgreSQL: 1) Cambia MSCU987 a estado 'VACÍO' deteniendo tarifa de Bolipuertos. 2) Inserta posición en inventario_almacen. 3) Enciende los relojes de Almacenaje Techado (Por Ton/CBM) para los 50 importadores hijos.
                  </p>
               </div>
            </div>
         </div>

      </div>
   );
}
