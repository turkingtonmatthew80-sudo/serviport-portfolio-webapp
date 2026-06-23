import { useState } from "react";
import { Search, Filter, Camera, ScanLine, X, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { useSwipeable } from "react-swipeable";

export function WaterClerkTally() {
  const [contenedores, setContenedores] = useState([
    { id: 'MSKU9081232', prevStatus: 'PENDIENTE', dir: 'DISCHARGE' },
    { id: 'CMAU1234567', prevStatus: 'PENDIENTE', dir: 'DISCHARGE' },
    { id: 'TGHU8989123', prevStatus: 'PENDIENTE', dir: 'DISCHARGE' },
    { id: 'HLXU1122334', prevStatus: 'PENDIENTE', dir: 'DISCHARGE' },
  ]);

  const [activeTab, setActiveTab] = useState<'DISCHARGE' | 'LOAD'>('DISCHARGE');
  const [photoModalOpen, setPhotoModalOpen] = useState<string | null>(null);

  const handleSwipeDischarge = (id: string) => {
    setContenedores(prev => prev.filter(c => c.id !== id));
  };

  const SwipeableRow = ({ cont }: { cont: any }) => {
    const handlers = useSwipeable({
      onSwipedRight: () => handleSwipeDischarge(cont.id),
      onSwipedLeft: () => setPhotoModalOpen(cont.id),
      trackMouse: true,
      delta: 50,
    });

    return (
      <div {...handlers} className="relative overflow-hidden mb-3 group touch-pan-y">
         <div className="absolute inset-0 bg-emerald-500 rounded-lg flex items-center justify-start pl-6 z-0">
            <span className="font-black text-emerald-900 flex items-center gap-2"><ArrowRight /> CONFIRMAR DESCARGA</span>
         </div>
         <div className="absolute inset-0 bg-red-500 rounded-lg flex items-center justify-end pr-6 z-0">
            <span className="font-black text-red-900 flex items-center gap-2">REPORTAR AVERÍA <ArrowLeft /></span>
         </div>
         
         <div className="bg-slate-800 border-2 border-slate-700 p-5 rounded-lg flex flex-col justify-center relative z-10 transition-transform active:scale-[0.98] cursor-grab active:cursor-grabbing">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black font-mono text-slate-100 tracking-wider">
                  {cont.id}
               </h3>
               <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-900 px-3 py-1 rounded">20' DRY</span>
            </div>
            <p className="font-mono text-xs text-slate-400 mt-3 pt-3 border-t border-slate-700/50">
               Sellos: INT • Precintos: OK
            </p>
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl space-y-4 shrink-0">
         <div className="flex items-center gap-3">
             <div className="flex-1 bg-slate-800 rounded flex p-1">
                 <button onClick={() => setActiveTab('DISCHARGE')} className={`flex-1 py-3 px-2 text-xs font-black uppercase tracking-widest rounded transition-colors ${activeTab === 'DISCHARGE' ? 'bg-primary text-primary-foreground' : 'text-slate-400 hover:text-slate-200'}`}>
                    Descarga (Imp)
                 </button>
                 <button onClick={() => setActiveTab('LOAD')} className={`flex-1 py-3 px-2 text-xs font-black uppercase tracking-widest rounded transition-colors ${activeTab === 'LOAD' ? 'bg-primary text-primary-foreground' : 'text-slate-400 hover:text-slate-200'}`}>
                    Embarque (Exp)
                 </button>
             </div>
             <button className="bg-slate-800 p-3 rounded shrink-0 text-slate-400">
                 <Filter size={20} />
             </button>
         </div>

         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
               type="text" 
               placeholder="Buscar contenedor (BIC)..."
               className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-12 py-4 text-lg font-mono text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 p-2">
               <ScanLine size={24} />
            </button>
         </div>
         
         <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            <span>Restantes: <span className="text-blue-400">{contenedores.length}</span></span>
            <span>Completados: <span className="text-emerald-400">12</span></span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-1 scroll-smooth">
         <p className="text-center text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-4">
            Swipe Derecha: Descargar • Swipe Izquierda: Avería
         </p>
         {contenedores.map(cont => (
            <SwipeableRow key={cont.id} cont={cont} />
         ))}
         {contenedores.length === 0 && (
            <div className="h-40 flex items-center justify-center text-slate-500 font-mono uppercase tracking-widest font-bold text-sm">
               Manifiesto Completado
            </div>
         )}
      </div>

      {photoModalOpen && (
         <div className="fixed inset-0 bg-black/90 flex flex-col z-[100]">
            <div className="p-4 flex justify-between items-center border-b border-slate-800">
               <h3 className="text-slate-200 font-black font-mono tracking-widest text-lg uppercase">Reporte: {photoModalOpen}</h3>
               <button onClick={() => setPhotoModalOpen(null)} className="p-2 text-slate-400 hover:text-white">
                  <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 flex flex-col p-4 space-y-4">
               {/* Simulación de Cámara Nativa */}
               <div className="flex-1 bg-black rounded-xl border-2 border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                  <Camera size={48} className="text-slate-600 mb-4" />
                  <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Toque para Capturar Foto</p>
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Tipo de Avería Confirmada</label>
                  <select className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-4 rounded-lg font-mono focus:border-red-500 focus:outline-none appearance-none">
                     <option>SELLO_ROTO</option>
                     <option>GOLPE_LATERAL_FONDO</option>
                     <option>DERRAME_LIQUIDOS</option>
                     <option>ABOLLADURA_PROFUNDA</option>
                  </select>
               </div>

               <button 
                  onClick={() => {
                     handleSwipeDischarge(photoModalOpen);
                     setPhotoModalOpen(null);
                  }}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 rounded-lg text-sm mt-4 flex items-center justify-center gap-2"
               >
                  <AlertTriangle size={18} /> Registrar y Continuar
               </button>
            </div>
         </div>
      )}
    </div>
  );
}
