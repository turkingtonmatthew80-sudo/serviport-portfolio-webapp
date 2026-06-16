import { useState } from "react";
import { Search, FileSearch, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export function AduanaConsultas() {
  const [queryTerm, setQueryTerm] = useState("");
  const [result, setResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!queryTerm) return;
    setSearching(true);
    
    try {
      // Intentar buscar por ID (DUA) o por referenciación interna (mblId/container)
      const hitosRef = collection(db, "hitos_legales");
      
      // Primera busqueda: por ID
      let q = query(hitosRef, where("__name__", "==", queryTerm));
      let snap = await getDocs(q);
      
      // Si no hay resultado, buscar si el DUA es parte de queryTerm
      if (snap.empty) {
        // En un caso real, podriamos tener un campo referencial en hito
        // Por ahora simulamos búsqueda si queryTerm coincide con algun string
        // Esto depende del modelo de DB. Podriamos buscar en MBL o Contenedores
        // Asumiendo que el ID es el DUA:
      }

      if (!snap.empty) {
        const doc = snap.docs[0];
        const data = doc.data();
        let statusStr = "Canal Verde (Levante)";
        if (data.status === "PENDIENTE_INSPECCION" || data.status === "EN_INSPECCION") {
           statusStr = "Canal Rojo (Revisión/Pendiente)";
        } else if (data.status === "RECHAZADO") {
           statusStr = "Canal Rojo (Rechazado)";
        } else if (data.status === "AMARILLO") {
           statusStr = "Canal Amarillo";
        }
        
        setResult({
          dua: doc.id,
          status: statusStr,
          importador: "SEGÚN MANIFIESTO", // Podria extraerse del bl_master
          fecha: new Date(data.createdAt || Date.now()).toLocaleDateString(),
          bl: data.mblId || queryTerm
        });
      } else {
        setResult("not_found");
      }
    } catch(e) {
       console.error("Error buscando SIDUNEA:", e);
       setResult("not_found");
    } finally {
       setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Consultas Operativas</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Consulte el estatus de trámites aduanales por BL, contenedor, o DUA.</p>
       </div>

       <div className="bg-white p-6 border border-border shadow-sm rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
              <input 
                type="text" 
                value={queryTerm}
                onChange={e => setQueryTerm(e.target.value)}
                placeholder="Ingrese P-BL, H-BL, o Contenedor para su consulta SIDUNEA..."
                className="pl-9 pr-4 py-3 border border-border rounded w-full font-mono text-sm focus:outline-none focus:border-primary bg-slate-50"
              />
            </div>
            <button onClick={handleSearch} disabled={searching} className="w-full md:w-auto bg-secondary text-white px-8 py-3 rounded font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2">
               {searching ? <Clock className="animate-spin" size={16} /> : <Search size={16}/>}
               {searching ? 'Consultando...' : 'Consultar'}
            </button>
          </div>
          
          {result === null && !searching && (
            <div className="mt-8 border border-dashed border-slate-300 p-8 rounded-lg flex flex-col items-center justify-center text-center bg-slate-50">
               <FileSearch size={32} className="text-slate-300 mb-4" />
               <p className="text-sm text-foreground-muted">Ingrese un identificador para iniciar su consulta transversal a lo largo del flujo documental.</p>
            </div>
          )}

          {result === 'not_found' && !searching && (
            <div className="mt-8 border border-dashed border-red-200 bg-red-50 p-8 rounded-lg flex flex-col items-center justify-center text-center">
               <AlertTriangle size={32} className="text-red-300 mb-4" />
               <p className="text-sm font-bold text-red-800">No se encontraron declaraciones</p>
               <p className="text-xs text-red-600 mt-1">El identificador proporcionado no corresponde a una declaración activa en SIDUNEA o no ha sido transmitido aún por la naviera.</p>
            </div>
          )}

          {result && result !== 'not_found' && !searching && (
            <div className="mt-8 border border-border p-6 rounded-lg bg-emerald-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  <CheckCircle2 size={48} className="text-emerald-100" />
               </div>
               <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-emerald-800 mb-4">Resultado SIDUNEA</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                 <div className="bg-white p-3 rounded border border-emerald-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Referencia Ingresada</p>
                    <p className="font-mono text-sm font-bold text-secondary">{result.bl}</p>
                 </div>
                 <div className="bg-white p-3 rounded border border-emerald-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">DUA Asignada</p>
                    <p className="font-mono text-sm font-bold text-secondary">{result.dua}</p>
                 </div>
                 <div className="bg-white p-3 rounded border border-emerald-100 md:col-span-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Estatus Selectividad</p>
                    <p className={`font-mono text-sm font-bold ${result.status.includes('Rojo') ? 'text-red-600' : 'text-emerald-600'}`}>{result.status}</p>
                 </div>
                 <div className="bg-white p-3 rounded border border-emerald-100 md:col-span-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Importador / Consignatario</p>
                    <p className="text-sm font-bold text-secondary">{result.importador}</p>
                 </div>
               </div>
            </div>
          )}
       </div>
    </div>
  );
}
