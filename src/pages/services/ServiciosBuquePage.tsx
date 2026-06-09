import {
  ArrowLeft, ArrowRight,
  Wrench,
  Package,
  Droplets,
  HeartPulse,
  HardHat,
} from "lucide-react";
import { Link } from "react-router-dom";

export function ServiciosBuquePage() {
  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="/services/buque.png"
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
            Husbandry Services
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Servicios al Buque
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Asistencia integral de "Husbandry" para el mantenimiento,
            aprovisionamiento y bienestar de su tripulación.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center w-full bg-background-muted/50">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-2/3">
              <div className="w-16 h-16 bg-secondary/10 rounded flex items-center justify-center mb-6">
                <Wrench className="text-foreground" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-4">
                Todo lo que su motonave necesita en puerto
              </h2>
              <div className="w-16 h-1 bg-secondary mb-8"></div>
              <p className="text-foreground-muted leading-relaxed text-lg mb-10">
                El agenciamiento portuario no se detiene en la papelería legal;
                entendemos la importancia de cada minuto de estadía de su
                embarcación. Por ello, brindamos toda la supervisión y logística
                operativa (Husbandry) para atender los requerimientos técnicos y
                humanos de la tripulación con eficiencia para así evitar demoras
                o contratiempos.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-background p-6 border border-border rounded-sm shadow-sm flex gap-4">
                  <Package className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-2">
                      Víveres y Provisiones
                    </h4>
                    <p className="text-foreground-muted text-sm">
                      Abastecimiento completo y fresco para la tripulación
                      durante todo el itinerario marítimo estipulado.
                    </p>
                  </div>
                </div>

                <div className="bg-background p-6 border border-border rounded-sm shadow-sm flex gap-4">
                  <Droplets className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-2">
                      Bunkering & Agua
                    </h4>
                    <p className="text-foreground-muted text-sm">
                      Suministro rápido y normado de agua potable y
                      reabastecimiento de combustible en puerto.
                    </p>
                  </div>
                </div>

                <div className="bg-background p-6 border border-border rounded-sm shadow-sm flex gap-4">
                  <HeartPulse className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-2">
                      Asistencia a Tripulación
                    </h4>
                    <p className="text-foreground-muted text-sm">
                      Gestión de atención médica de urgencia en clínicas locales
                      y procesos de relevo de personal de mando.
                    </p>
                  </div>
                </div>

                <div className="bg-background p-6 border border-border rounded-sm shadow-sm flex gap-4">
                  <HardHat className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-2">
                      Reparaciones en Sitio
                    </h4>
                    <p className="text-foreground-muted text-sm">
                      Coordinación de talleres certificados para reparaciones de
                      emergencia y recambio de repuestos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 w-full bg-secondary text-white p-8 rounded-sm shadow-lg sticky top-28">
              <h3 className="text-xl font-bold mb-4">Gestión B2B Directa</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Los Armadores con cuenta en <strong>Serviport OS</strong> pueden
                contratar directamente los servicios y provisiones durante el
                atraque, generando notificaciones inmediatas al departamento
                operativo.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-slate-300">
                <li className="flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                  Pre-aprobación del Discharge Account
                </li>
                <li className="flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                  Notificación 24h a Operaciones
                </li>
                <li className="flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                  Solicitud con carga de requisitos técnicos
                </li>
              </ul>
              <Link
                to="/portal"
                className="block w-full bg-primary text-white text-center font-bold py-3 px-4 rounded-sm hover:bg-primary transition-colors uppercase text-sm tracking-widest"
              >
                Ingreso al Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
