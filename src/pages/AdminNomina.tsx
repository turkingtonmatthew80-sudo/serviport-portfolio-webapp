import { useAdminAuth } from "../contexts/AdminAuthContext";

export function AdminNomina() {
  const { adminUser } = useAdminAuth();
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Nómina Venezolana</h2>
      <div className="p-12 text-center border border-dashed border-slate-300 rounded text-slate-500 font-mono text-sm uppercase bg-white/50">
         Módulo de Nómina en Desarrollo / Sin Datos Reales en BD
      </div>
    </div>
  );
}
