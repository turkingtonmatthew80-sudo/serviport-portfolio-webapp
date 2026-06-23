import { useState, useEffect } from "react";
import { Package, PlusCircle, X, CheckCircle, Clock, FileText, UploadCloud, Weight, ShieldAlert } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function ExportadorIngresos() {
  const { user } = useAuth();
  const [contenedores, setContenedores] = useState<any[]>([]);
  const [showVgmModal, setShowVgmModal] = useState(false);
  const [selectedCont, setSelectedCont] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    pesoVgm: "", 
    usaBasculaPuerto: false
  });

  useEffect(() => {
    fetchContenedores();
  }, [user]);

  const fetchContenedores = async () => {
    if (!user?.rif) return;
    try {
      const empRes = await fetch(`/api/sql/empresas?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'rif', value: user.rif }])));
      const empData = await empRes.json();
      if (!empData || empData.length === 0) return;
      
      const bkgRes = await fetch(`/api/sql/bookingsExportacion?filters=` + encodeURIComponent(JSON.stringify([{ type: 'where', field: 'exportadorId', value: empData[0].id }])));
      const bkgData = await bkgRes.json();
      
      if (bkgData && bkgData.length > 0) {
         const contRes = await fetch(`/api/sql/contenedores`);
         const contData = await contRes.json();
         const bkgIds = bkgData.map((b: any) => b.id);
         const related = contData.filter((c: any) => bkgIds.includes(c.bookingExportacionId));
         setContenedores(related);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleDeclareVGM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCont) return;
    
    try {
      const vgmVal = formData.usaBasculaPuerto ? null : parseFloat(formData.pesoVgm);
      
      // Update the container in DB
      await fetch(`/api/sql/contenedores/${selectedCont}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pesoVgmKg: vgmVal, _isSet: false })
      });
      // Optionally we could add a flag if they use baácula puerto, but maybe it just leaves it null and generates a bill
      
      setShowVgmModal(false);
      fetchContenedores();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Documentos & Certificación VGM</h2>
          <p className="text-foreground-muted text-sm font-sans mt-1">Gestión obligatoria de pesos SOLAS y documentación aduanera para permisos de embarque.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-border shadow-sm p-6">
             <h3 className="font-bold text-secondary text-sm tracking-widest font-mono mb-6 pb-2 border-b flex items-center gap-2">
                <UploadCloud size={16} className="text-primary"/> GESTOR DOCUMENTAL
             </h3>
             <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col justify-center items-center text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <FileText size={48} className="text-slate-300 mb-4" />
                <p className="font-bold text-slate-600 mb-1">Arrastre o haga clic para subir documentos</p>
                <p className="text-xs text-slate-400 font-mono">Factura Comercial, Packing List, Certificado de Origen</p>
             </div>
             
             <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 border rounded border-border text-sm">
                   <div className="flex items-center gap-3">
                      <FileText size={16} className="text-blue-500" />
                      <span className="font-bold text-slate-700">Factura_Comercial_EXP-1092.pdf</span>
                   </div>
                   <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded uppercase">Subido</span>
                </div>
             </div>
          </div>

          <div className="bg-white border border-border shadow-sm p-6 flex flex-col h-full">
             <h3 className="font-bold text-secondary text-sm tracking-widest font-mono mb-6 pb-2 border-b flex items-center gap-2">
                <Weight size={16} className="text-orange-500"/> MÓDULO SOLAS (PESAJE VGM)
             </h3>
             <div className="bg-orange-50 border border-orange-200 p-4 rounded mb-6">
                <h4 className="flex items-center gap-2 text-orange-800 font-bold text-sm mb-1">
                   <ShieldAlert size={16} /> Norma Internacional SOLAS
                </h4>
                <p className="text-xs text-orange-700 leading-relaxed font-mono">
                   Ningún contenedor podrá ser estibado en un buque sin la declaración de la Masa Bruta Verificada (VGM).
                </p>
             </div>

             <div className="space-y-4 flex-1">
                {contenedores.filter(c => c.estadoFisicoExport).length === 0 ? (
                  <div className="text-center p-6 text-slate-400 text-sm font-mono border border-dashed rounded">
                     No hay contenedores registrados.
                  </div>
                ) : (
                  contenedores.filter(c => c.estadoFisicoExport).map(c => (
                     <div key={c.numeroBic} className="flex flex-col md:flex-row justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded gap-4">
                        <div>
                           <div className="font-bold font-mono text-secondary mb-1">{c.numeroBic}</div>
                           <div className="text-xs text-slate-500 font-mono">
                              Estado: {c.pesoVgmKg ? <span className="text-emerald-600 font-bold">{c.pesoVgmKg} KG DECLARADO</span> : <span className="text-red-500 font-bold">SIN DECLARAR</span>}
                           </div>
                        </div>
                        {!c.pesoVgmKg && (
                           <button onClick={() => { setSelectedCont(c.numeroBic); setShowVgmModal(true); setFormData({pesoVgm: "", usaBasculaPuerto: false}); }} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 text-xs font-bold font-mono rounded whitespace-nowrap">
                              DECLARAR VGM
                           </button>
                        )}
                        {c.pesoVgmKg && (
                           <div className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded flex items-center gap-2">
                              <CheckCircle size={14} /> <span className="text-xs font-bold font-mono">CERTIFICADO</span>
                           </div>
                        )}
                     </div>
                  ))
                )}
             </div>
          </div>
       </div>

       {showVgmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white shadow-2xl w-full max-w-md overflow-hidden rounded animate-in zoom-in-95">
             <div className="bg-slate-900 px-5 py-4 flex justify-between items-center text-white">
               <h3 className="font-bold text-sm uppercase tracking-widest font-mono">Declaración VGM</h3>
               <button onClick={() => setShowVgmModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
             </div>
             
             <form onSubmit={handleDeclareVGM} className="p-6">
                <div className="mb-4">
                   <p className="text-sm font-bold text-slate-700 mb-2 font-mono">Contenedor: <span className="text-primary">{selectedCont}</span></p>
                </div>

                <div className="space-y-4">
                   <div className="flex items-start gap-3 p-3 border rounded border-slate-200 bg-slate-50">
                      <input 
                        type="radio" 
                        id="pesoSencamer" 
                        name="vgm_method" 
                        checked={!formData.usaBasculaPuerto} 
                        onChange={() => setFormData({...formData, usaBasculaPuerto: false})}
                        className="mt-1"
                      />
                      <div>
                         <label htmlFor="pesoSencamer" className="block text-xs font-bold text-slate-700 uppercase tracking-widest cursor-pointer">Pesaje en Planta Certificada</label>
                         <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Pesa el contenedor lleno en su planta utilizando una báscula certificada por SENCAMER y adjunta el ticket.</p>
                         
                         {!formData.usaBasculaPuerto && (
                            <div className="mt-3">
                               <input required type="number" step="0.01" min="1000" placeholder="Masa Bruta (KG)" value={formData.pesoVgm} onChange={e => setFormData({...formData, pesoVgm: e.target.value})} className="w-full border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary" />
                            </div>
                         )}
                      </div>
                   </div>

                   <div className="flex items-start gap-3 p-3 border rounded border-slate-200 bg-slate-50">
                      <input 
                        type="radio" 
                        id="pesoBolipuertos" 
                        name="vgm_method" 
                        checked={formData.usaBasculaPuerto} 
                        onChange={() => setFormData({...formData, usaBasculaPuerto: true})}
                        className="mt-1"
                      />
                      <div>
                         <label htmlFor="pesoBolipuertos" className="block text-xs font-bold text-slate-700 uppercase tracking-widest cursor-pointer">Pesar en Báscula de Bolipuertos</label>
                         <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Delega el pesaje obligatorio a la terminal durante el Gate-In. Esto generará un cargo automático en moneda local por Servicios de Pesado.</p>
                      </div>
                   </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                   <button type="button" onClick={() => setShowVgmModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Cancelar</button>
                   <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors">Confirmar VGM</button>
                </div>
             </form>
          </div>
        </div>
       )}
    </div>
  );
}
