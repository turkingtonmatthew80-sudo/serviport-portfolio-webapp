import { ArrowLeft, ArrowRight, Scale, Send, ShieldCheck, Anchor, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export function LegalDocsPage() {
  const [telegramStatus, setTelegramStatus] = useState<"idle" | "sending" | "sent" | "approved" | "rejected" | "error">("idle");
  const [vessel, setVessel] = useState("ZIM LUANDA (V202)");
  const [hitoType, setHitoType] = useState("Levante SENIAT / Declaración de Aduanas");
  const [comments, setComments] = useState("");
  const [docId, setDocId] = useState<string | null>(null);

  // Firestore listener waiting for the Authority (Telegram bot) to press the inline button
  useEffect(() => {
     let unsub: any = null;
     if (docId) {
        unsub = onSnapshot(doc(db, "hitos_legales", docId), (snap) => {
           const data = snap.data();
           if (data && data.status === "APROBADO") {
              setTelegramStatus("approved");
           } else if (data && data.status === "RECHAZADO") {
              setTelegramStatus("rejected");
           }
        });
     }
     return () => { if (unsub) unsub(); }
  }, [docId]);

  const handleTelegramDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTelegramStatus("sending");
    
    try {
        // 1. Create pending record in Firebase Database
        const newRef = await addDoc(collection(db, "hitos_legales"), {
           vessel,
           type: hitoType,
           comments,
           status: "PENDIENTE",
           createdAt: new Date().toISOString()
        });
        
        setDocId(newRef.id);
        
        // 2. Call the Express backend to fire the node-telegram-bot-api request
        const res = await fetch("/api/telegram/send-approval", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                docId: newRef.id,
                ente: hitoType.includes("SENIAT") ? "SENIAT" : "INEA",
                titulo: hitoType,
                detalles: comments || "Solicitud de autorización sin novedades.",
                vesselName: vessel
            })
        });

        if (res.ok) {
           setTelegramStatus("sent");
        } else {
           setTelegramStatus("error");
        }
    } catch(err) {
        console.error(err);
        setTelegramStatus("error");
    }
  };

  const resetFlow = () => {
     setTelegramStatus("idle");
     setDocId(null);
  };

  return (
    <div className="w-full bg-background-muted min-h-[100dvh]">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-background/10 rounded-full flex items-center justify-center mb-4 md:mb-6 md:mx-0 mx-auto">
            <Scale className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Documentos Legales y Autoridades
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Hitos legales de capitanía y notificaciones de despachos en tiempo real.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-background p-6 md:p-12 shadow-sm border border-border/50 rounded-sm">
            <div className="prose prose-lg text-foreground-muted max-w-none">
              <h3 className="text-2xl font-black text-secondary font-sansita mb-4 flex items-center gap-2">
                <Anchor className="text-primary mt-1" size={24} /> Emisión de Arribos y Zarpes (Capitanía)
              </h3>
              <p className="mb-4 text-sm font-sans">
                Para el cumplimiento con el Instituto Nacional de los Espacios Acuáticos (INEA) y la Capitanía de Puertos,
                Serviport establece trazabilidad estricta de cada escala. Los hitos legales son auditados vía Telegram a las autoridades de guardia.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                 <div className="border border-slate-200 p-4 rounded bg-slate-50">
                    <h4 className="font-bold text-emerald-700 font-mono text-sm tracking-widest uppercase mb-2">Hito 1: Pre-Arribo (72 / 48 / 24 hrs)</h4>
                    <ul className="text-xs space-y-1 mt-2 text-slate-600 font-sans">
                       <li>- Validación de certificado estatutario.</li>
                       <li>- Solicitud de atraque y practicaje.</li>
                       <li>- Interceptación con Seniat aduanas.</li>
                    </ul>
                 </div>
                 <div className="border border-slate-200 p-4 rounded bg-slate-50">
                    <h4 className="font-bold text-blue-700 font-mono text-sm tracking-widest uppercase mb-2">Hito 2: Despacho de Salida (Zarpe)</h4>
                    <ul className="text-xs space-y-1 mt-2 text-slate-600 font-sans">
                       <li>- Confirmación de liberación comercial.</li>
                       <li>- Sello digital de la capitanía local.</li>
                       <li>- Broadcast a sistemas navieros matriz.</li>
                    </ul>
                 </div>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Información Financiera
              </h3>
              <p className="mb-4">
                <strong>Régimen de facturación fiscal venezolano:</strong>{" "}
                Serviport emite facturas con doble denominación en Bolívares
                (VES) y Dólares estadounidenses (USD) según la tasa oficial
                diaria del Banco Central de Venezuela (BCV).
              </p>
              <p className="mb-8">
                <strong>Moneda base de operación:</strong> Bolívar venezolano
                (VES). Referencia constante: USD.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Datos Registrales
              </h3>
              <p className="mb-8 text-sm">
                <strong>Razón Social:</strong> Serviport Agentes Navieros, C.A.<br />
                <strong>RIF:</strong> J-50161779-1<br />
                <strong>Dirección Principal:</strong> Puerto de Puerto Cabello, Terminal Marítima, Estado Carabobo, Venezuela.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary font-bold hover:text-foreground transition-colors uppercase tracking-wider text-sm"
              >
                <ArrowLeft size={18}  /> VOLVER AL INICIO
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded shadow-xl relative overflow-hidden h-fit sticky top-24 text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={120} className="text-primary" />
             </div>
             <h3 className="text-xl font-bold font-mono tracking-wider mb-2 relative z-10 flex items-center gap-2">
                <Send size={20} className="text-[#0088cc]" /> TELEGRAM DISPATCH
             </h3>
             <p className="text-xs text-slate-400 mb-6 font-sans">Gateway directo con Capitanía y Autoridades.</p>

             <form onSubmit={handleTelegramDispatch} className="space-y-4 relative z-10 text-slate-800">
                 <div>
                   <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-300 mb-1">Buque</label>
                   <select 
                     value={vessel} 
                     onChange={(e) => setVessel(e.target.value)}
                     disabled={telegramStatus !== "idle" && telegramStatus !== "error"}
                     className="w-full bg-slate-800 border-none rounded text-white p-2.5 text-sm outline-none disabled:opacity-50">
                      <option>ZIM LUANDA (V202)</option>
                      <option>MSC ROSARIA (V105)</option>
                      <option>CMA CGM GEMINI</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-300 mb-1">Tipo de Hito Legal</label>
                   <select 
                     value={hitoType}
                     onChange={(e) => setHitoType(e.target.value)}
                     disabled={telegramStatus !== "idle" && telegramStatus !== "error"}
                     className="w-full bg-slate-800 border-none rounded text-white p-2.5 text-sm outline-none relative z-10 disabled:opacity-50">
                      <option>Levante SENIAT / Declaración de Aduanas</option>
                      <option>NOTIFICACIÓN DE ARRIBO (24HRS)</option>
                      <option>LIBERACIÓN Y DESPACHO DE ZARPE</option>
                      <option>Control INSAI Agropecuario</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-300 mb-1">Comentario para Autoridad</label>
                   <textarea rows={3} 
                     value={comments}
                     onChange={(e) => setComments(e.target.value)}
                     disabled={telegramStatus !== "idle" && telegramStatus !== "error"}
                     className="w-full bg-slate-800 border-none rounded text-white p-2 text-sm outline-none resize-none font-mono disabled:opacity-50" placeholder="Sin novedad. Solicitud conforme..."></textarea>
                </div>

                {(telegramStatus === "idle" || telegramStatus === "error") && (
                  <button 
                    type="submit" 
                    className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white py-3 px-4 rounded font-bold transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Emitir Broadcast Oficial a Telegram
                  </button>
                )}

                {(telegramStatus === "sending" || telegramStatus === "sent") && (
                  <div className="w-full bg-amber-500/20 text-amber-400 py-4 px-4 rounded font-bold uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-2 border border-amber-500/50">
                    <Clock size={24} className="animate-spin-slow mb-1" />
                    <span>Bloqueo Activo: Esperando Autoridad</span>
                    <span className="text-[10px] opacity-70 font-mononormal lowercase mt-1 text-center">
                       El sistema operativo está pausado. Un inspector gubernamental debe pinchar el botón "Aprobar" desde su app personal de Telegram.
                    </span>
                  </div>
                )}

                {telegramStatus === "approved" && (
                   <div className="w-full bg-emerald-500/20 text-emerald-400 py-4 px-4 rounded font-bold uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-2 border border-emerald-500/50">
                     <CheckCircle2 size={24} className="mb-1" />
                     <span>Autorización Concedida Vía Telegram</span>
                     <button type="button" onClick={resetFlow} className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-[10px]">
                        Avanzar Despacho y Nueva Solicitud
                     </button>
                   </div>
                )}

                {telegramStatus === "rejected" && (
                   <div className="w-full bg-red-500/20 text-red-400 py-4 px-4 rounded font-bold uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-2 border border-red-500/50">
                     <XCircle size={24} className="mb-1" />
                     <span>Autorización Densgada (SENIAT/INEA)</span>
                     <button type="button" onClick={resetFlow} className="mt-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-[10px]">
                        Contactar Autoridad y Resetear
                     </button>
                   </div>
                )}

                <div className="mt-4 bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[10px] text-emerald-500 leading-tight break-all">
                   {telegramStatus === "idle" ? "> Waiting command...\n> Ready to proxy /webhook" :
                    telegramStatus === "sending" ? "> Encrypting payload... \n> POST api.telegram.org/bot...\n> Pinging Webhook..." :
                    telegramStatus === "sent" ? "> 200 OK. Notification delivered successfully.\n> Awaiting InlineKeyboard callback_query..." :
                    telegramStatus === "approved" ? `> Webhook Event Received!\n> doc_id: ${docId}\n> status: APPROVED\n> Lock released.` :
                    telegramStatus === "rejected" ? `> Webhook Event Received!\n> doc_id: ${docId}\n> status: REJECTED\n> Lock maintained.` :
                    "> ERROR 500. Unable to reach Telegram API."
                   }
                </div>
             </form>
          </div>

        </div>
      </section>
    </div>
  );
}
