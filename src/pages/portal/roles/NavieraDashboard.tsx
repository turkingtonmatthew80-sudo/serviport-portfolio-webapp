import { Activity, Anchor, FileText, TrendingUp, Ship } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export function NavieraDashboard() {
  const { user } = useAuth();
  const [portCalls, setPortCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortCalls = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "port_calls"),
          where("userId", "==", user.id)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        
        // Sort explicitly by createdAt or any reasonable mechanism if timestamps exist
        setPortCalls(data.sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || '')));
      } catch (error) {
        console.error("Error fetching port calls:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortCalls();
  }, [user]);

  const actPortCalls = portCalls.filter(p => p.status !== "Completado").length;
  const pendientes = portCalls.filter(p => p.status === "Programado").length;
  const operando = portCalls.filter(p => p.status === "En Operación").length;

  const STATS = [
    { name: "Port Calls Activos", value: loading ? "-" : actPortCalls.toString(), icon: Ship, change: "Esta semana" },
    { name: "Proformas Pendientes", value: loading ? "-" : pendientes.toString(), icon: FileText, change: "Vencen en 48h", highlight: pendientes > 0 },
    { name: "Buques Operando", value: loading ? "-" : operando.toString(), icon: Anchor, change: "Muelle(s)" },
  ];

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
            {loading ? (
              <p className="text-sm text-gray-500 py-4 text-center">Cargando port calls...</p>
            ) : portCalls.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No hay escalas registradas</p>
            ) : (
              portCalls.slice(0, 5).map((call, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#0b1a2e]">{call.vesselName || "Buque Desconocido"}</p>
                    <p className="text-xs text-gray-500">
                      Viaje: {call.voyageNumber || "--"} | {call.location || "En Rada"}
                    </p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    call.status === "En Operación" ? "bg-[#00A9CE]/10 text-[#00A9CE]" :
                    call.status === "Programado" ? "bg-[#F7941D]/10 text-[#F7941D]" :
                    "bg-gray-100 text-gray-600"
                  )}>
                    {call.status || "Pendiente"}
                  </span>
                </div>
              ))
            )}
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
