import { Activity, Anchor, FileText, TrendingUp, Ship, Plus, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, addDoc } from "@/src/lib/db-wrapper";
import { db } from "../../../lib/firebase";

export function NavieraDashboard() {
  const { user } = useAuth();
  const [portCalls, setPortCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", imo: "", voyage: "", eta: "", port: "Puerto Cabello" });

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "portcalls")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      setPortCalls(
        data.sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || ""),
        ),
      );
      setLoading(false);
    }, (error) => {
      console.error("Error fetching port calls:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "portcalls"), {
        ...formData,
        status: "Programado",
        navieraId: user?.id,
        createdAt: new Date().toISOString()
      });
      setShowModal(false);
      setFormData({ name: "", imo: "", voyage: "", eta: "", port: "Puerto Cabello" });
    } catch(err) {
      console.error(err);
    }
  }

  const actPortCalls = portCalls.filter(p => p.status !== "Completado").length;
  const pendientes = portCalls.filter((p) => p.status === "Programado").length;
  const operando = portCalls.filter((p) => p.status === "En Operación").length;

  const STATS = [
    {
      name: "Port Calls Activos",
      value: loading ? "-" : actPortCalls.toString(),
      icon: Ship,
      change: "Esta semana",
    },
    {
      name: "Proformas Pendientes",
      value: loading ? "-" : pendientes.toString(),
      icon: FileText,
      change: "Vencen en 48h",
      highlight: pendientes > 0,
    },
    {
      name: "Buques Operando",
      value: loading ? "-" : operando.toString(),
      icon: Anchor,
      change: "Muelle(s)",
    },
  ];

  return (
    <div className="max-w-[1260px] mx-auto w-full animate-in fade-in duration-500 relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Panel de Naviera</h1>
        <p className="text-foreground-muted mt-1">
          Gestión de escalas y port calls en puerto.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {STATS.map((stat) => (
          <div
            key={stat.name}
            className="bg-background rounded-xl border border-border p-6 shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4 z-10 relative">
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border",
                  stat.highlight
                    ? "bg-red-50 border-red-100 text-red-500"
                    : "bg-sky-50 border-primary/10 text-primary",
                )}
              >
                <stat.icon size={24} />
              </div>
              <p className="text-sm font-semibold text-foreground-muted line-clamp-1">
                {stat.name}
              </p>
            </div>
            <div className="flex items-end justify-between mt-auto z-10 relative">
              <span className="text-3xl font-black text-foreground tracking-tight">
                {stat.value}
              </span>
              <span
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1",
                  stat.highlight
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-green-50 text-green-600 border border-green-100",
                )}
              >
                {!stat.highlight && <TrendingUp size={12} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-3">
            Escalas Recientes
          </h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-foreground-muted py-4 text-center">
                Cargando port calls...
              </p>
            ) : portCalls.length === 0 ? (
              <p className="text-sm text-foreground-muted py-4 text-center">
                No hay escalas registradas
              </p>
            ) : (
              portCalls.slice(0, 5).map((call, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-50 transition-all gap-4">
                  <div>
                    <p className="font-bold text-foreground">
                      {call.name || call.vesselName || "Buque Desconocido"}
                    </p>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      Viaje: {call.voyageNumber || call.voyage || "--"} |{" "}
                      {call.location || call.port || "En Rada"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={call.status || "Programado"}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await fetch("/api/portcalls/update-status", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              portCallId: call.id,
                              newStatus,
                              vesselName: call.name || call.vesselName
                            })
                          });
                        } catch(err) {
                          console.error("Error updating status:", err);
                        }
                      }}
                      className="text-xs border rounded p-1 font-mono font-bold uppercase bg-white text-secondary focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                    >
                      <option value="Programado">Programado</option>
                      <option value="En Operación">En Operación</option>
                      <option value="Completado">Completado</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-secondary rounded-xl text-white p-6 shadow-md relative overflow-hidden group">
          <div className="absolute -right-4 -top-8 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <Ship size={140} />
          </div>
          <h3 className="text-xl font-bold mb-2 relative z-10">
            Solicitar Port Call
          </h3>
          <p className="text-foreground-muted text-sm mb-6 relative z-10 w-4/5 line-clamp-3">
            Registra una nueva recalada e inicia el flujo operativo de tu buque
            en Puerto Cabello.
          </p>
          <button onClick={() => setShowModal(true)} className="relative z-10 w-full bg-accent hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-md transition-colors shadow-sm">
            Nueva Solicitud
          </button>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Nueva Solicitud de Port Call</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Buque</label>
                <input required type="text" className="w-full border rounded p-2 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número IMO</label>
                <input required type="text" className="w-full border rounded p-2 text-sm" value={formData.imo} onChange={e => setFormData({...formData, imo: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Viaje (Voyage)</label>
                  <input required type="text" className="w-full border rounded p-2 text-sm" value={formData.voyage} onChange={e => setFormData({...formData, voyage: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ETA</label>
                  <input required type="date" className="w-full border rounded p-2 text-sm" value={formData.eta} onChange={e => setFormData({...formData, eta: e.target.value})} />
                </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Puerto de Escala</label>
                 <select required className="w-full border rounded p-2 text-sm" value={formData.port} onChange={e => setFormData({...formData, port: e.target.value})}>
                    <option value="Puerto Cabello">Puerto Cabello</option>
                    <option value="La Guaira">La Guaira</option>
                    <option value="Guanta">Guanta</option>
                    <option value="Maracaibo">Maracaibo</option>
                 </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-sm font-bold">Cancelar</button>
                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded text-sm font-bold flex items-center gap-1"><Plus size={16}/> Programar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
