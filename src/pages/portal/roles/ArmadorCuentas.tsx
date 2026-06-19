import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Search,
  DollarSign,
  ListOrdered,
  FileSignature,
} from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore";

interface DaGroup {
  id: string;
  vessel: string;
  amount: number;
  status: string;
  port: string;
  daRef: string;
  items: any[];
}

export function ArmadorCuentas() {
  const [das, setDas] = useState<DaGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDas();
  }, []);

  const fetchDas = async () => {
    try {
      const snap = await getDocs(query(collection(db, "gastos_operativos")));

      const grouped: Record<string, DaGroup> = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        const key = data.portCallId || data.vesselName || "UNKNOWN";
        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            vessel: data.vesselName || "Buque de Servicio",
            amount: 0,
            status: "Aprobado", // Asumimos aprobado, si hay pendiente bajamos la flag
            port: data.port || "Puerto Cabello",
            daRef: `DA-${key.substring(0, 6).toUpperCase()}`,
            items: [],
          };
        }
        grouped[key].amount += data.monto || 0;
        grouped[key].items.push({ id: d.id, ...data });

        if (data.status !== "Aprobado") {
          grouped[key].status = "PENDIENTE";
        }
      });
      setDas(Object.values(grouped));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (group: DaGroup) => {
    try {
      for (const item of group.items) {
        if (item.status !== "Aprobado") {
          await updateDoc(doc(db, "gastos_operativos", item.id), {
            status: "Aprobado",
            approvedAt: new Date().toISOString(),
          });
        }
      }
      fetchDas();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">
          Cuentas y DA
        </h2>
        <p className="text-foreground-muted text-sm font-sans mt-1">
          Gestión y aprobación de Disbursement Accounts (Cuentas de Escala).
        </p>
      </div>

      <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-border flex items-center justify-between">
          <span className="font-bold text-sm text-secondary font-mono flex items-center gap-2">
            <DollarSign size={16} className="text-primary" />
            Listado de Cuentas Consolidado
          </span>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">
              Cargando cuentas...
            </div>
          ) : (
            das.map((da) => (
              <div key={da.id} className="p-5 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-secondary flex items-center gap-2 font-mono text-lg">
                      <FileText size={20} className="text-blue-500" />
                      {da.daRef}
                    </p>
                    {da.status === "Aprobado" ? (
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded flex items-center gap-1 w-fit">
                        <CheckCircle size={12} /> APROBADA
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded flex items-center gap-1 w-fit">
                        PENDIENTE DE FIRMA
                      </span>
                    )}
                  </div>
                  <p className="text-sm border-l-2 border-primary pl-2 text-foreground-muted mt-2 font-mono">
                    Buque:{" "}
                    <span className="font-bold text-secondary">
                      {da.vessel}
                    </span>{" "}
                    • Puerto: {da.port}
                  </p>

                  <div className="mt-4 space-y-1">
                    <p className="text-xs font-mono font-bold text-slate-500 mb-2 uppercase flex items-center gap-1.5">
                      <ListOrdered size={12} /> Desglose de Servicios:
                    </p>
                    {da.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100 text-xs font-mono"
                      >
                        <span className="text-slate-600">{item.tipo}</span>
                        <span className="text-secondary font-semibold">
                          ${" "}
                          {item.monto?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-start md:items-end md:justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-1">
                    Total a Pagar
                  </p>
                  <p className="text-3xl font-mono font-black text-secondary mb-4">
                    ${" "}
                    {da.amount?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>

                  {da.status === "Aprobado" ? (
                    <button className="text-xs uppercase tracking-widest font-bold px-4 py-2 border border-emerald-500 text-emerald-700 bg-emerald-50 rounded flex items-center gap-2">
                      <CheckCircle size={14} /> LIQUIDADO
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(da)}
                      className="w-full text-xs uppercase tracking-widest font-bold px-4 py-3 bg-primary text-white hover:bg-primary-hover border border-primary rounded flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <FileSignature size={14} /> FIRMAR Y APROBAR
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          {!loading && das.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">
              No hay DA registradas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
