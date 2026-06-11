import { useState, useRef, useEffect } from "react";
import { Search, X, FileText, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { megaMenuData } from "./Navigation";
import { newsData } from "../data/newsData";
import { ContainerUnit } from "./ContainerUnit";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const menuItems = Object.values(megaMenuData).flatMap((section) =>
    section.links.map((link) => ({
      title: link.label,
      path: link.path,
      type: "Página de Servicio / Corporativa",
      icon: <Compass size={16} className="text-primary" />,
    })),
  );

  const newsItems = newsData.map((news) => ({
    title: news.title,
    path: `/noticias/${news.id}`,
    type: "Noticia",
    icon: <FileText size={16} className="text-accent" />,
  }));

  const allItems = [...menuItems, ...newsItems];

  const searchResults =
    query.trim() === ""
      ? []
      : allItems
          .filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 8);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative flex items-center">
      {!isOpen ? (
        <ContainerUnit
          isSquare
          theme="bg-[#1e293b]"
          onClick={() => setIsOpen(true)}
        >
          <Search size={20} className="text-white" />
        </ContainerUnit>
      ) : (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-background-muted rounded-sm w-48 md:w-64 z-50">
          <Search size={18} className="text-foreground-muted ml-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none py-2 px-3 w-full text-sm text-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => {
              setIsOpen(false);
              setQuery("");
            }}
            className="p-2 text-foreground-muted hover:text-red-500 transition-colors shrink-0"
            aria-label="Cerrar búsqueda"
          >
            <X size={16} />
          </button>

          {/* Resultados */}
          {query.trim() !== "" && (
            <div className="absolute top-[120%] right-0 mt-1 w-[85vw] max-w-[350px] bg-background border border-border shadow-xl rounded-sm overflow-hidden flex flex-col max-h-[70vh]">
              {searchResults.length > 0 ? (
                <ul className="overflow-y-auto py-2">
                  {searchResults.map((result, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleSelect(result.path)}
                        className="w-full text-left px-4 py-3 hover:bg-background-muted border-b border-border last:border-0 flex items-start gap-3 transition-colors"
                      >
                        <div className="mt-0.5 shrink-0 bg-background-muted p-1.5 rounded-full">
                          {result.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                            {result.title}
                          </p>
                          <span className="text-xs text-foreground-muted">
                            {result.type}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-sm text-foreground-muted">
                  No se encontraron resultados para <br />
                  <span className="font-semibold text-foreground">"{query}"</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
