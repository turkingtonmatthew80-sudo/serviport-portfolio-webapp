import { Link } from "react-router-dom";
import { newsData } from "../data/newsData";
import { motion } from "motion/react";

export function NewsSection() {
  const latestNews = newsData.slice(0, 4);

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted/50 flex flex-col justify-center items-center">
      <div className="w-full max-w-[1260px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-4 md:mb-8"
        >
          <div>
            <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
              Actualidad
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-foreground leading-[1.15]">
              Noticias Recientes
            </h2>
          </div>
          <Link
            to="/noticias"
            className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary transition-colors uppercase tracking-wider text-xs"
          >
            VER TODAS <span>→</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full">
          {latestNews.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link
                to={`/noticias/${item.id}`}
                className="bg-background rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border flex flex-col group h-full"
              >
                <div className="h-44 overflow-hidden relative shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-bold text-foreground mb-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-foreground-muted mb-5 line-clamp-2 flex-1">
                    {item.excerpt}
                  </p>
                  <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-widest">
                    {item.date}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 md:hidden flex justify-center">
          <Link
            to="/noticias"
            className="group border-2 border-accent text-accent hover:text-white hover:bg-accent px-8 md:px-10 py-4 rounded font-bold transition-colors flex items-center justify-center gap-3 text-center text-sm md:text-base uppercase tracking-wider w-fit"
          >
            VER TODAS LAS NOTICIAS
          </Link>
        </div>
      </div>
    </section>
  );
}
