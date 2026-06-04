import { Package, Search, Map, LayoutDashboard } from "lucide-react";
import { cn } from "../../../lib/utils";

const STATS = [
  { name: "Contenedores en AGD", value: "24", icon: Package, change: "Trazabilidad activa" },
  { name: "Retiros Disponibles", value: "8", icon: LayoutDashboard, change: "Listos para gate-out" },
];

export function ImportadorDashboard() {
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0b1a2e]">Panel de Importador</h1>
        <p className="text-gray-500 mt-1">Supervisa y gestiona la trazabilidad de tu carga en AGD.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {STATS.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col group hover:border-[#00A9CE]/50 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#f0f9fb] border-[#00A9CE]/10 text-[#00A9CE] flex items-center justify-center border">
                <stat.icon size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-600 line-clamp-1">{stat.name}</p>
            </div>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Map className="text-[#00A9CE]" size={20} />
            Mis Contenedores en Almacén Documentado
          </h2>
          <button className="text-sm text-[#00A9CE] font-bold hover:underline hidden sm:block">Ir a Retiros</button>
        </div>
        <div className="p-0 flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-[#0b1a2e] text-xs uppercase font-bold text-white border-b border-[#0b1a2e]">
                <tr>
                  <th className="px-6 py-4 rounded-tl-sm">Contenedor</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Ubicación AGD</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right rounded-tr-sm">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { id: "MSCU1234567", type: "40'HC", loc: "Bloque B - F12 - N1", status: "Disponible", statusColor: "bg-green-100 text-green-700" },
                  { id: "CMAU8765432", type: "20'DC", loc: "Bloque A - F02 - N2", status: "Inspección", statusColor: "bg-yellow-100 text-yellow-700" },
                  { id: "HLXU4567890", type: "40'DC", loc: "Gate In", status: "En Muelle", statusColor: "bg-[#00A9CE]/20 text-[#00A9CE]" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#0b1a2e]">{row.id}</td>
                    <td className="px-6 py-4">{row.type}</td>
                    <td className="px-6 py-4 font-mono text-xs">{row.loc}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 text-xs font-bold rounded-full", row.statusColor)}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#00A9CE] font-semibold hover:text-[#F7941D] transition-colors">Solicitar Retiro</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
