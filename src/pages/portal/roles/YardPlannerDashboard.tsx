import { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Group } from "react-konva";
import { Map, Zap, Layers, AlertOctagon, Filter, CheckCircle2 } from "lucide-react";

// Simulamos los datos que vendrían del endpoint /api/tos/patio/mapa-estado
const RENDER_WIDTH = 800;
const RENDER_HEIGHT = 450;
const BLOCK_W = 200;
const BLOCK_H = 100;

export function YardPlannerDashboard() {
  const [filter, setFilter] = useState<'ALL' | 'HEAVY' | 'IMO' | 'ABANDONADOS'>('ALL');
  
  // Fake blocks for visualization
  const blocks = [
    { id: 'BLOQUE A (IMP)', x: 50, y: 50, capacity: 500, current: 480, type: 'IMPORTACION' },
    { id: 'BLOQUE B (EXP)', x: 300, y: 50, capacity: 500, current: 120, type: 'EXPORTACION' },
    { id: 'BLOQUE REEFER', x: 550, y: 50, capacity: 200, current: 198, type: 'REEFER' },
    { id: 'AFORO (SENIAT)', x: 50, y: 200, capacity: 50, current: 45, type: 'AFORO_SENIAT' },
    { id: 'IMO BLOQUE', x: 550, y: 200, capacity: 100, current: 20, type: 'IMO_PELIGROSOS' },
  ];

  const containersMock = [
     { bic: 'MSKU9911223', block: 'BLOQUE A (IMP)', type: 'HEAVY', bx: 10, by: 10 },
     { bic: 'HLXU1234567', block: 'BLOQUE A (IMP)', type: 'NORMAL', bx: 30, by: 10 },
     { bic: 'CMAX8899001', block: 'IMO BLOQUE', type: 'IMO', bx: 10, by: 10, alert: true },
     { bic: 'SUDU0000000', block: 'AFORO (SENIAT)', type: 'NORMAL', bx: 10, by: 10 },
     { bic: 'TGHU1111111', block: 'BLOQUE B (EXP)', type: 'ABANDONADOS', bx: 10, by: 10 },
  ];

  const getContainerColor = (type: string, isAlert: boolean) => {
     if (isAlert) return '#000000'; // HOLD / BLOQUEADO
     if (filter === 'ALL') {
        if (type === 'IMO') return '#ef4444'; // Red
        if (type === 'HEAVY') return '#f59e0b'; // Amber
        return '#3b82f6'; // Blue
     }
     if (filter === 'HEAVY') return type === 'HEAVY' ? '#f59e0b' : '#1e293b';
     if (filter === 'IMO') return type === 'IMO' ? '#ef4444' : '#1e293b';
     if (filter === 'ABANDONADOS') return type === 'ABANDONADOS' ? '#000000' : '#1e293b';
     return '#3b82f6';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black rounded-lg text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
           <Map className="text-primary" /> Planificador de Patio (TOS Command Center)
        </h1>
        <p className="text-slate-400 font-mono mt-1 text-sm bg-slate-800/50 px-3 py-1 rounded inline-block border border-slate-700">
           Grid 3D | Renderizado Konva | Work Orders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* TOS 2D Viewport */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col h-[600px]">
           <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="font-bold text-slate-200 font-mono tracking-widest uppercase text-sm flex items-center gap-2">
                 <Layers size={16} className="text-blue-500" /> Topología de Patio (Heatmaps)
              </h3>
              <div className="flex gap-2">
                 <button onClick={() => setFilter('ALL')} className={`px-3 py-1 text-xs font-bold rounded font-mono transition-colors ${filter === 'ALL' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Normal</button>
                 <button onClick={() => setFilter('HEAVY')} className={`px-3 py-1 text-xs font-bold rounded font-mono transition-colors ${filter === 'HEAVY' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Peso (&gt;25T)</button>
                 <button onClick={() => setFilter('IMO')} className={`px-3 py-1 text-xs font-bold rounded font-mono transition-colors ${filter === 'IMO' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Peligrosos</button>
                 <button onClick={() => setFilter('ABANDONADOS')} className={`px-3 py-1 text-xs font-bold rounded font-mono transition-colors ${filter === 'ABANDONADOS' ? 'bg-slate-950 text-slate-400 border border-slate-700' : 'bg-slate-800 text-slate-400'}`}>Abandono</button>
              </div>
           </div>

           <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center cursor-move" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              <Stage width={RENDER_WIDTH} height={RENDER_HEIGHT}>
                 <Layer>
                    {blocks.map(b => (
                       <Group key={b.id} x={b.x} y={b.y}>
                          <Rect
                             width={BLOCK_W}
                             height={BLOCK_H}
                             fill="#0f172a"
                             stroke="#334155"
                             strokeWidth={2}
                             cornerRadius={4}
                          />
                          <Text
                             x={10} y={10}
                             text={b.id}
                             fill="#64748b"
                             fontFamily="monospace"
                             fontSize={12}
                             fontStyle="bold"
                          />
                          <Text
                             x={10} y={BLOCK_H - 20}
                             text={`${Math.round((b.current / b.capacity) * 100)}% OCC`}
                             fill={b.current / b.capacity > 0.9 ? "#ef4444" : "#10b981"}
                             fontFamily="monospace"
                             fontSize={10}
                             fontStyle="bold"
                          />
                       </Group>
                    ))}

                    {containersMock.map((c, i) => {
                       const block = blocks.find(b => b.id === c.block);
                       if (!block) return null;
                       return (
                          <Group key={i} x={block.x + c.bx} y={block.y + 25 + c.by} draggable>
                             <Rect
                                width={18} height={10}
                                fill={getContainerColor(c.type, c.alert || false)}
                                cornerRadius={1}
                                stroke={c.alert ? "#ef4444" : undefined}
                                strokeWidth={c.alert ? 2 : 0}
                             />
                             {c.alert && (
                                <Text x={2} y={-8} text="🔒" fontSize={8} />
                             )}
                          </Group>
                       )
                    })}
                 </Layer>
              </Stage>
              
              <div className="absolute bottom-4 left-4 bg-slate-900/80 border border-slate-700 p-3 rounded backdrop-blur text-[10px] font-mono text-slate-400">
                 <p>Performance: JSON Aggregation (PostgreSQL)</p>
                 <p>Render.time: {Math.random() < 0.5 ? '12ms' : '15ms'}</p>
              </div>
           </div>
        </div>

        {/* Action Panel / Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-5 flex flex-col h-[600px] lg:col-span-1">
           <h3 className="font-bold text-slate-200 font-mono tracking-widest uppercase text-sm flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Zap size={16} className="text-amber-500" /> Órdenes y Alertas
           </h3>

           <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Alerta de Aforo SENIAT (Freno de Cascada) */}
              <div className="bg-red-950/30 border border-red-500/50 rounded-lg p-3 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-10"><AlertOctagon size={40} className="text-red-500" /></div>
                 <h4 className="text-red-400 font-bold uppercase tracking-widest text-xs font-mono mb-1">Traslado Mandatorio</h4>
                 <p className="text-slate-300 text-sm font-medium mb-3">MSKU9911223 Canal Rojo (SENIAT)</p>
                 <button className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded text-[10px] font-bold uppercase font-mono tracking-widest transition-colors flex items-center justify-center gap-2">
                    <CheckCircle2 size={14} /> Emitir Orden: AFORO
                 </button>
              </div>

              {/* Remoción Improductiva */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                 <h4 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-mono mb-1">Remoción Detectada</h4>
                 <p className="text-slate-300 text-xs mb-3">HLXU1234567 requiere salir hoy, pero está en Nivel 1 (Fondo).</p>
                 <button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-1.5 rounded text-[10px] font-bold uppercase font-mono tracking-widest transition-colors">
                    Generar Remociones (3 Cajas)
                 </button>
              </div>
              
              {/* Hold Authority */}
              <div className="bg-[#111] border border-slate-700 rounded-lg p-3">
                 <h4 className="text-slate-500 font-bold uppercase tracking-widest text-[10px] font-mono mb-1 flex items-center gap-1"><span className="text-red-500">🔒</span> HOLD LEGAL ACTIVO</h4>
                 <p className="text-slate-400 text-xs">CMAX8899001 Inmovilizado por mandato judicial (GNB).</p>
                 <p className="mt-2 text-[9px] text-slate-600 font-mono border-t border-slate-800 pt-2">Las órdenes de carga a gandola están deshabilitadas.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
