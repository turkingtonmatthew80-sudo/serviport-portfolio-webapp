import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Lock,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAdminAuth } from "../contexts/AdminAuthContext";

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginAdmin(username, password);
      // Wait a tick just in case
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Fallo de autenticación. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background-muted overflow-hidden font-sans">
      {/* Left Side - Brand & Presentation (Hidden on smallest mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary-dark border-r border-border text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent opacity-50 pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-3 cursor-pointer group mb-16"
          >
            <div className="bg-white/10 p-2 rounded backdrop-blur-sm group-hover:bg-white/20 transition-all">
              <img src="/logo.png" alt="ServiportLogo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-3xl font-black text-white tracking-tight uppercase">
              Servi
              <span className="text-primary group-hover:text-primary-dark transition-colors">
                port<span className="text-white">OS</span>
              </span>
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-lg"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight font-sansita">
              Sistema <br />
              <span className="text-primary">Administrativo.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Acceso restringido únicamente a personal interno y operadores del puerto de Serviport. 
            </p>
          </motion.div>
        </div>

        <div className="z-10 bg-black/40 backdrop-blur-md p-6 rounded border border-white/5 max-w-lg mt-12">
          <div className="flex items-start gap-4">
            <div className="bg-red-500/20 p-3 rounded-full text-red-500 shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-2 font-mono">
                Área de Alta Seguridad
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Todo acceso a esta plataforma está monitoreado y registrado. Este sistema no requiere creación de cuenta; las credenciales son asignadas directamente por la Administración en planta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Forms */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-12 relative w-full lg:w-1/2 overflow-y-auto min-h-[100dvh] bg-background">
        <div className="w-full flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} /> Volver al sitio público
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-8">
          <AnimatePresence mode="wait">
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-secondary mb-2 tracking-tight font-sansita">
                    Acceso Operativo
                  </h2>
                  <p className="text-foreground-muted">
                    Ingresa tus credenciales internas de Serviport
                  </p>
                </div>

                <div className="bg-white rounded shadow-sm p-8 border border-border">
                  <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                      <div className="bg-red-50 text-red-600 p-4 rounded text-sm border border-red-200 flex items-start gap-3">
                        <div className="mt-0.5 shrink-0 bg-red-100 rounded-full p-1">
                          <X size={14} className="text-red-600" />
                        </div>
                        <p className="font-medium">{error}</p>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-secondary font-mono tracking-wide">
                        USUARIO ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-foreground-muted" />
                        </div>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          autoComplete="off"
                          className="w-full pl-10 pr-4 py-3 border border-border rounded focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-300 text-foreground bg-background-muted hover:bg-white focus:bg-white font-mono"
                          placeholder="jdoor_45"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-secondary font-mono tracking-wide">
                        CONTRASEÑA
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-foreground-muted" />
                        </div>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          className="w-full pl-10 pr-4 py-3 border border-border rounded focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-300 text-foreground bg-background-muted hover:bg-white focus:bg-white font-mono text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary text-white px-6 py-3.5 rounded font-bold hover:bg-primary-dark transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest font-mono text-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>AUTENTICANDO...</span>
                        </>
                      ) : (
                        <>
                          <span>INICIAR SESIÓN</span>
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full text-center mt-auto pt-8 pb-4">
          <p className="text-xs text-foreground-muted">
            © 2026 Serviport Agentes Navieros, C.A.
            <br />
            Sistema TOS y ERP Privado
          </p>
        </div>
      </div>
    </div>
  );
}
