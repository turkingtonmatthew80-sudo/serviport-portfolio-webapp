import { useState, useEffect } from "react";
import { DollarSign, Save, Loader2, List, Settings, Plus, Edit, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { logAuditAction } from "../lib/audit";
import { useAdminAuth } from "../contexts/AdminAuthContext";

interface Tariff {
  id: string;
  name: string;
  type: string;
  price: number;
}

export function AdminConfig() {
  const { adminUser } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"tasas" | "tarifas" | "sistema">("tasas");
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState("0");
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // New Tariff Form
  const [showTariffForm, setShowTariffForm] = useState(false);
  const [newTariff, setNewTariff] = useState({ name: "", type: "por contenedor", price: 0 });

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        // Load settings / exchange rate
        const docRef = doc(db, "settings", "global");
        const docSnap = await getDoc(docRef);
        const today = new Date().toISOString().split('T')[0];

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.exchangeRateLastUpdated === today && data.exchangeRate) {
            setExchangeRate(data.exchangeRate.toString());
          } else {
            await fetchAndSaveExchangeRate(docRef, today);
          }
        } else {
          await fetchAndSaveExchangeRate(docRef, today);
        }

        // Load tariffs
        const tariffsRef = collection(db, "tariffs");
        const tariffsSnap = await getDocs(tariffsRef);
        let loadedTariffs: Tariff[] = [];
        tariffsSnap.forEach(t => {
           loadedTariffs.push({ id: t.id, ...t.data() } as Tariff);
        });

        // Seed if empty just for demo
        if (loadedTariffs.length === 0) {
           const initialTariffs = [
            { name: "Estiba/Desestiba Contenedor 20'", type: "por contenedor", price: 150 },
            { name: "Estiba/Desestiba Contenedor 40'", type: "por contenedor", price: 200 },
            { name: "Almacenaje AGD (días 1-5)", type: "por día", price: 45 },
            { name: "Carga Granel Limpia", type: "por tonelada", price: 12 },
            { name: "Agenciamiento Básico", type: "por escala", price: 1200 },
           ];
           for (const t of initialTariffs) {
             const added = await addDoc(collection(db, "tariffs"), t);
             loadedTariffs.push({ id: added.id, ...t });
           }
        }
        setTariffs(loadedTariffs);

      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  const fetchAndSaveExchangeRate = async (docRef: any, today: string) => {
    try {
      const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
      if (response.ok) {
         const apiData = await response.json();
         const newRate = apiData.promedio;
         setExchangeRate(newRate.toString());
         await setDoc(docRef, { exchangeRate: newRate, exchangeRateLastUpdated: today }, { merge: true });
      }
    } catch(err) {
      console.error("Failed to fetch BCV:", err);
    }
  };

  const handleSaveTasa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const docRef = doc(db, "settings", "global");
      await setDoc(docRef, { exchangeRate: parseFloat(exchangeRate), exchangeRateLastUpdated: today }, { merge: true });
      await logAuditAction(`Actualizó Tasa de Cambio (${exchangeRate} VES)`, adminUser?.role, adminUser?.email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTariff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
       const added = await addDoc(collection(db, "tariffs"), newTariff);
       setTariffs([...tariffs, { id: added.id, ...newTariff }]);
       await logAuditAction(`Creó nueva tarifa (${newTariff.name} - $${newTariff.price})`, adminUser?.role, adminUser?.email);
       setShowTariffForm(false);
       setNewTariff({ name: "", type: "por contenedor", price: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const exportDB = async () => {
    setIsLoading(true);
    try {
       const usersSnap = await getDocs(collection(db, "users"));
       const tariffsSnap = await getDocs(collection(db, "tariffs"));
       
       const exportData = {
         users: usersSnap.docs.map(d => d.data()),
         tariffs: tariffsSnap.docs.map(d => d.data()),
         exportDate: new Date().toISOString()
       };

       const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
       const url = URL.createObjectURL(blob);
       const a = document.createElement("a");
       a.href = url;
       a.download = `serviport_backup_${new Date().toISOString().split('T')[0]}.json`;
       document.body.appendChild(a);
       a.click();
       a.remove();
       URL.revokeObjectURL(url);

       await logAuditAction(`Exportó Base de Datos (JSON)`, adminUser?.role, adminUser?.email);
    } finally {
       setIsLoading(false);
    }
  };

  if (isLoadingData) {
     return <div className="p-8 text-center"><Loader2 className="animate-spin text-primary inline-block" size={32} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Configuración Global</h2>
        <p className="text-foreground-muted text-sm font-sans mt-1">Administración de tarifas, tasas de cambio y preferencias del sistema.</p>
      </div>

      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("tasas")}
          className={`px-6 py-3 font-bold text-sm tracking-widest uppercase transition-colors uppercase font-mono ${
            activeTab === "tasas" ? "text-primary border-b-2 border-primary" : "text-foreground-muted hover:text-secondary"
          }`}
        >
          Tasas de Cambio
        </button>
        <button
          onClick={() => setActiveTab("tarifas")}
          className={`px-6 py-3 font-bold text-sm tracking-widest uppercase transition-colors uppercase font-mono ${
            activeTab === "tarifas" ? "text-primary border-b-2 border-primary" : "text-foreground-muted hover:text-secondary"
          }`}
        >
          Catálogo de Tarifas
        </button>
        <button
          onClick={() => setActiveTab("sistema")}
          className={`px-6 py-3 font-bold text-sm tracking-widest uppercase transition-colors uppercase font-mono ${
            activeTab === "sistema" ? "text-primary border-b-2 border-primary" : "text-foreground-muted hover:text-secondary"
          }`}
        >
          Sistema y Autenticación
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "tasas" && (
            <div className="bg-white rounded border border-border shadow-sm p-8 max-w-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-emerald-50 p-3 rounded text-emerald-600 shrink-0">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-secondary text-lg mb-1">Tasa del Banco Central (BCV)</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    Esta tasa base se utiliza automáticamente para calcular los montos en Bolívares de las proformas y facturas. Se actualiza vía DolarAPI o manualmente.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveTasa} className="space-y-6 bg-background-muted p-6 rounded border border-border">
                <div>
                  <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wide font-mono">
                    Valor USD/VES Actual
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-foreground-muted font-bold">Bs.</span>
                    <input 
                      type="number" step="0.0001" required value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-border text-foreground rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-lg transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold tracking-widest font-mono text-sm uppercase rounded transition-colors disabled:opacity-50 shadow-sm">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Actualizar Tasa Manualmente
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "tarifas" && (
            <div className="bg-white rounded border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-secondary tracking-widest text-sm font-mono uppercase">Tarifario Base (Servicios)</h3>
                <button 
                  onClick={() => setShowTariffForm(!showTariffForm)}
                  className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded font-bold text-xs tracking-widest uppercase font-mono transition-colors flex items-center gap-1"
                >
                  <Plus size={16} /> Añadir Servicio
                </button>
              </div>

              {showTariffForm && (
                <form onSubmit={handleAddTariff} className="p-6 bg-background-muted border-b border-border space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-foreground-muted mb-1 font-mono uppercase">Nombre</label>
                       <input required type="text" className="w-full p-2 border border-border rounded" value={newTariff.name} onChange={(e) => setNewTariff({...newTariff, name: e.target.value})} />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-foreground-muted mb-1 font-mono uppercase">Unidad</label>
                       <select required className="w-full p-2 border border-border rounded" value={newTariff.type} onChange={(e) => setNewTariff({...newTariff, type: e.target.value})}>
                          <option value="por contenedor">por contenedor</option>
                          <option value="por tonelada">por tonelada</option>
                          <option value="por día">por día</option>
                          <option value="por escala">por escala</option>
                          <option value="unidad">unidad</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-foreground-muted mb-1 font-mono uppercase">Precio USD</label>
                       <input required type="number" step="0.01" className="w-full p-2 border border-border rounded" value={newTariff.price} onChange={(e) => setNewTariff({...newTariff, price: parseFloat(e.target.value)})} />
                     </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="bg-primary text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-widest">
                    {isLoading ? "Guardando..." : "Guardar Tarifa"}
                  </button>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm text-foreground">
                  <thead>
                    <tr className="bg-background-muted text-foreground-muted border-b border-border uppercase tracking-wider text-[10px] font-mono">
                      <th className="px-6 py-4 font-bold">ID (DB)</th>
                      <th className="px-6 py-4 font-bold">Nombre del Servicio</th>
                      <th className="px-6 py-4 font-bold">Unidad de Cobro</th>
                      <th className="px-6 py-4 font-bold text-right">Precio USD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tariffs.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-[10px] text-foreground-muted truncate max-w-[100px]">{t.id}</td>
                        <td className="px-6 py-4 font-bold text-secondary">{t.name}</td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-mono text-[10px] font-bold tracking-widest uppercase border border-slate-200">
                            {t.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-600 text-right text-base">${t.price.toFixed(2)}</td>
                      </tr>
                    ))}
                    {tariffs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-foreground-muted font-mono text-xs">Sin datos reales (0 tarifas registradas)</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "sistema" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-border shadow-sm rounded flex items-start gap-4">
                <Download className="text-secondary" size={32} />
                <div>
                  <h3 className="font-bold text-secondary mb-1">Backup de Base de Datos</h3>
                  <p className="text-sm text-foreground-muted mb-4">Exportación manual completa de los nodos de Firebase para auditoría.</p>
                  <button disabled={isLoading} onClick={exportDB} className="px-4 py-2 bg-slate-100 text-secondary hover:bg-slate-200 border border-slate-300 font-bold rounded text-xs uppercase transition-colors">
                    {isLoading ? "Exportando..." : "Exportar JSON"}
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 border border-border shadow-sm rounded flex items-start gap-4">
                <Settings className="text-secondary" size={32} />
                <div>
                  <h3 className="font-bold text-secondary mb-1">Mantenimiento de Servidores TOS</h3>
                  <p className="text-sm text-foreground-muted mb-4">Variables y entornos del sistema operativo.</p>
                  <button className="px-4 py-2 bg-secondary text-white font-bold rounded text-xs uppercase hover:bg-secondary-dark transition-colors">
                    Ver Variables
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
