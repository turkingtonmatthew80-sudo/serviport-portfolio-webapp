import { useState } from "react";
import { Search, Info, ShieldCheck, Download, AlertTriangle } from "lucide-react";

export function ConsolidadorLiberacion() {
   const [searchTerm, setSearchTerm] = useState("");

   const [houses, setHouses] = useState([
      { id: "h1", hbl: "HBL-00912A", importador: "Importaciones C.A.", contenedor: "HLBU9876543", almacenaje: 0, freights: true, release: false, aduana: "LEVANTE" },
      { id: "h2", hbl: "HBL-00912B", importador: "Comercializadora Sur", contenedor: "HLBU9876543", almacenaje: 150, freights: false, release: false, aduana: "RECONOCIMIENTO" },
      { id: "h3", hbl: "HBL-00912C", importador: "Tecno Global", contenedor: "HLBU9876543", almacenaje: 0, freights: true, release: true, aduana: "LEVANTE" },
   ]);

   const toggleRelease = (id: string) => {
      setHouses(houses.map(h => {
         if (h.id === id && h.freights) {
            return { ...h, release: !h.release };
         }
         return h;
      }));
   }

   const filteredDetails = houses.filter(h => 
      h.hbl.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.importador.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="space-y-6 max-w-7xl mx-auto">
         <div className="mb-4">
            <h1 className="text-2xl font-black rounded-lg text-secondary tracking-tight font-sansita uppercase">
               Módulo de Liberación Comercial (Cúmplase)
            </h1>
            <p className="text-foreground-muted font-mono mt-1 text-sm">
               Emisión de Orden de Entrega para Importadores (Release Order)
            </p>
         </div>

         <div className="bg-white border rounded-lg border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
               <h3 className="font-bold text-secondary font-mono tracking-widest text-sm uppercase">House B/L Disponibles en AGD</h3>
               <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
                  <input 
                     type="text" 
                     placeholder="Buscar HBL, Cliente..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-9 pr-4 py-1.5 border border-slate-300 rounded text-sm w-full font-mono focus:outline-none focus:border-primary bg-white"
                  />
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                     <tr className="bg-slate-50 border-b border-border">
                        <th className="p-4 text-xs font-bold text-foreground-muted uppercase tracking-widest">House B/L</th>
                        <th className="p-4 text-xs font-bold text-foreground-muted uppercase tracking-widest">Importador (Cliente Final)</th>
                        <th className="p-4 text-xs font-bold text-foreground-muted uppercase tracking-widest">Estatus Aduana</th>
                        <th className="p-4 text-xs font-bold text-foreground-muted uppercase tracking-widest text-center">Fletes y Gastos</th>
                        <th className="p-4 text-xs font-bold text-foreground-muted uppercase tracking-widest text-center">Agendamiento</th>
                        <th className="p-4 text-xs font-bold text-foreground-muted uppercase tracking-widest text-right">Cúmplase Comercial</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {filteredDetails.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="p-8 text-center text-slate-500 font-mono text-sm">No se encontraron House B/Ls.</td>
                        </tr>
                     ) : filteredDetails.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="p-4 font-bold text-secondary font-mono">
                              {row.hbl}
                              <p className="text-[10px] text-slate-400 mt-1 uppercase">Ex: {row.contenedor}</p>
                           </td>
                           <td className="p-4">
                              <span className="font-medium text-secondary text-sm">{row.importador}</span>
                           </td>
                           <td className="p-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono tracking-widest uppercase border ${
                                 row.aduana === 'LEVANTE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                 {row.aduana}
                              </span>
                           </td>
                           <td className="p-4 text-center">
                              {row.freights ? (
                                 <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1"><ShieldCheck size={14}/> PAGADOS</span>
                              ) : (
                                 <span className="text-red-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1"><AlertTriangle size={14}/> DEUDA USD {row.almacenaje}</span>
                              )}
                           </td>
                           <td className="p-4 text-center">
                              {row.release && row.aduana === 'LEVANTE' ? (
                                 <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Habilitado</span>
                              ) : (
                                 <span className="text-slate-400 text-xs italic">Bloqueado</span>
                              )}
                           </td>
                           <td className="p-4 text-right">
                              {row.release ? (
                                 <button onClick={() => toggleRelease(row.id)} className="bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors inline-block w-32 text-center shadow-sm">
                                    LIBERADO ✔
                                 </button>
                              ) : (
                                 <button 
                                    disabled={!row.freights}
                                    onClick={() => toggleRelease(row.id)} 
                                    className={`px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors inline-block w-32 text-center shadow-sm border ${
                                       row.freights ? 'bg-secondary text-white border-secondary hover:bg-secondary/90' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                    }`}
                                 >
                                    OTORGAR
                                 </button>
                              )}
                              
                              {row.release && (
                                 <a href="#" className="flex justify-end items-center gap-1 text-slate-500 hover:text-primary text-[10px] font-bold tracking-widest uppercase mt-2">
                                    <Download size={12}/> PDF Release
                                 </a>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex items-start gap-3">
               <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
               <div>
                  <p className="text-sm text-blue-800 font-bold uppercase tracking-widest mb-1">Manejo de LCL vs FCL</p>
                  <p className="text-xs text-blue-800/80 leading-relaxed max-w-4xl">
                     A diferencia del FCL donde el transportista asocia el contenedor, en LCL el importador contrata un camión NPR pequeño. El transportista de la carga consolidada no requiere agendar un pase de garita a Bolipuertos (VBS), sino presentarse directamente en su Almacén (AGD) una vez otorgado este Cúmplase y el Levante de la Aduana.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
