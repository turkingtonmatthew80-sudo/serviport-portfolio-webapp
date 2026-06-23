import React, { useState } from "react";
import { DollarSign, UploadCloud, FileText, CheckCircle2, History, Anchor, Info, AlertTriangle } from "lucide-react";

export function ArmadorCuentas() {
  const [activeTab, setActiveTab] = useState<'pda' | 'fda'>('pda');
  const [paymentCurrency, setPaymentCurrency] = useState<'USD' | 'VES'>('USD');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isFunded, setIsFunded] = useState(false);
  const [differentialWarning, setDifferentialWarning] = useState(false);

  // Ex: PDA total is $4,850.00 USD. BCV Rate: 38.50
  const totalPdaUsd = 4850.00;
  const bcvRate = 38.50;
  const requiredVes = totalPdaUsd * bcvRate; 

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPaymentAmount(val);
    if (paymentCurrency === 'VES' && val !== '') {
       const numVal = parseFloat(val);
       // Check if difference is within 0.5% tolerance
       const diff = Math.abs(numVal - requiredVes) / requiredVes;
       if (diff > 0.005) {
          setDifferentialWarning(true);
       } else {
          setDifferentialWarning(false);
       }
    } else {
       setDifferentialWarning(false);
    }
  };

  const simulateFunding = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsFunded(true);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 flex flex-col h-full bg-muted/10">
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Finanzas y Estado de Cuentas</h1>
        <p className="text-muted-foreground mt-1 text-sm">Proforma Disbursement Account (PDA) y Conciliación (FDA).</p>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button 
           onClick={() => setActiveTab('pda')} 
           className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'pda' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
           PDA (Fondeo Anticipado)
        </button>
        <button 
           onClick={() => setActiveTab('fda')} 
           className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'fda' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
           FDA (Liquidación Final)
        </button>
      </div>

      {activeTab === 'pda' && (
        <div className="flex flex-col lg:flex-row gap-6">
           {/* Left: PDA Readonly Breakdown */}
           <div className="lg:w-1/2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-muted px-5 py-4 border-b flex justify-between items-center">
                 <div>
                    <h3 className="font-bold">Desglose de PDA</h3>
                    <p className="text-xs text-muted-foreground">Escala: PC-HOR-169854 | Buque: M/N Horizon</p>
                 </div>
                 <div className="bg-primary/10 text-primary p-2 rounded flex items-center justify-center">
                    <FileText className="w-5 h-5"/>
                 </div>
              </div>
              
              <div className="flex-1 p-5 space-y-4">
                 <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between items-center border-b pb-2 border-dashed border-border">
                       <span>Muellaje (Eslora x Tiempo Est.)</span>
                       <span>$1,250.00</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 border-dashed border-border">
                       <span>Practicaje (In/Out)</span>
                       <span>$850.00</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 border-dashed border-border">
                       <span>Uso de Remolcador (Base)</span>
                       <span>$1,800.00</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 border-dashed border-border text-muted-foreground">
                       <span>Agua Potable (Estimado 150 MT)</span>
                       <span>$750.00</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 border-dashed border-border text-muted-foreground">
                       <span>Manejo de Desechos MARPOL</span>
                       <span>$200.00</span>
                    </div>
                 </div>
              </div>

              <div className="bg-primary/5 p-5 border-t border-primary/20 flex justify-between items-center">
                 <span className="font-bold text-lg">TOTAL A FONDEAR</span>
                 <span className="font-black text-2xl text-primary font-mono">${totalPdaUsd.toLocaleString(undefined, {minimumFractionDigits: 2})} USD</span>
              </div>
           </div>

           {/* Right: Payment Dropzone */}
           <div className="lg:w-1/2 bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
              <h3 className="font-bold mb-1">Registrar Fondeo</h3>
              <p className="text-sm text-muted-foreground mb-6">El buque no será autorizado a atracar hasta confirmar recepción de fondos.</p>
              
              {!isFunded ? (
                 <div className="space-y-6 flex-1">
                    <div className="flex gap-4">
                       <div className="flex-1">
                          <label className="text-xs font-medium mb-1.5 block">Moneda de Pago</label>
                          <select 
                             className="w-full bg-background border rounded-md px-3 py-2 text-sm outline-none"
                             value={paymentCurrency}
                             onChange={(e) => setPaymentCurrency(e.target.value as 'USD' | 'VES')}
                          >
                             <option value="USD">Dólares (USD - Swift/ACH)</option>
                             <option value="VES">Bolívares (VES - BCV)</option>
                          </select>
                       </div>
                       <div className="flex-1">
                          <label className="text-xs font-medium mb-1.5 block">Monto Transferido</label>
                          <input 
                             type="number" 
                             className={`w-full bg-background border ${differentialWarning ? 'border-red-400 focus:ring-red-400' : ''} rounded-md px-3 py-2 text-sm outline-none transition-colors`}
                             placeholder={paymentCurrency === 'USD' ? "4850.00" : requiredVes.toFixed(2)}
                             value={paymentAmount}
                             onChange={handleAmountChange}
                          />
                       </div>
                    </div>

                    {paymentCurrency === 'VES' && (
                       <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md border border-blue-100 dark:border-blue-900/30 flex gap-2 text-sm">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          <div className="text-blue-800 dark:text-blue-300">
                             Tasa BCV del día: <span className="font-bold font-mono">Bs. {bcvRate}</span>. 
                             Monto requerido: <span className="font-bold font-mono">Bs. {requiredVes.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                          </div>
                       </div>
                    )}

                    {differentialWarning && (
                       <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-200 dark:border-red-900/30 flex gap-2 text-sm animate-in fade-in slide-in-from-top-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                          <div className="text-red-800 dark:text-red-300">
                             <strong>El monto difiere significativamente del requerido.</strong> El límite de tolerancia cambiaria es 0.5%. Ajuste el diferencial cambiario o su banco rechazará el pago.
                          </div>
                       </div>
                    )}

                    <div>
                       <label className="text-xs font-medium mb-1.5 block">Comprobante (Swift/Transferencia)</label>
                       <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/50 cursor-pointer transition-colors">
                          <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
                          <p className="text-sm font-medium">Arrastre el PDF del Swift aquí</p>
                          <p className="text-xs text-muted-foreground mt-1">Máximo 5MB</p>
                       </div>
                    </div>

                    <div className="pt-2">
                       <button 
                          onClick={simulateFunding}
                          disabled={differentialWarning || paymentAmount === '' || isUploading}
                          className="w-full bg-primary text-white font-medium py-2.5 rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                       >
                          {isUploading ? "Verificando Transacción..." : "Notificar Fondeo de PDA"}
                       </button>
                    </div>
                 </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                       <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">PDA Fondeada</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                       El comprobante ha sido enviado al ERP central. En cuanto el Contador de ServiPort concilie los fondos, se emitirá la autorización de Atraque.
                    </p>
                    <button onClick={() => setIsFunded(false)} className="text-primary text-sm font-medium hover:underline">Subir comprobante adicional</button>
                 </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'fda' && (
         <div className="bg-card border border-border rounded-xl shadow-sm p-8 text-center flex flex-col items-center justify-center h-96">
            <Anchor className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold mb-2">Liquidación Final (FDA) no disponible</h3>
            <p className="text-muted-foreground text-sm max-w-md">
               El buque M/N Horizon aún no ha zarpado. El registro de "Final Disbursement Account" estará disponible una vez cerradas las operaciones físicas y los tiempos exactos de lancheros/remolcadores sean inyectados por el Water Clerk in situ.
            </p>
         </div>
      )}
    </div>
  );
}
