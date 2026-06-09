import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Droplets,
  PackageOpen,
  Snowflake,
  AlertTriangle,
  Blocks,
} from "lucide-react";

export function SectorsPage() {
  const { hash } = useLocation();

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

  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Especialización Operativa
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold mb-4 md:mb-6 leading-[1.1] text-white drop-shadow-lg">
            Sectores Industriales
          </h1>
          <p className="text-sm md:text-lg text-slate-200 font-medium max-w-3xl leading-relaxed drop-shadow mx-auto md:mx-0">
            Capacidad comprobada para atender diferentes tipos de carga con
            protocolos específicos, maquinaria especializada y personal
            calificado.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-8 md:py-12 bg-secondary px-4 md:px-6 border-b border-white/10 flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full">
          <div className="md:w-1/3 shrink-0 flex justify-center md:justify-start">
            <div className="text-primary flex gap-3 md:gap-4">
              <Box className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              <Droplets className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              <PackageOpen
                className="w-8 h-8 md:w-10 md:h-10"
                strokeWidth={1.5}
              />
              <Snowflake
                className="w-8 h-8 md:w-10 md:h-10"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <p className="md:w-2/3 text-sm md:text-base text-slate-300 leading-relaxed font-medium text-center md:text-left">
            Entendemos que cada sector industrial requiere un trato único.
            Serviport está capacitada y certificada para atender la diversidad
            de la demanda logística venezolana, garantizando integridad y
            eficiencia.
          </p>
        </div>
      </section>

      {/* SECTORES GRID */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto space-y-6 md:space-y-8 lg:space-y-12 w-full">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-12">
            {/* CARGA CONTENERIZADA */}
            <div
              id="contenerizada"
              className="bg-background p-6 md:p-8 lg:p-10 border border-border/50 rounded-sm shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group scroll-mt-24"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors rounded flex items-center justify-center mb-4 md:mb-6">
                <Blocks className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 md:mb-4">
                Carga Contenerizada (FCL / LCL)
              </h3>
              <p className="text-sm md:text-base text-foreground-muted leading-relaxed mb-4 md:mb-6 mt-0">
                Soluciones de importación y exportación para carga consolidada
                (LCL) y contenedor completo (FCL).
              </p>
              <ul className="text-xs md:text-sm text-foreground-muted space-y-2.5">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{" "}
                  Gestión de gate-in y gate-out.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{" "}
                  Reconocimiento aduanero.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{" "}
                  Almacenaje en AGD y entrega final.
                </li>
              </ul>
            </div>

            {/* CARGA A GRANEL */}
            <div
              id="granel"
              className="bg-background p-6 md:p-8 lg:p-10 border border-border/50 rounded-sm shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group scroll-mt-24"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors rounded flex items-center justify-center mb-4 md:mb-6">
                <Droplets className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 md:mb-4">
                Carga a Granel (Bulk Cargo)
              </h3>
              <p className="text-sm md:text-base text-foreground-muted leading-relaxed mb-4 md:mb-6 mt-0">
                Operación de descarga directa de granos y cereales destinados a
                la infraestructura de silos del puerto.
              </p>
              <ul className="text-xs md:text-sm text-foreground-muted space-y-2.5">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{" "}
                  Registro de toneladas métricas por shipment.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{" "}
                  Coordinación directa a silos de Bolipuertos.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{" "}
                  Retiro coordinado con camiones de clientes.
                </li>
              </ul>
            </div>
          </div>

          {/* CARGA GENERAL Y SUELTA */}
          <div
            id="general"
            className="bg-background p-6 md:p-8 lg:p-10 border border-border/50 rounded-sm shadow-sm flex flex-col md:flex-row gap-6 md:gap-10 hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group scroll-mt-24"
          >
            <div className="md:w-1/3 flex flex-col justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary text-white rounded flex items-center justify-center mb-4 md:mb-6">
                <PackageOpen className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1 md:mb-2 leading-tight">
                Carga General
                <br />y Suelta
              </h3>
              <span className="text-primary font-bold tracking-widest text-[10px] md:text-xs uppercase">
                Breakbulk / Proyectos
              </span>
            </div>
            <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-border md:pl-8 lg:pl-10 pt-6 md:pt-0 flex flex-col justify-center">
              <p className="text-sm md:text-lg text-foreground-muted leading-relaxed font-medium mb-4 md:mb-6">
                Manejo especializado de piezas de gran tamaño, maquinaria pesada
                y mercancías delicadas con resguardo en galpón techado.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <span className="bg-background-muted border border-border shadow-sm text-foreground-muted px-3 md:px-4 py-1.5 md:py-2 font-bold text-xs md:text-sm rounded-full">
                  Embalaje especial
                </span>
                <span className="bg-background-muted border border-border shadow-sm text-foreground-muted px-3 md:px-4 py-1.5 md:py-2 font-bold text-xs md:text-sm rounded-full">
                  Trincado y manipulación
                </span>
                <span className="bg-background-muted border border-border shadow-sm text-foreground-muted px-3 md:px-4 py-1.5 md:py-2 font-bold text-xs md:text-sm rounded-full">
                  Equipos pesados
                </span>
                <span className="bg-background-muted border border-border shadow-sm text-foreground-muted px-3 md:px-4 py-1.5 md:py-2 font-bold text-xs md:text-sm rounded-full">
                  Posiciones exactas
                </span>
              </div>
            </div>
          </div>

          <div
            id="refrigerada"
            className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-12 scroll-mt-24"
          >
            {/* CARGA REFRIGERADA */}
            <div className="bg-secondary text-white p-6 md:p-8 lg:p-10 rounded-sm shadow-md border-t-[3px] md:border-t-4 border-primary hover:-translate-y-1 transition-all duration-300 group">
              <div className="mb-4 md:mb-6">
                <Snowflake className="text-primary w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-3 md:mb-4">
                Carga Refrigerada
              </h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4 md:mb-6 mt-0">
                Infraestructura y conocimiento para mantener la cadena de frío
                sin interrupciones durante el almacenaje portuario y
                nacionalización.
              </p>
              <ul className="text-xs md:text-sm text-slate-200 space-y-2.5">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{" "}
                  Conexión continua de contenedores reefers.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{" "}
                  Monitoreo y mantenimiento especializado.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{" "}
                  Pre-trip inspections (PTI) y soporte técnico.
                </li>
              </ul>
            </div>

            {/* CARGA PELIGROSA */}
            <div className="bg-background border-[3px] md:border-4 border-accent/10 p-6 md:p-8 lg:p-10 rounded-sm shadow-sm hover:border-accent/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="mb-4 md:mb-6">
                <AlertTriangle className="text-accent w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 md:mb-4">
                Carga Peligrosa
              </h3>
              <p className="text-sm md:text-base text-foreground-muted leading-relaxed mb-4 md:mb-6 mt-0">
                La seguridad es nuestra prioridad. Mantenemos el más alto rigor
                técnico, segregación y monitoreo para mercancias controladas.
              </p>
              <ul className="text-xs md:text-sm text-foreground-muted space-y-2.5">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{" "}
                  Manejo bajo Código IMDG internacional.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{" "}
                  Cumplimiento de regulaciones nacionales.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{" "}
                  Protocolos de seguridad certificados.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
