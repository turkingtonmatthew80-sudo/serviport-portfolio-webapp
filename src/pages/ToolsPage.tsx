import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Calculator,
  Monitor,
  Activity,
  ArrowRight,
} from "lucide-react";

export function ToolsPage() {
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const handleTrackAndTrace = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/portal");
  };

  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Monitor size={400} />
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Ecosistema Digital
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold mb-4 md:mb-6 leading-[1.1] text-white">
            Herramientas Digitales
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Monitorea información crítica sobre tus envíos, programa
            simulaciones operativas y solicita cotizaciones en tiempo real.
          </p>
        </div>
      </section>

      {/* TRACK & TRACE SECTION */}
      <section
        id="track"
        className="py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center border-b border-border scroll-mt-20"
      >
        <div className="max-w-[1260px] mx-auto w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
              Localización
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded flex items-center justify-center mb-4 md:mb-6">
              <Search className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-2 md:mb-4 leading-[1.15]">
              Seguimiento de Carga (Track & Trace)
            </h2>
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <p className="text-sm md:text-base text-foreground-muted leading-relaxed font-medium mb-6 md:mb-8">
              Buscador público simplificado para rastrear contenedores en tiempo
              real. Ingresa el número de tu contenedor para conocer el estatus
              general y disponibilidad en el muelle o el Almacén General de
              Depósito.
            </p>

            <form
              onSubmit={handleTrackAndTrace}
              className="bg-background border md:border-2 border-border p-1.5 md:p-2 rounded-lg flex shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all max-w-lg"
            >
              <input
                type="text"
                placeholder="Nº Contenedor (Ej: ABCD1234567)"
                className="w-full px-3 md:px-4 outline-none text-foreground-muted font-mono text-sm md:text-lg uppercase placeholder:normal-case placeholder:font-sans"
                required
              />
              <button
                type="submit"
                className="bg-secondary text-white px-4 md:px-6 py-2 md:py-4 rounded font-bold hover:bg-primary transition-colors whitespace-nowrap text-xs md:text-sm"
              >
                RASTREAR
              </button>
            </form>
            <div className="mt-4 text-[10px] md:text-xs text-foreground-muted flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              Para trazabilidad completa con ubicación exacta, inicia sesión en
              Serviport OS.
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-background-muted p-6 md:p-8 rounded-sm border border-border relative">
              <div className="absolute top-0 right-0 p-4 md:p-6 text-gray-200">
                <Search className="w-16 h-16 md:w-[100px] md:h-[100px]" />
              </div>
              <h4 className="text-base md:text-lg font-bold text-foreground mb-4 md:mb-6">
                Resultados Mostrados
              </h4>
              <ul className="space-y-3 md:space-y-4 relative z-10">
                <li className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border border-border flex items-center justify-center font-bold text-primary shrink-0 text-sm md:text-base">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground text-sm md:text-base">
                      Estatus General
                    </h5>
                    <p className="text-xs md:text-sm text-foreground-muted">
                      En tránsito internacional, En puerto, En AGD, Retirado,
                      Embarcado.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border border-border flex items-center justify-center font-bold text-primary shrink-0 text-sm md:text-base">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground text-sm md:text-base">
                      Ubicación
                    </h5>
                    <p className="text-xs md:text-sm text-foreground-muted">
                      Última ubicación conocida del contenedor reportada por el
                      yard planner.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border border-border flex items-center justify-center font-bold text-primary shrink-0 text-sm md:text-base">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground text-sm md:text-base">
                      Fechas Estimadas
                    </h5>
                    <p className="text-xs md:text-sm text-foreground-muted">
                      Fecha estimada de disponibilidad (importación) o embarque
                      (exportación).
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COTIZADOR EN LINEA */}
      <section
        id="quote"
        className="py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center bg-background-muted border-b border-border scroll-mt-20"
      >
        <div className="max-w-[1260px] mx-auto w-full flex flex-col lg:flex-row-reverse gap-8 lg:gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
              Comercial
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded flex items-center justify-center mb-4 md:mb-6">
              <Calculator className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-2 md:mb-4 leading-[1.15]">
              Cotizador en Línea
            </h2>
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <p className="text-sm md:text-base text-foreground-muted leading-relaxed font-medium mb-4 md:mb-6">
              Herramienta avanzada de solicitudes comerciales para obtener
              tarifas de fletes, almacenaje aduanero, agenciamiento naviero o
              transporte terrestre logístico de manera rápida y eficiente.
            </p>
            <p className="text-sm md:text-base text-foreground-muted leading-relaxed font-medium mb-6 md:mb-8">
              Adjunta manifiestos preliminares o requerimientos especiales y
              recibe una propuesta adaptada a tus necesidades operativas en un
              plazo de respuesta garantizado de 24 a 48 horas.
            </p>
            <button
              onClick={() => navigate("/contacto")}
              className="flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded font-bold hover:bg-primary transition-colors text-xs uppercase tracking-wider"
            >
              SOLICITAR COTIZACIÓN <ArrowRight size={16} />
            </button>
          </div>

          <div className="lg:w-1/2 w-full grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-background p-4 md:p-6 rounded-sm shadow-sm border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-bold text-foreground md:mb-2 text-sm md:text-base mb-1">
                Agenciamiento
              </h4>
              <p className="text-xs md:text-sm text-foreground-muted">
                Cotiza trámites de arribo, estadía y actas.
              </p>
            </div>
            <div className="bg-background p-4 md:p-6 rounded-sm shadow-sm border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-bold text-foreground md:mb-2 text-sm md:text-base mb-1">
                Almacenaje AGD
              </h4>
              <p className="text-xs md:text-sm text-foreground-muted">
                Cotiza custodia, nacionalización y vaciados.
              </p>
            </div>
            <div className="bg-background p-4 md:p-6 rounded-sm shadow-sm border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-bold text-foreground md:mb-2 text-sm md:text-base mb-1">
                Transporte
              </h4>
              <p className="text-xs md:text-sm text-foreground-muted">
                Distribución a todo el territorio nacional.
              </p>
            </div>
            <div className="bg-background p-4 md:p-6 rounded-sm shadow-sm border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-bold text-foreground md:mb-2 text-sm md:text-base mb-1">
                Husbandry
              </h4>
              <p className="text-xs md:text-sm text-foreground-muted">
                Víveres, agua, bunkering portuario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MONITOR OPERATIVO */}
      <section
        id="monitor"
        className="py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center bg-secondary text-white scroll-mt-20"
      >
        <div className="max-w-[1260px] mx-auto w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm border border-white/5">
              Simulación B2B
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-background/10 rounded flex items-center justify-center mb-4 md:mb-6">
              <Activity className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 md:mb-4 leading-[1.15]">
              Monitor Operativo del Puerto
            </h2>
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium mb-4 md:mb-6">
              Visualiza en tiempo real y a escala el estado de las operaciones
              portuarias en el Puerto de Puerto Cabello. Los clientes
              autorizados tienen acceso a diagramas 2D/3D procedurales para
              supervisar el movimiento de barcos, equipos pesados y estiba.
            </p>
            <ul className="text-xs md:text-sm text-slate-300 space-y-2 md:space-y-3 mb-6 md:mb-8">
              <li className="flex items-center gap-2 md:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{" "}
                Puestos de atraque y buques posicionados.
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{" "}
                Nivel de ocupación general de patios.
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{" "}
                Esquema del Almacén General de Depósito.
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{" "}
                Simulación de tiempo acelerado (para clientes).
              </li>
            </ul>
            <button
              onClick={() => navigate("/portal")}
              className="bg-primary text-foreground px-5 py-2.5 rounded font-bold hover:bg-primary hover:text-white transition-colors text-xs uppercase tracking-wider"
            >
              ACCEDER AL PORTAL
            </button>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="aspect-[4/3] md:aspect-video bg-slate-950 rounded flex items-center justify-center border border-white/5 relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 top-auto h-32 md:h-48 bg-gradient-to-t from-primary/20 to-transparent"></div>
              {/* Decorative grid pattern mimicking a digital radar */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:40px_40px]"></div>
              <div className="relative z-10 flex flex-col items-center p-6 text-center">
                <Monitor className="w-12 h-12 md:w-16 md:h-16 text-primary mb-3 md:mb-4 opacity-80" />
                <span className="font-mono text-primary tracking-widest text-xs md:text-sm uppercase">
                  Simulación Activa
                </span>
                <p className="text-slate-500 mt-2 text-[10px] md:text-xs tracking-wide">
                  Requiere credenciales comerciales B2B
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
