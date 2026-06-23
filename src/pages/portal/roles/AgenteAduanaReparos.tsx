import { useState, useEffect } from "react";
import { AlertCircle, Scale, FileWarning, CheckCircle } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function AgenteAduanaReparos() {
  const { user } = useAuth();
  const [reparos, setReparos] = useState<any[]>([]);

  const fetchReparos = async () => {
     if (!user?.rif) return;
     try {
       const empRes = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'rif', value: user.rif }])));
       const empData = await empRes.json();
       if (!empData || empData.length === 0) return;

       // Find contenedores for this agent
       const cRes = await fetch(`/api/sql/contenedores?filters=` + encodeURIComponent(JSON.stringify([
         { type: 'where', field: 'agenteAduanasId', value: empData[0].id }
       ])));
       const conts = await cRes.json();
       const bicList = conts.map((c:any) => c.numeroBic);

       if (bicList.length === 0) {
          setReparos([]);
          return;
       }

       // Find declarations for these BICs that have REPARO_ACTIVO
       const dRes = await fetch(`/api/sql/declaracionesAduaneras`);
       const allDecls = await dRes.json();
       const reps = allDecls.filter((d:any) => bicList.includes(d.contenedorBic) && d.estadoDeclaracion === 'REPARO_ACTIVO');
       
       setReparos(reps);
     } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchReparos();
  }, [user]);

  return (
    <div className="space-y-6">
       <div>
         <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Gestor de Disputas & Reparos</h2>
         <p className="text-foreground-muted text-sm mt-1">Resolución de actas de reparo levantadas durante aforos físicos y rectificación de declaraciones.</p>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded p-6 shadow-sm text-white">
          <div className="flex items-center gap-3 mb-2">
             <Scale className="text-amber-500" size={24} />
             <h3 className="font-bold font-mono tracking-widest text-sm text-slate-200">BANDEJA DE ACTAS PROCEDENTES</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
             Si el funcionario dictaminó que la carga difería de la DUA inicial, la mercancía quedará retenida (Hard-Lock) hasta la presentación de la DUA Complementaria/Rectificativa y el pago de Multas (Forma 16).
          </p>
       </div>

       <div className="grid grid-cols-1 gap-6 min-h-[400px]">
          {reparos.length === 0 ? (
             <div className="bg-white border border-border shadow-sm flex flex-col items-center justify-center text-slate-400 font-mono text-sm p-12">
                <CheckCircle size={48} className="text-emerald-200 mb-4" />
                No hay reparos activos ni disputas abiertas con las autoridades.
             </div>
          ) : (
             reparos.map(r => (
                <div key={r.id} className="bg-white border-2 border-red-500 shadow-sm rounded overflow-hidden">
                   <div className="bg-red-500 text-white p-3 font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <FileWarning size={16} /> REPARO ACTIVO - MULTA APLICADA EN DUA: {r.numeroDua}
                   </div>
                   <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                         <p className="font-bold text-secondary text-lg mb-1">Contenedor Implicado: {r.contenedorBic}</p>
                         <p className="text-sm font-mono text-slate-600 mb-4 bg-slate-50 p-3 rounded">Motivo: Discrepancia arancelaria según Acta de Reconocimiento. (Carga simulada para ejemplo).</p>
                         
                         <div className="space-y-4">
                            <div>
                               <p className="text-xs font-bold font-mono text-slate-500 mb-2">1. ADJUNTAR DUA RECTIFICATIVA</p>
                               <input type="file" className="text-sm bg-slate-50 border p-2 w-full rounded focus:outline-none" />
                            </div>
                            <div>
                               <p className="text-xs font-bold font-mono text-slate-500 mb-2">2. PLANILLA DE PAGO DE MULTA (BCV / TESORO NACIONAL)</p>
                               <input type="file" className="text-sm bg-slate-50 border p-2 w-full rounded focus:outline-none" />
                            </div>
                         </div>
                      </div>
                      
                      <div className="w-full md:w-1/3 flex flex-col justify-end">
                         <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold font-mono text-sm uppercase tracking-widest py-4 rounded shadow-sm transition-colors">
                            Solicitar Desbloqueo
                         </button>
                      </div>
                   </div>
                </div>
             ))
          )}
       </div>
    </div>
  );
}
