import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Ship, Globe, Anchor, ShieldCheck } from "lucide-react";
import { RegistryService, ShippingLine, Vessel, Port, CustomsOffice } from "../lib/registryService";
import { seedRegistryDatabase } from "../lib/seedRegistry";

export const Directorio = () => {
  const [lines, setLines] = useState<ShippingLine[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [customs, setCustoms] = useState<CustomsOffice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let [l, v, p, c] = await Promise.all([
          RegistryService.getLines(),
          RegistryService.getVessels(),
          RegistryService.getPorts(),
          RegistryService.getCustoms(),
        ]);

        if (l.length === 0) {
           console.log("No directory data found. Seeding initial real massive payload...");
           await seedRegistryDatabase();
           [l, v, p, c] = await Promise.all([
            RegistryService.getLines(),
            RegistryService.getVessels(),
            RegistryService.getPorts(),
            RegistryService.getCustoms(),
          ]);
        }

        setLines(l);
        setVessels(v);
        setPorts(p);
        setCustoms(c);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <BookOpen size={48} className="text-secondary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight font-serif">
            Directorio Marítimo
          </h1>
          <p className="text-slate-500 mt-4 max-w-2xl text-lg">
            Catálogo global de infraestructura, navieras y entidades vinculadas al transporte logístico.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Navieras */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-primary" size={28} />
                <h2 className="text-2xl font-bold text-slate-800">Líneas Navieras</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lines.map(line => (
                  <div key={line.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
                    <h3 className="font-bold text-xl text-slate-800 mb-2">{line.name}</h3>
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-4">{line.countryOfOrigin} • Fundada en {line.foundedYear}</p>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{line.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-500">TEU: {line.teuCapacity?.toLocaleString()}</span>
                      <span className="text-xs font-bold text-secondary">Rango Global: #{line.globalRank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Buques */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Ship className="text-primary" size={28} />
                <h2 className="text-2xl font-bold text-slate-800">Buques Identificados</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vessels.map(v => (
                  <Link key={v.id} to={`/directorio/buque/${v.id}`} className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white hover:border-slate-600 transition block">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-xl">{v.name}</h3>
                       <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-1 rounded font-mono">IMO {v.imo}</span>
                    </div>
                    <p className="text-xs text-primary font-mono uppercase tracking-wider mb-4">Bandera: {v.flag}</p>
                    <div className="space-y-1 text-sm text-slate-400 mb-4 font-mono">
                      <p>• Construido: {v.builtYear}</p>
                      <p>• GT: {v.grossTonnage.toLocaleString()}</p>
                      <p>• TEU Capacidad: {v.teuCapacity}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between">
                       <span className="text-xs font-bold text-secondary-cyan">Operador: {v.operatorId}</span>
                       <span className={`text-xs font-bold ${v.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>{v.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Ports */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Anchor className="text-primary" size={28} />
                <h2 className="text-2xl font-bold text-slate-800">Puertos (Nodos)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ports.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex gap-4">
                     <div className="w-16 h-16 bg-blue-50 rounded flex items-center justify-center shrink-0">
                       <Anchor size={32} className="text-blue-500" />
                     </div>
                     <div>
                       <h3 className="font-bold text-lg text-slate-800">{p.name}</h3>
                       <p className="text-xs text-slate-400 font-mono tracking-widest mb-2">{p.locode} • {p.city}, {p.country}</p>
                       <p className="text-sm text-slate-600">{p.description}</p>
                     </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Customs */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-primary" size={28} />
                <h2 className="text-2xl font-bold text-slate-800">Aduanas</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customs.map(c => (
                  <div key={c.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:bg-white transition">
                     <div className="flex justify-between items-center mb-2">
                       <h3 className="font-bold text-lg text-slate-800">{c.name}</h3>
                       <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Cod. {c.code}</span>
                     </div>
                     <p className="text-sm text-slate-600 mb-2">{c.description}</p>
                     <p className="text-xs text-slate-500 font-mono">Jurisdicción: {c.jurisdiction}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
};
