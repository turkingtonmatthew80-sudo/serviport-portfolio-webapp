import { useState, useEffect } from "react";
import { Ship, Anchor, Droplets, Trash2, Power, Settings, Loader2 } from "lucide-react";

export function HusbandryBoardDashboard() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServicios = async () => {
     try {
        const res = await fetch('/api/sql/servicios_husbandry?filters=' + JSON.stringify([{ type: 'orderBy', field: 'fechaHoraSolicitud', direction: 'desc' }]));
        if (res.ok) setServicios(await res.json());
     } catch (e) {
        console.error(e);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
     fetchServicios();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
     try {
        await fetch(`/api/sql/servicios_husbandry/${id}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ estado: newStatus })
        });
        fetchServicios();
     } catch (e) {
        alert("Error actualizando estado.");
     }
  };

  const getIconForType = (tipo: string) => {
     if (tipo === 'SUMINISTRO_AGUA' || tipo === 'AGUA') return { icon: Droplets, color: 'text-blue-500' };
     if (tipo === 'RECOLECCION_DESECHOS' || tipo === 'MARPOL') return { icon: Trash2, color: 'text-amber-500' };
     return { icon: Anchor, color: 'text-slate-400' };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
               <Ship /> Atención a Buques (Husbandry)
            </h1>
            <p className="text-slate-400 font-mono mt-1 text-sm">
               Coordinación de servicios auxiliares y logística presencial.
            </p>
         </div>
         {loading && <Loader2 className="animate-spin text-slate-500" />}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start overflow-y-auto pr-2">
         {servicios.length === 0 && !loading && (
            <p className="col-span-2 text-center text-slate-500 font-mono text-sm py-10">No hay servicios de husbandry reportados.</p>
         )}
         {servicios.map(srv => {
            const { icon: Icon, color } = getIconForType(srv.tipoServicio);
            return (
               <div key={srv.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                  <div className="p-4 bg-slate-800/30 border-b border-slate-800 flex justify-between items-center">
                     <div>
                        <h3 className="font-black text-lg text-slate-100 uppercase tracking-widest">Escala: {srv.escalaId?.split('-')[0] || 'N/A'}</h3>
                        <p className="font-mono text-[10px] uppercase text-slate-500">Buque ID: {srv.escalaId || 'Desconocido'}</p>
                     </div>
                     <span className={`font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${srv.estado === 'SOLICITADO' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'}`}>
                        {srv.estado.replace('_', ' ')}
                     </span>
                  </div>
                  
                  <div className="p-4 space-y-3 relative">
                     <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 p-3 rounded-lg">
                        <div className={`p-2 bg-slate-900 rounded-full ${color}`}>
                           <Icon size={20} />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">{srv.tipoServicio}</p>
                           <p className="text-xs text-slate-500 font-mono">{srv.detallesRequerimiento || 'Sin detalles adicionales'}</p>
                        </div>
                     </div>

                     <button onClick={() => updateStatus(srv.id, srv.estado === 'SOLICITADO' ? 'EN_PROCESO' : 'COMPLETADO')} className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-black font-mono tracking-widest text-xs uppercase py-3 rounded border justify-center border-slate-700 flex items-center gap-2 transition-colors">
                        {srv.estado === 'SOLICITADO' ? 'Marcar En Proceso' : 'Marcar Completado'}
                     </button>
                  </div>
               </div>
            );
         })}
      </div>
    </div>
  );
}
