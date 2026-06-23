import React from "react";
import { Ship, DollarSign, AlertTriangle, CheckCircle, Navigation, Info, Clock, Thermometer, Droplets, Wind } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function ArmadorDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
             <Ship className="w-6 h-6 text-primary" /> Panel de Control de Flota
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Supervisión operativa y cumplimiento (Shipowner Dashboard)</p>
        </div>
        
        {/* Weather & Tide Header Widget */}
        <div className="flex items-center gap-4 bg-muted/40 p-3 rounded-lg border border-border/50 text-sm">
           <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
             <Droplets className="w-4 h-4"/>
             <span>Marea: +0.6m (Subiendo)</span>
           </div>
           <div className="h-6 w-px bg-border"></div>
           <div className="flex items-center gap-2 text-muted-foreground">
             <Wind className="w-4 h-4"/>
             <span>Viento: 12 nudos (NNE)</span>
           </div>
           <div className="h-6 w-px bg-border"></div>
           <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
             <Thermometer className="w-4 h-4"/>
             <span>28°C</span>
           </div>
        </div>
      </div>

      {/* Alertas Criticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5" />
            <div>
               <h3 className="font-semibold text-red-800 dark:text-red-400 text-sm">Certificado SMC por vencer</h3>
               <p className="text-red-700/80 dark:text-red-300/80 text-xs mt-1">El certificado SMC del buque M/N Horizon (IMO: 9123456) vence en 5 días. Esto bloqueará futuros registros de escala.</p>
            </div>
         </div>
         <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-900/10 flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div>
               <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 text-sm">PDA Pendiente de Fondeo</h3>
               <p className="text-yellow-700/80 dark:text-yellow-300/80 text-xs mt-1">La Proforma (PDA) para la escala PC-HOR-169854 requiere fondeo anticipado ($4,850.00 USD).</p>
            </div>
         </div>
      </div>

      {/* Vessel Timeline */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-lg font-bold">Viaje Activo: M/N Horizon</h2>
               <p className="text-sm text-muted-foreground mt-1">Escala ID: PC-HOR-169854 | Destino: Puerto Cabello</p>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> EN OPERACIONES
            </div>
         </div>

         <div className="relative">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-muted-foreground/20 z-0"></div>
            
            <div className="relative z-10 flex justify-between">
               {/* Step 1: Anuncio ETA */}
               <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-background">
                     <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="text-center mt-3">
                     <p className="text-sm font-semibold">Anuncio ETA</p>
                     <p className="text-xs text-muted-foreground">Completado</p>
                  </div>
               </div>
               
               {/* Step 2: Fondeadero */}
               <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-background">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="text-center mt-3">
                     <p className="text-sm font-semibold">Fondeadero</p>
                     <p className="text-xs text-muted-foreground">Completado</p>
                  </div>
               </div>

               {/* Step 3: Piloto a Bordo */}
               <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-background">
                     <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="text-center mt-3">
                     <p className="text-sm font-semibold">Piloto a Bordo</p>
                     <p className="text-xs text-muted-foreground">Completado</p>
                  </div>
               </div>

               {/* Step 4: Atracado */}
               <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-background">
                     <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="text-center mt-3">
                     <p className="text-sm font-semibold">Atracado</p>
                     <p className="text-xs text-muted-foreground">Muelle 04</p>
                  </div>
               </div>

               {/* Step 5: Operaciones (Current) */}
               <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md ring-4 ring-blue-500/20 animate-pulse">
                     <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-center mt-3">
                     <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Operaciones</p>
                     <p className="text-xs text-muted-foreground">54% Completado</p>
                  </div>
               </div>

               {/* Step 6: Zarpe */}
               <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-muted-foreground/30 text-muted-foreground flex items-center justify-center text-sm ring-4 ring-background">
                     <Navigation className="w-4 h-4" />
                  </div>
                  <div className="text-center mt-3">
                     <p className="text-sm font-medium text-muted-foreground">Zarpe</p>
                     <p className="text-xs text-muted-foreground opacity-50">Pendiente Clearance</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
