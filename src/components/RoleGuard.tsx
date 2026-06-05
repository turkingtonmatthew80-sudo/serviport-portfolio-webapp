import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { RoleId } from "../contexts/AuthContext";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: RoleId[]; // Optional. If not provided, it will check the URL params!
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const { rol } = useParams<{ rol: string }>();

  if (isLoading) return <div className="p-8">Verificando accesos...</div>;
  if (!user) return <Navigate to="/login" replace />;

  let hasAccess = false;

  if (allowedRoles && allowedRoles.length > 0) {
    hasAccess = user.roles.some((role) => allowedRoles.includes(role));
  } else if (rol) {
    // If no explicit allowedRoles passed, try to deduce from the URL path parameter
    // map common path names back to roles (e.g. aduana -> agente_aduana)
    let requiredRole = rol;
    if (rol === "aduana") requiredRole = "agente_aduana";
    
    hasAccess = user.roles.includes(requiredRole as RoleId);
  } else {
    // If neither is provided, deny access by default or fallback
    hasAccess = false;
  }

  if (!hasAccess) {
    return (
      <div className="p-8 text-center animate-in fade-in">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0b1a2e] mb-2 tracking-tight">Acceso Restringido</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Su cuenta no cuenta con el rol corporativo necesario para acceder a este módulo operativo. Contacte a soporte si cree que es un error.
          </p>
          <button 
             onClick={() => window.history.back()}
             className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
          >
             Volver atras
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
