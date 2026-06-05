import { ArrowRight, Hammer, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export function VacanciesPage() {
  return (
    <div className="w-full bg-slate-50 min-h-[calc(100dvh-10rem)] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-xl shadow-slate-200/50 rounded-sm border border-gray-100 overflow-hidden text-center flex flex-col">
        <div className="bg-[#0b1a2e] py-16 px-8 relative overflow-hidden flex flex-col items-center">
           <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <Briefcase size={200} className="text-white -rotate-12" />
           </div>
           <div className="w-20 h-20 bg-[#00A9CE]/20 rounded-full flex items-center justify-center mb-6 relative z-10">
             <Hammer className="text-[#00A9CE]" size={36} />
           </div>
           <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 relative z-10">Portal de Empleos</h1>
           <span className="inline-block px-4 py-1.5 bg-[#F7941D] text-white font-bold tracking-wider text-xs uppercase rounded-sm relative z-10">
             En Construcción
           </span>
        </div>
        
        <div className="p-10 md:p-16 flex flex-col items-center">
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium mb-10 max-w-xl">
            Actualmente estamos trabajando en nuestro portal de vacantes digitales. Si deseas postularte a ofertas laborales o enviar tu síntesis curricular a nuestro equipo de Recursos Humanos, por favor contáctanos directamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/contacto" 
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#00A9CE] text-white font-bold py-4 px-8 rounded-sm hover:bg-[#008EBF] transition-colors uppercase tracking-wider text-sm"
            >
              SOLICITAR MÁS INFORMACIÓN
            </Link>
            <Link 
              to="/nosotros/carreras" 
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white border border-[#0b1a2e] text-[#0b1a2e] font-bold py-4 px-8 rounded-sm hover:bg-[#0b1a2e] hover:text-white transition-colors uppercase tracking-wider text-sm"
            >
              <ArrowRight size={18} className="rotate-180" /> VOLVER
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
