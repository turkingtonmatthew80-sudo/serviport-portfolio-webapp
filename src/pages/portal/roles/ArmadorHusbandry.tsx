import React, { useState } from "react";
import { Droplets, Fuel, Trash2, Users, FileSignature, UploadCloud, ChevronRight, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function ArmadorHusbandry() {
  const { user } = useAuth();
  const [crewStatus, setCrewStatus] = useState<'pending' | 'transmitted' | 'approved'>('pending');

  const simulateCrewTransmission = () => {
    setCrewStatus('transmitted');
    setTimeout(() => {
       setCrewStatus('approved');
    }, 2500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
           Servicios de Husbandría y Tripulación
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Gestión de aprovisionamientos y cumplimiento migratorio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         
         {/* Tarjeta Agua y Bunker */}
         <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
               <div className="p-2.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                  <Droplets className="w-5 h-5" />
               </div>
               <span className="text-xs font-semibold px-2 py-1 bg-muted text-muted-foreground rounded-full">Provisión</span>
            </div>
            <h3 className="font-bold text-lg mb-1">Agua Potable & Bunkering</h3>
            <p className="text-sm text-muted-foreground mb-6">Solicitud de gabarra para suministro de agua fresca y combustible (MGO/HFO).</p>
            
            <div className="mt-auto space-y-4">
               <div>
                 <label className="text-xs font-medium mb-1 block">Agua Potable (MT)</label>
                 <div className="flex bg-muted/50 rounded-md border p-1">
                    <input type="number" defaultValue="150" className="bg-transparent border-none w-full outline-none px-2 text-sm" />
                    <span className="text-xs text-muted-foreground self-center px-2">~ $750.00</span>
                 </div>
               </div>
               <div>
                 <label className="text-xs font-medium mb-1 block">Combustible MGO (MT)</label>
                 <div className="flex bg-muted/50 rounded-md border p-1">
                    <input type="number" defaultValue="20" className="bg-transparent border-none w-full outline-none px-2 text-sm" />
                    <span className="text-xs text-muted-foreground self-center px-2">~ $14,200.00</span>
                 </div>
               </div>
               <button className="w-full bg-primary text-white font-medium py-2 rounded-md text-sm hover:bg-primary/90 mt-2">
                 Solicitar Abastecimiento
               </button>
            </div>
         </div>

         {/* Tarjeta Gestion MARPOL */}
         <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col h-full bg-amber-50/30 dark:bg-amber-900/5">
            <div className="flex items-start justify-between mb-4">
               <div className="p-2.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg">
                  <Trash2 className="w-5 h-5" />
               </div>
               <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 rounded-full flex items-center gap-1">
                 <AlertCircle className="w-3 h-3"/> Requerido IMO
               </span>
            </div>
            <h3 className="font-bold text-lg mb-1">Gestión MARPOL</h3>
            <p className="text-sm text-muted-foreground mb-6">Descarga obligatoria de lodos (Sludge) y aguas oleosas según convenios internacionales.</p>
            
            <div className="mt-auto space-y-4">
               <div>
                 <label className="text-xs font-medium mb-1 block">Volumen Sludge (m³)</label>
                 <input type="number" defaultValue="12.5" className="w-full bg-background border px-3 py-1.5 rounded-md text-sm" />
               </div>
               <div className="border border-dashed border-muted-foreground/30 p-3 rounded-md text-center bg-background/50 hover:bg-muted/50 cursor-pointer transition-colors">
                  <UploadCloud className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Adjuntar Declaración Jurada PDF</p>
               </div>
               <button className="w-full bg-amber-600 text-white font-medium py-2 rounded-md text-sm hover:bg-amber-700 mt-2">
                 Programar Camión Vacuum
               </button>
            </div>
         </div>

         {/* Tarjeta Cambio de Tripulacion */}
         <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
               <div className="p-2.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">
                  <Users className="w-5 h-5" />
               </div>
               <span className="text-xs font-semibold px-2 py-1 bg-muted text-muted-foreground rounded-full">Crew Desk</span>
            </div>
            <h3 className="font-bold text-lg mb-1">Crew Change (SAIME / INEA)</h3>
            <p className="text-sm text-muted-foreground mb-4">Gestión de On-signers y Off-signers. Al transmitir, se envía webhook a autoridades para emisión de Shore Pass.</p>
            
            <div className="mt-auto bg-muted/40 p-3 rounded-lg border text-sm max-h-32 overflow-y-auto mb-4 space-y-2">
               {/* Simulating AG grid with simple list for visual purpose */}
               <div className="flex justify-between items-center text-xs">
                 <span className="font-medium">Carlos Rivera (Capitán)</span>
                 <span className="text-blue-600 font-semibold text-[10px] uppercase bg-blue-100 px-1.5 py-0.5 rounded">ON-SIGNER</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="font-medium">J. Smith (Ch. Eng.)</span>
                 <span className="text-orange-600 font-semibold text-[10px] uppercase bg-orange-100 px-1.5 py-0.5 rounded">OFF-SIGNER</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="font-medium">A. García (Marinero)</span>
                 <span className="text-blue-600 font-semibold text-[10px] uppercase bg-blue-100 px-1.5 py-0.5 rounded">ON-SIGNER</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="font-medium">R. Silva (Mecánico)</span>
                 <span className="text-blue-600 font-semibold text-[10px] uppercase bg-blue-100 px-1.5 py-0.5 rounded">ON-SIGNER</span>
               </div>
            </div>

            {crewStatus === 'pending' && (
              <button onClick={simulateCrewTransmission} className="w-full border border-primary text-primary hover:bg-primary/5 font-medium py-2 rounded-md text-sm mt-auto flex items-center justify-center gap-2">
                 <ShieldCheck className="w-4 h-4"/> <span>Transmitir a SAIME / Capitanía</span>
              </button>
            )}
            
            {crewStatus === 'transmitted' && (
              <div className="w-full bg-muted text-muted-foreground font-medium py-2 rounded-md text-sm mt-auto flex items-center justify-center gap-2 animate-pulse">
                 <span>Esperando Autoridad (Telegram bot)...</span>
              </div>
            )}

            {crewStatus === 'approved' && (
              <div className="w-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium py-2 rounded-md text-sm mt-auto flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-4 h-4" /> <span>Shore Pass Aprobados</span>
              </div>
            )}
         </div>

      </div>
    </div>
  );
}
