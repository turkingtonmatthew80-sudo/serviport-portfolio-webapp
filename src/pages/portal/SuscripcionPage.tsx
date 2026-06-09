import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  ShieldAlert,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export function SuscripcionPage() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount();
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        setDeleteError(
          "Por seguridad, debes haber iniciado sesión recientemente para eliminar tu cuenta. Por favor, cierra sesión, vuelve a entrar e inténtalo de nuevo.",
        );
      } else {
        setDeleteError(
          "Hubo un error al eliminar tu cuenta. Por favor, intenta más tarde o contacta a soporte. (" +
            (error.message || "") +
            ")",
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Settings className="text-primary" />
          Configuración y Suscripción
        </h1>
        <p className="text-foreground-muted">
          Administra tu perfil corporativo y las preferencias de cuenta.
        </p>
      </div>

      <div className="bg-background rounded-xl shadow-sm border border-border p-6 mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Detalles del Perfil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-foreground-muted mb-1">
              Razón Social
            </label>
            <p className="text-foreground bg-background-muted p-3 rounded-md border border-border">
              {user?.razonSocial}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground-muted mb-1">
              RIF
            </label>
            <p className="text-foreground bg-background-muted p-3 rounded-md border border-border">
              {user?.rif || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground-muted mb-1">
              Correo Electrónico
            </label>
            <p className="text-foreground bg-background-muted p-3 rounded-md border border-border">
              {user?.email}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground-muted mb-1">
              Roles Activos
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.roles.map((role) => (
                <span
                  key={role}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  {role.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6">
        <h2 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
          <ShieldAlert size={20} />
          Zona de Peligro
        </h2>
        <p className="text-red-600/80 text-sm mb-6">
          Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten la
          seguridad.
        </p>

        {deleteError && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm relative">
            <span className="flex items-start gap-2">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <span>{deleteError}</span>
            </span>
          </div>
        )}

        {showConfirm ? (
          <div className="bg-background p-5 rounded-lg border border-red-200">
            <p className="font-bold text-foreground mb-4">
              ¿Estás absolutamente seguro de querer eliminar tu cuenta
              corporativa?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-md font-bold hover:bg-red-700 transition disabled:opacity-70"
              >
                {isDeleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                Sí, eliminar cuenta de forma permanente
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-5 py-2 bg-gray-100 text-foreground-muted rounded-md font-bold hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 bg-red-100 text-red-700 border border-red-200 px-5 py-2.5 rounded-md font-bold hover:bg-red-200 transition"
          >
            <Trash2 size={18} />
            Eliminar Cuenta
          </button>
        )}
      </div>
    </div>
  );
}
