import { useParams, Navigate, Link } from "react-router-dom";
import Markdown from "react-markdown";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { newsData } from "../data/newsData";

export function NewsArticlePage() {
  const { articleId } = useParams();
  const article = newsData.find((item) => item.id === articleId);

  if (!article) {
    return <Navigate to="/noticias" replace />;
  }

  return (
    <div className="w-full bg-background-muted flex-grow pb-20">
      {/* Article Header w/ Image */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 flex items-end min-h-[50vh]">
        <div className="absolute inset-0">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/60 to-secondary/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1260px] mx-auto px-4 md:px-6 pt-24">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center text-white/70 text-[10px] md:text-xs font-bold mb-6 md:mb-8 uppercase tracking-widest gap-y-2">
            <Link to="/" className="hover:text-white transition-colors">
              INICIO
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/noticias" className="hover:text-white transition-colors">
              NOTICIAS
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-primary">{article.category}</span>
          </div>

          <span className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-4 md:mb-6 uppercase shadow-sm">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white mb-4 md:mb-6 leading-[1.1]">
            {article.title}
          </h1>
          <p className="text-sm md:text-xl text-white/90 max-w-3xl border-l-[3px] md:border-l-4 border-primary pl-4">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 md:mt-8 text-white/70 text-xs md:text-sm font-medium">
            <span>{article.date}</span>
            {article.author && (
              <>
                <span className="hidden md:inline">•</span>
                <span>Por: {article.author}</span>
              </>
            )}
            {article.country && (
              <>
                <span className="hidden md:inline">•</span>
                <span>Región: {article.country}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-[800px] mx-auto px-4 md:px-6 mt-8 md:mt-12">
        <div className="bg-background p-6 md:p-12 shadow-sm border border-border/50 rounded-sm">
          <div className="prose prose-sm md:prose-lg prose-secondary max-w-none text-foreground-muted leading-relaxed [&>p]:mb-6 [&>h3]:text-xl md:[&>h3]:text-2xl [&>h3]:font-extrabold [&>h3]:text-foreground [&>h3]:mb-4 [&>h3]:mt-8 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:mb-6 [&>ol]:pl-6 [&>ol]:list-decimal [&>strong]:text-foreground">
            <Markdown>{article.content}</Markdown>
          </div>

          <div className="mt-12 md:mt-16 pt-8 border-t border-border/50">
            <Link
              to="/noticias"
              className="inline-flex items-center text-foreground hover:text-primary font-bold transition-colors text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="mr-2" size={18} />
              Volver a Noticias
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
