import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { Loader2, Save, User, Lock, Mail, Phone, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export function AdminAccountSettings() {
  const { adminUser } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!adminUser || adminUser.role === "SUPERADMIN") {
        setIsLoading(false);
        return;
      }
      try {
        const d = await getDoc(doc(db, "employees", adminUser.id));
        if (d.exists()) {
          const data = d.data();
          setName(data.name === "Sin Configurar" ? "" : data.name);
          setPassword(data.password || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [adminUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser || adminUser.role === "SUPERADMIN") return;
    
    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "employees", adminUser.id), {
        name,
        password,
        email,
        phone,
      });
      setSuccessMsg("Perfil actualizado exitosamente.");
    } catch (err) {
      setErrorMsg("Error al guardar los datos.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (adminUser?.role === "SUPERADMIN") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Configuración de Cuenta</h2>
        <div className="bg-white p-8 border border-border text-center rounded shadow-sm">
          <p className="text-foreground-muted font-mono">La cuenta de Administrador de Sistema se configura mediante variables de entorno.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tight font-sansita">Configuración de Cuenta</h2>
        <p className="text-foreground-muted text-sm mt-1">Completa tus datos personales y actualiza tu credencial de acceso.</p>
      </div>

      <div className="bg-white border border-border p-8 shadow-sm rounded">
        <form onSubmit={handleSave} className="space-y-8">
          
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 font-mono text-sm rounded">
              <CheckCircle2 size={18} />
              {successMsg}
            </motion.div>
          )}

          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 p-4 font-mono text-sm rounded">
              {errorMsg}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-foreground-muted uppercase tracking-wide font-mono">
                <User size={14} /> Nombre Completo (Requerido)
              </label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-background-muted border border-border text-foreground rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm transition-colors"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-foreground-muted uppercase tracking-wide font-mono">
                <Lock size={14} /> Contraseña de Acceso (Requerida)
              </label>
              <input 
                type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background-muted border border-border text-foreground rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-foreground-muted uppercase tracking-wide font-mono">
                <Mail size={14} /> Correo Corporativo
              </label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background-muted border border-border text-foreground rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm transition-colors"
                placeholder="juan@serviport.com"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-foreground-muted uppercase tracking-wide font-mono">
                <Phone size={14} /> Teléfono Móvil
              </label>
              <input 
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-background-muted border border-border text-foreground rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm transition-colors"
                placeholder="+58 414 123 4567"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-border flex justify-end">
            <button type="submit" disabled={isSaving} className="flex justify-center items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold tracking-widest font-mono text-sm uppercase rounded transition-colors disabled:opacity-50">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
