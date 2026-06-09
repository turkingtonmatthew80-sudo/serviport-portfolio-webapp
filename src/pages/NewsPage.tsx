import { Link } from "react-router-dom";
import { newsData } from "../data/newsData";

export function NewsPage() {
  const featuredArticle = newsData.find((item) => item.featured) || newsData[0];

  const latestNews = newsData
    .filter(
      (item) =>
        item.category === "Noticia" || item.category === "Nota de Prensa",
    )
    .slice(0, 4);
  const advisories = newsData
    .filter((item) => item.category === "Aviso Operativo")
    .slice(0, 4);
  const blogs = newsData
    .filter((item) => item.category === "Blog" && !item.featured)
    .slice(0, 4);
  const caseStudies = newsData
    .filter((item) => item.category === "Caso de Éxito")
    .slice(0, 4);

  return (
    <div className="w-full bg-background">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-5 pointer-events-none">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full object-cover text-white fill-current"
            preserveAspectRatio="none"
          >
            <path d="M100 0 L50 100 L100 100 Z" />
            <path d="M50 0 L100 50 L100 0 Z" opacity="0.5" />
            <circle
              cx="80"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Noticias y Eventos
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold mb-4 md:mb-6 leading-[1.1] text-white drop-shadow-lg">
            Actualidad y Novedades
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Descubre más sobre Serviport con nuestras últimas noticias,
            actualizaciones operativas y artículos de expertos del sector
            portuario.
          </p>
        </div>
      </section>

      <div className="max-w-[1260px] mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 space-y-16 md:space-y-24 w-full">
        {/* Featured Article */}
        <section>
          <div className="flex justify-between items-end mb-4 md:mb-8 border-b border-border pb-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Artículo Destacado
            </h2>
          </div>
          <Link
            to={`/noticias/${featuredArticle.id}`}
            className="group grid lg:grid-cols-2 gap-6 md:gap-8 items-center bg-background md:p-6 rounded-sm border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-64 md:h-80 lg:h-[400px] w-full overflow-hidden rounded-t-sm lg:rounded-l-sm lg:rounded-tr-none">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 md:p-0 md:pr-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <span className="bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
                  {featuredArticle.category}
                </span>
                <span className="text-[10px] md:text-xs font-medium text-foreground-muted">
                  {featuredArticle.date}
                </span>
              </div>
              <h3 className="text-xl md:text-3xl font-extrabold text-foreground mb-3 md:mb-4 group-hover:text-primary transition-colors leading-tight">
                {featuredArticle.title}
              </h3>
              <p className="text-sm md:text-base text-foreground-muted mb-0">
                {featuredArticle.excerpt}
              </p>
            </div>
          </Link>
        </section>

        {/* Latest News */}
        <section id="noticias">
          <div className="flex justify-between items-end mb-4 md:mb-8 border-b border-border pb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Últimas Noticias
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {latestNews.map((item) => (
              <Link
                key={item.id}
                to={`/noticias/${item.id}`}
                className="bg-background rounded-sm overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 border border-border/50 flex flex-col group"
              >
                <div className="h-40 md:h-44 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <h4 className="font-bold text-foreground text-sm md:text-base mb-2 md:mb-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] md:text-[11px] font-medium text-foreground-muted uppercase tracking-widest mt-auto">
                    {item.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Advisories */}
        <section id="avisos">
          <div className="flex justify-between items-end mb-4 md:mb-8 border-b border-border pb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Avisos Operativos
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {advisories.map((item) => (
              <Link
                key={item.id}
                to={`/noticias/${item.id}`}
                className="bg-background rounded-sm p-4 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 border border-border/50 flex flex-col group h-full"
              >
                <span className="bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm w-max mb-3 md:mb-4">
                  {item.country || "Venezuela"}
                </span>
                <h4 className="font-bold text-foreground mb-2 md:mb-3 text-sm md:text-base leading-snug group-hover:text-primary transition-colors flex-grow">
                  {item.title}
                </h4>
                <span className="text-[10px] md:text-[11px] font-medium text-foreground-muted uppercase tracking-widest mt-3 md:mt-4">
                  {item.date}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Blogs */}
        <section id="blog">
          <div className="flex justify-between items-end mb-4 md:mb-8 border-b border-border pb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Blogs
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {blogs.map((item) => (
              <Link
                key={item.id}
                to={`/noticias/${item.id}`}
                className="bg-background rounded-sm overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 border border-border/50 flex flex-col group"
              >
                <div className="h-40 md:h-44 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <h4 className="font-bold text-foreground text-sm md:text-base mb-2 md:mb-3 leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] md:text-[11px] font-medium text-foreground-muted uppercase tracking-widest mt-auto">
                    {item.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Case Studies */}
        <section id="casos">
          <div className="flex justify-between items-end mb-4 md:mb-8 border-b border-border pb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Casos de Éxito
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {caseStudies.map((item) => (
              <Link
                key={item.id}
                to={`/noticias/${item.id}`}
                className="bg-background rounded-sm overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 border border-border/50 flex flex-col group p-4 md:p-6"
              >
                <span className="bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm w-max mb-4 md:mb-6">
                  {item.category}
                </span>
                <h4 className="font-bold text-foreground mb-3 md:mb-4 text-sm md:text-base leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs md:text-sm text-foreground-muted mb-4 md:mb-6 line-clamp-3 flex-1">
                  {item.excerpt}
                </p>
                <span className="text-[10px] md:text-[11px] font-medium text-foreground-muted uppercase tracking-widest">
                  {item.date}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
