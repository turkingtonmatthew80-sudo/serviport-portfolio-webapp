import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Anchor } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(email, password);
    if (success) {
      // It's a bit tricky to get roles right away, because `login` updates `AuthContext` state which is asynchronous,
      // but `login` could return the user object instead of boolean. Let's just fix `useAuth` or do it in an effect.
      // Alternatively, let's just use `navigate("/portal")` and let an index route redirect based on roles.
      navigate("/portal");
    } else {
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-20 px-6 bg-slate-50">
      <Link to="/" className="mb-8 flex items-center gap-2 cursor-pointer group">
        <Anchor className="text-[#00A9CE] group-hover:text-[#F7941D] transition-colors" size={32} />
        <span className="text-2xl font-black text-[#0b1a2e] tracking-tight uppercase">Servi<span className="text-[#00A9CE] group-hover:text-[#F7941D] transition-colors">port</span></span>
      </Link>
      
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-[#0b1a2e] mb-2 text-center">Serviport OS</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Accede con tu usuario corporativo registrado.</p>
        
        <form className="space-y-5" onSubmit={handleLogin}>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{error}</div>}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] focus:outline-none transition-all" placeholder="usuario@empresa.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] focus:outline-none transition-all" placeholder="••••••••" />
          </div>
          <div className="flex justify-start items-center text-sm">
            <span className="text-[#00A9CE] cursor-pointer hover:underline font-medium">¿Olvidaste tu contraseña?</span>
          </div>
          
          <button type="submit" className="w-full bg-[#F7941D] text-white px-6 py-3 rounded-md font-bold hover:bg-[#e0861a] transition-colors shadow-sm">
            INGRESAR AL PORTAL
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600 mb-4">¿No tienes cuenta comercial?</p>
          <Link to="/registro-b2b" className="block w-full border border-[#00A9CE] text-[#00A9CE] px-6 py-3 rounded-md font-bold hover:bg-[#00A9CE] hover:text-white transition-colors">
            REGISTRO DE CLIENTES B2B
          </Link>
        </div>
      </div>
    </div>
  );
}
