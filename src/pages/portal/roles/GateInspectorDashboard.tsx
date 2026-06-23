import { useState } from "react";
import { QrCode, Camera, ShieldAlert, CheckCircle2, Box } from "lucide-react";

export function GateInspectorDashboard() {
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedContainer, setScannedContainer] = useState<any>(null);

  const mockScan = async () => {
    const token = prompt("Ingrese el Token VBS (o deje en blanco para obtener la cita más reciente):");
    setScannerActive(true);
    
    try {
        const filters = token ? [{ type: 'where', field: 'tokenVbs', value: token }] : [];
        const res = await fetch('/api/sql/citas_garita' + (filters.length > 0 ? '?filters=' + JSON.stringify(filters) : ''));
        const citas = await res.json();
        
        if (citas && citas.length > 0) {
           const cita = citas[0];
           setScannedContainer({
              id: cita.id,
              bic: cita.contenedorBic || 'S/N',
              vbsToken: cita.tokenVbs,
              type: cita.tipoTransaccion,
              driver: cita.conductorNombres,
              plate: cita.vehiculoPlaca
           });
        } else {
           alert("Token VBS no encontrado o no hay citas garita disponibles.");
        }
    } catch(e) {
        console.error(e);
        alert("Error de conexión");
    } finally {
        setScannerActive(false);
    }
  };

  const handleConfirm = async () => {
     try {
        if (!scannedContainer) return;
        
        // Registrar Evento Garita
        await fetch('/api/sql/gate_events', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
              citaGaritaId: scannedContainer.id,
              tipoMovimiento: scannedContainer.type,
              fechaHora: new Date().toISOString(),
           })
        });

        // Actualizar estado de cita
        await fetch(`/api/sql/citas_garita/${scannedContainer.id}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ estado: 'COMPLETADA' })
        });
        
        alert("Gate procesado exitosamente.");
        setScannedContainer(null);
     } catch (e) {
        alert("Error al procesar Gate.");
     }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl space-y-2 shrink-0">
         <h1 className="text-2xl font-black text-slate-100 tracking-tight font-sansita uppercase">Garita (Gate) EIR</h1>
         <p className="text-slate-400 font-mono text-xs flex items-center gap-2">
            Inspección Física y Control VBS.
         </p>
      </div>

      {!scannedContainer ? (
         <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <button 
               onClick={mockScan}
               className={`w-64 h-64 rounded-3xl flex flex-col items-center justify-center border-4 ${scannerActive ? 'border-blue-500 bg-blue-950/30' : 'border-slate-700 bg-slate-900'} transition-all`}
            >
               <QrCode size={64} className={scannerActive ? 'text-blue-500 animate-pulse' : 'text-slate-500'} />
               <span className={`mt-4 font-mono font-bold tracking-widest uppercase ${scannerActive ? 'text-blue-400' : 'text-slate-500'}`}>
                  {scannerActive ? 'Buscando...' : 'Escanear Turno VBS'}
               </span>
            </button>
            <p className="text-slate-500 font-mono text-xs max-w-xs text-center border border-slate-800 p-3 rounded bg-slate-900">
               La validación del token VBS consulta la base de datos SQL en vivo.
            </p>
         </div>
      ) : (
         <div className="flex-1 space-y-4 overflow-y-auto pr-2 pb-10">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                        {scannedContainer.type}
                     </span>
                     <h2 className="text-3xl font-black font-mono text-slate-100 mt-2">{scannedContainer.bic}</h2>
                     <p className="text-slate-400 font-mono mt-1 text-sm">{scannedContainer.plate} • {scannedContainer.driver}</p>
                  </div>
                  <CheckCircle2 size={40} className="text-emerald-500" />
               </div>

               <div className="space-y-4 mb-6">
                  <h3 className="font-bold text-slate-300 uppercase text-xs font-mono tracking-widest border-b border-slate-800 pb-2">
                     Checklist Físico (EIR Unfolded Box)
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest">Techo</label>
                        <select className="w-full bg-slate-800 border-slate-700 rounded p-2 text-sm text-slate-300 font-mono">
                           <option>OK</option><option>GOLPEADO</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest">Paneles Laterales</label>
                        <select className="w-full bg-slate-800 border-slate-700 rounded p-2 text-sm text-slate-300 font-mono mt-1">
                           <option>OK</option><option>ABOLLADURA MAYOR</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest">Piso</label>
                        <select className="w-full bg-slate-800 border-slate-700 rounded p-2 text-sm text-slate-300 font-mono">
                           <option>OK</option><option>SUCIO/MANCHADO</option>
                        </select>
                     </div>
                     <div className="flex flex-col items-center justify-end">
                        <button className="bg-slate-800 text-slate-300 p-2 rounded flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase w-full">
                           <Camera size={16} /> Foto Precinto
                        </button>
                     </div>
                  </div>
               </div>

               <button 
                  onClick={handleConfirm}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest py-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
               >
                  Generar EIR y Procesar Gate
               </button>
               <p className="text-[9px] text-slate-500 text-center mt-3 font-mono uppercase">
                  Esto puede disparar eventos financieros automáticos de Demurrage / Garantías vacíos.
               </p>
            </div>
         </div>
      )}
    </div>
  );
}
