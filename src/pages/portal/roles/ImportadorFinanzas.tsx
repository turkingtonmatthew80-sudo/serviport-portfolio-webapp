import React, { useState } from "react";
import { Receipt, DollarSign, Wallet, FileText, Upload, AlertTriangle, ArrowRight, ShieldCheck, Calculator } from "lucide-react";

const INVOICES = [
  { id: "INV-2026-991", type: "Almacenaje (Bolipuertos)", bl: "MEDU1234567", usdAmount: 450.00, bcvIssueDate: 45.10, status: "POR_PAGAR" },
  { id: "INV-2026-882", type: "Demurrage Naviera", bl: "HLCU7654321", usdAmount: 1200.00, bcvIssueDate: 44.80, status: "PAGADA" },
];

export function ImportadorFinanzas() {
  const [bcvToday] = useState(45.50); // Simulated real-time BCV rate
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>("INV-2026-991");
  const [paymentMethod, setPaymentMethod] = useState<"VES_TRANSFER" | "USD_CASH" | "USD_TRANSFER">("VES_TRANSFER");

  const pendingInvoices = INVOICES.filter(i => i.status === "POR_PAGAR");
  const paidInvoices = INVOICES.filter(i => i.status === "PAGADA");

  const activeInvoice = INVOICES.find(i => i.id === selectedInvoice);

  // Calcula diferencial si paga en Bs
  const issueVesAmount = activeInvoice ? activeInvoice.usdAmount * activeInvoice.bcvIssueDate : 0;
  const currentVesAmount = activeInvoice ? activeInvoice.usdAmount * bcvToday : 0;
  const differential = currentVesAmount - issueVesAmount;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
           Finanzas y Pagos Locales
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
           Pasarela bimonetaria con cálculo de diferencial cambiario (BCV).
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         {/* Lista de Facturas */}
         <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
               <div className="bg-muted px-4 py-3 border-b border-border">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><Receipt className="w-4 h-4"/> Por Pagar</h3>
               </div>
               <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
                  {pendingInvoices.map(inv => (
                     <div 
                        key={inv.id} 
                        onClick={() => setSelectedInvoice(inv.id)}
                        className={`p-4 cursor-pointer hover:bg-muted/30 transition-colors ${selectedInvoice === inv.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                     >
                        <div className="flex justify-between items-start mb-1">
                           <span className="font-mono text-sm font-bold text-primary">{inv.id}</span>
                           <span className="font-mono text-sm font-bold text-foreground">${inv.usdAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-xs font-semibold text-foreground">{inv.type}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">Ref B/L: {inv.bl}</p>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
               <div className="bg-muted px-4 py-3 border-b border-border">
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground"><ShieldCheck className="w-4 h-4"/> Historial (Pagadas)</h3>
               </div>
               <div className="divide-y divide-border">
                  {paidInvoices.map(inv => (
                     <div key={inv.id} className="p-4 opacity-70">
                        <div className="flex justify-between items-start mb-1">
                           <span className="font-mono text-sm font-bold text-muted-foreground">{inv.id}</span>
                           <span className="font-mono text-sm font-bold text-muted-foreground">${inv.usdAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{inv.type}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Pasarela de Pago */}
         <div className="lg:w-2/3">
            {activeInvoice ? (
               <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
                  <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/20">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h2 className="text-xl font-bold font-mono">{activeInvoice.id}</h2>
                           <p className="text-sm text-muted-foreground mt-1">{activeInvoice.type} | B/L: {activeInvoice.bl}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm text-foreground mb-1">Total a Pagar (Base)</p>
                           <p className="text-3xl font-black text-foreground tracking-tight">${activeInvoice.usdAmount.toFixed(2)}</p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background border border-border rounded-lg p-3">
                           <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Tasa BCV Emisión</p>
                           <p className="font-mono font-medium text-sm">Bs. {activeInvoice.bcvIssueDate.toFixed(2)}</p>
                        </div>
                        <div className="bg-background border border-border rounded-lg p-3">
                           <p className="text-[10px] text-primary uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Calculator className="w-3 h-3"/> Tasa BCV Hoy</p>
                           <p className="font-mono font-medium text-sm text-primary">Bs. {bcvToday.toFixed(2)}</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                     <h3 className="font-bold text-sm mb-4">Método de Pago</h3>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        <button 
                           onClick={() => setPaymentMethod("VES_TRANSFER")}
                           className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'VES_TRANSFER' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/50'}`}
                        >
                           <Wallet className={`w-5 h-5 ${paymentMethod === 'VES_TRANSFER' ? 'text-primary' : 'text-muted-foreground'}`}/>
                           <span className="text-xs font-semibold text-center mt-1">Transf. Nacionales (Bs)</span>
                        </button>
                        <button 
                           onClick={() => setPaymentMethod("USD_TRANSFER")}
                           className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'USD_TRANSFER' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/50'}`}
                        >
                           <DollarSign className={`w-5 h-5 ${paymentMethod === 'USD_TRANSFER' ? 'text-primary' : 'text-muted-foreground'}`}/>
                           <span className="text-xs font-semibold text-center mt-1">Transf. Internacional ($)</span>
                        </button>
                        <button 
                           onClick={() => setPaymentMethod("USD_CASH")}
                           className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'USD_CASH' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/50'}`}
                        >
                           <Receipt className={`w-5 h-5 ${paymentMethod === 'USD_CASH' ? 'text-primary' : 'text-muted-foreground'}`}/>
                           <span className="text-xs font-semibold text-center mt-1">Efectivo en Taquilla ($)</span>
                        </button>
                     </div>

                     {/* Dynamic Payment Details based on method */}
                     <div className="bg-muted/30 border border-border rounded-lg p-5 flex-1 mb-6">
                        {paymentMethod === "VES_TRANSFER" && (
                           <div className="space-y-4 animate-in fade-in">
                              <p className="text-sm font-medium">Resumen Liquidación (Bs.)</p>
                              <div className="flex justify-between items-center text-sm">
                                 <span className="text-muted-foreground">Monto Base Invocando Tasa Emisión:</span>
                                 <span className="font-mono">Bs. {issueVesAmount.toFixed(2)}</span>
                              </div>
                              {differential > 0 && (
                                 <div className="flex justify-between items-center text-sm text-orange-600 bg-orange-50 dark:bg-orange-950/20 p-2-rounded">
                                    <span className="flex items-center gap-1 font-medium"><AlertTriangle className="w-4 h-4"/> Diferencial Cambiario:</span>
                                    <span className="font-mono font-bold">+ Bs. {differential.toFixed(2)}</span>
                                 </div>
                              )}
                              <div className="pt-3 border-t border-border flex justify-between items-center">
                                 <span className="font-bold">Total a Transferir:</span>
                                 <span className="font-black text-xl font-mono text-primary">Bs. {currentVesAmount.toFixed(2)}</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground italic text-right mt-1">Referencia BCV: {bcvToday.toFixed(2)} x ${activeInvoice.usdAmount.toFixed(2)}</p>

                              <div className="mt-6 space-y-3">
                                 <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Referencia Bancaria</label>
                                 <input type="text" placeholder="Ej. 008123456789" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-primary outline-none" />
                                 <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-background cursor-pointer hover:bg-muted/50 transition-colors">
                                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                    <span className="text-sm font-medium text-muted-foreground">Subir Comprobante (PDF/JPG)</span>
                                 </div>
                              </div>
                           </div>
                        )}
                        {paymentMethod === "USD_TRANSFER" && (
                           <div className="space-y-4 animate-in fade-in flex flex-col items-center justify-center text-center py-8">
                              <p className="text-sm font-medium text-foreground max-w-md">Para realizar el pago internacional vía Wire Transfer (Panamá/USA), por favor solicite las coordenadas bancarias pulsando el botón a continuación.</p>
                              <button className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/90 transition-colors flex items-center gap-2 mt-4">
                                 Solicitar Coordenadas <ArrowRight className="w-4 h-4" />
                              </button>
                           </div>
                        )}
                        {paymentMethod === "USD_CASH" && (
                           <div className="space-y-4 animate-in fade-in flex flex-col items-center justify-center text-center py-8">
                              <AlertTriangle className="w-8 h-8 text-orange-500 mb-2" />
                              <p className="text-sm font-medium text-foreground max-w-md">El pago en divisas conformadas se debe realizar exclusivamente en las taquillas comerciales dentro del terminal.</p>
                              <p className="text-xs text-muted-foreground mt-2 font-mono">Presente la factura Nro: {activeInvoice.id}</p>
                           </div>
                        )}
                     </div>

                     <button className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
                        Procesar Pago {paymentMethod === 'VES_TRANSFER' ? `(Bs. ${currentVesAmount.toFixed(2)})` : ''}
                     </button>
                  </div>
               </div>
            ) : (
               <div className="bg-card border border-border shadow-sm rounded-xl flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
                  Seleccione una factura por pagar
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
