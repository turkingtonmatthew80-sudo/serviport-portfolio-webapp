import { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Group, Circle } from "react-konva";
import { Map, Layers, RadioReceiver, SlidersHorizontal, Trash2 } from "lucide-react";

const RENDER_WIDTH = 900;
const RENDER_HEIGHT = 500;
const BLOCK_W = 200;
const BLOCK_H = 100;

export function DigitalTwinDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingestionRate, setIngestionRate] = useState(100);

  // Fake blocks for visualization
  const blocks = [
    { id: 'BLOQUE A (IMP)', x: 50, y: 50 },
    { id: 'BLOQUE B (EXP)', x: 300, y: 50 },
    { id: 'BLOQUE REEFER', x: 550, y: 50 },
    { id: 'ZONA DE FONDEO (AIS)', x: 50, y: 250 },
  ];

  // Mocking the backend for preview purposes since DB might be empty
  const mockHydrate = () => {
      const dbRows = [
         // Commercial Real
         { bic: 'MSKU1122334', bloque_id: 'BLOQUE A (IMP)', bay: 10, is_simulated: false },
         { bic: 'MSC9988221', bloque_id: 'BLOQUE B (EXP)', bay: 20, is_simulated: false },
         
         // Simulated Ghosts
         { bic: 'SIM-99121', bloque_id: 'BLOQUE A (IMP)', bay: 15, is_simulated: true },
         { bic: 'SIM-99122', bloque_id: 'BLOQUE A (IMP)', bay: 20, is_simulated: true },
         { bic: 'SIM-99123', bloque_id: 'BLOQUE B (EXP)', bay: 50, is_simulated: true },
         { bic: 'VESSEL-01', bloque_id: 'ZONA DE FONDEO (AIS)', bay: 10, is_simulated: true, type: 'vessel' }
      ];
      setData(dbRows);
      setLoading(false);
  };

  useEffect(() => {
     // En una aplicación real: fetch('/api/gemelo-digital/mapa-unificado')
     mockHydrate();

     // Fake WSS update
     const interval = setInterval(() => {
         setData(prev => prev.map(item => {
             if (item.type === 'vessel' && item.is_simulated) {
                 return { ...item, bay: item.bay + (Math.random() > 0.5 ? 2 : -1) };
             }
             return item;
         }));
     }, 3000);
     return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto flex flex-col pt-4">
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl space-y-2 shrink-0">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-black text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
                  <RadioReceiver className="text-cyan-400" /> Gemelo Digital & Shadow Mapping
               </h1>
               <p className="text-slate-400 font-mono mt-1 text-sm bg-slate-800/50 px-3 py-1 rounded inline-flex items-center gap-2 border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  AIS Live Telemetry + Simulador PostgreSQL Estocástico
               </p>
            </div>
            
            <div className="flex gap-3">
               <button 
                  onClick={() => alert("Simulando eliminación de contenedores fantasma (simulados) de la BD SQL...")}
                  className="bg-cyan-950/30 border border-cyan-800/50 hover:bg-cyan-900/40 text-cyan-400 font-mono uppercase tracking-widest text-xs font-bold py-2 px-4 rounded transition-all flex items-center gap-2">
                  <Trash2 size={16} /> Purgar Fantasmas
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Renderizador Konva 2D */}
         <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col h-[600px] relative">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
               <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg flex flex-col gap-2 shadow-2xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest">
                     <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Comercial Real (Prioridad Absoluta)
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                     <span className="w-3 h-3 bg-transparent border-2 border-cyan-400 border-dashed rounded-sm"></span> Gemelo Fantasma (Cedente)
                  </div>
               </div>
            </div>

            <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center cursor-move" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
               <Stage width={RENDER_WIDTH} height={RENDER_HEIGHT}>
                  {/* Capa 0: Asfalto base y bloques (Caché estática) */}
                  <Layer listening={false}>
                     {blocks.map(b => (
                        <Group key={b.id} x={b.x} y={b.y}>
                           <Rect width={BLOCK_W} height={BLOCK_H} fill="#0f172a" stroke="#334155" strokeWidth={2} cornerRadius={8} />
                           <Text x={10} y={10} text={b.id} fill="#475569" fontFamily="monospace" fontSize={14} fontStyle="bold" />
                        </Group>
                     ))}
                  </Layer>

                  {/* Capa 1: Comercial Real (Alta Prioridad) */}
                  <Layer>
                     {data.filter(d => !d.is_simulated).map((c, i) => {
                        const block = blocks.find(b => b.id === c.bloque_id);
                        if (!block) return null;
                        return (
                           <Group key={c.bic} x={block.x + c.bay} y={block.y + 40} draggable>
                              <Rect width={24} height={12} fill="#10b981" cornerRadius={2} />
                           </Group>
                        )
                     })}
                  </Layer>

                  {/* Capa 2: Gemelo Fantasma (Holográfico y Z-Index Superior Visual pero baja prioridad backend) */}
                  <Layer opacity={0.6}>
                     {data.filter(d => d.is_simulated).map((c, i) => {
                        const block = blocks.find(b => b.id === c.bloque_id);
                        if (!block) return null;
                        
                        if (c.type === 'vessel') {
                           return (
                              <Group key={c.bic} x={block.x + c.bay} y={block.y + 40}>
                                 <Circle radius={15} fill="transparent" stroke="#22d3ee" strokeWidth={2} dash={[5, 5]} />
                                 <Text text="⚓ AIS SENSOR" y={22} x={-25} fill="#22d3ee" fontSize={10} />
                              </Group>
                           )
                        }

                        return (
                           <Group key={c.bic} x={block.x + c.bay} y={block.y + 60} listening={false}>
                              <Rect width={24} height={12} fill="transparent" stroke="#22d3ee" strokeWidth={2} dash={[2, 2]} cornerRadius={2} />
                           </Group>
                        )
                     })}
                  </Layer>
               </Stage>

               <div className="absolute bottom-4 left-4 bg-[#0a0a0a]/80 border border-slate-800 p-3 rounded backdrop-blur text-[10px] font-mono text-cyan-500 uppercase tracking-widest shadow-2xl">
                  <p>Motor: PostgreSQL + React Konva (Shadow Mode)</p>
                  <p>Workers Activos: 2/2 (Puppeteer Cluster)</p>
                  <p className="animate-pulse">Websocket: Sincronizando (12ms ping)</p>
               </div>
            </div>
         </div>

         {/* Controles de Simulación */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col h-[600px] lg:col-span-1 p-5">
            <h3 className="font-bold text-slate-200 font-mono tracking-widest uppercase text-sm flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
               <SlidersHorizontal size={16} className="text-cyan-500" /> Tasa de Ingestión
            </h3>

            <div className="space-y-8 flex-1">
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <label className="text-xs uppercase font-bold tracking-widest text-slate-400 font-mono">Volumen AIS (%)</label>
                     <span className="text-cyan-400 font-mono font-bold text-lg">{ingestionRate}%</span>
                  </div>
                  <input 
                     type="range" min="0" max="100" 
                     value={ingestionRate} 
                     onChange={(e) => setIngestionRate(Number(e.target.value))}
                     className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-full appearance-none outline-none" 
                  />
                  <p className="text-[10px] text-slate-500 font-mono mt-2 leading-relaxed">
                     Ajusta la permeabilidad del scraper. 100% inyecta todos los buques detectados en Firebase hacia PostgreSQL. 
                  </p>
               </div>

               <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs uppercase font-bold tracking-widest text-slate-300 font-mono border-b border-slate-800 pb-2 mb-3">Algoritmo Anti-Colisión</h4>
                  <ul className="text-[10px] text-slate-500 font-mono space-y-2 list-disc pl-4 marker:text-cyan-700">
                     <li>Los contenedores fantasma (Capa 2) ceden su celda instantáneamente.</li>
                     <li>Trigger BEFORE UPDATE intercepta superposiciones.</li>
                     <li>Overflow redirigido a bloques secundarios.</li>
                  </ul>
               </div>
            </div>

            <button 
               onClick={() => alert("Consola de logs sincronización Firebase-SQL no conectada actualmente.")}
               className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest py-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 font-mono mt-auto">
               <Layers size={16} /> Ver Logs de Firebase Sync
            </button>
         </div>
      </div>
    </div>
  );
}
