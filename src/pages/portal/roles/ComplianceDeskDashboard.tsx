import { useState, useEffect } from "react";
import { FileEdit, ShieldAlert, Send, CheckCircle2, History, Loader2 } from "lucide-react";

export function ComplianceDeskDashboard() {
  const [correcciones, setCorrecciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCorrecciones = async () => {
     try {
        const res = await fetch('/api/sql/bitacora_correcciones_bl?filters=' + JSON.stringify([{ type: 'where', field: 'estado', value: 'PENDIENTE' }]));
        if (res.ok) setCorrecciones(await res.json());
     } catch (e) {
        console.error(e);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
     fetchCorrecciones();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
     try {
        await fetch(`/api/sql/bitacora_correcciones_bl/${id}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ estado: newStatus })
        });
        fetchCorrecciones();
     } catch (e) {
        alert("Error actualizando corrección.");
     }
  };

  const DiffViewer = ({ oldValue, newValue }: { oldValue: string, newValue: string }) => (
      <div className="font-mono text-sm mt-3 bg-slate-950 border border-slate-800 rounded p-4">
         <div className="text-red-400 bg-red-950/30 px-2 py-1 flex mb-1">- {oldValue || '(Vacío)'}</div>
         <div className="text-emerald-400 bg-emerald-950/30 px-2 py-1 flex">+ {newValue || '(Vacío)'}</div>
      </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
               <FileEdit /> Cartas de Corrección (Compliance)
            </h1>
            <p className="text-slate-400 font-mono mt-1 text-sm">
               Gestión de Hard Locks Aduanales e interactividad con el SENIAT.
            </p>
         </div>
         {loading && <Loader2 className="animate-spin text-slate-500" />}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto">
         {correcciones.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 p-8 text-center space-y-4">
               <ShieldAlert size={48} />
               <p className="font-mono uppercase tracking-widest font-bold text-sm">Todo en Orden</p>
               <p className="text-[10px]">No hay cartas de corrección pendientes de SENIAT.</p>
            </div>
         )}
         {correcciones.map(c => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
               <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                  <div className="flex items-center gap-3">
                     <span className="bg-blue-900/50 text-blue-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest font-mono">
                        BL ID: {c.blId ? c.blId.split('-')[0] : 'N/A'}
                     </span>
                     <span className="text-slate-300 font-bold blur-[2px] hover:blur-none transition-all cursor-help" title="Justificación oculta">Motivo: {c.justificacion}</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-1 font-mono uppercase tracking-widest font-bold rounded flex items-center gap-1">
                     <History size={12}/> Oficializado
                  </span>
               </div>
               
               <div className="p-6">
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-500 font-mono">Campo a Modificar: <span className="text-white">{c.campoModificado}</span></p>
                  <DiffViewer oldValue={c.valorAnterior} newValue={c.valorNuevo} />

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                     <button onClick={() => updateStatus(c.id, 'APROBADO_ADUANA')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold tracking-widest uppercase text-xs transition-colors flex items-center justify-center gap-2 font-mono">
                        <Send size={16} /> Elevar al SENIAT (Corrección)
                     </button>
                     <button onClick={() => updateStatus(c.id, 'RECHAZADO')} className="sm:w-auto px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-lg font-bold tracking-widest uppercase text-xs transition-colors flex items-center justify-center gap-2 font-mono border border-slate-700">
                        <ShieldAlert size={16} /> Rechazar Petición
                     </button>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-3 font-mono uppercase">
                     Nota: Esta acción genera un Hard Lock en la DB hasta que Aduana responda. Puede generar multas.
                  </p>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
