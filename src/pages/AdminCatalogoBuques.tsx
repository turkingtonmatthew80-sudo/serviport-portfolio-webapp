import { useState, useEffect } from "react";
import { Ship, Search, Anchor, Filter, Info, Map } from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "@/src/lib/db-wrapper";

interface ScrapedVessel {
  id: string;
  name: string;
  imo: string;
  type: string;
  lastSeenPort: string;
  eta?: string;
  updatedAt?: any;
}

export function AdminCatalogoBuques() {
  const { adminUser } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [vessels, setVessels] = useState<ScrapedVessel[]>([]);

  useEffect(() => {
    // Escuchar colección real del Scraper
    const unsub = onSnapshot(collection(db, "catalogo_buques"), (snap) => {
      const data: ScrapedVessel[] = [];
      snap.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as ScrapedVessel);
      });
      setVessels(data);
    });

    return () => unsub();
  }, []);

  const filteredVessels = vessels.filter(v => {
    if (filterType !== "ALL" && v.type !== filterType) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      // v.name or v.imo could be undefined depending on scraper data
      const name = v.name || "";
      const imo = v.imo || "";
      return name.toLowerCase().includes(term) || imo.includes(term);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
         <div>
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita flex items-center gap-3">
               <Ship className="text-primary" size={32} />
               Catálogo Global de Buques
            </h2>
            <p className="text-foreground-muted font-mono mt-1">
               Inteligencia marítima consolidada por el Gemelo Digital
            </p>
         </div>
      </div>

      <div className="bg-white border border-border shadow-sm p-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Anchor size={200} className="text-primary" />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-primary font-mono"
                 placeholder="Buscar por Nombre de Buque o IMO..."
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="relative">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <select 
                  className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-primary font-bold text-secondary cursor-pointer"
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
               >
                  <option value="ALL">CUALQUIER TIPO</option>
                  <option value="Portacontenedores">PORTACONTENEDORES</option>
                  <option value="Tanquero">TANQUEROS</option>
                  <option value="Granelero">GRANELEROS</option>
                  <option value="RO-RO">RO-RO (VEHÍCULOS)</option>
               </select>
            </div>
         </div>

         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVessels.map(v => (
               <div key={v.id} className="border border-slate-200 rounded p-4 bg-white hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                        <h4 className="font-bold text-secondary font-mono text-lg tracking-tight group-hover:text-primary transition-colors">{v.name}</h4>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">IMO: {v.imo}</p>
                     </div>
                     <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded
                        ${v.type === 'Portacontenedores' ? 'bg-blue-100 text-blue-700' :
                          v.type === 'Tanquero' ? 'bg-orange-100 text-orange-700' :
                          v.type === 'Granelero' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }
                     `}>
                        {v.type}
                     </span>
                  </div>
                  
                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                     <p className="flex items-center justify-between text-xs font-sans text-slate-600">
                        <span className="flex items-center gap-1.5"><Map size={14} className="text-slate-400"/> Visto en:</span>
                        <span className="font-bold font-mono tracking-widest">{v.lastSeenPort}</span>
                     </p>
                     <p className="flex items-center justify-between text-xs font-sans text-slate-600">
                        <span className="flex items-center gap-1.5"><Info size={14} className="text-slate-400"/> ETA:</span>
                        <span className="font-bold font-mono">{v.eta}</span>
                     </p>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
