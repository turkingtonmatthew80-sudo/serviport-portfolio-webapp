import { useState } from "react";
import { ArrowRight, MailCheck, Bell, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

export function NewsletterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    interests: {
      news: true,
      ops: false,
      regulatory: false,
    }
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCheckboxChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        [id]: !prev.interests[id as keyof typeof prev.interests]
      }
    }));
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <section className="bg-[#0b1a2e] pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-[#F7941D]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="text-[#F7941D]" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Suscripción al Boletín</h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium">
            Mantente informado con noticias, recursos portuarios, normativas y perspectivas directo en tu bandeja de entrada.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-white p-10 md:p-16 shadow-xl border border-gray-100 rounded-sm text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MailCheck className="text-green-600" size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-4">¡Suscripción Exitosa!</h2>
              <p className="text-gray-600 font-medium text-lg mb-8">
                Gracias, {formData.name || 'usuario'}. Hemos registrado tu correo ({formData.email}) en nuestra base de datos. Pronto comenzarás a recibir nuestras actualizaciones.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-[#00A9CE] font-bold hover:text-[#0b1a2e] transition-colors uppercase tracking-wider text-sm"
              >
                Suscribir otro correo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 shadow-xl border border-gray-100 rounded-sm space-y-6">
              
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-[#0b1a2e] mb-2 uppercase tracking-wider">Nombre Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00A9CE] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-[#0b1a2e] mb-2 uppercase tracking-wider">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="ejemplo@empresa.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00A9CE] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-bold text-[#0b1a2e] mb-2 uppercase tracking-wider">Empresa (Opcional)</label>
                <input 
                  type="text" 
                  id="company" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Nombre de tu empresa"
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00A9CE] focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-[#0b1a2e] mb-4 uppercase tracking-wider">Áreas de Interés</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={formData.interests.news} onChange={() => handleCheckboxChange('news')} className="w-5 h-5 accent-[#F7941D] cursor-pointer" />
                    <span className="text-gray-700 font-medium group-hover:text-[#F7941D] transition-colors">Noticias Corporativas y Proyectos</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={formData.interests.ops} onChange={() => handleCheckboxChange('ops')} className="w-5 h-5 accent-[#F7941D] cursor-pointer" />
                    <span className="text-gray-700 font-medium group-hover:text-[#F7941D] transition-colors">Operaciones Portuarias e Infraestructura</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={formData.interests.regulatory} onChange={() => handleCheckboxChange('regulatory')} className="w-5 h-5 accent-[#F7941D] cursor-pointer" />
                    <span className="text-gray-700 font-medium group-hover:text-[#F7941D] transition-colors">Normativa Aduanera y Legal</span>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#F7941D] text-white font-bold py-4 px-6 rounded-sm hover:bg-orange-500 transition-colors uppercase tracking-wider"
                >
                  Confirmar Suscripción <ArrowRight size={20} />
                </button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                Al suscribirte, aceptas nuestra <Link to="/politica-de-privacidad" className="text-[#00A9CE] hover:underline">Política de Privacidad</Link>. Podrás darte de baja en cualquier momento usando el enlace al final de nuestros correos.
              </p>
            </form>
          )}
          
          <div className="mt-12 text-center">
             <Link to="/" className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-[#0b1a2e] transition-colors uppercase tracking-wider text-sm">
               <ArrowRight size={18} className="rotate-180" /> VOLVER AL INICIO
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
