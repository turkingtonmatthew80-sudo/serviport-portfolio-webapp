import { useState } from "react";
import { Search, AlertTriangle, Filter, CheckCircle2, FileUp, X } from "lucide-react";

export function GerenteExcepciones() {
  const [modalOpen, setModalOpen] = useState(false);
  const [contenedores] = useState([
    { id: 'MSKU9081232', status: 'IN_YARD', tipo: 'IMPORTACION', cliente: 'Polar C.A.' },
    { id: 'CMAU1234567', status: 'IN_YARD', tipo: 'IMPORTACION', cliente: 'Nestle VE' },
    { id: 'TGHU8989123', status: 'IN_YARD', tipo: 'IMPORTACION', cliente: 'Automercados Plaza' },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black rounded-lg text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
           <AlertTriangle className="text-primary" /> Excepciones Operativas (Días de Gracia)
        </h1>
        <p className="text-slate-400 font-mono mt-1 text-sm bg-slate-800/50 px-3 py-1 rounded inline-block border border-slate-700">
           Inyección Masiva | Contingencias SIDEUNIA/SASP | Perdones
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-xl">
         <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="flex gap-4 items-center w-full md:w-auto">
               <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                     type="text" 
                     placeholder="Buscar contenedor, cliente o booking..."
                     className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm w-full font-mono text-slate-200 focus:outline-none focus:border-primary"
                  />
               </div>
               <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shrink-0">
                  <Filter size={14} /> Filtos Masivos
               </button>
            </div>
            
            <button 
               onClick={() => setModalOpen(true)}
               className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-colors"
            >
               <AlertTriangle size={16} /> Inyectar Días Libres (3 Seleccionados)
            </button>
         </div>

         {/* Contenedores Grid */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-700 text-slate-400 font-mono text-xs uppercase tracking-widest">
                     <th className="p-4 w-10">
                        <input type="checkbox" checked readOnly className="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                     </th>
                     <th className="p-4 font-normal">Contenedor BIC</th>
                     <th className="p-4 font-normal">Tipo</th>
                     <th className="p-4 font-normal">Estado Actual</th>
                     <th className="p-4 font-normal">Cliente (Consignatario)</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {contenedores.map(cont => (
                     <tr key={cont.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                           <input type="checkbox" checked readOnly className="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                        </td>
                        <td className="p-4 font-mono font-bold text-blue-400">{cont.id}</td>
                        <td className="p-4 font-mono text-xs text-slate-400">{cont.tipo}</td>
                        <td className="p-4">
                           <span className="px-2 py-1 rounded text-[10px] font-bold font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              {cont.status}
                           </span>
                        </td>
                        <td className="p-4 font-medium">{cont.cliente}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {modalOpen && (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full shadow-2xl flex flex-col">
               <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                  <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest flex items-center gap-2">
                     <AlertTriangle className="text-amber-500" size={18} /> Protocolo de Contingencia
                  </h3>
                  <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-6 space-y-5">
                  <p className="text-sm text-slate-300">
                     Está a punto de modificar transaccionalmente el cálculo de almacenaje para <strong className="text-white">3</strong> contenedores.
                  </p>
                  
                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Días a Inyectar</label>
                     <input type="number" defaultValue={2} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Tipo de Contingencia</label>
                     <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500">
                        <option value="FALLA_SISTEMA_ESTADO">Falla Sistema Estado (SENIAT/SASP)</option>
                        <option value="CLIMA_ADVERSO">Clima Adverso / Cierre Operaciones</option>
                        <option value="PARO_SINDICAL">Paro Sindical</option>
                        <option value="PERDON_COMERCIAL">Perdón Comercial Autorizado</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Soporte Oficial (Obligatorio)</label>
                     <div className="border border-dashed border-slate-600 rounded p-4 text-center hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                        <FileUp size={24} className="text-slate-500" />
                        <span className="text-xs text-slate-400 font-mono uppercase tracking-wide">Adjuntar PDF Comunicado Oficial</span>
                     </div>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-800 bg-slate-800/20 flex justify-end gap-3">
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest text-xs rounded transition-colors">
                     Cancelar
                  </button>
                  <button className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase tracking-widest text-xs rounded transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                     <CheckCircle2 size={16} /> Procesar UPDATE Batch
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
