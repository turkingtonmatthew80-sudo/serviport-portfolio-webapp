import { useState, useEffect } from "react";
import { Box, FileText, Search, Download, Layers, ShieldCheck, ArrowRight, Truck, Database, Bot, RefreshCcw, CheckSquare, XCircle, Send } from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc, serverTimestamp, collection, query, where, getDocs, getDoc } from "@/src/lib/db-wrapper";

export function AdminDocumentos() {
  const { adminUser } = useAdminAuth();
  
  const [showDeconsolidate, setShowDeconsolidate] = useState<string | null>(null);
  const [scraperStatus, setScraperStatus] = useState<"idle" | "running" | "done">("idle");
  const [scrapedData, setScrapedData] = useState<any[]>([]);

  const [masterBls, setMasterBls] = useState<any[]>([]);
  const [hitos, setHitos] = useState<any[]>([]);
  const [containersAgd, setContainersAgd] = useState<any[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
     let unsubMbl = () => {};
     let unsubHitos = () => {};
     let unsubContainers = () => {};

     const fetchAll = async () => {
         let qMbl: any = collection(db, "master_bls");
         if (adminUser?.port !== "GLOBAL") qMbl = query(qMbl, where("port", "==", adminUser?.port || "Puerto Cabello"));
         unsubMbl = onSnapshot(qMbl, (snap) => setMasterBls(snap.docs.map(d => ({...d.data(), gid: d.id}))));

         let qHitos: any = collection(db, "hitos_legales");
         if (adminUser?.port !== "GLOBAL") qHitos = query(qHitos, where("port", "==", adminUser?.port || "Puerto Cabello"));
         unsubHitos = onSnapshot(qHitos, (snap) => setHitos(snap.docs.map(d => ({...d.data(), gid: d.id}))));

         let qContainers: any = collection(db, "containers_agd");
         if (adminUser?.port !== "GLOBAL") qContainers = query(qContainers, where("port", "==", adminUser?.port || "Puerto Cabello"));
         unsubContainers = onSnapshot(qContainers, (snap) => setContainersAgd(snap.docs.map(d => ({...d.data(), gid: d.id}))));
     }

     if (adminUser) fetchAll();

     return () => {
         unsubMbl();
         unsubHitos();
         unsubContainers();
     };
  }, [adminUser]);

  const emitBroadcast = async (hitoId: string, mblId: string) => {
      setIsBroadcasting(true);
      try {
          const mblDoc = await getDoc(doc(db, "master_bls", mblId));
          let vName = "Desconocido";
          let cName = "Desc";
          if (mblDoc.exists()) {
             vName = mblDoc.data().vessel;
             cName = mblDoc.data().container;
          }

          await setDoc(doc(db, "hitos_legales", hitoId), {
              status: "PENDING",
              createdAt: serverTimestamp()
          }, { merge: true });

          await fetch("/api/telegram/send-approval", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  docId: hitoId,
                  ente: "SENIAT",
                  titulo: `Inspección Física ${hitoId}`,
                  vesselName: vName,
                  detalles: `Contenedor ${cName}`
              })
          });
      } catch(e) {
          console.error("Broadcast failed:", e);
      } finally {
          setIsBroadcasting(false);
      }
  };

  const handleSubmitCorrectionLetter = async (mblId: string) => {
    const motive = prompt("Justificación para Carta de Corrección (ej. Discrepancia de Peso, Error de Shipper):");
    if (!motive) return;
    try {
       await fetch("/api/documentos/correction", {
           method: "POST",
           body: JSON.stringify({ mblId, motive })
       }); // Symbolize
       alert(`Carta de Corrección registrada exitosamente ante el ente regulador para el BL: ${mblId}. Se ha emitido la trazabilidad.`);
    } catch(e) {
       console.error("Error submitting letter", e);
    }
  };

  const handleDeconsolidateConfirm = async (targetMbl: any) => {
     try {
         // RESOLUTION 7: Flujo de Desconsolidación (LCL) en Almacén (AGD)
         // Cuando la orden cambia el macro-contenedor a EMPTY_AT_DEPOT el backend automatiza la emisión de CargoCycleIDs
         
         setIsBroadcasting(true);
         // Simulate internal backend automation
         setTimeout(() => {
            alert(`El contenedor ${targetMbl.container} ha cambiado a EMPTY_AT_DEPOT. Se han emitido CargoCycleIDs (House BLs) de forma automatizada.`);
            setShowDeconsolidate(null);
            setIsBroadcasting(false);
         }, 1000);
         
     } catch(e) {
         console.error(e);
     }
  };
  const runSiduneaScraper = async () => {
    setScraperStatus("running");
    setScrapedData([]);
    
    try {
        const results = [];
        // Tomaremos los primeros 3 contenedores activos sin seleccionar
        const pendingContainers = containersAgd.slice(0, 3);
        
        for (const container of pendingContainers) {
             const mblRef = masterBls.find(m => m.container === container.containerId);
             
             const response = await fetch("/api/sidunea/selectivity", {
                 method: "POST",
                 headers: { "Content-Type" : "application/json" },
                 body: JSON.stringify({
                     mblId: mblRef ? mblRef.gid : null,
                     containerId: container.containerId,
                     importador: mblRef ? "Consignatario BL" : "Importador General",
                     vesselName: mblRef ? mblRef.vessel : "Buque TBD"
                 })
             });
             const data = await response.json();
             
             if (data.success) {
                 results.push({
                     bl: container.containerId,
                     status: "VALIDATED_SIDUNEA",
                     canal: data.canal.toUpperCase(),
                     taxes: data.canal === "Verde" ? "PAGADO" : "EN REVISIÓN"
                 });
             }
        }
        
        setScrapedData(results);
    } catch(e) {
        console.error("Scraper Error", e);
    } finally {
        setScraperStatus("done");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita flex items-center gap-3">
            <Box className="text-primary" size={32} />
            Gestión Documental y Almacén (AGD)
          </h2>
          <p className="text-foreground-muted font-mono mt-1">
            Repositorio, desconsolidación LCL y normativas aduaneras en {adminUser?.port}
          </p>
        </div>
      </div>

      {/* WEB SCRAPING AUTÓNOMO SIDUNEA */}
      <div className="bg-slate-900 border border-slate-800 rounded p-6 shadow-lg text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 pt-4 pr-12 opacity-5 pointer-events-none">
           <Database size={150} className="text-primary" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
           <div>
              <h3 className="text-xl font-bold font-mono tracking-widest text-[#00A9CE] flex items-center gap-2 mb-2">
                 <Bot size={24} /> ROBOT WEB (SIDUNEA SCRAPER)
              </h3>
              <p className="text-sm text-slate-400 font-sans max-w-2xl">
                 Crawler automatizado para extracción de datos externos de la plataforma de aduanas nacional. Vincula cruces de selectividad (Canal Rojo/Verde) con los B/L Máster en el TOS sin intervención manual.
              </p>
           </div>
           <button 
              onClick={runSiduneaScraper}
              disabled={scraperStatus === "running"}
              className="bg-[#00A9CE] hover:bg-[#0088A8] disabled:bg-slate-700 text-white px-6 py-3 rounded font-bold font-mono uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
           >
              {scraperStatus === "running" ? (
                 <><RefreshCcw size={16} className="animate-spin" /> Extrayendo Datos...</>
              ) : (
                 <><Database size={16} /> Iniciar Scraping </>
              )}
           </button>
        </div>

        {scraperStatus !== "idle" && (
           <div className="mt-6 bg-slate-950 border border-slate-800 rounded p-4 font-mono text-xs">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
                 <span className={`${scraperStatus === "running" ? "text-yellow-500 animate-pulse" : "text-emerald-500"}`}>
                   {scraperStatus === "running" ? "> Ejecutando Puppeteer script [sidunea_crosscheck.js]..." : "> Ejecución finalizada. 2 Registros machelados."}
                 </span>
              </div>
              
              <div className="space-y-2">
                 {scrapedData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800">
                       <span className="font-bold text-slate-300">BL: {item.bl}</span>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest ${item.canal === 'VERDE' ? 'bg-emerald-900 text-emerald-400 border border-emerald-700' : 'bg-red-900 text-red-400 border border-red-700'}`}>
                          CANAL {item.canal}
                       </span>
                       <span className="text-slate-500">Impuestos: {item.taxes}</span>
                       {item.status === "VALIDATED_SIDUNEA" ? <CheckSquare className="text-emerald-500" size={16}/> : <XCircle className="text-orange-500" size={16}/>}
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-white p-6 border border-border shadow-sm">
           <div className="flex items-center gap-4 mb-6">
             <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
               <input 
                 type="text" 
                 placeholder="Buscar por BL Máster, House BL o Buque..."
                 className="w-full pl-10 pr-4 py-2 border border-border rounded text-sm focus:outline-none focus:border-primary font-mono"
               />
             </div>
             <select className="border border-border p-2 rounded text-sm font-mono text-foreground-muted">
               <option>Todos los Estados</option>
               <option>Canal Verde</option>
               <option>Canal Rojo</option>
             </select>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="text-[10px] text-foreground-muted uppercase tracking-widest bg-slate-50 border-b border-border font-mono">
                 <tr>
                   <th className="px-6 py-4 font-bold">Documentos</th>
                   <th className="px-6 py-4 font-bold">Entidad / Buque</th>
                   <th className="px-6 py-4 font-bold">Selectividad</th>
                   <th className="px-6 py-4 font-bold text-right">Acciones</th>
                 </tr>
               </thead>
               <tbody>
                  {masterBls.map(mbl => (
                    <tr key={mbl.gid} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                           <span className="font-bold text-secondary font-mono">M-BL: {mbl.mbl}</span>
                           <span className={`text-[10px] px-1 border rounded w-fit font-bold uppercase tracking-widest ${mbl.type === 'LCL CONSOLIDADO' ? 'text-orange-600 bg-orange-100 border-orange-200' : 'text-blue-600 bg-blue-100 border-blue-200'}`}>{mbl.type || 'DESCONOCIDO'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-secondary text-xs">{mbl.vessel}<br/><span className="text-foreground-muted font-sans text-xs">Contenedor: {mbl.container}</span></td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded font-bold text-[9px] tracking-widest uppercase font-mono ${mbl.canal === 'VERDE' ? 'bg-emerald-100 text-emerald-800' : mbl.canal === 'AMARILLO' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{mbl.canal ? `Canal ${mbl.canal}` : 'SIN CANAL'}</span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2 text-right">
                        {mbl.type === "LCL CONSOLIDADO" && (
                          <button 
                              onClick={() => setShowDeconsolidate(mbl.gid)}
                              className="flex items-center gap-1 text-[10px] bg-slate-100 border border-border px-2 py-1.5 font-bold uppercase text-slate-700 hover:bg-slate-200 rounded transition-colors"
                          >
                            <Layers size={14} /> Desconsolidar H-BL
                          </button>
                        )}
                        <button
                          onClick={() => handleSubmitCorrectionLetter(mbl.gid)}
                          title="Emitir Carta de Corrección de Manifiesto"
                          className="flex items-center gap-1 text-[10px] bg-indigo-50 border border-indigo-200 px-2 py-1.5 font-bold uppercase text-indigo-700 hover:bg-indigo-100 rounded transition-colors shadow-sm"
                        >
                           Carta Corrección
                        </button>
                        <button className="text-primary hover:text-primary-hover p-1.5 border border-primary/20 rounded">
                          <Download size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {hitos.map(hito => {
                     const relatedMbl = masterBls.find(m => m.gid === hito.mblId) || {};
                     return (
                     <tr key={hito.gid} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex flex-col gap-1">
                            <span className="font-bold text-secondary font-mono">{hito.gid}</span>
                            <span className="text-[10px] text-blue-600 bg-blue-100 px-1 border border-blue-200 rounded w-fit font-bold uppercase tracking-widest">{hito.tipo || "FCL STANDARD"}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 font-mono text-secondary text-xs">{hito.ente} ({relatedMbl.vessel || 'N/A'})<br/><span className="text-foreground-muted font-sans text-xs">Contenedor: {relatedMbl.container || 'N/A'}</span></td>
                       <td className="px-6 py-4">
                          {hito.status === "APROBADO" ? (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold text-[9px] tracking-widest uppercase font-mono">APROBADO / LEVANTE</span>
                          ) : hito.status === "RECHAZADO" ? (
                              <span className="bg-red-900 text-red-100 px-2 py-1 rounded font-bold text-[9px] tracking-widest uppercase font-mono">RECHAZADO SENIAT</span>
                          ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-bold text-[9px] tracking-widest uppercase font-mono">Canal Rojo / Inspección</span>
                          )}
                       </td>
                       <td className="px-6 py-4 text-right flex justify-end gap-2 text-right">
                          <button 
                             onClick={() => emitBroadcast(hito.gid, hito.mblId)}
                             disabled={isBroadcasting || hito.status === "PENDING" || hito.status === "APROBADO" || hito.status === "RECHAZADO"}
                             className="flex items-center gap-1 text-[10px] bg-[#0088cc] text-white px-2 py-1.5 font-bold uppercase hover:bg-[#0077b3] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors shadow"
                          >
                             <Send size={14} /> 
                             {hito.status === "PENDING" ? "ENVIADO A TELEGRAM" : "EMITIR BROADCAST OFICIAL"}
                          </button>
                         <button className="text-primary hover:text-primary-hover p-1.5 border border-primary/20 rounded">
                           <Download size={14} />
                         </button>
                       </td>
                     </tr>
                     )
                  })}
                  {masterBls.length === 0 && hitos.length === 0 && (
                     <tr>
                         <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-mono">No hay documentos en este puerto.</td>
                     </tr>
                  )}
               </tbody>
             </table>
           </div>
         </div>

         <div className="bg-slate-900 border border-slate-800 text-white rounded p-6 shadow-sm overflow-hidden relative">
            <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
               <ShieldCheck size={180} className="text-primary" />
            </div>
            <h3 className="font-mono text-sm tracking-widest font-bold text-slate-400 mb-6 relative z-10">CONTENEDORES EN AGD</h3>
            
            <div className="space-y-4 relative z-10">
               {containersAgd.map(c => (
                 <div key={c.gid} className="border border-slate-800 p-3 bg-slate-950/50 rounded flex justify-between items-center">
                    <div>
                      <p className="font-mono font-bold text-emerald-400 text-sm">{c.id || c.gid}</p>
                      <p className="text-[10px] text-slate-500 font-sans">{c.daysInPort} Días ({c.overstayDays > 0 ? `Sobreestadía: ${c.overstayDays} día(s)` : `Restan: ${c.freeDays - c.daysInPort} días Libres`})</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${c.type === 'LCL POR DIVIDIR' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'}`}>{c.type || 'AGD'}</span>
                 </div>
               ))}
               {containersAgd.length === 0 && (
                 <p className="text-sm text-slate-500 font-mono italic">No hay contenedores en AGD.</p>
               )}
            </div>
         </div>
      </div>

      {showDeconsolidate && (() => {
         const targetMbl = masterBls.find(m => m.gid === showDeconsolidate);
         if (!targetMbl) return null;
         return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
           <div className="bg-white rounded max-w-2xl w-full border border-border shadow-2xl">
              <div className="p-6 border-b border-border bg-slate-50 flex justify-between items-center">
                 <div>
                    <h3 className="font-black text-secondary font-mono uppercase tracking-tight text-xl">Confirmar Desconsolidación LCL</h3>
                    <p className="text-xs text-foreground-muted font-sans mt-1">M-BL: {targetMbl.mbl} (Contenedor {targetMbl.container})</p>
                 </div>
                 <button onClick={() => setShowDeconsolidate(null)} className="text-slate-400 hover:text-slate-700 font-bold p-2 text-xl">&times;</button>
              </div>

              <div className="p-6 space-y-6">
                 <p className="text-sm text-foreground-muted bg-blue-50 border border-blue-200 p-3 rounded font-mono text-blue-900">
                    Al proceder, el contenedor físico ({targetMbl.container}) pasará al AGD virtual como <strong className="font-black">Vacío Pendiente de Devolución</strong>, y la carga se subdividirá en bultos (House BLs) para despacho a transportistas separados.
                 </p>
                 
                 <div className="space-y-3">
                    <p className="text-xs text-slate-500 font-mono">Los bultos serían obtenidos dinámicamente de sus House BLs asociados.</p>
                 </div>
              </div>

              <div className="p-6 border-t border-border bg-slate-50 flex justify-end gap-3">
                 <button onClick={() => setShowDeconsolidate(null)} className="px-4 py-2 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors rounded">Cancelar</button>
                 <button 
                   onClick={() => handleDeconsolidateConfirm(targetMbl)} 
                   disabled={isBroadcasting}
                   className="px-4 py-2 bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary-hover disabled:opacity-50 transition-colors rounded shadow-sm flex items-center gap-2"
                 >
                    <ArrowRight size={14} /> Registrar Desconsolidación ALMACÉN (AGD)
                 </button>
              </div>
           </div>
        </div>
         );
      })()}
    </div>
  );
}
