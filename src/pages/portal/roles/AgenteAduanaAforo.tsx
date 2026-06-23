import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Hammer, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function AgenteAduanaAforo() {
  const { user } = useAuth();
  const [declaracionesEnRojo, setDeclaracionesEnRojo] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState("");

  const refreshAforos = async () => {
     if (!user?.rif) return;
     try {
       // Ideally we join empresas, contenedores, and declaraciones. For simplicity here:
       const empRes = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'rif', value: user.rif }])));
       const empData = await empRes.json();
       if (!empData || empData.length === 0) return;

       // Find contenedores for this agent that are ROJO
       const cRes = await fetch(`/api/sql/contenedores?filters=` + encodeURIComponent(JSON.stringify([
         { type: 'where', field: 'agenteAduanasId', value: empData[0].id },
         { type: 'where', field: 'selectividadSeniat', value: 'ROJO' }
       ])));
       const conts = await cRes.json();
       const bicList = conts.map((c:any) => c.numeroBic);

       if (bicList.length === 0) {
          setDeclaracionesEnRojo([]);
          return;
       }

       // Find declarations for these BICs that don't have levante
       const dRes = await fetch(`/api/sql/declaracionesAduaneras`);
       const allDecls = await dRes.json();
       const reds = allDecls.filter((d:any) => bicList.includes(d.contenedorBic) && d.estadoDeclaracion !== 'LEVANTE_OTORGADO');
       
       setDeclaracionesEnRojo(reds);

     } catch(e) { console.error(e); }
  };

  useEffect(() => {
    refreshAforos();
  }, [user]);

  const solicitarPosicionamiento = (dua: string) => {
     setStatusMsg(`Orden de movimiento al patio de revisión generada para DUA ${dua}. Se cobrarán maniobras en la factura de la naviera/cliente.`);
     setTimeout(() => setStatusMsg(""), 5000);
  };

  return (
    <div className="space-y-6">
       <div>
         <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Consola de Aforo Físico</h2>
         <p className="text-foreground-muted text-sm mt-1">Gestión de Reconocimiento Físico para contenedores sorteados con Canal Rojo.</p>
       </div>

       {statusMsg && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded font-mono text-sm font-bold shadow-sm">
             ⭐ {statusMsg}
          </div>
       )}

       <div className="bg-white border border-border shadow-sm p-6 min-h-[500px]">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm mb-6 border-b pb-2 flex items-center gap-2">
             <AlertTriangle className="text-red-500" /> CANAL ROJO (PENDIENTES DE INSPECCIÓN)
          </h3>
          
          <div className="space-y-4">
             {declaracionesEnRojo.length === 0 ? (
                <div className="text-center p-12 text-slate-400 border-2 border-dashed rounded font-mono text-sm">
                   No existen declaraciones en Canal Rojo activas en su jurisdicción.
                </div>
             ) : (
                declaracionesEnRojo.map(d => (
                   <div key={d.id} className="bg-red-50/50 border border-red-200 rounded p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                         <div className="bg-red-100 text-red-600 p-3 rounded shadow-sm">
                            <Hammer size={24} />
                         </div>
                         <div>
                            <p className="font-bold font-mono text-secondary mb-1">DUA: {d.numeroDua}</p>
                            <p className="text-sm font-mono text-slate-600">B/L - BIC: {d.contenedorBic}</p>
                            <p className="text-xs text-red-700 uppercase tracking-widest font-bold mt-2 flex items-center gap-1">
                               <Clock size={12} /> BLOQUEADO HASTA AFORO POSITIVO
                            </p>
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                         <button onClick={() => solicitarPosicionamiento(d.numeroDua)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 text-xs font-bold font-mono uppercase tracking-widest rounded shadow-sm">
                            Solicitar Posicionamiento (Grúa)
                         </button>
                         <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold font-mono uppercase tracking-widest rounded shadow-sm flex items-center justify-center gap-1">
                            <ShieldCheck size={14} /> Subir Acta Fiscal (Conforme)
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
