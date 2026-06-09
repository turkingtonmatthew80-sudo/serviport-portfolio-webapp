import { ChevronDown, Calendar, Anchor, MapPin } from "lucide-react";

export function PartnersProjectsSection() {
  const partners = [
    { title: "Estado Operativo en Medio Oriente", date: "Jun 2, 2026" },
    {
      title: "Interrupción Operativa en el Puerto Havre",
      date: "Abr 24, 2026",
      tag: "Feature",
    },
    {
      title: "Advertencia de Tsunami y Terremoto",
      date: "Abr 22, 2026",
      tag: "Noticias",
    },
    {
      title: "Incidente en Refinería Vivo",
      date: "Abr 19, 2026",
      tag: "Feature",
    },
  ];

  const projects = [
    {
      icon: Calendar,
      title: "Programar una Inspección",
      desc: "Reserve tiempo con nuestra red global de expertos para cualquier inspección urgente de flotas y cargamento pesado.",
    },
    {
      icon: Anchor,
      title: "Reembolsos del Canal",
      desc: "Descubra nuestra calculadora en línea para obtener estimaciones precisas sobre tránsito y tarifas aduanales.",
    },
    {
      icon: MapPin,
      title: "Encuentra puerto/oficina",
      desc: "Encuentre ayuda en nuestras más de 400 oficinas en 60 países alrededor de todas las costas del mundo.",
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center bg-background-muted">
      <div className="max-w-[1260px] mx-auto w-full flex flex-col gap-12 md:gap-24">
        {/* Partners */}
        <div>
          <div className="flex justify-between items-end mb-10 border-b border-border pb-4">
            <h2 className="text-3xl font-extrabold text-foreground">
              Nuestros Aliados
            </h2>
            <button className="text-sm text-accent font-bold flex items-center gap-1 hover:text-accent transition-colors">
              Todas las Alianzas <ChevronDown size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((p, i) => (
              <div
                key={i}
                className="bg-background p-6 border border-border rounded-md shadow-sm hover:shadow-md transition-shadow flex flex-col mt-2"
              >
                {p.tag ? (
                  <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-2.5 py-1 rounded w-fit mb-4">
                    {p.tag}
                  </span>
                ) : (
                  <div className="h-6 mb-4"></div> /* Spacer */
                )}
                <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-relaxed flex-1">
                  {p.title}
                </h4>
                <span className="text-xs text-foreground-muted mt-6 font-medium tracking-wide uppercase">
                  {p.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-3xl font-extrabold text-foreground mb-10 pb-4 border-b border-border">
            Nuevos proyectos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <div
                key={i}
                className="bg-background p-8 border border-border rounded-md shadow-sm flex gap-6 hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="text-accent flex-shrink-0 mt-1">
                  <p.icon size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground mb-3">
                    {p.title}
                  </h4>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
