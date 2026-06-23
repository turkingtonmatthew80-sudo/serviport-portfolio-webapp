import { useState, useEffect } from "react";
import { FileText, Search, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function AgenteAduanaExpediente() {
  const { user } = useAuth();
  const [contenedores, setContenedores] = useState<any[]>([]);
  const [selectedCont, setSelectedCont] = useState<any>(null);
  const [hsCode, setHsCode] = useState("");
  const [adValorem, setAdValorem] = useState<number>(0);
  const [montoTributos, setMontoTributos] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState("");

  const fakeArancel = (code: string) => {
     // Mocking arancel_aduanas logic
     if (code.startsWith("85")) return 15; // Electrónica 15%
     if (code.startsWith("87")) return 20; // Vehículos 20%
     if (code.startsWith("10")) return 5;  // Cereales 5%
     return 10;
  }

  useEffect(() => {
    if (hsCode.length >= 4) {
      const adv = fakeArancel(hsCode);
      setAdValorem(adv);
      // Fakes the invoice value calculation based on Ad Valorem ($10k assumed value + 16% IVA)
      setMontoTributos((10000 * adv / 100) + (10000 * 0.16));
    }
  }, [hsCode]);

  useEffect(() => {
     const fetchContenedores = async () => {
        if (!user?.rif) return;
        try {
           const empRes = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'rif', value: user.rif }])));
           const empData = await empRes.json();
           if (!empData || empData.length === 0) return;
           const agenteId = empData[0].id;

           // We want to see all containers attached to this agent that have not been declared yet (or are in process)
           const res = await fetch(`/api/sql/contenedores?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'agenteAduanasId', value: agenteId }])));
           setContenedores(await res.json());
        } catch(e) { console.error(e); }
     };
     fetchContenedores();
  }, [user]);

  const handleTransmitirDUA = async () => {
      setStatusMsg("");
      try {
         const res = await fetch("/api/aduanas/declaracion/transmitir", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
               contenedorBic: selectedCont.numeroBic,
               codigoArancelario: hsCode,
               descripcion: "Carga general declarada",
               montoTributos
            })
         });
         const data = await res.json();
         if (!data.success) {
            setStatusMsg("❌ Error: " + data.error);
         } else {
            setStatusMsg(`✅ DUA ${data.data.numeroDua} transmitida exitosamente. Canal de Selectividad: ${data.data.selectividad}`);
            setSelectedCont(null);
         }
      } catch(e: any) {
         setStatusMsg("❌ Falla de conexión SIDUNEA: " + e.message);
      }
  };

  return (
    <div className="space-y-6">
       <div>
         <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Gestor de Declaraciones & VUCE</h2>
         <p className="text-foreground-muted text-sm mt-1">Transmisión de Declaración Única de Aduanas (DUA) al ecosistema SIDUNEA.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
          {/* Listado Izquierdo */}
          <div className="bg-white border border-border shadow-sm flex flex-col h-full overflow-hidden">
             <div className="p-4 border-b font-bold font-mono tracking-widest text-secondary text-sm bg-slate-50 flex items-center justify-between">
                <span>CARGAS ASIGNADAS</span>
             </div>
             <div className="p-4 overflow-y-auto flex-1 space-y-3">
                {contenedores.length === 0 ? (
                   <p className="text-sm font-mono text-slate-500 text-center mt-10">No existen cargas delegadas a su agencia en este momento.</p>
                ) : (
                   contenedores.map(c => (
                      <div key={c.numeroBic} onClick={() => setSelectedCont(c)} className={`p-4 border rounded cursor-pointer transition-colors ${selectedCont?.numeroBic === c.numeroBic ? 'bg-primary/5 border-primary' : 'bg-slate-50 hover:bg-slate-100'} flex items-center justify-between`}>
                         <div>
                            <p className="font-bold font-mono text-secondary mb-1">{c.numeroBic}</p>
                            <p className="text-xs text-foreground-muted font-mono">{c.tipoIso} • Selectividad: {c.selectividadSeniat || 'NO ASIGNADA'}</p>
                         </div>
                         <CheckCircle size={16} className={c.selectividadSeniat ? 'text-emerald-500' : 'text-slate-300'} />
                      </div>
                   ))
                )}
             </div>
          </div>

          {/* Formulario Derecho */}
          <div className="bg-white border border-border shadow-sm p-6 flex flex-col overflow-y-auto">
             <h3 className="font-bold font-mono tracking-widest text-slate-500 text-sm mb-6 border-b pb-2">TRANSMISIÓN DUA</h3>
             
             {!selectedCont ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                   <FileText size={48} className="mb-4 text-slate-200" />
                   <p className="font-mono text-sm">Seleccione un contenedor para declarar.</p>
                </div>
             ) : (
                <div className="space-y-6">
                   {statusMsg && (
                      <div className={`p-4 rounded text-sm font-mono font-bold ${statusMsg.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                         {statusMsg}
                      </div>
                   )}
                   
                   <div>
                      <label className="block text-xs font-bold text-slate-500 font-mono tracking-widest mb-1">CÓDIGO ARANCELARIO (HS)</label>
                      <input 
                         type="text" 
                         className="w-full border p-2 rounded text-lg font-mono focus:outline-none focus:border-primary"
                         placeholder="Ej: 8517.12.00.00"
                         value={hsCode}
                         onChange={e => setHsCode(e.target.value)}
                         maxLength={14}
                      />
                      <p className="text-[10px] text-slate-400 mt-1">El Arancel de Aduanas autocompletará las alícuotas.</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border rounded">
                      <div>
                         <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Ad Valorem %</p>
                         <p className="text-xl font-black text-secondary">{adValorem}%</p>
                      </div>
                      <div>
                         <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">IVA %</p>
                         <p className="text-xl font-black text-secondary">16%</p>
                      </div>
                   </div>

                   <div className="bg-blue-50 p-4 border border-blue-100 rounded">
                      <p className="text-[10px] uppercase font-bold text-blue-800 tracking-widest mb-1">Proyección de Tributos (VES)</p>
                      <p className="text-3xl font-black text-blue-900 font-sansita mt-1">${montoTributos.toLocaleString()}</p>
                   </div>

                   <button onClick={handleTransmitirDUA} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest font-mono text-sm py-4 rounded transition-colors shadow-lg">
                      Transmitir a SIDUNEA
                   </button>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
