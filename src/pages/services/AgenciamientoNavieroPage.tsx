import {
  Anchor,
  CheckCircle2,
  ShieldCheck,
  Ship,
  ArrowLeft, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export function AgenciamientoNavieroPage() {
  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="/services/agenciamiento.png"
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
            Shipping Agency
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Agenciamiento Naviero
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Representación legal e integral de tu buque ante INEA, SENIAT y
            autoridades portuarias venezolanas.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
              <div className="bg-background border border-border rounded-sm p-8 shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center mb-6">
                  <Anchor className="text-primary" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Agentes Navieros Generales
                </h2>
                <div className="w-12 h-1 bg-primary mb-6"></div>
                <p className="text-foreground-muted mb-6 leading-relaxed">
                  Serviport actúa como representante legal e integral de buques
                  y motonaves ante las autoridades portuarias venezolanas: INEA
                  (Instituto Nacional de los Espacios Acuáticos), SENIAT
                  (Aduana) y Bolipuertos S.A. Gestionamos todos los trámites de
                  arribo, atraque, operaciones y zarpe, asegurando el
                  cumplimiento normativo y la agilidad portuaria.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2
                      className="text-primary shrink-0 mt-1"
                      size={18}
                    />{" "}
                    <span className="text-foreground-muted">
                      Tramitación de aviso de arribo y manifiesto de carga.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2
                      className="text-primary shrink-0 mt-1"
                      size={18}
                    />{" "}
                    <span className="text-foreground-muted">
                      Coordinación de práctico, remolcadores y amarre.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2
                      className="text-primary shrink-0 mt-1"
                      size={18}
                    />{" "}
                    <span className="text-foreground-muted">
                      Gestión de reconocimiento aduanero y actas de inspección.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2
                      className="text-primary shrink-0 mt-1"
                      size={18}
                    />{" "}
                    <span className="text-foreground-muted">
                      Liquidación de gastos portuarios y emisión de Disbursement
                      Account.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2
                      className="text-primary shrink-0 mt-1"
                      size={18}
                    />{" "}
                    <span className="text-foreground-muted">
                      Representación ante organismos de control (Cuarentena,
                      INEA).
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-12">
              <div className="bg-background border border-border rounded-sm p-8 shadow-md">
                <div className="w-12 h-12 bg-secondary/10 rounded flex items-center justify-center mb-6">
                  <ShieldCheck className="text-foreground" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Agentes Protectores
                </h2>
                <div className="w-12 h-1 bg-secondary mb-6"></div>
                <p className="text-foreground-muted mb-6 leading-relaxed">
                  Ofrecemos resguardo estricto de los intereses de armadores y
                  fletadores durante la estadía del buque en puerto. Serviport
                  actúa como contraparte independiente que supervisa que todas
                  las operaciones se ejecuten conforme a los términos del
                  contrato de fletamento.
                </p>
                <div className="bg-background-muted border border-border p-6 rounded-sm text-sm text-foreground-muted italic border-l-4 border-l-accent">
                  "Protegemos la economía de su viaje y la integridad de la
                  tripulación en los principales puertos venezolanos."
                </div>
              </div>

              <div className="bg-secondary text-white rounded-sm p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-4">
                  ¿Necesitas optimizar tu estadía en puerto?
                </h3>
                <p className="text-slate-300 mb-8">
                  Solicita una cotización o ingresa a Serviport OS para
                  coordinar el próximo Port Call.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/herramientas"
                    className="bg-primary font-bold px-6 py-3 text-center rounded-sm hover:bg-primary transition-colors whitespace-nowrap"
                  >
                    Cotizar Servicio
                  </Link>
                  <Link
                    to="/portal"
                    className="bg-background/10 font-bold px-6 py-3 text-center rounded-sm hover:bg-background/20 transition-colors whitespace-nowrap"
                  >
                    Acceder al Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
