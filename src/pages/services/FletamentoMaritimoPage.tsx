import {
  ArrowLeft, ArrowRight,
  Compass,
  Ship,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

export function FletamentoMaritimoPage() {
  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="/services/fletamento.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <Link
            to="/servicios"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-colors uppercase tracking-wider text-xs mb-6 mx-auto md:mx-0"
          >
            <ArrowLeft size={16}  /> Volver a Servicios
          </Link>
          <br />
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Chartering
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Fletamento Marítimo
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Intermediación y cotización de buques para el transporte de grandes
            volúmenes y proyectos a escala global.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center mb-6">
                <Compass className="text-primary" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-4">
                La ruta ideal para tu carga a gran escala
              </h2>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <p className="text-foreground-muted leading-relaxed text-lg">
                Serviport conecta a armadores y fletadores con la flota adecuada
                según el tipo de mercancía, ruta y condiciones requeridas.
                Facilitamos el arrendamiento (fletamento) de motonaves completas
                para el traslado eficaz y competitivo de grandes toneladas de
                materias primas o equipos sobredimensionados hasta o desde
                puertos venezolanos.
              </p>

              <div className="space-y-4 pt-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-background-muted border border-border p-2 rounded shrink-0 text-foreground">
                    <Ship size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">
                      Tipos de Carga
                    </h4>
                    <p className="text-foreground-muted text-sm mt-1">
                      Buques especializados para carga a granel (sólida y
                      líquida), carga refrigerada en flota dedicada, mercancía
                      general, contenerizada y cargas proyecto (Heavy Lift).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-background-muted border border-border p-2 rounded shrink-0 text-foreground">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">
                      Negociación y Contratos
                    </h4>
                    <p className="text-foreground-muted text-sm mt-1">
                      Asesoría para modalidades de Time Charter y Voyage
                      Charter, protegiendo financieramente la carga y logrando
                      tarifas competitivas en el mercado mundial.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-background-muted border border-border p-8 md:p-10 rounded-sm">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Servicios de Chartering
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 border-b border-border pb-4">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-foreground-muted font-medium">
                    Búsqueda rápida de tonelaje disponible y posición de buques
                    a nivel global.
                  </span>
                </li>
                <li className="flex items-start gap-3 border-b border-border pb-4">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-foreground-muted font-medium">
                    Negociación de los términos y condiciones de flete (Charter
                    Party).
                  </span>
                </li>
                <li className="flex items-start gap-3 border-b border-border pb-4">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-foreground-muted font-medium">
                    Coordinación directa de operaciones de embarque/desembarque.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-foreground-muted font-medium">
                    Asesoría integral en cálculo de tiempos, laytime, demoras y
                    despachos.
                  </span>
                </li>
              </ul>
              <Link
                to="/herramientas"
                className="mt-8 flex items-center justify-center gap-2 bg-secondary text-white font-bold py-3 px-6 rounded-sm hover:bg-slate-800 transition-colors uppercase text-sm tracking-wider w-full"
              >
                Solicitar Cotización de Buque
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
