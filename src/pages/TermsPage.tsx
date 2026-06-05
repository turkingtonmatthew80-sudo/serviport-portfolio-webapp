import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function TermsPage() {
  return (
    <div className="w-full bg-slate-50 min-h-[100dvh]">
      <section className="bg-[#0b1a2e] pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Términos y Condiciones</h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium">
            Normativas legales sobre responsabilidades de transporte, estiba y depósito aduanero.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
          <div className="prose prose-lg text-gray-600 max-w-none">
            <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Responsabilidades de Transporte</h3>
            <p className="mb-8">
              Serviport actúa como intermediario logístico y operador portuario. Las responsabilidades por daños durante el transporte terrestre se rigen por el contrato de transporte específico y la póliza de seguro contratada para cada operación.
            </p>

            <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Estiba y Desestiba</h3>
            <p className="mb-8">
              Las operaciones de carga y descarga se ejecutan conforme a las normas de seguridad portuaria de Bolipuertos S.A. y los estándares internacionales de la OMI. Serviport declina responsabilidad por daños originados en condiciones climáticas extremas, fuerza mayor o defectos preexistentes en la carga no declarados.
            </p>

            <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Depósito Aduanero y Almacenaje</h3>
            <p className="mb-8">
              El almacenaje en AGD se regula por las normas del SENIAT y la Superintendencia de Aduanas. El cliente es responsable de la veracidad de la documentación aduanera presentada. Los contenedores en estado de abandono serán reubicados según normativa vigente y podrán ser subastados conforme a la ley aduanera venezolana.
            </p>

            <h3 className="text-2xl font-bold text-[#0b1a2e] mb-4">Tarifas y Pagos</h3>
            <p className="mb-8">
              Las tarifas están definidas en el catálogo de servicios del sistema. El Tariff Engine calcula automáticamente el costo según servicios prestados y tarifas vigentes. El cliente debe aprobar la proforma antes de la emisión de la factura fiscal definitiva.
            </p>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100">
             <Link to="/" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-[#0b1a2e] transition-colors uppercase tracking-wider text-sm">
               <ArrowRight size={18} className="rotate-180" /> VOLVER AL INICIO
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
