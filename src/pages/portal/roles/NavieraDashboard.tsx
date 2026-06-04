import { Activity, Anchor, FileText, TrendingUp, Ship } from "lucide-react";
import { cn } from "../../../lib/utils";

const STATS = [
  { name: "Port Calls Activos", value: "3", icon: Ship, change: "+1 esta semana" },
  { name: "Proformas Pendientes", value: "2", icon: FileText, change: "Vencen en 48h", highlight: true },
  { name: "Buques Operando", value: "1", icon: Anchor, change: "Muelle 4" },
];

export function NavieraDashboard() {
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0b1a2e]">Panel de Naviera</h1>
        <p className="text-gray-500 mt-1">Gestión de escalas y port calls en puerto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {STATS.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col relative overflow-hidden group hover:border-[#00A9CE]/50 transition-colors">
            <div className="flex items-center gap-4 mb-4 z-10 relative">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border", stat.highlight ? "bg-red-50 border-red-100 text-red-500" : "bg-[#f0f9fb] border-[#00A9CE]/10 text-[#00A9CE]")}>
                <stat.icon size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-600 line-clamp-1">{stat.name}</p>
            </div>
            <div className="flex items-end justify-between mt-auto z-10 relative">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</span>
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1", stat.highlight ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100")}>
                {!stat.highlight && <TrendingUp size={12} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-gray-100 pb-3">Escalas Recientes</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0b1a2e]">MSC ALINA</p>
                <p className="text-xs text-gray-500">Viaje: 1245A | Muelle 4</p>
              </div>
              <span className="bg-[#00A9CE]/10 text-[#00A9CE] px-3 py-1 rounded-full text-xs font-bold">En Operación</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0b1a2e]">CMA CGM MAUPASSANT</p>
                <p className="text-xs text-gray-500">Viaje: 8871B | En Rada</p>
              </div>
              <span className="bg-[#F7941D]/10 text-[#F7941D] px-3 py-1 rounded-full text-xs font-bold">Programado</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0b1a2e] rounded-xl text-white p-6 shadow-md relative overflow-hidden group">
          <div className="absolute -right-4 -top-8 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <Ship size={140} />
          </div>
          <h3 className="text-xl font-bold mb-2 relative z-10">Solicitar Port Call</h3>
          <p className="text-gray-400 text-sm mb-6 relative z-10 w-4/5 line-clamp-3">Registra una nueva recalada e inicia el flujo operativo de tu buque en Puerto Cabello.</p>
          <button className="relative z-10 w-full bg-[#F7941D] hover:bg-[#e0861a] text-white font-bold py-3 px-4 rounded-md transition-colors shadow-sm">
            Nueva Solicitud
          </button>
        </div>
      </div>
    </div>
  );
}
