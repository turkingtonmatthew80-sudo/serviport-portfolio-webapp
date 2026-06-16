import { Link } from "react-router-dom";
import { Package, Search, Map, LayoutDashboard } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export function ImportadorDashboard() {
  const { user } = useAuth();
  const [containers, setContainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "contenedores")
    );
    
    // Wire up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setContainers(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching containers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const activeContainers = containers.filter(
    (c) => c.status !== "Retirado",
  ).length;
  const readyToWithdraw = containers.filter(
    (c) => c.status === "Disponible",
  ).length;

  const STATS = [
    {
      name: "Contenedores en AGD",
      value: loading ? "-" : activeContainers.toString(),
      icon: Package,
      change: "Trazabilidad activa",
    },
    {
      name: "Retiros Disponibles",
      value: loading ? "-" : readyToWithdraw.toString(),
      icon: LayoutDashboard,
      change: "Listos para gate-out",
    },
  ];

  return (
    <div className="max-w-[1260px] mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Panel de Importador
        </h1>
        <p className="text-foreground-muted mt-1">
          Supervisa y gestiona la trazabilidad de tu carga en AGD.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {STATS.map((stat) => (
          <div
            key={stat.name}
            className="bg-background rounded-xl border border-border p-6 shadow-sm flex flex-col group hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-sky-50 border-primary/10 text-primary flex items-center justify-center border">
                <stat.icon size={24} />
              </div>
              <p className="text-sm font-semibold text-foreground-muted line-clamp-1">
                {stat.name}
              </p>
            </div>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-3xl font-black text-foreground tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-background-muted text-foreground-muted border border-border">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden h-full flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center bg-background-muted/50">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Map className="text-primary" size={20} />
            Mis Contenedores en Almacén Documentado
          </h2>
          <Link to="/portal/importador/retiros" className="text-sm text-primary font-bold hover:underline hidden sm:block">
            Ir a Retiros
          </Link>
        </div>
        <div className="p-0 flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground-muted">
              <thead className="bg-secondary text-xs uppercase font-bold text-white border-b border-secondary">
                <tr>
                  <th className="px-6 py-4 rounded-tl-sm">Contenedor</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Ubicación AGD</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right rounded-tr-sm">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-foreground-muted"
                    >
                      Cargando contenedores...
                    </td>
                  </tr>
                ) : containers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-foreground-muted"
                    >
                      No hay contenedores registrados
                    </td>
                  </tr>
                ) : (
                  containers.map((row, i) => {
                    let statusColor = "bg-gray-100 text-foreground-muted";
                    if (row.status === "Disponible")
                      statusColor = "bg-green-100 text-green-700";
                    if (row.status === "Inspección")
                      statusColor = "bg-yellow-100 text-yellow-700";
                    if (row.status === "En Muelle")
                      statusColor = "bg-primary/20 text-primary";

                    return (
                      <tr
                        key={i}
                        className="hover:bg-background-muted transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-bold text-foreground">
                          {row.containerId || row.containerNumber || `CONT-${i+1}`}
                        </td>
                        <td className="px-6 py-4">{row.type || "40HC"}</td>
                        <td className="px-6 py-4 font-mono text-xs">
                          {row.location || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "px-2.5 py-1 text-xs font-bold rounded-full",
                              statusColor,
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to="/portal/importador/retiros" className="text-primary font-semibold hover:text-accent transition-colors">
                            Solicitar Retiro
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
