import { ArrowRight, Mail, MapPin, Phone, Building2, Send, Clock, User, Briefcase, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "motion/react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    empresa: "",
    email: "",
    tipo: "Cotización",
    mensaje: "",
    privacidad: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const CopyButton = ({ text }: { text: string }) => (
    <button 
      onClick={() => handleCopy(text)}
      className="ml-2 p-1.5 text-gray-400 hover:text-[#00A9CE] bg-slate-50 hover:bg-slate-100 rounded transition-colors"
      title="Copiar al portapapeles"
    >
      {copiedText === text ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      // 1. Guardar en Firestore
      await addDoc(collection(db, "consultas"), {
        ...formData,
        createdAt: new Date().toISOString()
      });

      // 2. Enviar email vía formsubmit.co
      await fetch("https://formsubmit.co/ajax/turkingtonmatthew80@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: `Nueva Consulta de Serviport: ${formData.tipo}`,
            Nombre: `${formData.nombre} ${formData.apellidos}`,
            Empresa: formData.empresa || "No especificada",
            Email: formData.email,
            Tipo: formData.tipo,
            Mensaje: formData.mensaje
        })
      });

      setSubmitStatus({ type: 'success', message: 'Mensaje enviado con éxito. Nuestro equipo te contactará en breve.' });
      setFormData({
        nombre: "",
        apellidos: "",
        empresa: "",
        email: "",
        tipo: "Cotización",
        mensaje: "",
        privacidad: false
      });
    } catch (error) {
      console.error(error);
      setSubmitStatus({ type: 'error', message: 'Hubo un error al enviar el mensaje. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-[#0b1a2e] pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-block px-4 py-2 bg-[#F7941D] text-white font-bold tracking-wider text-xs md:text-sm mb-6 uppercase rounded-sm">
            CONTACTO
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-tight mb-6 tracking-tight">
            Navegamos contigo<br/>hacia el éxito
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed">
            Mantente en contacto y encuentra el canal adecuado para tu requerimiento. Nos entusiasma escucharte y brindarte la mejor solución portuaria.
          </p>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
        <h2 className="text-3xl font-extrabold text-[#0b1a2e] mb-8 text-center bg-slate-50 inline-block px-8 py-2 border-b-4 border-[#00A9CE] mx-auto">
          ¿Qué deseas hacer hoy?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 shadow-lg border-b-4 border-transparent hover:border-[#00A9CE] transition-all rounded-sm flex flex-col group cursor-pointer" onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}>
             <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Hacer una Consulta</h3>
             <div className="mt-auto pt-8">
               <Send className="text-[#00A9CE] group-hover:scale-110 transition-transform" size={48} strokeWidth={1} />
             </div>
          </div>
          <div className="bg-white p-8 shadow-lg border-b-4 border-transparent hover:border-[#F7941D] transition-all rounded-sm flex flex-col group cursor-pointer" onClick={() => document.getElementById('direcciones')?.scrollIntoView({ behavior: 'smooth' })}>
             <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Ver Oficinas y Telefonos</h3>
             <div className="mt-auto pt-8">
               <Building2 className="text-[#F7941D] group-hover:scale-110 transition-transform" size={48} strokeWidth={1} />
             </div>
          </div>
          <Link to="/herramientas" className="bg-white p-8 shadow-lg border-b-4 border-transparent hover:border-[#0b1a2e] transition-all rounded-sm flex flex-col group">
             <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Seguimiento de Carga</h3>
             <div className="mt-auto pt-8">
               <MapPin className="text-[#0b1a2e] group-hover:scale-110 transition-transform" size={48} strokeWidth={1} />
             </div>
          </Link>
          <Link to="/nosotros/carreras" className="bg-white p-8 shadow-lg border-b-4 border-transparent hover:border-[#008EBF] transition-all rounded-sm flex flex-col group">
             <h3 className="text-xl font-bold text-[#0b1a2e] mb-4">Buscar una Carrera</h3>
             <div className="mt-auto pt-8">
               <Briefcase className="text-[#008EBF] group-hover:scale-110 transition-transform" size={48} strokeWidth={1} />
             </div>
          </Link>
        </div>
      </section>

      {/* DETAILED CONTENT SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto" id="direcciones">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* CONTACT INFO */}
          <div className="lg:col-span-5 flex flex-col space-y-12">
            
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#0b1a2e]/5 rounded-full flex justify-center items-center">
                  <MapPin className="text-[#F7941D]" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#0b1a2e]">Direcciones</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                  <h4 className="font-bold text-[#0b1a2e] mb-2 uppercase tracking-wide text-sm flex items-center justify-between">Oficina Comercial <span className="w-2 h-2 bg-[#00A9CE] rounded-full"></span></h4>
                  <p className="text-gray-600 leading-relaxed font-medium">Multicentro Maiquetía, Piso 2,<br/>Oficina 20, Parroquia Maiquetía,<br/>La Guaira, Venezuela.</p>
                </div>
                <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                  <h4 className="font-bold text-[#0b1a2e] mb-2 uppercase tracking-wide text-sm flex items-center justify-between">Sede Operativa <span className="w-2 h-2 bg-[#F7941D] rounded-full"></span></h4>
                  <p className="text-gray-600 leading-relaxed font-medium">Puerto de Puerto Cabello,<br/>Terminal Marítima, Estado Carabobo,<br/>Venezuela.</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#0b1a2e]/5 rounded-full flex justify-center items-center">
                  <Mail className="text-[#00A9CE]" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#0b1a2e]">Correo Electrónico</h3>
              </div>
              <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-[#0b1a2e] mb-1">Gerencia Comercial</h4>
                  <div className="flex items-center">
                    <a href="mailto:Gerenciacomercial@serviportve.com" className="text-gray-600 hover:text-[#F7941D] font-medium break-all transition-colors">Gerenciacomercial@serviportve.com</a>
                    <CopyButton text="Gerenciacomercial@serviportve.com" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0b1a2e] mb-1">Administración</h4>
                  <div className="flex items-center">
                    <a href="mailto:administracion@serviport.ve" className="text-gray-600 hover:text-[#F7941D] font-medium break-all transition-colors">administracion@serviport.ve</a>
                    <CopyButton text="administracion@serviport.ve" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0b1a2e] mb-1">Contacto General</h4>
                  <div className="flex items-center">
                    <a href="mailto:serviportagentesnavieros@gmail.com" className="text-gray-600 hover:text-[#F7941D] font-medium break-all transition-colors">serviportagentesnavieros@gmail.com</a>
                    <CopyButton text="serviportagentesnavieros@gmail.com" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#0b1a2e]/5 rounded-full flex justify-center items-center">
                  <Phone className="text-[#00A9CE]" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#0b1a2e]">Teléfonos</h3>
              </div>
              <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0b1a2e] text-sm">Central (Oficina L-V)</span>
                  <div className="flex items-center">
                    <a href="tel:+582123383957" className="text-gray-600 hover:text-[#00A9CE] font-bold">+58 212 3383957</a>
                    <CopyButton text="+582123383957" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0b1a2e] text-sm">Celular Comercial / Admin</span>
                  <div className="flex items-center">
                    <a href="tel:+584129361462" className="text-gray-600 hover:text-[#00A9CE] font-bold">+58 412 9361462</a>
                    <CopyButton text="+584129361462" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0b1a2e] text-sm">Operaciones (Terminal)</span>
                  <div className="flex items-center">
                    <a href="tel:+584242963458" className="text-gray-600 hover:text-[#00A9CE] font-bold">+58 424 2963458</a>
                    <CopyButton text="+584242963458" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#0b1a2e]/5 rounded-full flex justify-center items-center">
                  <Clock className="text-slate-800" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#0b1a2e]">Horario de Atención</h3>
              </div>
              <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                <p className="text-gray-600 font-medium">De Lunes a Viernes<br/>08:00 am a 05:00 pm</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 italic">Nota: Las operaciones en muelle y AGD mantienen horarios 24/7 dependiendo del itinerario de buques aprobados.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-7" id="formulario">
            <div className="bg-white shadow-xl shadow-slate-200/50 rounded-sm overflow-hidden flex flex-col h-full border border-gray-100">
              <div className="bg-[#0b1a2e] p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#00A9CE] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-3xl font-bold mb-2 relative z-10">Escríbenos</h2>
                <p className="text-slate-300 font-medium relative z-10">Completa el formulario y nos contactaremos a la brevedad.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 md:p-10 lg:p-12 space-y-8 flex-1">
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-bold text-[#0b1a2e] mb-2 uppercase tracking-wide">Nombre <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="nombre" 
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00A9CE] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="apellidos" className="block text-sm font-bold text-[#0b1a2e] mb-2 uppercase tracking-wide">Apellidos <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="apellidos" 
                      required
                      value={formData.apellidos}
                      onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00A9CE] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="empresa" className="block text-sm font-bold text-[#0b1a2e] mb-2 uppercase tracking-wide">
                    Empresa (C.A. / S.A.)
                  </label>
                  <input 
                    type="text" 
                    id="empresa" 
                    value={formData.empresa}
                    onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                    placeholder="Ej. Comercializadora Sur C.A."
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00A9CE] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-[#0b1a2e] mb-2 uppercase tracking-wide">Correo electrónico para contactarte <span className="text-red-500">*</span></label>
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
                  <label htmlFor="tipo" className="block text-sm font-bold text-[#0b1a2e] mb-2 uppercase tracking-wide">Tipo de Solicitud</label>
                  <select 
                    id="tipo" 
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00A9CE] focus:border-transparent transition-all font-medium text-gray-700"
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  >
                    <option>Cotización</option>
                    <option>Queja</option>
                    <option>Reclamo</option>
                    <option>Sugerencia</option>
                    <option>Información general</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-bold text-[#0b1a2e] mb-2 uppercase tracking-wide">Comentario, Mensaje o Sugerencia <span className="text-red-500">*</span></label>
                  <textarea 
                    id="mensaje" 
                    rows={5}
                    required
                    value={formData.mensaje}
                    onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00A9CE] focus:border-transparent transition-all resize-y"
                  ></textarea>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-sm border border-gray-100">
                  <input 
                    type="checkbox" 
                    id="privacidad"
                    required
                    checked={formData.privacidad}
                    onChange={(e) => setFormData({...formData, privacidad: e.target.checked})}
                    className="mt-1 w-5 h-5 accent-[#F7941D] cursor-pointer shrink-0" 
                  />
                  <label htmlFor="privacidad" className="text-sm text-gray-600 leading-relaxed cursor-pointer select-none">
                    He leído y acepto la <Link to="/politica-de-privacidad" className="text-[#00A9CE] hover:underline font-bold">Política de Privacidad B2B</Link>. Comprendo que mis datos serán tratados para responder mi solicitud. <span className="text-red-500">*</span>
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-[#00A9CE] text-white font-bold py-4 px-10 rounded-sm hover:bg-[#008EBF] transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:bg-opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'ENVIANDO...' : <><Send size={18} /> ENVIAR MENSAJE</>}
                </button>

                {submitStatus.type && (
                  <div className={`p-4 rounded-sm text-sm font-bold mt-4 ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {submitStatus.message}
                  </div>
                )}

              </form>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER IMAGE */}
      <section className="h-[400px] w-full relative">
        <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80" alt="Contenedores Serviport" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2e] to-transparent mix-blend-multiply opacity-80" />
      </section>
    </div>
  );
}
