import {
  ArrowLeft, ArrowRight,
  Award,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function CertificationsPage() {
  const norms = [
    {
      title: "INEA",
      desc: "Autorización para operar como agente naviero ante el Instituto Nacional de los Espacios Acuáticos.",
    },
    {
      title: "SENIAT",
      desc: "Registro activo como operador de Almacén General de Depósito y contribuyente especial.",
    },
    {
      title: "Bolipuertos S.A.",
      desc: "Concesión y permisos habilitados para operar servicios portuarios y estiba en la Terminal Marítima de Puerto Cabello.",
    },
    {
      title: "IICL",
      desc: "Parámetros y guías operativas para la evaluación y reparación de contenedores bajo los criterios del Institute of International Container Lessors.",
    },
    {
      title: "IMDG Code",
      desc: "Capacitación y protocolos estandarizados para el manejo seguro de mercancía y carga peligrosa.",
    },
  ];

  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <Link
            to="/nosotros"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-colors uppercase tracking-wider text-xs mb-6 mx-auto md:mx-0"
          >
            <ArrowLeft size={16}  /> VOLVER A NOSOTROS
          </Link>
          <br />
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Estándares de Calidad
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Certificaciones y Reconocimientos
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Nuestro compromiso absoluto con la excelencia se refleja en el
            cumplimiento normativo internacional y nacional en todas nuestras
            operaciones.
          </p>
        </div>
      </section>

      {/* ISO 9001 SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center max-w-[1260px] mx-auto w-full">
          <div className="order-2 lg:order-1 relative h-[500px] rounded-sm overflow-hidden bg-background-muted shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80"
              alt="Auditoría ISO 9001"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 bg-background p-4 shadow-lg rounded-sm w-48 text-center flex flex-col items-center justify-center border-b-4 border-secondary">
              <Award
                size={48}
                className="text-primary mb-2"
                strokeWidth={1.5}
              />
              <h4 className="font-extrabold text-foreground">ISO 9001:2015</h4>
              <p className="text-xs text-foreground-muted font-bold uppercase mt-1">
                SGC Certificado
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center mb-6">
              <Award className="text-primary" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              ISO 9001:2015
            </h2>
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <p className="text-foreground-muted leading-relaxed font-mediumtext-lg">
              Serviport Agentes Navieros, C.A. opera bajo un Sistema de Gestión
              de Calidad (SGC) certificado conforme a la estricta norma ISO
              9001:2015. Esta certificación internacional garantiza que nuestros
              procesos y operaciones portuarias cumplen con los más altos
              estándares medibles de calidad, y demuestra nuestro compromiso
              irreversible con la mejora continua.
            </p>
            <div className="bg-background-muted p-8 border border-border rounded-sm">
              <h4 className="font-bold text-foreground mb-4">
                Alcance de la Certificación
              </h4>
              <p className="text-sm leading-relaxed text-foreground-muted font-medium">
                Agenciamiento naviero integral, operaciones marítimas de estiba
                y desestiba, manejo de control de carga contenerizada y general,
                almacenamiento en Almacén General de Depósito (AGD), y
                transporte logístico terrestre de mercancías a nivel nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUMPLIMIENTO NORMATIVO Y MEMBRESÍAS */}
      <section className="bg-background-muted py-12 md:py-16 lg:py-20 px-4 md:px-6 border-t border-border">
        <div className="max-w-[1260px] mx-auto w-full grid lg:grid-cols-2 gap-8 md:gap-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <ShieldCheck className="text-foreground" size={36} />
              <h2 className="text-3xl font-extrabold text-foreground">
                Cumplimiento Normativo
              </h2>
            </div>
            <div className="space-y-4">
              {norms.map((norm, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-background p-6 border border-border rounded-sm shadow-sm flex gap-4"
                >
                  <div className="shrink-0 mt-1">
                    <CheckCircle2 className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">
                      {norm.title}
                    </h4>
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      {norm.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-8">
              <FileCheck className="text-accent" size={36} />
              <h2 className="text-3xl font-extrabold text-foreground">
                Membresías Gremiales
              </h2>
            </div>
            <div className="bg-background p-10 border border-border shadow-md rounded-sm">
              <p className="text-foreground-muted mb-8 leading-relaxed">
                Pertenecer a los principales gremios del ámbito comercial y
                marítimo nos permite estar alineados con el desarrollo de
                políticas portuarias y crear alianzas estratégicas para nuestro
                sector.
              </p>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="w-12 h-12 bg-background-muted rounded-sm flex items-center justify-center shrink-0">
                    <Award className="text-foreground-muted" size={24} />
                  </div>
                  <span className="font-bold text-foreground-muted">
                    Cámara de Comercio de Puerto Cabello (CCPC)
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-background-muted rounded-sm flex items-center justify-center shrink-0">
                    <Award className="text-foreground-muted" size={24} />
                  </div>
                  <span className="font-bold text-foreground-muted">
                    Asociaciones Navieras Nacionales Relevantes
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
