import { ArrowRight, Award, ShieldCheck, FileCheck, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function CertificationsPage() {
  const norms = [
    {
      title: "INEA",
      desc: "Autorización para operar como agente naviero ante el Instituto Nacional de los Espacios Acuáticos."
    },
    {
      title: "SENIAT",
      desc: "Registro activo como operador de Almacén General de Depósito y contribuyente especial."
    },
    {
      title: "Bolipuertos S.A.",
      desc: "Concesión y permisos habilitados para operar servicios portuarios y estiba en la Terminal Marítima de Puerto Cabello."
    },
    {
      title: "IICL",
      desc: "Parámetros y guías operativas para la evaluación y reparación de contenedores bajo los criterios del Institute of International Container Lessors."
    },
    {
      title: "IMDG Code",
      desc: "Capacitación y protocolos estandarizados para el manejo seguro de mercancía y carga peligrosa."
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80" alt="Certificaciones y Calidad" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/85" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link to="/nosotros" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> VOLVER A NOSOTROS
          </Link>
          <div className="inline-block px-4 py-2 bg-[#00A9CE] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">
            Estándares de Calidad
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Certificaciones y Reconocimientos
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
            Nuestro compromiso absoluto con la excelencia se refleja en el cumplimiento normativo internacional y nacional en todas nuestras operaciones.
          </p>
        </div>
      </section>

      {/* ISO 9001 SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative h-[500px] rounded-sm overflow-hidden bg-slate-100 shadow-xl">
             <img src="https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80" alt="Auditoría ISO 9001" className="w-full h-full object-cover" />
             <div className="absolute top-6 left-6 bg-white p-4 shadow-lg rounded-sm w-48 text-center flex flex-col items-center justify-center border-b-4 border-[#0b1a2e]">
               <Award size={48} className="text-[#00A9CE] mb-2" strokeWidth={1.5} />
               <h4 className="font-extrabold text-[#0b1a2e]">ISO 9001:2015</h4>
               <p className="text-xs text-gray-500 font-bold uppercase mt-1">SGC Certificado</p>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div className="w-16 h-16 bg-[#00A9CE]/10 rounded flex items-center justify-center mb-6">
              <Award className="text-[#00A9CE]" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-4">ISO 9001:2015</h2>
            <div className="w-16 h-1 bg-[#00A9CE] mb-6"></div>
            <p className="text-gray-600 leading-relaxed font-mediumtext-lg">
              Serviport Agentes Navieros, C.A. opera bajo un Sistema de Gestión de Calidad (SGC) certificado conforme a la estricta norma ISO 9001:2015. Esta certificación internacional garantiza que nuestros procesos y operaciones portuarias cumplen con los más altos estándares medibles de calidad, y demuestra nuestro compromiso irreversible con la mejora continua.
            </p>
            <div className="bg-gray-50 p-8 border border-gray-100 rounded-sm">
              <h4 className="font-bold text-[#0b1a2e] mb-4">Alcance de la Certificación</h4>
              <p className="text-sm leading-relaxed text-gray-600 font-medium">
                Agenciamiento naviero integral, operaciones marítimas de estiba y desestiba, manejo de control de carga contenerizada y general, almacenamiento en Almacén General de Depósito (AGD), y transporte logístico terrestre de mercancías a nivel nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUMPLIMIENTO NORMATIVO Y MEMBRESÍAS */}
      <section className="bg-slate-50 py-24 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          
          <div>
            <div className="flex items-center gap-4 mb-8">
              <ShieldCheck className="text-[#0b1a2e]" size={36} />
              <h2 className="text-3xl font-extrabold text-[#0b1a2e]">Cumplimiento Normativo</h2>
            </div>
            <div className="space-y-4">
              {norms.map((norm, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm flex gap-4"
                >
                  <div className="shrink-0 mt-1">
                    <CheckCircle2 className="text-[#00A9CE]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0b1a2e] mb-1">{norm.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{norm.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
             <div className="flex items-center gap-4 mb-8">
              <FileCheck className="text-[#F7941D]" size={36} />
              <h2 className="text-3xl font-extrabold text-[#0b1a2e]">Membresías Gremiales</h2>
            </div>
            <div className="bg-white p-10 border border-gray-100 shadow-md rounded-sm">
              <p className="text-gray-600 mb-8 leading-relaxed">
                Pertenecer a los principales gremios del ámbito comercial y marítimo nos permite estar alineados con el desarrollo de políticas portuarias y crear alianzas estratégicas para nuestro sector.
              </p>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-sm flex items-center justify-center shrink-0">
                    <Award className="text-gray-400" size={24} />
                  </div>
                  <span className="font-bold text-gray-700">Cámara de Comercio de Puerto Cabello (CCPC)</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-sm flex items-center justify-center shrink-0">
                    <Award className="text-gray-400" size={24} />
                  </div>
                  <span className="font-bold text-gray-700">Asociaciones Navieras Nacionales Relevantes</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
