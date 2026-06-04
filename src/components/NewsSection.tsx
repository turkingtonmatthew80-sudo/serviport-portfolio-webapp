import { Link } from 'react-router-dom';
import { newsData } from '../data/newsData';

export function NewsSection() {
  const latestNews = newsData.slice(0, 4);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto bg-gray-50/50">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-4xl font-extrabold text-[#0b1a2e]">Noticias Recientes</h2>
        <Link to="/noticias" className="hidden md:flex items-center text-[#F7941D] hover:text-[#d87c14] font-bold text-sm tracking-widest uppercase transition-colors">
          Ver todas las noticias <span className="ml-2">→</span>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestNews.map((item) => (
          <Link key={item.id} to={`/noticias/${item.id}`} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group">
            <div className="h-44 overflow-hidden relative">
               <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <span className="absolute bottom-3 left-3 bg-[#F7941D] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
                 {item.category}
               </span>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h4 className="font-bold text-[#0b1a2e] mb-3 leading-snug line-clamp-2 group-hover:text-[#00A9CE] transition-colors">{item.title}</h4>
              <p className="text-sm text-gray-500 mb-5 line-clamp-2 flex-1">{item.excerpt}</p>
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{item.date}</span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-10 md:hidden flex justify-center">
        <Link to="/noticias" className="inline-flex border-2 border-[#0b1a2e] text-[#0b1a2e] px-8 py-3 font-bold text-sm hover:bg-[#0b1a2e] hover:text-white transition-colors">
          VER TODAS LAS NOTICIAS
        </Link>
      </div>
    </section>
  );
}
