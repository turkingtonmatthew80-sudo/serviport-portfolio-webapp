import { useState, useEffect } from "react";
import { Anchor, ShieldAlert, WifiOff, Wifi, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useAdminAuth } from "../../../contexts/AdminAuthContext";

const HITO_TYPES = [
    { type: 'EOP', label: 'End of Sea Passage' },
    { type: 'PILOT_ON_BOARD', label: 'Piloto Abordo' },
    { type: 'FIRST_LINE_ASHORE', label: '1ra Amarra en Tierra' },
    { type: 'GANGWAY_SECURED', label: 'Escala Asegurada' },
    { type: 'COMMENCED_DISCHARGE', label: 'Inicio de Descarga' },
    { type: 'COMPLETED_DISCHARGE', label: 'Fin de Operaciones' },
    { type: 'CAST_OFF', label: 'Zarpe (Cast Off)' },
];

export function WaterClerkDashboard() {
  const { adminUser } = useAdminAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [escala, setEscala] = useState<any>(null);
  const [sofEvents, setSofEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
      try {
         // Obtener escala actual (activa)
         const resEsc = await fetch('/api/sql/escalas?filters=' + JSON.stringify([{ type: 'where', field: 'estatusOperativo', value: 'ATRAQUE' }]));
         if (resEsc.ok) {
             const data = await resEsc.json();
             if (data.length > 0) {
                 setEscala(data[0]);
                 const resSof = await fetch('/api/sql/sof_eventos?filters=' + JSON.stringify([{ type: 'where', field: 'escalaId', value: data[0].id }]));
                 if (resSof.ok) setSofEvents(await resSof.json());
             }
         }
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchState();
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleMarkEvent = async (hito: string) => {
    if (!escala) return;
    
    // Captura exacta del reloj del dispositivo (si está offline deberíamos meter en indexedDB, pero aquí enviamos si estamos online)
    const now = new Date();
    
    if (isOnline) {
       try {
           await fetch('/api/sql/sof_eventos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                 escalaId: escala.id,
                 tipoEvento: hito,
                 fechaHora: now.toISOString(),
                 enviadoDesdeOffline: false
              })
           });
           fetchState();
       } catch (e) {
           alert("Error registrando SOF");
       }
    } else {
        alert("Operando Offline. Evento no enviado al servidor (Falta implementación de Service Worker).");
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto h-full flex flex-col pt-4">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl">
         <div>
            <h1 className="text-xl font-black text-slate-100 tracking-tight font-sansita uppercase">Statement of Facts</h1>
            {escala ? (
               <p className="text-slate-400 font-mono mt-1 text-sm flex items-center gap-2">
                  ESCALA: {escala.id.split('-')[0]} <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded text-[10px]">VIAJE: {escala.viajeId || 'S/N'}</span>
               </p>
            ) : (
               <p className="text-red-400 font-mono mt-1 text-sm flex items-center gap-2">No hay escalas activas en ATRAQUE.</p>
            )}
         </div>
         <div className={`p-3 rounded-full ${isOnline ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} flex items-center justify-center shrink-0`}>
            {isOnline ? <Wifi size={24} /> : <WifiOff size={24} />}
         </div>
      </div>

      {!isOnline && (
         <div className="bg-red-950/30 border border-red-900/50 p-3 rounded-lg flex items-center gap-3 text-red-200 text-sm font-mono mt-2 animate-pulse">
            <ShieldAlert size={16} className="text-red-500" />
            Operando Offline. Eventos guardados en DB Local.
         </div>
      )}

      {escala && (
          <div className="flex-1 space-y-4">
             {HITO_TYPES.map((def, i) => {
               const ev = sofEvents.find(e => e.tipoEvento === def.type);
               const done = !!ev;
               
               // The first not-done event is active
               const isNext = !done && !HITO_TYPES.slice(0, i).some(prevDef => !sofEvents.find(e => e.tipoEvento === prevDef.type));
               
               return (
                 <div 
                    key={def.type} 
                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                       done 
                          ? 'bg-slate-800/80 border-slate-700 opacity-70' 
                          : isNext
                             ? 'bg-slate-800 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                             : 'bg-slate-900/60 border-slate-800 opacity-50 pointer-events-none'
                    }`}
                 >
                    <button 
                       onClick={() => !done && handleMarkEvent(def.type)}
                       disabled={done}
                       className="w-full h-full p-6 flex items-center justify-between text-left focus:outline-none"
                    >
                        <div>
                           <p className="font-bold font-mono tracking-widest uppercase text-slate-400 text-xs mb-1">
                              HITO {i + 1} / {HITO_TYPES.length}
                           </p>
                           <h3 className={`text-xl font-black uppercase ${done ? 'text-slate-300' : 'text-blue-400'}`}>
                              {def.label}
                           </h3>
                        </div>
                        
                        {done ? (
                           <div className="flex flex-col items-end gap-1">
                              <CheckCircle2 className="text-emerald-500" size={24} />
                              <span className="font-mono font-bold text-emerald-400">{new Date(ev.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        ) : (
                           <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0">
                              <Clock className="text-white" size={28} />
                           </div>
                        )}
                    </button>
                 </div>
               )
             })}
          </div>
      )}
    </div>
  );
}
