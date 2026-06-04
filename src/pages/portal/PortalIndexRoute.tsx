import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function PortalIndexRoute() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.roles.length > 0) {
        // Redirect to the first role's dashboard
        const role = user.roles[0];
        // We will map 'importador' to 'importador', 'agente_aduana' to 'aduana', etc.
        const pathMap: Record<string, string> = {
          naviera: 'naviera',
          armador: 'armador',
          importador: 'importador',
          exportador: 'exportador',
          agente_aduana: 'aduana',
          transportista: 'transportista'
        };
        const basePath = pathMap[role] || role;
        navigate(`/portal/${basePath}/dashboard`, { replace: true });
      } else {
        // Fallback
        navigate("/portal/suscripcion", { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  return <div className="p-8 text-center text-gray-500">Cargando módulos...</div>;
}
