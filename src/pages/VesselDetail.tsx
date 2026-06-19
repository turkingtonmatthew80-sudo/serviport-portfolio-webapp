import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { RegistryService, Vessel } from "../lib/registryService";
import { Ship, ArrowLeft, Anchor, Key, Flag, Hash } from "lucide-react";

export const VesselDetail = () => {
  const { id } = useParams();
  const [vessel, setVessel] = useState<Vessel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVessel = async () => {
      try {
        const vessels = await RegistryService.getVessels();
        const found = vessels.find(v => v.id === id);
        if (found) setVessel(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchVessel();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vessel) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Buque no encontrado</h1>
        <Link to="/directorio" className="text-secondary mt-4 block">Volver al directorio</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <Link to="/directorio" className="flex items-center gap-2 text-secondary hover:text-secondary-dark font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Volver al Directorio
        </Link>
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800 text-white">
          <div className="h-48 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center relative border-b border-slate-800">
            <div className="absolute inset-0 pattern-dots opacity-10"></div>
            <Ship size={80} className="text-primary opacity-80" />
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold font-mono tracking-widest text-emerald-400 uppercase bg-emerald-400/10 px-3 py-1 rounded inline-block mb-3">
                  {vessel.status}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold font-serif">{vessel.name}</h1>
                <p className="mt-2 text-slate-400 text-lg flex items-center gap-2">
                  <Anchor size={18} /> {vessel.vesselType} under {vessel.flag} flag
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">IMO Number</p>
                <p className="text-3xl font-mono text-secondary-cyan font-black">{vessel.imo}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                 <p className="text-xs text-slate-400 uppercase font-bold mb-1 flex items-center gap-1"><Hash size={12}/> Año Contr.</p>
                 <p className="text-xl font-medium font-mono">{vessel.builtYear}</p>
               </div>
               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                 <p className="text-xs text-slate-400 uppercase font-bold mb-1 flex items-center gap-1"><Flag size={12}/> Bandera</p>
                 <p className="text-xl font-medium tracking-tight">{vessel.flag}</p>
               </div>
               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                 <p className="text-xs text-slate-400 uppercase font-bold mb-1">GT (Gross Tonnage)</p>
                 <p className="text-xl font-medium font-mono">{vessel.grossTonnage.toLocaleString()}</p>
               </div>
               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                 <p className="text-xs text-slate-400 uppercase font-bold mb-1">DWT (Deadweight)</p>
                 <p className="text-xl font-medium font-mono">{vessel.deadweight.toLocaleString()}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Key size={18} className="text-primary"/> Identificación Operativa
                </h3>
                <ul className="space-y-4 text-sm font-mono text-slate-300">
                   <li className="flex justify-between border-b border-slate-800 pb-2">
                     <span className="text-slate-500">Operador Armador:</span>
                     <span className="font-bold text-white uppercase">{vessel.operatorId}</span>
                   </li>
                   <li className="flex justify-between border-b border-slate-800 pb-2">
                     <span className="text-slate-500">Capacidad TEU:</span>
                     <span className="font-bold text-white">{vessel.teuCapacity?.toLocaleString() || "N/A"}</span>
                   </li>
                   <li className="flex justify-between border-b border-slate-800 pb-2">
                     <span className="text-slate-500">Eslora (Length):</span>
                     <span className="font-bold text-white">{vessel.length ? `${vessel.length} m` : "N/A"}</span>
                   </li>
                   <li className="flex justify-between border-b border-slate-800 pb-2">
                     <span className="text-slate-500">Manga (Beam):</span>
                     <span className="font-bold text-white">{vessel.beam ? `${vessel.beam} m` : "N/A"}</span>
                   </li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
