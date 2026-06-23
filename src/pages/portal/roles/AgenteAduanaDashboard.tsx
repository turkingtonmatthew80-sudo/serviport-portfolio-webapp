import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertTriangle, FileText, Anchor } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function AgenteAduanaDashboard() {
  const { user } = useAuth();
  const [contenedores, setContenedores] = useState<any[]>([]);
  const [declaraciones, setDeclaraciones] = useState<any[]>([]);

  useEffect(() => {
     const fetchData = async () => {
        if (!user?.rif) return;
        try {
           const empRes = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'rif', value: user.rif }])));
           const empData = await empRes.json();
           if (!empData || empData.length === 0) return;
           
           const cRes = await fetch(`/api/sql/contenedores?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'agenteAduanasId', value: empData[0].id }])));
           const conts = await cRes.json();
           setContenedores(conts);

           const dRes = await fetch(`/api/sql/declaracionesAduaneras`);
           setDeclaraciones(await dRes.json());
        } catch(e) { console.error(e); }
     };
     fetchData();
  }, [user]);

  const stats = {
     total: contenedores.length,
     liberados: contenedores.filter(c => declaraciones.some(d => d.contenedorBic === c.numeroBic && d.estadoDeclaracion === 'LEVANTE_OTORGADO')).length,
     verde: contenedores.filter(c => c.selectividadSeniat === 'VERDE' && !declaraciones.some(d => d.contenedorBic === c.numeroBic && d.estadoDeclaracion === 'LEVANTE_OTORGADO')).length,
     amarillo: contenedores.filter(c => c.selectividadSeniat === 'AMARILLO').length,
     rojo: contenedores.filter(c => c.selectividadSeniat === 'ROJO' && !declaraciones.some(d => d.contenedorBic === c.numeroBic && d.estadoDeclaracion === 'LEVANTE_OTORGADO')).length
  };

  const handleSeed = async () => {
     try {
        await fetch("/api/aduanas/seed-demo", { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ rif: user?.rif, razonSocial: user?.razonSocial }) });
        window.location.reload();
     } catch(e) {}
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
           <h1 className="text-2xl font-black text-secondary tracking-tight font-sansita uppercase">
             Triage Desk / Prioridades
           </h1>
           <p className="text-foreground-muted font-mono mt-1 text-sm">
             {user?.razonSocial || "Agencia Aduanal C.A."} | RIF: {user?.rif}
           </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
           {contenedores.length === 0 && (
              <button onClick={handleSeed} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-mono text-xs px-4 py-2 uppercase tracking-widest rounded transition-colors">
                 Cargar Datos de Prueba
              </button>
           )}
           <div className="flex items-center gap-3 bg-white p-3 border border-border rounded shadow-sm">
             <span className="flex h-3 w-3 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
             </span>
             <span className="text-xs font-bold font-mono tracking-widest text-slate-600">SIDUNEA: ONLINE</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-slate-900 border border-slate-800 text-white rounded p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-1">TOTAL DE CARGAS</p>
            <h3 className="text-3xl font-black">{stats.total}</h3>
         </div>
         <div className="bg-emerald-50 border border-emerald-200 shadow-sm p-4 rounded flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-emerald-800 font-mono tracking-widest uppercase mb-1 flex items-center gap-1"><CheckCircle size={10}/> LEVANTE OTORGADO</p>
            <h3 className="text-3xl font-black text-emerald-600">{stats.liberados}</h3>
         </div>
         <div className="bg-yellow-50 border border-yellow-200 shadow-sm p-4 rounded flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-yellow-800 font-mono tracking-widest uppercase mb-1 flex items-center gap-1"><AlertTriangle size={10}/> CANAL AMARILLO</p>
            <h3 className="text-3xl font-black text-yellow-600">{stats.amarillo}</h3>
         </div>
         <div className="bg-red-50 border border-red-200 shadow-sm p-4 rounded flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-red-800 font-mono tracking-widest uppercase mb-1 flex items-center gap-1"><AlertTriangle size={10}/> CANAL ROJO (PENDIENTE)</p>
            <h3 className="text-3xl font-black text-red-600">{stats.rojo}</h3>
         </div>
      </div>

      <div className="bg-white border border-border shadow-sm rounded overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          <h3 className="font-bold text-secondary font-mono tracking-widest text-sm text-slate-600">RELOJ CONTRA DEMURRAGE (FREE TIME)</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar BIC..."
              className="pl-9 pr-4 py-2 border border-border rounded text-sm w-full font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
             <thead className="text-[10px] text-foreground-muted uppercase tracking-widest border-b border-border font-mono">
                <tr>
                   <th className="px-6 py-4 font-bold">Contenedor / Tipo</th>
                   <th className="px-6 py-4 font-bold">Selectividad</th>
                   <th className="px-6 py-4 font-bold">Estado Legal</th>
                   <th className="px-6 py-4 font-bold text-right">Tiempo Libre Restante</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-border">
                {contenedores.length === 0 ? (
                  <tr>
                     <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-mono">No hay cargas asignadas en este momento.</td>
                  </tr>
                ) : (
                  contenedores.map(c => {
                     const dec = declaraciones.find(d => d.contenedorBic === c.numeroBic);
                     const statusLabel = dec ? dec.estadoDeclaracion : 'NO TRANSMITIDA';
                     const selectividad = c.selectividadSeniat || 'NO ASIGNADA';
                     const rDays = Math.floor(Math.random() * 8) + 1; // Fake free time
                     return (
                        <tr key={c.numeroBic} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                             <p className="font-bold text-secondary font-mono flex items-center gap-2"><Anchor size={14} className="text-blue-500"/> {c.numeroBic}</p>
                             <p className="text-xs text-foreground-muted">{c.tipoIso}</p>
                           </td>
                           <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono tracking-widest uppercase ${
                                selectividad === 'VERDE' ? 'bg-emerald-100 text-emerald-800' :
                                selectividad === 'AMARILLO' ? 'bg-yellow-100 text-yellow-800' :
                                selectividad === 'ROJO' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'
                             }`}>
                                {selectividad}
                             </span>
                           </td>
                           <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">
                              {statusLabel}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className={`font-black font-mono text-lg ${rDays <= 2 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                                 {rDays} DÍAS
                              </span>
                           </td>
                        </tr>
                     )
                  })
                )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
