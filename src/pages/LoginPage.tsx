import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Anchor,
  Mail,
  Lock,
  ArrowRight,
  Activity,
  BellRing,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, checkIfUserExists, resetPassword } =
    useAuth();

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Recovery State
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [recoveryMessage, setRecoveryMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // Wait a tick just in case
      navigate("/portal");
    } catch (err: any) {
      if (err.message === "auth/user-not-registered") {
        setError(
          "Acceso denegado: Usuario no registrado en la base de datos corporativa. Por favor registre su empresa primero.",
        );
      } else if (err.message === "auth/unverified-email") {
        setError(
          "Tu cuenta no está verificada. Por favor revisa el enlace enviado a tu correo corporativo.",
        );
      } else if (err.message === "auth/user-not-found-in-db") {
        setError(
          "Tu cuenta fue autenticada pero el perfil comercial no fue encontrado. Contacta a soporte.",
        );
      } else if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      } else {
        setError(
          "Ocurrió un error al intentar acceder. Por favor, intenta más tarde.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      navigate("/portal");
    } catch (err: any) {
      if (
        err.message === "auth/user-not-registered" ||
        err.code === "auth/user-not-registered"
      ) {
        setError(
          "Acceso denegado: Solo las cuentas B2B registradas en nuestra base corporativa pueden iniciar sesión con Google.",
        );
      } else if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        setError(""); // Ignorar si el usuario cierra el popup
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "Ya existe una cuenta con este correo corporativo (posiblemente usando contraseña). Intenta iniciar sesión con tu correo y contraseña.",
        );
      } else if (err.code === "auth/unauthorized-domain") {
        setError(
          "Error de dominio: El dominio actual no está autorizado en Google Firebase. Añade el dominio de esta página a los 'Authorized domains' en la consola de Firebase Authentication.",
        );
      } else {
        console.error("Login with Google Error", err);
        setError(
          "Ocurrió un error con la autenticación de Google. " +
            (err.message || ""),
        );
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setRecoveryMessage("Por favor ingresa tu correo electrónico.");
      setRecoveryStatus("error");
      return;
    }

    setRecoveryStatus("loading");
    setRecoveryMessage("");

    try {
      const exists = await checkIfUserExists(recoveryEmail);
      if (!exists) {
        setRecoveryStatus("error");
        setRecoveryMessage(
          "Este correo no está registrado en nuestro sistema. Por favor solicita un registro B2B.",
        );
        return;
      }

      const success = await resetPassword(recoveryEmail);
      if (success) {
        setRecoveryStatus("success");
        setRecoveryMessage(
          "Hemos enviado instrucciones a tu correo para restablecer tu contraseña.",
        );
      } else {
        setRecoveryStatus("error");
        setRecoveryMessage(
          "No pudimos enviar el correo de recuperación. Intente más tarde.",
        );
      }
    } catch (err) {
      setRecoveryStatus("error");
      setRecoveryMessage("Ocurrió un error al intentar verificar la cuenta.");
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background-muted overflow-hidden font-sans">
      {/* Left Side - Brand & Presentation (Hidden on smallest mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/20 to-transparent opacity-50 pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-3 cursor-pointer group mb-16"
          >
            <div className="bg-background/10 p-2 rounded-lg backdrop-blur-sm group-hover:bg-background/20 transition-all">
              <Anchor
                className="text-primary group-hover:text-accent transition-colors"
                size={32}
              />
            </div>
            <span className="text-3xl font-black text-white tracking-tight uppercase">
              Servi
              <span className="text-primary group-hover:text-accent transition-colors">
                port
              </span>
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-lg"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              La operación de tu carga, <br />
              <span className="text-primary">en tus manos.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Accede a Serviport OS para monitorear escalas, gestionar
              contenedores y aprobar proformas en tiempo real. Entorno B2B
              exclusivo para nuestros aliados comerciales.
            </p>
          </motion.div>
        </div>

        <div className="z-10 grid grid-cols-2 gap-6 max-w-lg mt-12">
          <div className="flex items-start gap-3">
            <div className="bg-primary/20 p-2 rounded text-primary shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Monitoreo en Tiempo Real
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Trazabilidad exacta de tu carga en AGD.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-accent/20 p-2 rounded text-accent shrink-0">
              <BellRing size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Notificaciones Activas
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Alertas de zarpe, gate-out y liberación.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Forms */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-12 relative w-full lg:w-1/2 overflow-y-auto min-h-[100dvh]">
        <div className="w-full flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-8">
          <AnimatePresence mode="wait">
            {!isRecovering ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                    Bienvenido
                  </h2>
                  <p className="text-foreground-muted">
                    Ingresa tus credenciales para acceder a Serviport OS
                  </p>
                </div>

                <div className="bg-background rounded-xl shadow-xl shadow-slate-200/50 p-8 border border-border">
                  <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-start gap-3">
                        <div className="mt-0.5 shrink-0 bg-red-100 rounded-full p-1">
                          <X size={14} className="text-red-600" />
                        </div>
                        <p className="font-medium">{error}</p>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-foreground-muted">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-foreground-muted" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-300 text-foreground bg-background-muted/50 hover:bg-background focus:bg-background"
                          placeholder="usuario@empresa.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-semibold text-foreground-muted">
                          Contraseña
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsRecovering(true)}
                          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-foreground-muted" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          className="w-full pl-10 pr-10 py-3 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-300 text-foreground bg-background-muted/50 hover:bg-background focus:bg-background"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground-muted hover:text-foreground-muted focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || isGoogleLoading}
                      className="w-full bg-secondary text-white px-6 py-3.5 rounded-lg font-bold hover:bg-slate-800 focus:ring-4 focus:ring-secondary/20 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>VERIFICANDO...</span>
                        </>
                      ) : (
                        <>
                          <span>INGRESAR AHORA</span>
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-background text-foreground-muted">
                          O continuar con
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isLoading || isGoogleLoading}
                      className="w-full bg-background border border-border text-foreground-muted px-6 py-3.5 rounded-lg font-bold hover:bg-background-muted transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isGoogleLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                      )}
                      <span>Google</span>
                    </button>
                  </form>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-foreground-muted mb-3">
                    ¿Aún no tienes cuenta comercial B2B?
                  </p>
                  <Link
                    to="/registro-b2b"
                    className="inline-block text-sm font-bold text-accent hover:text-orange-500 hover:underline transition-all"
                  >
                    SOLICITAR REGISTRO DE CLIENTE
                  </Link>
                </div>
              </motion.div>
            ) : (
              // Recuperación de Contraseña
              <motion.div
                key="recovery"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-background rounded-xl shadow-xl shadow-slate-200/50 p-8 border border-border relative">
                  <button
                    onClick={() => {
                      setIsRecovering(false);
                      setRecoveryStatus("idle");
                      setRecoveryMessage("");
                    }}
                    className="absolute top-4 left-4 p-2 text-foreground-muted hover:text-foreground-muted bg-background-muted hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <div className="text-center mb-6 mt-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                      <Lock size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                      Recuperar Acceso
                    </h2>
                    <p className="text-foreground-muted text-sm">
                      Ingresa el correo asociado a tu cuenta B2B y te enviaremos
                      un enlace para restablecer tu contraseña.
                    </p>
                  </div>

                  {recoveryStatus === "success" ? (
                    <div className="text-center py-6">
                      <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="font-bold text-lg text-foreground mb-2">
                        ¡Correo Enviado!
                      </h3>
                      <p className="text-foreground-muted text-sm mb-6 max-w-xs mx-auto">
                        {recoveryMessage}
                      </p>
                      <button
                        onClick={() => setIsRecovering(false)}
                        className="w-full border border-border text-foreground-muted px-6 py-3 rounded-lg font-bold hover:bg-background-muted transition-all font-sm"
                      >
                        VOLVER AL LOGIN
                      </button>
                    </div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleRecovery}>
                      {recoveryStatus === "error" && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
                          {recoveryMessage}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-foreground-muted">
                          Correo Electrónico
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-foreground-muted" />
                          </div>
                          <input
                            type="email"
                            required
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-300 text-foreground bg-background-muted/50 focus:bg-background"
                            placeholder="usuario@empresa.com"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={recoveryStatus === "loading"}
                        className="w-full bg-primary text-white px-6 py-3.5 rounded-lg font-bold hover:bg-primary-dark focus:ring-4 focus:ring-primary/20 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {recoveryStatus === "loading" ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>ENVIANDO...</span>
                          </>
                        ) : (
                          <>
                            <span>ENVIAR INSTRUCCIONES</span>
                            <ArrowRight
                              size={18}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full text-center mt-auto pt-8 pb-4">
          <p className="text-xs text-foreground-muted">
            © 2026 Serviport Agentes Navieros, C.A.
            <br />
            Uso exclusivo para usuarios B2B autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}
