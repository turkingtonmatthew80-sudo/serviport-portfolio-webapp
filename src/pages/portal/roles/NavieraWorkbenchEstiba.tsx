import React, { useState } from 'react';
import { Ship, Bot, Send, Search, CheckCircle2 } from 'lucide-react';

export function NavieraWorkbenchEstiba() {
  const [fillPercent, setFillPercent] = useState([85]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const simulateGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsDone(true);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <div className="px-6 py-4 bg-background border-b flex items-center justify-between shadow-sm z-10 w-full">
         <div>
            <h1 className="text-xl font-bold tracking-tight">Workbench: Planificación de Viajes (Motor de Estiba)</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Ship className="w-4 h-4" /> M/N Horizon (Capacidad 1,000 TEUs) - Ruteo: La Guaira → Puerto Cabello
            </p>
         </div>
         {isDone && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
               <CheckCircle2 className="w-4 h-4" />
               <span className="text-sm font-medium">Oficializado - A la espera de SENIAT</span>
            </div>
         )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Real Bookings Demand */}
        <div className="w-80 border-r bg-background flex flex-col">
          <div className="p-4 border-b">
             <h2 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Demanda Real (Bookings)</h2>
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input placeholder="Buscar booking..." className="w-full border rounded pl-9 h-9 text-sm" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {[
               {id: 'BK-1200', client: 'Cacao Ve', teus: 12, pos: 'Tiers 02'},
               {id: 'BK-1201', client: 'Ron Santa Teresa', teus: 4, pos: 'Tiers 04'},
               {id: 'BK-1202', client: 'Exportadora Sur', teus: 20, pos: 'Tiers 02'},
               {id: 'BK-1203', client: 'Textiles CA', teus: 8, pos: 'Tiers 06'},
             ].map(bk => (
               <div key={bk.id} className="p-3 rounded-lg border bg-muted/30 flex justify-between items-center hover:bg-muted/50 cursor-pointer">
                  <div>
                     <p className="text-sm font-medium">{bk.id}</p>
                     <p className="text-xs text-muted-foreground">{bk.client}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold">{bk.teus} TEUs</p>
                     <p className="text-[10px] text-primary">{bk.pos}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Center Panel: Bay Plan Visualization & Hybrid Engine */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
           {/* Visualizer Mock */}
           <div className="bg-background rounded-xl border p-6 flex-1 flex items-center justify-center relative overflow-hidden shadow-sm">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             
             <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-lg font-medium mb-6 bg-background/80 px-4 py-1 rounded-full backdrop-blur">Vista Transversal (Bay Plan)</h3>
                
                <div className="grid grid-cols-10 gap-1 opacity-90">
                   {Array(100).fill(0).map((_, i) => {
                      const isReal = i >= 80;
                      const isSimulated = isDone && i < fillPercent[0] && i >= (100 - fillPercent[0]);
                      
                      let bg = 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
                      if (isReal) bg = 'bg-blue-500 border-blue-600 shadow-sm';
                      else if (isSimulated) bg = 'bg-indigo-300 border-indigo-400 dark:bg-indigo-700 dark:border-indigo-600 pattern-diagonal-lines sm';

                      return (
                        <div key={i} className={`w-8 h-8 md:w-10 md:h-10 border rounded-[2px] transition-all duration-500 ${bg}`} />
                      );
                   })}
                </div>
                <div className="flex gap-6 mt-8 text-sm bg-background/80 px-4 py-2 rounded-full backdrop-blur">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Carga Real (Bookings)</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-300 dark:bg-indigo-700 rounded-sm"></div> Simulada (IA)</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm border"></div> Vacío</div>
                </div>
             </div>
           </div>

           {/* Motor Hibrido Controls */}
           <div className="mt-6 bg-background rounded-xl border p-6 shadow-sm">
             <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2"><Bot className="text-primary w-5 h-5"/> Generador Híbrido de Carga</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    Asigna la carga real en los tiers inferiores y rellena la capacidad restante con contenedores ficticios válidos mediante Faker y la base de datos de SENIAT, para alcanzar el target de estiba.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{fillPercent[0]}%</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase mt-1">Ocupación Target</div>
                </div>
             </div>
             
             <div className="px-2 mb-8">
               <input 
                 type="range"
                 value={fillPercent[0]} 
                 max={100} 
                 min={40} 
                 step={1} 
                 onChange={(e) => setFillPercent([parseInt(e.target.value)])}
                 disabled={isGenerating || isDone}
                 className="w-full"
               />
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t">
               <button className="px-4 py-2 border rounded font-medium text-sm disabled:opacity-50" onClick={() => setIsDone(false)} disabled={!isDone}>Resetear</button>
               <button onClick={simulateGeneration} disabled={isGenerating || isDone} className="px-4 py-2 rounded text-sm font-medium bg-primary text-white flex items-center disabled:opacity-50 hover:bg-primary/90">
                 {isGenerating ? <><Bot className="w-4 h-4 mr-2 animate-bounce" /> Sintetizando...</> : <><Send className="w-4 h-4 mr-2" /> Generar Manifiesto CUSCAR</>}
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
