import { useState, useRef, useEffect } from "react";
import { Search, X, FileText, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { megaMenuData } from "./Navigation";
import { newsData } from "../data/newsData";

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

  const menuItems = Object.values(megaMenuData).flatMap(section => 
    section.links.map(link => ({
      title: link.label,
      path: link.path,
      type: "Página de Servicio / Corporativa",
      icon: <Compass size={16} className="text-[#00A9CE]" />
    }))
  );

  const newsItems = newsData.map(news => ({
    title: news.title,
    path: `/noticias/${news.id}`,
    type: "Noticia",
    icon: <FileText size={16} className="text-[#F7941D]" />
  }));

  const allItems = [...menuItems, ...newsItems];

  const searchResults = query.trim() === "" 
    ? [] 
    : allItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative flex items-center">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-500 hover:text-[#00A9CE] transition-colors"
          aria-label="Buscar en Serviport"
        >
          <Search size={20} />
        </button>
      ) : (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-slate-100 rounded-sm w-48 md:w-64 z-50">
          <Search size={18} className="text-gray-400 ml-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none py-2 px-3 w-full text-sm text-[#0b1a2e]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={() => {
              setIsOpen(false);
              setQuery("");
            }}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors shrink-0"
            aria-label="Cerrar búsqueda"
          >
            <X size={16} />
          </button>

          {/* Resultados */}
          {query.trim() !== "" && (
            <div className="absolute top-[120%] right-0 mt-1 w-[85vw] max-w-[350px] bg-white border border-gray-100 shadow-xl rounded-sm overflow-hidden flex flex-col max-h-[70vh]">
              {searchResults.length > 0 ? (
                <ul className="overflow-y-auto py-2">
                  {searchResults.map((result, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => handleSelect(result.path)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-gray-50 last:border-0 flex items-start gap-3 transition-colors"
                      >
                        <div className="mt-0.5 shrink-0 bg-slate-100 p-1.5 rounded-full">
                          {result.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0b1a2e] line-clamp-2 leading-snug">{result.title}</p>
                          <span className="text-xs text-gray-500">{result.type}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-sm text-gray-500">
                  No se encontraron resultados para <br/><span className="font-semibold text-gray-700">"{query}"</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
