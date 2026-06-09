import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function TermsPage() {
  return (
    <div className="w-full bg-background-muted min-h-[100dvh]">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-background/10 rounded-full flex items-center justify-center mb-4 md:mb-6 md:mx-0 mx-auto">
            <FileText className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Términos y Condiciones
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Normativas legales sobre responsabilidades de transporte, estiba y
            depósito aduanero.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="bg-background p-6 md:p-12 shadow-sm border border-border/50 rounded-sm">
            <div className="prose prose-lg text-foreground-muted max-w-none">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Responsabilidades de Transporte
              </h3>
              <p className="mb-8">
                Serviport actúa como intermediario logístico y operador
                portuario. Las responsabilidades por daños durante el transporte
                terrestre se rigen por el contrato de transporte específico y la
                póliza de seguro contratada para cada operación.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Estiba y Desestiba
              </h3>
              <p className="mb-8">
                Las operaciones de carga y descarga se ejecutan conforme a las
                normas de seguridad portuaria de Bolipuertos S.A. y los
                estándares internacionales de la OMI. Serviport declina
                responsabilidad por daños originados en condiciones climáticas
                extremas, fuerza mayor o defectos preexistentes en la carga no
                declarados.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Depósito Aduanero y Almacenaje
              </h3>
              <p className="mb-8">
                El almacenaje en AGD se regula por las normas del SENIAT y la
                Superintendencia de Aduanas. El cliente es responsable de la
                veracidad de la documentación aduanera presentada. Los
                contenedores en estado de abandono serán reubicados según
                normativa vigente y podrán ser subastados conforme a la ley
                aduanera venezolana.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Tarifas y Pagos
              </h3>
              <p className="mb-8">
                Las tarifas están definidas en el catálogo de servicios del
                sistema. El Tariff Engine calcula automáticamente el costo según
                servicios prestados y tarifas vigentes. El cliente debe aprobar
                la proforma antes de la emisión de la factura fiscal definitiva.
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
        </div>
      </section>
    </div>
  );
}
