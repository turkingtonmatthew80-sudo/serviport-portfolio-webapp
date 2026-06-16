import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Anchor,
  CheckCircle2,
  ChevronRight,
  Building,
  ShieldCheck,
  CreditCard,
  MapPin,
  Eye,
  EyeOff,
  Search,
  Map as MapIcon,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth, RoleId } from "../contexts/AuthContext";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet icon issue in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapModal({
  isOpen,
  onClose,
  onSelectAddress,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (addr: string) => void;
}) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Reverse geocoding with Nominatim
  const fetchAddress = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      );
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
        setPosition({ lat, lng });
      }
    } catch (error) {
      console.error("Geocoding error", error);
    }
    setLoading(false);
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });

    return position === null ? null : <Marker position={position}></Marker>;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <MapIcon size={18} className="text-primary" /> Selecciona tu
            ubicación
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-foreground-muted hover:text-foreground-muted hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 bg-background-muted relative">
          <MapContainer
            center={[10.4806, -66.9036]}
            zoom={6}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-border text-sm font-medium text-foreground-muted z-[1000] pointer-events-none">
            Haz clic en el mapa para ubicar tu dirección
          </div>
        </div>
        <div className="px-5 py-4 border-t border-border bg-background-muted flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 text-sm text-foreground-muted truncate">
            {loading ? (
              "Cargando dirección..."
            ) : address ? (
              <span className="font-medium text-foreground" title={address}>
                {address}
              </span>
            ) : (
              "Ninguna ubicación seleccionada"
            )}
          </div>
          <button
            type="button"
            disabled={!address || loading}
            onClick={() => {
              onSelectAddress(address);
              onClose();
            }}
            className="w-full sm:w-auto bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Ubicación
          </button>
        </div>
      </div>
    </div>
  );
}

function AddressInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-foreground-muted" />
          </div>
          <input
            type="text"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Dirección fiscal detallada..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 bg-background-muted hover:bg-slate-200 text-foreground-muted border border-border px-4 py-2.5 rounded-md font-semibold transition-colors flex items-center gap-2"
        >
          <MapIcon size={18} />
          <span className="hidden sm:inline">Buscar en Mapa</span>
        </button>
      </div>
      <MapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAddress={onChange}
      />
    </>
  );
}

const SERVICES = [
  { id: "naviera", name: "Naviera", desc: "Gestión de Port Calls y proformas" },
  {
    id: "armador",
    name: "Armador",
    desc: "Cuentas de liquidación y husbandry",
  },
  {
    id: "importador",
    name: "Importador (BCO)",
    desc: "Trazabilidad en AGD y retiros",
  },
  {
    id: "exportador",
    name: "Exportador",
    desc: "Ingreso al almacén y embarque",
  },
  {
    id: "agente_aduana",
    name: "Agente de Aduana",
    desc: "Consultas operativas y despachos",
  },
  {
    id: "transportista",
    name: "Transportista",
    desc: "Órdenes de carga y EIRs",
  },
  {
    id: "consolidador",
    name: "Consolidador / NVOCC",
    desc: "Gestión de B/L máster y house",
  },
];

export function B2BRegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Form State
  const [rifLeft, setRifLeft] = useState("");
  const [rifRight, setRifRight] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [emailDomain, setEmailDomain] = useState("empresa.com");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [representante, setRepresentante] = useState("");

  const navigate = useNavigate();
  const { register, registerGoogleUser } = useAuth();
  const [error, setError] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleAutofilled, setIsGoogleAutofilled] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleGoogleAutofill = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.displayName) setRepresentante(user.displayName);
      if (user.email) {
        const parts = user.email.split("@");
        if (parts.length === 2) {
          setEmailUser(parts[0]);
          setEmailDomain(parts[1]);
        }
      }

      // Do NOT sign out here. Keep them signed in so we can finalize registration without re-authenticating.
      setIsGoogleAutofilled(true);
    } catch (err: any) {
      if (err.code === "auth/unauthorized-domain") {
        setError(
          "Error de dominio: El dominio actual no está autorizado en Google Firebase.",
        );
      } else if (
        err.code !== "auth/popup-closed-by-user" &&
        err.code !== "auth/cancelled-popup-request"
      ) {
        setError("Ocurrió un error al extraer los datos de Google.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      if (step === 2) {
        // Validation for step 2
        if (rifLeft.length !== 9 || rifRight.length !== 1) {
          setError("El RIF debe tener 9 dígitos seguidos de 1 dígito.");
          return;
        }

        const isSecure =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&._-]{8,}$/.test(
            password,
          );
        if (!isGoogleAutofilled && !isSecure) {
          setError(
            "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
          );
          return;
        }

        if (!emailUser || !emailDomain) {
          setError("Verifica el correo electrónico.");
          return;
        }
      }
      setError("");
      setStep(step + 1);
    } else {
      setError("");
      const fullRif = `J-${rifLeft}-${rifRight}`;
      const fullEmail = `${emailUser}@${emailDomain}`;

      try {
        if (isGoogleAutofilled) {
          await registerGoogleUser({
            razonSocial,
            email: fullEmail,
            rif: fullRif,
            roles: selectedServices as RoleId[],
          });
        } else {
          await register(
            {
              razonSocial,
              email: fullEmail,
              rif: fullRif,
              roles: selectedServices as RoleId[],
            },
            password,
          );
        }

        setIsSuccess(true);
      } catch (err: any) {
        if (
          err.message === "auth/email-already-in-use" ||
          err.code === "auth/email-already-in-use" ||
          err.code === "auth/credential-already-in-use"
        ) {
          setError(
            "El correo electrónico ya está registrado. Por favor, intenta iniciar sesión.",
          );
        } else if (err.code === "auth/operation-not-allowed") {
          setError(
            "El registro por correo electrónico no está habilitado. Por favor, contacta a soporte o habilítalo en la consola de Firebase.",
          );
        } else {
          setError(
            "Hubo un error al crear la cuenta. Verifica tus datos o intenta más tarde. Detalle: " +
              (err.message || ""),
          );
        }
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[100dvh] bg-background-muted flex flex-col py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <Anchor
              className="text-primary group-hover:text-accent transition-colors"
              size={28}
            />
            <span className="text-xl font-black text-foreground tracking-tight uppercase">
              Servi
              <span className="text-primary group-hover:text-accent transition-colors">
                port
              </span>
            </span>
          </Link>
        </div>
        <div className="mx-auto w-full max-w-lg bg-background shadow-xl rounded-2xl overflow-hidden border border-border p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            ¡Registro Exitoso!
          </h2>

          {isGoogleAutofilled ? (
            <p className="text-foreground-muted mb-8 leading-relaxed">
              Tu cuenta corporativa ha sido creada y validada exitosamente
              mediante tu cuenta de Google.
              <br />
              <br />
              Ya puedes iniciar sesión en el portal utilizando la opción de{" "}
              <strong>Continuar con Google</strong>.
            </p>
          ) : (
            <p className="text-foreground-muted mb-8 leading-relaxed">
              Hemos enviado un correo electrónico a{" "}
              <span className="font-semibold text-gray-800">
                {emailUser}@{emailDomain}
              </span>
              .
              <br />
              <br />
              Por favor, revisa tu bandeja de entrada (o carpeta de spam) y haz
              clic en el enlace adjunto para{" "}
              <strong>verificar tu cuenta corporativa</strong> antes de iniciar
              sesión.
            </p>
          )}

          <Link
            to="/login"
            className="inline-flex w-full bg-primary text-white px-6 py-3.5 rounded-lg font-bold hover:bg-primary-dark transition-all justify-center"
          >
            IR AL INICIO DE SESIÓN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background-muted flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-2 group">
          <Anchor
            className="text-primary group-hover:text-accent transition-colors"
            size={28}
          />
          <span className="text-xl font-black text-foreground tracking-tight uppercase">
            Servi
            <span className="text-primary group-hover:text-accent transition-colors">
              port
            </span>
          </span>
        </Link>
        <div className="text-sm text-foreground-muted font-medium">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline hover:text-accent"
          >
            Inicia sesión
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl bg-background shadow-xl rounded-2xl overflow-hidden border border-border flex flex-col md:flex-row">
        {/* Progress Sidebar */}
        <div className="w-full md:w-1/3 bg-secondary p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Registro B2B</h2>
          <div className="space-y-6">
            <div
              className={cn(
                "flex items-start gap-3",
                step >= 1 ? "opacity-100" : "opacity-40",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold",
                  step > 1
                    ? "bg-green-500 text-white"
                    : step === 1
                      ? "bg-accent text-white"
                      : "bg-gray-700 text-gray-300",
                )}
              >
                {step > 1 ? <CheckCircle2 size={16} /> : "1"}
              </div>
              <div>
                <p className="font-semibold text-sm mt-1.5">Servicios</p>
                <p className="text-xs text-foreground-muted mt-1">
                  Selecciona los módulos a contratar
                </p>
              </div>
            </div>

            <div
              className={cn(
                "flex items-start gap-3",
                step >= 2 ? "opacity-100" : "opacity-40",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold",
                  step > 2
                    ? "bg-green-500 text-white"
                    : step === 2
                      ? "bg-accent text-white"
                      : "bg-gray-700 text-gray-300",
                )}
              >
                {step > 2 ? <CheckCircle2 size={16} /> : "2"}
              </div>
              <div>
                <p className="font-semibold text-sm mt-1.5">Datos Fiscales</p>
                <p className="text-xs text-foreground-muted mt-1">
                  Información de la empresa y RIF
                </p>
              </div>
            </div>

            <div
              className={cn(
                "flex items-start gap-3",
                step >= 3 ? "opacity-100" : "opacity-40",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold",
                  step === 3
                    ? "bg-accent text-white"
                    : "bg-gray-700 text-gray-300",
                )}
              >
                3
              </div>
              <div>
                <p className="font-semibold text-sm mt-1.5">Confirmación</p>
                <p className="text-xs text-foreground-muted mt-1">
                  Resumen de costos y activación
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="w-full md:w-2/3 p-8 md:p-12">
          <form onSubmit={handleNext}>
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="text-primary" /> Selecciona tus
                    Servicios
                  </h3>
                  <p className="text-slate-500 text-sm mt-2">
                    Selecciona los servicios que necesitas. Puedes ampliarlos
                    después en el portal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {SERVICES.map((srv) => {
                    const isSelected = selectedServices.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleService(srv.id)}
                        className={cn(
                          "border-2 rounded-xl p-4 cursor-pointer transition-all duration-200",
                          isSelected
                            ? "border-primary bg-cyan-50/30"
                            : "border-border hover:border-primary/50 hover:bg-background-muted",
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-foreground">
                            {srv.name}
                          </span>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border flex items-center justify-center",
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-border",
                            )}
                          >
                            {isSelected && (
                              <CheckCircle2 size={12} className="text-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">{srv.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  disabled={selectedServices.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3.5 rounded-md font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar <ChevronRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Building className="text-primary" /> Datos Fiscales
                  </h3>
                  <p className="text-slate-500 text-sm mt-2">
                    Ingresa los datos fiscales de tu empresa. Usaremos esta
                    información para emitir facturas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAutofill}
                  disabled={isGoogleLoading}
                  className="w-full mb-6 bg-background border border-border text-foreground-muted px-6 py-2 rounded-lg font-bold hover:bg-background-muted transition-all flex items-center justify-center gap-3"
                >
                  {isGoogleLoading ? (
                    <Loader2 size={18} className="animate-spin text-foreground-muted" />
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
                  <span>Autocompletar Nombre completo y Correo con Google</span>
                </button>

                <div className="space-y-5 mb-8">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 font-medium">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-foreground-muted mb-1.5">
                        RIF Venezolano *
                      </label>
                      <div className="flex items-center">
                        <span className="bg-gray-100 border border-border border-r-0 rounded-l-md px-3 py-2.5 text-foreground-muted font-semibold select-none">
                          J-
                        </span>
                        <input
                          type="text"
                          required
                          value={rifLeft}
                          onChange={(e) => {
                            const val = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 9);
                            setRifLeft(val);
                          }}
                          placeholder="123456789"
                          className="w-full border-y border-l border-r-0 border-border px-3 py-2.5 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-gray-300"
                        />
                        <span className="bg-gray-100 border-y border-border px-3 py-2.5 text-foreground-muted font-semibold select-none">
                          -
                        </span>
                        <input
                          type="text"
                          required
                          value={rifRight}
                          onChange={(e) => {
                            const val = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 1);
                            setRifRight(val);
                          }}
                          placeholder="0"
                          className="w-16 border border-border rounded-r-md px-3 py-2.5 focus:border-primary focus:ring-0 outline-none transition-all text-center placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground-muted mb-1.5">
                        Razón Social *
                      </label>
                      <input
                        type="text"
                        required
                        value={razonSocial}
                        onChange={(e) => setRazonSocial(e.target.value)}
                        placeholder="Mi Empresa, C.A."
                        className="w-full border border-border rounded-md px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-muted mb-1.5">
                      Dirección Fiscal *
                    </label>
                    <AddressInput value={direccion} onChange={setDireccion} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-foreground-muted mb-1.5">
                        Representante Legal *
                      </label>
                      <input
                        type="text"
                        required
                        value={representante}
                        onChange={(e) => setRepresentante(e.target.value)}
                        placeholder="Nombre completo"
                        className="w-full border border-border rounded-md px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground-muted mb-1.5">
                        Correo Electrónico *
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          required
                          value={emailUser}
                          onChange={(e) =>
                            setEmailUser(e.target.value.replace(/\s|@/g, ""))
                          }
                          placeholder="usuario"
                          className="w-1/2 border border-r-0 border-border rounded-l-md px-3 py-2.5 focus:border-primary outline-none transition-all focus:relative z-10"
                        />
                        <span className="bg-gray-100 border-y border-border px-3 py-2.5 text-foreground-muted font-semibold select-none z-0">
                          @
                        </span>
                        <input
                          type="text"
                          required
                          value={emailDomain}
                          onChange={(e) =>
                            setEmailDomain(e.target.value.replace(/\s|@/g, ""))
                          }
                          placeholder="empresa.com"
                          className="w-1/2 border border-l-0 border-border rounded-r-md px-3 py-2.5 focus:border-primary outline-none transition-all focus:relative z-10"
                        />
                      </div>
                    </div>
                  </div>
                  {!isGoogleAutofilled && (
                    <div>
                      <label className="block text-sm font-semibold text-foreground-muted mb-1.5 flex justify-between">
                        <span>Contraseña Acceso Portal *</span>
                        <span className="text-xs text-foreground-muted font-normal">
                          Mín. 8 caracteres, 1 may/min, 1 número
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required={!isGoogleAutofilled}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full border border-border rounded-md pl-4 pr-10 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-foreground"
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
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 border border-border text-foreground-muted px-6 py-3.5 rounded-md font-bold hover:bg-background-muted transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3.5 rounded-md font-bold hover:bg-slate-800 transition-colors"
                  >
                    Continuar <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <CreditCard className="text-primary" /> Resumen de
                    Suscripción
                  </h3>
                  <p className="text-slate-500 text-sm mt-2">
                    Revisa el resumen de tu suscripción y confirma la
                    activación.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 font-medium">
                    {error}
                  </div>
                )}

                <div className="bg-background-muted border border-border rounded-xl p-6 mb-8">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="text-foreground-muted font-medium">
                        Plan Base (Acceso a portal)
                      </span>
                      <span className="font-bold text-foreground">Incluido</span>
                    </div>
                    {selectedServices.map((id) => {
                      const s = SERVICES.find((x) => x.id === id);
                      return (
                        <div
                          key={id}
                          className="flex justify-between items-center pb-3 border-b border-border border-dashed"
                        >
                          <span className="text-foreground-muted">
                            Servicio: {s?.name}
                          </span>
                          <span className="font-medium text-foreground">
                            Simulado
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg text-foreground">
                      Total Mensual
                    </span>
                    <span className="font-black text-2xl text-primary">
                      $0.00
                    </span>
                  </div>
                  <p className="text-xs text-foreground-muted text-right mt-1">
                    * Simulación de costo
                  </p>
                </div>

                <div className="flex items-start gap-3 mb-8">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <p className="text-sm text-foreground-muted leading-tight">
                    Acepto los{" "}
                    <Link
                      to="/terminos-y-condiciones"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Términos B2B
                    </Link>{" "}
                    y la{" "}
                    <Link
                      to="/politica-de-privacidad"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Política de Privacidad
                    </Link>
                    . Entiendo que los servicios contratados se activarán tras
                    la revisión de mis documentos.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 border border-border text-foreground-muted px-6 py-3.5 rounded-md font-bold hover:bg-background-muted transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 flex items-center justify-center gap-2 bg-accent text-white px-6 py-3.5 rounded-md font-bold hover:bg-orange-500 transition-colors shadow-sm"
                  >
                    Confirmar y Activar
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
