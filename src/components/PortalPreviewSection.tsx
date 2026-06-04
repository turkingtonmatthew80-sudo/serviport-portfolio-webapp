import { Lock, BarChart, FileText, Anchor } from "lucide-react";
import { Link } from "react-router-dom";

export function PortalPreviewSection() {
  return (
    <section className="min-h-[100dvh] flex flex-col justify-center py-24 px-6 bg-gray-50/50 border-b border-gray-200">
      <div className="max-w-[1400px] w-full mx-auto bg-[#0b1a2e] rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Anchor size={400} />
        </div>
        
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          <div className="lg:w-1/2 p-12 lg:p-20 z-10 flex flex-col justify-center">
            <div className="inline-block px-6 py-3 bg-[#00A9CE] text-white font-bold tracking-wider text-sm md:text-base mb-6 uppercase shadow-sm">
              Módulo de Acceso Único
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Accede a Serviport OS
            </h2>
            <p className="text-slate-300 mb-10 leading-relaxed text-lg">
              Portal exclusivo para clientes B2B. Monitorea tus operaciones en tiempo real, gestiona documentos, aprueba proformas y coordina retiros de carga desde cualquier dispositivo.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <BarChart className="text-[#00A9CE]" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Monitoreo en tiempo real</h4>
                  <p className="text-slate-400 text-sm">Escalas de buques y trazabilidad de contenedores en el AGD.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <FileText className="text-[#00A9CE]" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Gestión documental digital</h4>
                  <p className="text-slate-400 text-sm">Aprobación de proformas y descarga de facturas y manifiestos.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/portal" className="bg-[#00A9CE] text-white px-8 py-3.5 rounded font-bold hover:bg-[#008EBF] transition-colors text-center flex items-center justify-center gap-2">
                <Lock size={18} />
                INGRESAR AL PORTAL
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 bg-slate-900 border-l border-white/5 p-12 lg:p-16 flex flex-col justify-center relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#00A9CE]/20 to-transparent pointer-events-none"></div>
             
             <div className="relative z-10">
               <h3 className="text-2xl font-bold text-white mb-4">¿Eres nuevo en Serviport?</h3>
               <p className="text-slate-400 mb-8 leading-relaxed">
                 Únete a nuestra red de clientes B2B. Selecciona los servicios logísticos que necesitas y activa tu suscripción de acceso al portal.
               </p>
               <ul className="text-slate-300 space-y-3 mb-10 text-sm">
                 <li className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full"></div> Perfiles para Navieras, Armadores y BCOs.
                 </li>
                 <li className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full"></div> Solicitudes de Port Calls y Husbandry.
                 </li>
                 <li className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#00A9CE] rounded-full"></div> Coordinación con Agentes de Aduana y Transportistas.
                 </li>
               </ul>

               <Link to="/portal" className="border-2 border-white/20 text-white px-8 py-3.5 rounded font-bold hover:bg-white/10 transition-colors text-center block w-fit">
                 REGISTRO DE CLIENTE B2B
               </Link>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
