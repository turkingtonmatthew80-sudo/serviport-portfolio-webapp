import { useState } from "react";
import { Package, Search, ChevronDown, ChevronRight, UploadCloud, Users } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface House {
   id: string;
   hbl: string;
   importador: string;
   descripcion: string;
   peso: number;
   volumen: number;
   status: string;
}

interface MasterRow {
   id: string;
   mbl: string;
   contenedor: string;
   status: string;
   houses: House[];
}

export function ConsolidadorDesconsolidacion() {
   const { user } = useAuth();
   
   const [expandedRow, setExpandedRow] = useState<string | null>("MBL-HL-998123");

   const [masters] = useState<MasterRow[]>([
      {
         id: "MBL-HL-998123",
         mbl: "MBL-HL-998123",
         contenedor: "HLBU9876543 (40' HC)",
         status: "EN_PATIO_ESPERANDO_VACIADO",
         houses: [
            { id: "h1", hbl: "HBL-00912A", importador: "Importaciones C.A.", descripcion: "Repuestos Auto", peso: 2500, volumen: 15, status: "MANIFESTADO" },
            { id: "h2", hbl: "HBL-00912B", importador: "Comercializadora Sur", descripcion: "Textiles", peso: 1200, volumen: 8, status: "MANIFESTADO" },
            { id: "h3", hbl: "HBL-00912C", importador: "Tecno Global", descripcion: "Laptops y Telefonía", peso: 800, volumen: 5, status: "MANIFESTADO" },
         ]
      },
      {
         id: "MBL-MS-110022",
         mbl: "MBL-MS-110022",
         contenedor: "MSKU1092281 (20' DRY)",
         status: "EN_TRANSITO",
         houses: [
            { id: "h4", hbl: "HBL-110022A", importador: "FarmaCentro", descripcion: "Insumos Médicos", peso: 3000, volumen: 12, status: "PRE_ARRIBO" }
         ]
      }
   ]);

   const toggleRow = (id: string) => {
      if (expandedRow === id) setExpandedRow(null);
      else setExpandedRow(id);
   }

   return (
      <div className="space-y-6 max-w-7xl mx-auto">
         <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
               <h1 className="text-2xl font-black rounded-lg text-secondary tracking-tight font-sansita uppercase">
                  Desconsolidación (Split Documental)
               </h1>
               <p className="text-foreground-muted font-mono mt-1 text-sm">
                  Gestión de Master B/L y desagregación de House B/Ls a Importadores Finales.
               </p>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors">
               <UploadCloud size={18} /> Subir Archivo Desglose XLS
            </button>
         </div>

         <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50 flex justify-between items-center">
               <h3 className="font-bold text-secondary font-mono tracking-widest text-sm uppercase">Listado de Contenedores Master</h3>
               <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
                  <input type="text" placeholder="Buscar BL o Contenedor..." className="pl-9 pr-4 py-1.5 border rounded w-full font-mono text-sm focus:border-primary focus:outline-none bg-white" />
               </div>
            </div>

            <div className="divide-y divide-border">
               {masters.map(m => (
                  <div key={m.id} className="flex flex-col">
                     {/* FILA PADRE (MASTER) */}
                     <div 
                        onClick={() => toggleRow(m.id)}
                        className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${expandedRow === m.id ? 'bg-primary/5' : ''}`}
                     >
                        <div className="flex items-center gap-4">
                           <div className="text-primary">
                              {expandedRow === m.id ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                           </div>
                           <Package className="text-slate-400" size={24} />
                           <div>
                              <p className="font-bold text-secondary text-base">{m.mbl}</p>
                              <p className="text-xs font-mono text-slate-500 mt-0.5">FCL: {m.contenedor}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right">
                              <p className="text-xs font-bold text-secondary font-mono uppercase tracking-wider">{m.houses.length} House B/Ls</p>
                              <p className="text-xs text-foreground-muted font-mono">{m.houses.reduce((acc,h)=>acc+h.peso, 0).toLocaleString()} kg | {m.houses.reduce((acc,h)=>acc+h.volumen, 0).toLocaleString()} CBM</p>
                           </div>
                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest font-mono ${m.status === 'EN_PATIO_ESPERANDO_VACIADO' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                              {m.status.replaceAll('_', ' ')}
                           </span>
                        </div>
                     </div>

                     {/* FILAS HIJAS (HOUSE BLS) */}
                     {expandedRow === m.id && (
                        <div className="bg-slate-50/50 p-4 border-t border-dashed border-slate-200">
                           <div className="ml-12 mr-6">
                              <div className="flex justify-between items-center mb-4">
                                 <h4 className="text-xs font-bold uppercase tracking-widest text-secondary/70 flex items-center gap-2">
                                    <Users size={14} /> Asignación de Importadores LCL
                                 </h4>
                                 <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                                    Notificar Masivamente
                                 </button>
                              </div>
                              <table className="w-full text-left text-sm">
                                 <thead>
                                    <tr className="border-b border-slate-200 text-xs font-mono uppercase tracking-widest text-slate-500">
                                       <th className="py-2">H-BL</th>
                                       <th className="py-2">Importador RIF/Nombre</th>
                                       <th className="py-2">Mercancía</th>
                                       <th className="py-2 text-right">Peso/Vol</th>
                                       <th className="py-2 text-right">Estado</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {m.houses.map(h => (
                                       <tr key={h.id} className="hover:bg-white transition-colors">
                                          <td className="py-3 font-bold font-mono text-secondary">{h.hbl}</td>
                                          <td className="py-3 text-secondary font-medium">{h.importador}</td>
                                          <td className="py-3 text-slate-600 text-xs">{h.descripcion}</td>
                                          <td className="py-3 text-right font-mono text-xs">{h.peso} kg<br/><span className="text-slate-400">{h.volumen} CBM</span></td>
                                          <td className="py-3 text-right">
                                             <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                                                {h.status}
                                             </span>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     )}

                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
