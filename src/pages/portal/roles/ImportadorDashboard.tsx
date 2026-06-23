import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Map, LayoutDashboard, Clock, AlertCircle, CheckCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function ImportadorDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
           Panel de Importador (Consignatario)
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
           Torre de Control Financiera & Visibilidad Aduanera
        </p>
      </div>

      {/* Widget del Doble Reloj & Semaforo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Doble Reloj */}
         <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg flex items-center gap-2">
                 <Clock className="text-primary w-5 h-5"/> Costos & Tiempo Libre (BL: MEDU1234567)
               </h2>
               <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full">3 Contenedores Activos</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Reloj Naviera (Demurrage) */}
               <div className="flex flex-col items-center p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <h3 className="font-semibold text-sm mb-4 text-blue-800 dark:text-blue-300">Free Time Naviera (Demurrage)</h3>
                  {/* Circular Progress Mockup */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="10" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-blue-500" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset="80.7" strokeLinecap="round"/>
                     </svg>
                     <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-blue-600">5</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">/ 7 Días</span>
                     </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">Faltan 2 días para recargo por demora del equipo.</p>
               </div>

               {/* Reloj Bolipuertos (Almacenaje) */}
               <div className="flex flex-col items-center p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <h3 className="font-semibold text-sm mb-4 text-emerald-800 dark:text-emerald-300">Días Libres Puerto (Almacenaje)</h3>
                  {/* Circular Progress Mockup */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="10" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-red-500" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset="0" strokeLinecap="round"/>
                     </svg>
                     <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-red-600">6</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">/ 5 Días</span>
                     </div>
                  </div>
                  <p className="text-xs text-red-600 font-semibold mt-4 text-center text-balance flex items-center gap-1 justify-center">
                     <AlertCircle className="w-3 h-3" /> Generando Almacenaje
                  </p>
               </div>
            </div>
         </div>

         {/* Semaforo de Selectividad */}
         <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="text-primary w-5 h-5"/> Selectividad SENIAT
            </h2>
            <div className="space-y-4 flex-1">
               <div className="flex items-center gap-4 bg-muted/40 p-3 rounded-lg border border-border/50 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 border-2 border-green-500 flex items-center justify-center">
                     <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                     <p className="text-sm font-semibold">Canal Verde</p>
                     <p className="text-xs text-muted-foreground">Levante Automático. (0 Conts)</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 bg-muted/40 p-3 rounded-lg border border-border/50 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500 flex items-center justify-center">
                     <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div>
                     <p className="text-sm font-semibold">Canal Amarillo</p>
                     <p className="text-xs text-muted-foreground">Revisión Documental (0 Conts)</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-200 dark:border-red-900/30 ring-1 ring-red-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-red-500 animate-pulse"></div>
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 border-2 border-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                     <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                     <p className="text-sm font-bold text-red-800 dark:text-red-400">Canal Rojo</p>
                     <p className="text-xs text-red-700/80 dark:text-red-300/80">Aforo Físico Requerido (3 Conts)</p>
                  </div>
               </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic text-center">Nota: Canal rojo genera cargos automáticos por movilización (Reach Stacker) en patio.</p>
         </div>
      </div>

   </div>
  );
}
