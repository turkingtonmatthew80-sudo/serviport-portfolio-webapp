import { useState, useEffect } from "react";
import { CheckCircle2, QrCode, ShieldAlert, Truck } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function AgenteAduanaDespachos() {
  const { user } = useAuth();
  const [contenedores, setContenedores] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchDespachos = async () => {
     if (!user?.rif) return;
     try {
       const empRes = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'rif', value: user.rif }])));
       const empData = await empRes.json();
       if (!empData || empData.length === 0) return;

       const cRes = await fetch(`/api/sql/contenedores?filters=` + encodeURIComponent(JSON.stringify([
         { type: 'where', field: 'agenteAduanasId', value: empData[0].id }
       ])));
       const conts = await cRes.json();

       // Let's filter only those that are in YARD or Full Gate in, basically the imported ones that are waiting.
       // And those with status of import levante
       const bicList = conts.map((c:any) => c.numeroBic);
       if (bicList.length === 0) return;

       const dRes = await fetch(`/api/sql/declaracionesAduaneras`);
       const allDecls = await dRes.json();
       
       // map the state
       const mappedConts = conts.map((c:any) => {
          const d = allDecls.find((dec:any) => dec.contenedorBic === c.numeroBic);
          return {
             ...c,
             declaracion: d || null
          }
       }).filter((c:any) => c.declaracion?.estadoDeclaracion === 'LEVANTE_OTORGADO');

       setContenedores(mappedConts);
     } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchDespachos();
  }, [user]);

  const solicitarPase = async (bic: string) => {
     try {
        const res = await fetch("/api/aduanas/despacho/solicitar-salida", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ numeroBic: bic })
        });
        const data = await res.json();
        if (!data.success) {
           setStatusMsg("❌ Bloqueo Comercial: " + data.error);
        } else {
           setStatusMsg(`✅ Pase de Salida Digital generado. Token: ${data.token}. Entréguelo a su transportista.`);
        }
     } catch(e: any) {
        setStatusMsg("❌ Falla de sistema: " + e.message);
     }
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Solicitud de Pase de Salida</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">La validación final. Requiere Levante Aduanero y liberación comercial de todos los involucrados.</p>
       </div>

       {statusMsg && (
          <div className={`p-4 rounded font-mono font-bold text-sm shadow-sm ${statusMsg.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
             {statusMsg}
          </div>
       )}

       <div className="bg-white border border-border shadow-sm rounded p-6 min-h-[500px]">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm mb-6 border-b pb-2 flex items-center gap-2">
             <CheckCircle2 className="text-primary" size={16} /> CARGAS NACIONALIZADAS ELEGIBLES
          </h3>

          <div className="space-y-4">
             {contenedores.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded text-slate-400 font-mono text-sm bg-slate-50">
                   Actualmente no tiene contenedores con Levante Otorgado listos para emitir pase de salida.
                </div>
             ) : (
                contenedores.map(c => (
                   <div key={c.numeroBic} className="bg-slate-50 border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-6 rounded hover:bg-slate-100 transition-colors">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold font-mono text-secondary text-lg">{c.numeroBic}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest flex items-center gap-1">
                               <ShieldAlert size={12} /> LEVANTE OTORGADO
                            </span>
                         </div>
                         <p className="text-xs text-slate-500 font-mono">Consulte pagos a Naviera, Almacenaje y GNB antes de solicitar Pase de Salida.</p>
                      </div>

                      <div className="w-full md:w-auto">
                         <button onClick={() => solicitarPase(c.numeroBic)} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full font-bold uppercase tracking-widest px-6 py-3 text-xs font-mono rounded shadow-sm flex justify-center items-center gap-2 transition-colors">
                            <QrCode size={16} /> Emitir Pase de Salida
                         </button>
                      </div>
                   </div>
                ))
             )}
          </div>
       </div>
    </div>
  );
}
