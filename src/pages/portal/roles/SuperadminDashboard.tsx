import { useState, useEffect } from "react";
import { Activity, AlertTriangle, ShieldAlert, BarChart3, Clock, TrendingUp, Ship, Loader2 } from "lucide-react";

export function SuperadminDashboard() {
  const [metrics, setMetrics] = useState({
     teus: 0,
     revenue: 0,
     shipsActives: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchData = async () => {
         try {
             // Fetch real data from SQL
             const [resFacturas, resEscalas, resContenedores] = await Promise.all([
                 fetch('/api/sql/facturas_pendientes'),
                 fetch('/api/sql/escalas?filters=' + JSON.stringify([{ type: 'where', field: 'estatusOperativo', value: 'ATRAQUE' }])),
                 fetch('/api/sql/contenedores')
             ]);
             
             let totalRevenue = 0;
             if (resFacturas.ok) {
                 const facturas = await resFacturas.json();
                 totalRevenue = facturas.reduce((acc: number, cur: any) => acc + parseFloat(cur.montoUsd || "0"), 0);
             }
             
             let shipsActives = 0;
             if (resEscalas.ok) {
                 const escalas = await resEscalas.json();
                 shipsActives = escalas.length;
             }
             
             let totalTeus = 0;
             if (resContenedores.ok) {
                 const contenedores = await resContenedores.json();
                 totalTeus = contenedores.reduce((acc: number, cur: any) => acc + (cur.tamano === '40' ? 2 : 1), 0);
             }

             setMetrics({
                 teus: totalTeus,
                 revenue: totalRevenue,
                 shipsActives: shipsActives
             });
         } catch (e) {
             console.error(e);
         } finally {
             setLoading(false);
         }
     };
     fetchData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black rounded-lg text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
             <Activity className="text-primary" /> Torre de Control Global {loading && <Loader2 size={16} className="animate-spin text-slate-500" />}
          </h1>
          <p className="text-slate-400 font-mono mt-1 text-sm bg-slate-800/50 px-3 py-1 rounded inline-block border border-slate-700">
             Vista Multipuerto | Rol: SUPERADMIN
          </p>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BarChart3 size={100} className="text-blue-500" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">TEUs Operados (Histórico)</p>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-4xl font-black text-blue-400">{metrics.teus.toLocaleString()}</h3>
            <span className="text-sm font-mono text-blue-200 mb-1">TEUs</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={100} className="text-emerald-500" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">Facturación Local Operada</p>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-4xl font-black text-emerald-400">${(metrics.revenue / 1000000).toFixed(6)}M</h3>
            <span className="text-sm font-mono text-emerald-200 mb-1">USD</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Ship size={100} className="text-purple-500" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 relative z-10">Buques Operando (ATRAQUE)</p>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-4xl font-black text-purple-400">{metrics.shipsActives}</h3>
            <span className="text-sm font-mono text-purple-200 mb-1">Activos</span>
          </div>
        </div>
      </div>

      {/* Bottlenecks Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden mt-6 flex flex-col items-center justify-center py-12">
          <ShieldAlert className="text-slate-700 mb-4" size={48} />
          <h3 className="font-bold text-slate-400 font-mono tracking-widest text-sm uppercase">Consola de Cuellos de Botella Limpia</h3>
          <p className="text-xs text-slate-500 mt-2 font-mono">No hay alertas SLA activas en los terminales.</p>
      </div>
    </div>
  );
}
