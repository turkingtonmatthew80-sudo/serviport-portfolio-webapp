import { useState } from "react";
import { Package, Search, FileText, Download, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { generateSecondaryManifestPDF } from "../../../lib/pdfGenerator";
import { motion } from "motion/react";

interface HouseBL {
  id: string;
  hbl: string;
  consignee: string;
  packages: number;
  weight: number;
  description: string;
  status: "APROBADO" | "PENDIENTE";
}

interface MasterBL {
  id: string;
  mbl: string;
  vessel: string;
  container: string;
  status: "DESCONSOLIDADO_APROBADO" | "EN_PROCESO";
  houses: HouseBL[];
}

export function ConsolidadorDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const [masters] = useState<MasterBL[]>([
    {
      id: "M1",
      mbl: "ZIMU12345678",
      vessel: "ZIM LUANDA",
      container: "ZCSU9988112",
      status: "DESCONSOLIDADO_APROBADO",
      houses: [
        { id: "H1", hbl: "HBL-001A", consignee: "TECNOLOGÍA CARACAS C.A.", packages: 12, weight: 2.5, description: "Electrónicos", status: "APROBADO" },
        { id: "H2", hbl: "HBL-001B", consignee: "IMPORTACIONES LARA", packages: 4, weight: 0.8, description: "Repuestos Auto", status: "APROBADO" }
      ]
    },
    {
      id: "M2",
      mbl: "MSCU55599922",
      vessel: "MSC ROSARIA",
      container: "MSCU3322114",
      status: "EN_PROCESO",
      houses: [
         { id: "H3", hbl: "HBL-002A", consignee: "DISTRIBUIDORA VALENCIA", packages: 40, weight: 12.0, description: "Textiles", status: "APROBADO" },
         { id: "H4", hbl: "HBL-002B", consignee: "FERRETERIA GLOBAL", packages: 15, weight: 5.5, description: "Herramientas", status: "PENDIENTE" }
      ]
    }
  ]);

  const handleDownloadManifest = (mbl: MasterBL) => {
    generateSecondaryManifestPDF({
      consoName: user?.razonSocial || "CONSOLIDADOR NVOCC",
      masterBL: mbl.mbl,
      containerId: mbl.container,
      houses: mbl.houses
    });
  };

  const filteredMasters = masters.filter(m => 
    m.mbl.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.houses.some(h => h.hbl.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-secondary tracking-tight font-sansita uppercase">
          Portal Consolidador (NVOCC)
        </h1>
        <p className="text-foreground-muted font-mono mt-1 text-sm">
          {user?.razonSocial || "Agencia Consolidadora C.A."} | RIF: {user?.rif || "J-000000000"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 border border-border shadow-sm flex items-center justify-between col-span-2 md:col-span-1">
             <div>
                <p className="text-[10px] font-bold text-foreground-muted font-mono tracking-widest uppercase mb-1">MÁSTER B/L GESTIONADOS</p>
                <h3 className="text-3xl font-black text-secondary">{masters.length}</h3>
             </div>
             <FileText className="text-slate-300" size={48} />
         </div>
      </div>

      <div className="bg-white border border-border shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm">DESCONSOLIDACIÓN LCL / GESTIÓN DE B/L HOUSE</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar House B/L, Máster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded text-sm w-full font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        <div className="p-6">
           <div className="space-y-6">
               {filteredMasters.map(mbl => (
                 <div key={mbl.id} className="border border-slate-200 p-0 bg-white rounded shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 border-b border-slate-200 gap-4">
                       <div>
                          <p className="font-bold text-secondary font-mono tracking-widest text-sm flex items-center gap-2">
                             <Package size={16} className="text-slate-400" />
                             M-BL: {mbl.mbl}
                          </p>
                          <p className="text-xs text-foreground-muted font-mono mt-1">Buque: {mbl.vessel} • Contenedor: {mbl.container}</p>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className={`${mbl.status === 'DESCONSOLIDADO_APROBADO' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'} border text-[10px] font-bold px-2 py-1 rounded font-mono uppercase tracking-widest flex items-center gap-1`}>
                             {mbl.status === 'DESCONSOLIDADO_APROBADO' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                             {mbl.status.replace("_", " ")}
                          </span>
                          <button 
                            onClick={() => handleDownloadManifest(mbl)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 p-1.5 rounded transition"
                            title="Generar Manifiesto Secundario PDF"
                          >
                            <Download size={16} />
                          </button>
                       </div>
                    </div>
                    
                    <div className="p-4 space-y-0 divide-y divide-slate-100">
                       {mbl.houses.map(hbl => (
                         <div key={hbl.id} className="flex flex-col md:flex-row md:items-center justify-between py-3">
                            <div>
                               <p className="text-sm font-bold font-mono text-slate-700">H-BL: {hbl.hbl}</p>
                               <p className="text-xs font-sans text-slate-500 mt-0.5">Consignatario: <span className="font-bold text-slate-700">{hbl.consignee}</span> • {hbl.description}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 md:mt-0">
                               <p className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                  {hbl.packages} Bultos / {hbl.weight} Tons
                               </p>
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono tracking-widest ${hbl.status === 'APROBADO' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {hbl.status}
                               </span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
               
               {filteredMasters.length === 0 && (
                 <div className="text-center py-8 text-slate-400 font-mono text-sm">
                    No se encontraron M-BLs o H-BLs
                 </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
}
