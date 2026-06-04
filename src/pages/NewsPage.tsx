import { Link } from 'react-router-dom';
import { newsData } from '../data/newsData';

export function NewsPage() {
  const featuredArticle = newsData.find(item => item.featured) || newsData[0];
  
  const latestNews = newsData.filter(item => item.category === "Noticia" || item.category === "Nota de Prensa").slice(0, 4);
  const advisories = newsData.filter(item => item.category === "Aviso Operativo").slice(0, 4);
  const blogs = newsData.filter(item => item.category === "Blog" && !item.featured).slice(0, 4);
  const caseStudies = newsData.filter(item => item.category === "Caso de Éxito").slice(0, 4);

  return (
    <main className="flex-grow bg-white">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#00A9CE] to-[#008EBF] py-20 px-6 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl font-extrabold mb-6 inline-block bg-white/20 px-4 py-2 mt-10">NOTICIAS Y EVENTOS</h1>
          <p className="text-xl max-w-2xl font-medium">Descubre más sobre Serviport con nuestras últimas noticias, actualizaciones operativas y artículos de expertos.</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
           {/* Abstract shape to match screenshot vibe */}
           <svg viewBox="0 0 100 100" className="w-full h-full object-cover text-white fill-current" preserveAspectRatio="none">
              <path d="M100 0 L50 100 L100 100 Z" />
              <path d="M50 0 L100 50 L100 0 Z" opacity="0.5"/>
              <circle cx="80" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
           </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        
        {/* Featured Article */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-extrabold text-[#0b1a2e]">Artículo Destacado</h2>
          </div>
          <Link to={`/noticias/${featuredArticle.id}`} className="group grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 md:h-96 w-full overflow-hidden rounded">
              <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-[#D32F2F] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
                  {featuredArticle.category}
                </span>
                <span className="text-sm font-medium text-gray-400">{featuredArticle.date}</span>
              </div>
              <h3 className="text-3xl font-bold text-[#0b1a2e] mb-4 group-hover:text-[#00A9CE] transition-colors">{featuredArticle.title}</h3>
              <p className="text-gray-600 mb-6 text-lg">{featuredArticle.excerpt}</p>
            </div>
          </Link>
        </section>

        {/* Latest News */}
        <section id="noticias">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-extrabold text-white bg-[#00A9CE] px-4 py-2 inline-block">ÚLTIMAS NOTICIAS</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestNews.map(item => (
              <Link key={item.id} to={`/noticias/${item.id}`} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group">
                <div className="h-44 overflow-hidden relative">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <span className="absolute bottom-3 left-3 bg-[#D32F2F] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
                     {item.category}
                   </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-bold text-[#0b1a2e] mb-3 leading-snug line-clamp-2 group-hover:text-[#00A9CE] transition-colors">{item.title}</h4>
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-auto">{item.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Advisories */}
        <section id="avisos">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-extrabold text-white bg-[#00A9CE] px-4 py-2 inline-block">AVISOS OPERATIVOS</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisories.map(item => (
              <Link key={item.id} to={`/noticias/${item.id}`} className="bg-white rounded-md p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group h-full">
                 <span className="bg-[#D32F2F] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full w-max shadow-sm mb-4">
                   {item.country || "Venezuela"}
                 </span>
                 <h4 className="font-bold text-[#0b1a2e] mb-3 text-lg leading-snug group-hover:text-[#00A9CE] transition-colors flex-grow">{item.title}</h4>
                 <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-4">{item.date}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Blogs */}
        <section id="blog">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-extrabold text-white bg-[#00A9CE] px-4 py-2 inline-block">BLOGS</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map(item => (
              <Link key={item.id} to={`/noticias/${item.id}`} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group">
                <div className="h-44 overflow-hidden relative">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <span className="absolute bottom-3 left-3 bg-[#D32F2F] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
                     {item.category}
                   </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-bold text-[#0b1a2e] mb-3 leading-snug line-clamp-3 group-hover:text-[#00A9CE] transition-colors">{item.title}</h4>
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-auto">{item.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Case Studies */}
        <section id="casos">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-extrabold text-white bg-[#00A9CE] px-4 py-2 inline-block">CASOS DE ÉXITO</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {caseStudies.map(item => (
              <Link key={item.id} to={`/noticias/${item.id}`} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group p-6">
                <span className="bg-[#D32F2F] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm w-max mb-6">
                  {item.category}
                </span>
                <h4 className="font-bold text-[#0b1a2e] mb-4 text-xl leading-snug group-hover:text-[#00A9CE] transition-colors">{item.title}</h4>
                <p className="text-sm text-gray-500 mb-6 line-clamp-3 flex-1">{item.excerpt}</p>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{item.date}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
