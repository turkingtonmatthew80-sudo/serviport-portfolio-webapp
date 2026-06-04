import { useParams, Navigate, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { newsData } from '../data/newsData';

export function NewsArticlePage() {
  const { articleId } = useParams();
  const article = newsData.find(item => item.id === articleId);

  if (!article) {
    return <Navigate to="/noticias" replace />;
  }

  return (
    <main className="flex-grow bg-gray-50 pb-20">
      
      {/* Article Header w/ Image */}
      <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 flex items-end min-h-[50vh]">
        <div className="absolute inset-0">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2e]/90 via-[#0b1a2e]/60 to-[#0b1a2e]/30"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-24">
          {/* Breadcrumb */}
          <div className="flex items-center text-white/70 text-sm font-medium mb-8 uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/noticias" className="hover:text-white transition-colors">Noticias</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#00A9CE]">{article.category}</span>
          </div>

          <span className="inline-block bg-[#F7941D] text-white text-xs font-bold px-3 py-1 mb-4 uppercase tracking-wider rounded-sm">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl border-l-4 border-[#00A9CE] pl-4">
            {article.excerpt}
          </p>
          
          <div className="flex items-center gap-6 mt-8 text-white/70 text-sm font-medium">
            <span>{article.date}</span>
            {article.author && (
              <>
                <span>•</span>
                <span>Por: {article.author}</span>
              </>
            )}
            {article.country && (
               <>
                 <span>•</span>
                 <span>Región: {article.country}</span>
               </>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 mt-12 bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-md">
        <div className="prose prose-lg prose-[#0b1a2e] max-w-none text-gray-700 leading-relaxed [&>p]:mb-6 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-[#0b1a2e] [&>h3]:mb-4 [&>h3]:mt-8 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:mb-6 [&>ol]:pl-6 [&>ol]:list-decimal [&>strong]:text-[#0b1a2e]">
          <Markdown>{article.content}</Markdown>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
           <Link to="/noticias" className="inline-flex items-center text-[#0b1a2e] hover:text-[#00A9CE] font-bold transition-colors">
              <ArrowLeft className="mr-2" size={20} />
              Volver a Noticias
           </Link>
        </div>
      </article>

    </main>
  );
}
