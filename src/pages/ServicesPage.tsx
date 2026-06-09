import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Anchor,
  ShieldCheck,
  Wrench,
  HardHat,
  Forklift,
  Box,
  Wind,
  Compass,
  Truck,
  Container,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function ServicesPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        // Adding a slight delay to ensure rendering is complete
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Anchor size={400} />
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Nuestros Servicios
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold mb-4 md:mb-6 leading-[1.1] text-white">
            Aportamos valor a la cadena <br className="hidden md:block" />
            logística de nuestros clientes
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Servicio integral en todas las etapas de la cadena logística
            portuaria.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12 border-b border-border bg-background-muted/50 px-4 md:px-6 flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full text-center md:text-left">
          <p className="text-sm md:text-base text-foreground-muted leading-relaxed font-medium">
            Serviport te brinda un servicio integral que cubre todas las etapas
            de la cadena logística portuaria: desde la representación legal del
            buque ante autoridades venezolanas, pasando por la carga y descarga
            de mercancías, hasta el almacenaje aduanero y el transporte
            terrestre de distribución nacional.
          </p>
        </div>
      </section>

      {/* AGENCIAMIENTO NAVIERO */}
      <section
        id="agenciamiento-naviero"
        className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center scroll-mt-20"
      >
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="lg:w-1/3">
              <div className="sticky top-28">
                <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
                  Representación Legal
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded flex items-center justify-center mb-4 md:mb-6">
                  <Anchor className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-2 md:mb-4 leading-[1.15]">
                  Agenciamiento Naviero
                </h2>
                <div className="w-16 h-1 bg-primary mb-6"></div>
                <p className="text-sm md:text-base text-foreground-muted leading-relaxed font-medium mb-6 md:mb-8">
                  Representación legal e integral de buques y protección
                  estricta de intereses en puerto.
                </p>
                <Link
                  to="/servicios/agenciamiento-naviero"
                  className="inline-flex items-center gap-2 text-white bg-secondary px-5 py-2.5 rounded font-bold hover:bg-blue-900 transition-colors text-xs uppercase tracking-wider"
                >
                  Ver Detalles <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-6 md:space-y-8">
              <div className="bg-background-muted border border-border/50 rounded-sm p-6 md:p-8 hover:border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 md:mb-4 flex items-center gap-3">
                  <Anchor className="text-primary w-5 h-5 md:w-6 md:h-6" />{" "}
                  Agentes Navieros Generales
                </h3>
                <p className="text-sm md:text-base text-foreground-muted leading-relaxed mb-4 md:mb-6">
                  Serviport actúa como representante legal e integral de buques
                  y motonaves ante las autoridades portuarias venezolanas: INEA,
                  SENIAT y Bolipuertos S.A. Gestionamos todos los trámites de
                  arribo, atraque, operaciones y zarpe.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm text-foreground-muted">
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />{" "}
                    Tramitación de aviso de arribo y manifiesto.
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />{" "}
                    Coordinación de práctico, remolcadores y amarre.
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />{" "}
                    Gestión de reconocimiento aduanero y actas.
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />{" "}
                    Liquidación de gastos portuarios (Disbursement Account).
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />{" "}
                    Representación ante Cuarentena e INEA.
                  </li>
                </ul>
              </div>

              <div className="bg-background-muted border border-border/50 rounded-sm p-6 md:p-8 hover:border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 md:mb-4 flex items-center gap-3">
                  <ShieldCheck className="text-primary w-5 h-5 md:w-6 md:h-6" />{" "}
                  Agentes Protectores
                </h3>
                <p className="text-sm md:text-base text-foreground-muted leading-relaxed">
                  Resguardo estricto de los intereses de armadores y fletadores
                  durante la estadía del buque en puerto. Serviport actúa como
                  contraparte independiente que supervisa que todas las
                  operaciones se ejecuten conforme a los términos del contrato
                  de fletamento.
                </p>
              </div>

              <div className="bg-background-muted border border-border/50 rounded-sm p-6 md:p-8 hover:border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 md:mb-4 flex items-center gap-3">
                  <Wrench className="text-primary w-5 h-5 md:w-6 md:h-6" />{" "}
                  Servicios al Buque (Husbandry)
                </h3>
                <p className="text-sm md:text-base text-foreground-muted leading-relaxed mb-4 md:mb-6">
                  Coordinación integral de servicios de reaprovisionamiento y
                  asistencia durante la estadía del buque en el muelle.
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] md:text-xs text-foreground font-bold">
                  <span className="bg-background border border-border px-3 py-1.5 rounded-full shadow-sm">
                    Suministro de víveres
                  </span>
                  <span className="bg-background border border-border px-3 py-1.5 rounded-full shadow-sm">
                    Bunkering
                  </span>
                  <span className="bg-background border border-border px-3 py-1.5 rounded-full shadow-sm">
                    Asistencia médica
                  </span>
                  <span className="bg-background border border-border px-3 py-1.5 rounded-full shadow-sm">
                    Reparaciones
                  </span>
                </div>
                <Link
                  to="/servicios/servicios-al-buque"
                  className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary transition-colors mt-6 text-xs uppercase tracking-wider"
                >
                  Ver Detalles <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPERACIONES PORTUARIAS */}
      <section
        id="operaciones-portuarias"
        className="bg-secondary text-white py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center scroll-mt-20"
      >
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16">
            <div className="lg:w-1/3">
              <div className="sticky top-28">
                <div className="inline-block px-2 py-1 bg-background/10 text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm border border-white/5">
                  Estiba y Maniobras
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded flex items-center justify-center mb-4 md:mb-6">
                  <HardHat className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 md:mb-4 leading-[1.15]">
                  Operaciones Portuarias
                </h2>
                <div className="w-16 h-1 bg-primary mb-6"></div>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium mb-6 md:mb-8">
                  Maniobras eficientes con cuadrillas expertas y maquinaria
                  propia de alta capacidad en el patio.
                </p>
                <Link
                  to="/servicios/operaciones-portuarias"
                  className="inline-flex items-center gap-2 text-foreground bg-primary px-5 py-2.5 rounded font-bold hover:bg-primary hover:text-white transition-colors text-xs uppercase tracking-wider"
                >
                  Ver Detalles <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-6 md:space-y-8">
              <div className="bg-background/5 border border-white/5 rounded-sm p-6 md:p-8 hover:bg-background/10 hover:border-white/10 transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-extrabold mb-3 md:mb-4 flex items-center gap-3">
                  <Box className="w-5 h-5 md:w-6 md:h-6 text-primary" /> Estiba
                  y Desestiba
                </h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4 md:mb-6">
                  Operaciones de carga y descarga de navíos ejecutadas por
                  cuadrillas profesionales de estibadores certificados,
                  manejando contenedores, granel o carga general.
                </p>
                <div className="space-y-2.5 text-xs md:text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />{" "}
                    Personal capacitado y calificado con certificado.
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />{" "}
                    Cobertura de póliza de seguro internacional.
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />{" "}
                    Historial impecable como operador de terminal.
                  </div>
                </div>
              </div>

              <div className="bg-background/5 border border-white/5 rounded-sm p-6 md:p-8 hover:bg-background/10 hover:border-white/10 transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-extrabold mb-3 md:mb-4 flex items-center gap-3">
                  <Forklift className="w-5 h-5 md:w-6 md:h-6 text-primary" />{" "}
                  Manejo de Patio y Maquinaria
                </h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Operaciones con equipos pesados de alta capacidad. Contamos
                  con grúas de hasta 100+ toneladas, reach stackers y
                  montacargas para la manipulación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALMACENAJE Y RESGUARDO */}
      <section
        id="almacenaje-resguardo"
        className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted flex justify-center w-full scroll-mt-20"
      >
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="mb-10 md:mb-16 text-center">
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
              Seguridad Comercial
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded flex items-center justify-center mb-4 md:mb-6 mx-auto">
              <Container className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-4 leading-[1.15]">
              Almacenaje y Resguardo
            </h2>
            <p className="text-foreground-muted text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-6 md:mb-8">
              Instalaciones aduaneras de primer nivel con seguridad 24x7 y
              manejo técnico.
            </p>
            <Link
              to="/servicios/almacenaje-resguardo"
              className="inline-flex items-center gap-2 text-foreground bg-background border border-border shadow-sm px-5 py-2.5 rounded font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-xs uppercase tracking-wider mx-auto"
            >
              Ver Detalles <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div className="bg-background border border-border/50 p-6 md:p-8 shadow-sm rounded-sm hover:-translate-y-1 hover:border-primary/20 hover:shadow-md transition-all border-t-4 border-t-secondary">
              <h3 className="text-lg md:text-xl font-extrabold text-foreground mb-2 md:mb-4">
                Almacén General de Depósito (AGD)
              </h3>
              <p className="text-foreground-muted mb-4 md:mb-6 text-sm leading-relaxed">
                Espacio propio provisto de patios descubiertos organizados en
                bloques alfabéticos, destinado al almacenamiento seguro.
              </p>
              <ul className="space-y-2.5 text-xs md:text-sm text-foreground-muted border-t pt-4 md:pt-6 border-border/50">
                <li className="flex gap-2">
                  <b>•</b> Capacidad doble de un patio estándar.
                </li>
                <li className="flex gap-2">
                  <b>•</b> Vaciado y llenado de contenedores.
                </li>
                <li className="flex gap-2">
                  <b>•</b> Video-vigilancia y resguardo 24x7.
                </li>
              </ul>
            </div>

            <div className="bg-background border border-border/50 p-6 md:p-8 shadow-sm rounded-sm hover:-translate-y-1 hover:border-primary/20 hover:shadow-md transition-all border-t-4 border-t-primary">
              <h3 className="text-lg md:text-xl font-extrabold text-foreground mb-2 md:mb-4">
                Almacén de Equipos Vacíos
              </h3>
              <p className="text-foreground-muted mb-4 md:mb-6 text-sm leading-relaxed">
                Zona dedicada al acopio, inspección técnica, lavado y
                reparaciones de contenedores, y reefer containers.
              </p>
              <ul className="space-y-2.5 text-xs md:text-sm text-foreground-muted border-t pt-4 md:pt-6 border-border/50">
                <li className="flex gap-2">
                  <b>•</b> Conformidad y Reporte de daños.
                </li>
                <li className="flex gap-2">
                  <b>•</b> Reparaciones menores IICL.
                </li>
                <li className="flex gap-2">
                  <b>•</b> Conexión y pre-trip para reefers.
                </li>
              </ul>
            </div>

            <div className="bg-background border border-border/50 p-6 md:p-8 shadow-sm rounded-sm hover:-translate-y-1 hover:border-border hover:shadow-md transition-all border-t-4 border-t-gray-300">
              <h3 className="text-lg md:text-xl font-extrabold text-foreground mb-2 md:mb-4">
                Galpón Cerrado
              </h3>
              <p className="text-foreground-muted mb-4 md:mb-6 text-sm leading-relaxed">
                Para mercancía delicada, carga general suelta y proyecto que
                requiera protección climática controlada.
              </p>
              <ul className="space-y-2.5 text-xs md:text-sm text-foreground-muted border-t pt-4 md:pt-6 border-border/50">
                <li className="flex gap-2">
                  <b>•</b> Control de humedad y clima.
                </li>
                <li className="flex gap-2">
                  <b>•</b> Posiciones numeradas precisas.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FLETAMENTO Y TRANSPORTE */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 border-t border-border flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div
              id="fletamento-maritimo"
              className="scroll-mt-20 group cursor-default"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:shadow-md transition-all duration-300">
                <Compass className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4 md:mb-6 leading-[1.15]">
                Fletamento Marítimo
              </h2>
              <p className="text-sm md:text-base text-foreground-muted leading-relaxed mb-4 md:mb-6">
                Intermediación y cotización de buques para el transporte de
                grandes volúmenes de carga y proyectos. Conectamos armadores y
                fletadores.
              </p>
              <ul className="space-y-2 text-foreground-muted text-xs md:text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />{" "}
                  Carga a granel, líquida y contenedores.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />{" "}
                  Negociación de Voyage y Time Charter.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />{" "}
                  Asesoría en rutas óptimas y costos.
                </li>
              </ul>
              <Link
                to="/servicios/fletamento-maritimo"
                className="inline-flex items-center gap-2 text-foreground bg-background-muted hover:bg-primary border border-border hover:border-primary hover:text-white font-bold px-4 py-2 transition-all duration-300 mt-6 text-xs uppercase tracking-wider rounded"
              >
                Ver Detalles <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>

            <div
              id="transporte-mercancias"
              className="scroll-mt-20 group cursor-default"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:shadow-md transition-all duration-300">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4 md:mb-6 leading-[1.15]">
                Transporte de Mercancías
              </h2>
              <p className="text-sm md:text-base text-foreground-muted leading-relaxed mb-4 md:mb-6">
                Flota de transporte terrestre propia para traslado seguro y
                distribución nacional. Cubrimos el último eslabón desde el
                puerto.
              </p>
              <ul className="space-y-2 text-foreground-muted text-xs md:text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />{" "}
                  Acarreo en zonas portuarias.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />{" "}
                  Transporte de carga general y especializada.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />{" "}
                  Servicio de escolta para cargas valiosas.
                </li>
              </ul>
              <Link
                to="/servicios/transporte-mercancias"
                className="inline-flex items-center gap-2 text-foreground bg-background-muted hover:bg-primary border border-border hover:border-primary hover:text-white font-bold px-4 py-2 transition-all duration-300 mt-6 text-xs uppercase tracking-wider rounded"
              >
                Ver Detalles <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
