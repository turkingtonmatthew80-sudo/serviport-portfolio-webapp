import { ChevronDown, Calendar, Anchor, MapPin } from "lucide-react";

export function PartnersProjectsSection() {
  const partners = [
    { title: "Estado Operativo en Medio Oriente", date: "Jun 2, 2026" },
    { title: "Interrupción Operativa en el Puerto Havre", date: "Abr 24, 2026", tag: "Feature" },
    { title: "Advertencia de Tsunami y Terremoto", date: "Abr 22, 2026", tag: "Noticias" },
    { title: "Incidente en Refinería Vivo", date: "Abr 19, 2026", tag: "Feature" },
  ];

  const projects = [
    { icon: Calendar, title: "Programar una Inspección", desc: "Reserve tiempo con nuestra red global de expertos para cualquier inspección urgente de flotas y cargamento pesado." },
    { icon: Anchor, title: "Reembolsos del Canal", desc: "Descubra nuestra calculadora en línea para obtener estimaciones precisas sobre tránsito y tarifas aduanales." },
    { icon: MapPin, title: "Encuentra puerto/oficina", desc: "Encuentre ayuda en nuestras más de 400 oficinas en 60 países alrededor de todas las costas del mundo." },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto bg-gray-50 flex flex-col gap-24">
      {/* Partners */}
      <div>
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-extrabold text-[#0b1a2e]">Nuestros Aliados</h2>
          <button className="text-sm text-[#F7941D] font-bold flex items-center gap-1 hover:text-[#F7941D] transition-colors">
            Todas las Alianzas <ChevronDown size={16} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {partners.map((p, i) => (
             <div key={i} className="bg-white p-6 border border-gray-100 rounded-md shadow-sm hover:shadow-md transition-shadow flex flex-col mt-2">
                {p.tag ? (
                  <span className="bg-orange-100 text-[#F7941D] text-[10px] font-bold uppercase px-2.5 py-1 rounded w-fit mb-4">{p.tag}</span>
                ) : (
                  <div className="h-6 mb-4"></div> /* Spacer */
                )}
                <h4 className="font-bold text-sm text-[#0b1a2e] line-clamp-2 leading-relaxed flex-1">{p.title}</h4>
                <span className="text-xs text-gray-400 mt-6 font-medium tracking-wide uppercase">{p.date}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Projects */}
      <div>
         <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-10 pb-4 border-b border-gray-200">Nuevos proyectos</h2>
         <div className="grid md:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <div key={i} className="bg-white p-8 border border-gray-100 rounded-md shadow-sm flex gap-6 hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="text-[#F7941D] flex-shrink-0 mt-1">
                  <p.icon size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#0b1a2e] mb-3">{p.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
         </div>
      </div>
    </section>
  );
}
