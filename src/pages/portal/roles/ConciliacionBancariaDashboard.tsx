import { useState, useEffect } from "react";
import { DollarSign, Check, X, FileText, Download, Loader2 } from "lucide-react";

export function ConciliacionBancariaDashboard() {
  const [transacciones, setTransacciones] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
     try {
        const [resTxn, resInv] = await Promise.all([
           fetch('/api/sql/transacciones_bancarias'),
           fetch('/api/sql/facturas_pendientes?filters=' + JSON.stringify([{ type: 'where', field: 'estado', value: 'REPORTADO_PAGADO' }]))
        ]);
        if (resTxn.ok) setTransacciones(await resTxn.json());
        if (resInv.ok) setDocumentos(await resInv.json());
     } catch (e) {
        console.error("Error al cargar conciliaciones", e);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
     fetchData();
  }, []);

  const handleMatch = async (docId: string, txnId: string) => {
     try {
        await fetch(`/api/sql/facturas_pendientes/${docId}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ estado: 'CONCILIADO', transaccionBancariaId: txnId })
        });
        await fetch(`/api/sql/transacciones_bancarias/${txnId}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ estado: 'CONCILIADO', facturaId: docId })
        });
        fetchData();
     } catch(e) {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-sansita uppercase flex items-center gap-2">
               <DollarSign /> Conciliación Bancaria y Facturación
            </h1>
            <p className="text-slate-400 font-mono mt-1 text-sm">
               Diferencial cambiario automático y liberación de saldos.
            </p>
         </div>
         <div className="bg-slate-800 px-4 py-2 rounded text-right">
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold">Tasa Oficial BCV Hoy</p>
            <p className="text-lg font-black text-emerald-400 font-mono">1 USD = 36.45 VES</p>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
         {/* Extracto Bancario */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden shadow-xl">
            <div className="bg-slate-800 w-full p-3 border-b border-slate-700 font-bold text-slate-300 uppercase tracking-widest text-xs font-mono flex justify-between">
               <span>Extracto Bancario Real (CSV/API)</span>
               {loading && <Loader2 size={14} className="animate-spin text-cyan-500" />}
            </div>
            <div className="p-4 space-y-3 overflow-y-auto">
               {transacciones.length === 0 && !loading && (
                  <p className="text-slate-500 font-mono text-sm">No hay transacciones bancarias recientes.</p>
               )}
               {transacciones.map(txn => (
                  <div key={txn.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg cursor-grab active:cursor-grabbing hover:border-slate-600 transition-colors">
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[10px] text-slate-500 font-mono font-bold uppercase">{txn.banco} | REF: <span className="text-blue-400">{txn.referenciaBancaria}</span></p>
                           <p className="text-emerald-500 font-black font-mono text-xl mt-1">${parseFloat(txn.montoUsd || "0").toFixed(2)}</p>
                           <p className="text-slate-400 font-mono text-xs mt-1">Bs. {parseFloat(txn.montoVes || "0").toLocaleString()}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Pagos Reportados por Clientes */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden shadow-xl">
            <div className="bg-slate-800 w-full p-3 border-b border-slate-700 font-bold text-slate-300 uppercase tracking-widest text-xs font-mono">
               Pagos Reportados en Portal Web
            </div>
            <div className="p-4 space-y-3 overflow-y-auto">
               {documentos.length === 0 && !loading && (
                  <p className="text-slate-500 font-mono text-sm">No hay facturas reportadas sin conciliar.</p>
               )}
               {documentos.map(doc => (
                  <div key={doc.id} className="bg-[#111] border-2 border-dashed border-slate-700 p-4 rounded-lg flex flex-col justify-between group">
                     <div className="flex justify-between">
                        <div>
                           <h4 className="font-black text-slate-200 uppercase">{doc.clienteId}</h4>
                           <p className="text-[10px] text-slate-500 font-mono font-bold uppercase mt-1">{doc.tipoServicio} | FACTURA: {doc.numeroFactura}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-black text-blue-400 font-mono text-xl">${parseFloat(doc.montoUsd || "0").toFixed(2)}</p>
                           <p className="text-[10px] text-slate-500 font-mono font-bold uppercase mt-1">Ref Reportada: {doc.referenciaReportada}</p>
                        </div>
                     </div>
                     <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">
                           Seleccione transacción para hacer match
                        </span>
                        <div className="flex gap-2">
                           <button onClick={() => {
                              const matchId = prompt("Ingrese el ID de transacción a conciliar (ej: " + (transacciones[0]?.id || "UUID") + "):");
                              if (matchId) handleMatch(doc.id, matchId);
                           }} className="p-2 bg-emerald-950 text-emerald-500 rounded hover:bg-emerald-900 transition-colors"><Check size={18} /></button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
