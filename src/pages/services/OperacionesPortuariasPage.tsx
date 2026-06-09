import { ArrowLeft, ArrowRight, CheckCircle2, HardHat, Forklift, Box } from "lucide-react";
import { Link } from "react-router-dom";

export function OperacionesPortuariasPage() {
  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="/services/operaciones.png"
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
            Port Operations
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Operaciones Portuarias
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Estiba, desestiba y manejo de patio con cuadrillas profesionales y
            maquinaria de alta capacidad.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center mb-6">
                <Box className="text-primary" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-4">
                Estiba y Desestiba
              </h2>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <p className="text-foreground-muted leading-relaxed text-lg">
                Ejecutamos operaciones de carga y descarga de navíos con
                cuadrillas profesionales de estibadores certificados. Serviport
                maneja todo tipo de carga garantizando los más altos estándares
                de seguridad y eficiencia en el puerto.
              </p>
            </div>

            <div className="bg-background-muted border border-border rounded-sm p-8 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Tipos de carga que manejamos:
              </h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={18}
                  />{" "}
                  <span className="text-foreground-muted">
                    Contenedores llenos (FCL) y vacíos.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={18}
                  />{" "}
                  <span className="text-foreground-muted">
                    Carga a granel (granos, cereales) a silos.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={18}
                  />{" "}
                  <span className="text-foreground-muted">
                    Carga general y suelta (breakbulk).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={18}
                  />{" "}
                  <span className="text-foreground-muted">
                    Carga refrigerada (reefers).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={18}
                  />{" "}
                  <span className="text-foreground-muted">
                    Carga peligrosa bajo normas IMDG.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-primary shrink-0 mt-0.5"
                    size={18}
                  />{" "}
                  <span className="text-foreground-muted">
                    Buques Ro-Ro y cargas proyectos.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative rounded-xl overflow-hidden shadow-2xl h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80"
                alt="Maquinaria de Patio"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <div className="w-16 h-16 bg-accent/10 rounded flex items-center justify-center mb-6">
                <Forklift className="text-accent" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-4">
                Manejo de Patio y Maquinaria
              </h2>
              <div className="w-16 h-1 bg-accent mb-6"></div>
              <p className="text-foreground-muted leading-relaxed text-lg mb-6">
                Realizamos operaciones con equipos pesados de alta capacidad en
                el terminal portuario, garantizando agilidad en el movimiento de
                contenedores y carga sobredimensionada.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="bg-secondary text-white p-2 rounded shrink-0">
                    <HardHat size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      Grúas Inteligentes
                    </h4>
                    <p className="text-sm text-foreground-muted">
                      Grúas móviles y flotantes con capacidad desde 25 hasta más
                      de 100 toneladas.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-secondary text-white p-2 rounded shrink-0">
                    <Forklift size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      Reach Stackers y Montacargas
                    </h4>
                    <p className="text-sm text-foreground-muted">
                      Equipamiento robusto para el apilamiento de contenedores y
                      manejo de carga general/paletizada.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-secondary text-white p-2 rounded shrink-0">
                    <Box size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      Alquiler de Aparejos
                    </h4>
                    <p className="text-sm text-foreground-muted">
                      Alquiler de aparejos de estiba, chasis con genset y
                      maquinaria complementaria porta contenedores.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
