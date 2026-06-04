import { ArrowRight, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function TeamPage() {
  const team = [
    {
      name: "Carlos Mendoza",
      role: "Gerente General",
      description: "Con más de 20 años de experiencia en el sector marítimo venezolano, Carlos lidera la estrategia de expansión y cumplimiento normativo integral ante las autoridades locales.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
      name: "Ana Valentina Rojas",
      role: "Directora Comercial",
      description: "Encargada de gestionar la red de aliados B2B y líneas navieras, asegurando la adaptabilidad de las operaciones en nuestras oficinas de La Guaira y Puerto Cabello.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
      name: "Miguel Ángel Suárez",
      role: "Jefe de Operaciones",
      description: "Supervisa las cuadrillas de estiba, la disposición del AGD y la maquinaria pesada de Serviport, garantizando seguridad milimétrica en el patio día y noche.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
      name: "Dra. Elena Silva",
      role: "Directora de Asuntos Legales",
      description: "Especialista en derecho aduanero marítimo, responsable del agenciamiento naviero protector y las resoluciones con el SENIAT y Bolipuertos.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
      name: "Roberto Campos",
      role: "Gerente B2B y Serviport OS",
      description: "Ingeniero líder detrás de la implementación operativa digital, gestionando la matriz del Tariff Engine y las pasarelas portuarias de nuestros clientes interconectados.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
      name: "Luis Fernando Ortiz",
      role: "Gerente de Transporte Logístico",
      description: "Planifica el eslabón final y gestiona el flujo de la flota terrestre y de acarreo interno hacia todo el territorio nacional.",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400&h=400",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Nuestro Equipo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1a2e]/90" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 w-full text-center">
          <Link to="/nosotros" className="inline-flex items-center justify-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-sm mb-6">
            <ArrowRight size={18} className="rotate-180" /> VOLVER A NOSOTROS
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            Liderazgo y Capital Humano
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            Unidos por metas comunes y una infraestructura de primera clase. Somos el equipo que navega contigo hacia el éxito.
          </p>
        </div>
      </section>

      {/* TEAM GRID */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {team.map((member, idx) => (
              <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="bg-white group"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#0b1a2e]/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0b1a2e] to-transparent p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-bold text-2xl">{member.name}</h3>
                    <p className="text-[#00A9CE] font-bold text-sm tracking-wider uppercase">{member.role}</p>
                  </div>
                </div>
                <div className="p-6 border-x border-b border-gray-100 shadow-sm relative pt-8">
                  <div className="absolute -top-3 left-6 w-8 h-1 bg-[#F7941D]" />
                  <p className="text-gray-600 leading-relaxed text-sm font-medium">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* CAREERS CTA */}
      <section className="py-24 px-6 bg-[#0b1a2e]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#00A9CE]/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <UserPlus size={40} className="text-[#00A9CE]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Únete a nuestra tripulación</h2>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Siempre estamos buscando talento portuario, comercial y operativo apasionado por desafiar los estándares y entregar soluciones sólidas.
          </p>
          <a href="mailto:gerenciacomercial@serviportve.com" className="inline-flex items-center gap-2 bg-[#00A9CE] text-white font-bold py-4 px-10 rounded-sm hover:bg-[#008EBF] transition-colors uppercase tracking-wider">
            ENVIAR TU SÍNTESIS CURRICULAR <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </div>
  );
}
