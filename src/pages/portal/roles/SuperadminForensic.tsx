import { useState } from "react";
import { Search, ShieldAlert, GitMerge, FileText, Filter, AlertTriangle } from "lucide-react";

export function SuperadminForensic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs] = useState([
    { id: '1', cycleId: 'BKG-2026-0091', timestamp: '2026-05-18 14:32:00', actorId: 'U-8812', rol: 'INSPECTOR_GARITA', accion: 'Aprobación EIR (Gate-In)', gravedad: 'INFO_VERDE' },
    { id: '2', cycleId: 'VES-CAB-88A2', timestamp: '2026-05-18 12:45:11', actorId: 'U-0019', rol: 'WATER_CLERK', accion: 'Registro Descarga Bulto SOBRANTE', gravedad: 'WARNING_AMARILLO' },
    { id: '3', cycleId: 'VES-CAB-88A2', timestamp: '2026-05-18 09:15:00', actorId: 'U-0001', rol: 'SUPERADMIN', accion: 'SOFT DELETE MAESTRO INVOCADO', gravedad: 'CRITICAL_ROJO' },
    { id: '4', cycleId: 'MBL-HL-9981', timestamp: '2026-05-17 16:20:44', actorId: 'U-1122', rol: 'CONSOLIDADOR', accion: 'Asignación HBL a Importador Falsa', gravedad: 'CRITICAL_ROJO' },
    { id: '5', cycleId: 'BKG-2026-0091', timestamp: '2026-05-17 10:00:22', actorId: 'U-3321', rol: 'YARD_PLANNER', accion: 'Reubicación de Patio (A1->B2)', gravedad: 'INFO_VERDE' },
  ]);

  const [killSwitchOpen, setKillSwitchOpen] = useState(false);
  const [killId, setKillId] = useState("");

  const filteredLogs = logs.filter(l => 
    l.cycleId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black rounded-lg text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
             <FileText className="text-primary" /> Monitor Forense (Audit Desk)
          </h1>
          <p className="text-slate-400 font-mono mt-1 text-sm bg-slate-800/50 px-3 py-1 rounded inline-block border border-slate-700">
             Registro Transaccional Inmutable | PostgreSQL LWW
          </p>
        </div>
        
        <button 
          onClick={() => setKillSwitchOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-black tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
        >
          <ShieldAlert size={18} /> KILL SWITCH (CASCADA)
        </button>
      </div>

      {killSwitchOpen && (
        <div className="bg-red-950/40 border border-red-900/50 p-6 rounded-lg mb-8 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
           <div className="flex items-start gap-4">
              <AlertTriangle className="text-red-500 shrink-0 mt-1" size={24} />
              <div className="w-full">
                 <h3 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-2">Peligro: Borrado Lógico en Cascada</h3>
                 <p className="text-sm text-red-200/80 mb-4 font-mono">
                    Ingrese el ID Maestro (Ej. Escala ID). Esta acción ejecutará un UPDATE en Postgres seteando `is_archived = TRUE` al maestro y a todos sus dependientes (contenedores, facturas, citas). Desaparecerá de todas las vistas del sistema inmediatamente.
                 </p>
                 <div className="flex flex-col md:flex-row gap-3">
                    <input 
                      type="text" 
                      placeholder="ID Maestro a purgar..."
                      value={killId}
                      onChange={(e) => setKillId(e.target.value)}
                      className="bg-slate-900 border border-red-800/50 text-red-100 px-4 py-2 rounded font-mono text-sm w-full md:w-96 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                    <div className="flex gap-2">
                       <button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded uppercase tracking-widest text-xs transition-colors">
                          Ejecutar Purga
                       </button>
                       <button onClick={() => setKillSwitchOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded uppercase tracking-widest text-xs transition-colors border border-slate-700">
                          Cancelar
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Advanced Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center shadow-xl">
         <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
               type="text" 
               placeholder="Buscar por Cycle ID, Actor, Acción..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm w-full font-mono text-slate-200 focus:outline-none focus:border-primary"
            />
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 flex-1 md:flex-none transition-colors">
               <Filter size={14} /> Filtro Avanzado
            </button>
            <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 flex-1 md:flex-none transition-colors">
               <GitMerge size={14} /> Reconstruir Flujo
            </button>
         </div>
      </div>

      {/* Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-x-auto">
         <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead>
               <tr className="bg-slate-800/50 border-b border-slate-700 text-slate-400 font-mono text-xs uppercase tracking-widest">
                  <th className="p-4 font-normal">Timestamp</th>
                  <th className="p-4 font-normal">Gravedad</th>
                  <th className="p-4 font-normal">Cycle ID</th>
                  <th className="p-4 font-normal">Actor (Rol)</th>
                  <th className="p-4 font-normal">Acción Transaccional</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
               {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                     <td className="p-4 font-mono text-xs text-slate-500">{log.timestamp}</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono tracking-widest uppercase border ${
                           log.gravedad === 'CRITICAL_ROJO' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                           log.gravedad === 'WARNING_AMARILLO' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                           'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                           {log.gravedad.split('_')[0]}
                        </span>
                     </td>
                     <td className="p-4 font-mono font-bold text-blue-400 cursor-pointer hover:underline">{log.cycleId}</td>
                     <td className="p-4 font-mono text-xs">
                        <span className="text-slate-200">{log.actorId}</span><br />
                        <span className="text-slate-500">{log.rol}</span>
                     </td>
                     <td className="p-4">
                        <p className={`font-medium ${log.gravedad === 'CRITICAL_ROJO' ? 'text-red-400' : 'text-slate-300'}`}>
                           {log.accion}
                        </p>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
