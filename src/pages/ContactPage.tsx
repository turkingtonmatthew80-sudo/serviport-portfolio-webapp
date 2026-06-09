import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Building2,
  Send,
  Clock,
  User,
  Briefcase,
  Copy,
  Check,
} from "lucide-react";
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
    privacidad: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const CopyButton = ({ text }: { text: string }) => (
    <button
      onClick={() => handleCopy(text)}
      className="ml-2 p-1.5 text-foreground-muted hover:text-primary bg-background-muted hover:bg-background-muted rounded transition-colors"
      title="Copiar al portapapeles"
    >
      {copiedText === text ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // 1. Guardar en Firestore
      const docPromise = addDoc(collection(db, "consultas"), {
        ...formData,
        createdAt: new Date().toISOString(),
      });

      // Agregar timeout para evitar que se quede pegado si firebase falla
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout conectando a la base de datos")),
          8000,
        ),
      );

      await Promise.race([docPromise, timeoutPromise]);

      // 2. Enviar email vía formsubmit.co
      const response = await fetch(
        "https://formsubmit.co/ajax/turkingtonmatthew80@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `Nueva Consulta de Serviport: ${formData.tipo}`,
            Nombre: `${formData.nombre} ${formData.apellidos}`,
            Empresa: formData.empresa || "No especificada",
            Email: formData.email,
            Tipo: formData.tipo,
            Mensaje: formData.mensaje,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Error en el servicio de envío de correos.");
      }

      setSubmitStatus({
        type: "success",
        message:
          "Mensaje enviado con éxito. Nuestro equipo te contactará en breve.",
      });
      setFormData({
        nombre: "",
        apellidos: "",
        empresa: "",
        email: "",
        tipo: "Cotización",
        mensaje: "",
        privacidad: false,
      });
    } catch (error) {
      console.error(error);
      setSubmitStatus({
        type: "error",
        message: "Hubo un error al enviar el mensaje. Intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background-muted min-h-[100dvh]">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Contacto
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Navegamos contigo
            <br className="hidden md:block" /> hacia el éxito
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Mantente en contacto y encuentra el canal adecuado para tu
            requerimiento. Nos entusiasma escucharte y brindarte la mejor
            solución portuaria.
          </p>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 max-w-[1260px] mx-auto -mt-8 md:-mt-16 relative z-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-6 md:mb-8 text-center bg-background-muted inline-block px-4 md:px-8 py-2 md:py-4 border-b-[3px] md:border-b-4 border-primary mx-auto">
          ¿Qué deseas hacer hoy?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div
            className="bg-background p-6 md:p-8 shadow-md border-b-[3px] md:border-b-4 border-transparent hover:border-primary transition-all rounded-sm flex flex-col group cursor-pointer"
            onClick={() =>
              document
                .getElementById("formulario")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-4">
              Hacer una Consulta
            </h3>
            <div className="mt-auto pt-6 md:pt-8 flex justify-center md:justify-start">
              <Send
                className="w-10 h-10 md:w-12 md:h-12 text-primary group-hover:scale-110 transition-transform"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div
            className="bg-background p-6 md:p-8 shadow-md border-b-[3px] md:border-b-4 border-transparent hover:border-accent transition-all rounded-sm flex flex-col group cursor-pointer"
            onClick={() =>
              document
                .getElementById("direcciones")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-4">
              Ver Oficinas y Teléfonos
            </h3>
            <div className="mt-auto pt-6 md:pt-8 flex justify-center md:justify-start">
              <Building2
                className="w-10 h-10 md:w-12 md:h-12 text-accent group-hover:scale-110 transition-transform"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <Link
            to="/herramientas"
            className="bg-background p-6 md:p-8 shadow-md border-b-[3px] md:border-b-4 border-transparent hover:border-secondary transition-all rounded-sm flex flex-col group"
          >
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-4">
              Seguimiento de Carga
            </h3>
            <div className="mt-auto pt-8">
              <MapPin
                className="text-foreground group-hover:scale-110 transition-transform"
                size={48}
                strokeWidth={1.5}
              />
            </div>
          </Link>
          <Link
            to="/nosotros/carreras"
            className="bg-background p-8 shadow-lg border-b-4 border-transparent hover:border-primary transition-all rounded-sm flex flex-col group"
          >
            <h3 className="text-xl font-bold text-foreground mb-4">
              Buscar una Carrera
            </h3>
            <div className="mt-auto pt-8">
              <Briefcase
                className="text-primary group-hover:scale-110 transition-transform"
                size={48}
                strokeWidth={1.5}
              />
            </div>
          </Link>
        </div>
      </section>

      {/* DETAILED CONTENT SECTION */}
      <section
        className="py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center"
        id="direcciones"
      >
        <div className="max-w-[1260px] mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* CONTACT INFO */}
          <div className="lg:col-span-5 flex flex-col space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary/5 rounded-full flex justify-center items-center">
                  <MapPin className="text-accent" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Direcciones
                </h3>
              </div>
              <div className="space-y-6">
                <div className="bg-background p-6 border border-border shadow-sm rounded-sm">
                  <h4 className="font-bold text-foreground mb-2 uppercase tracking-wide text-sm flex items-center justify-between">
                    Oficina Comercial{" "}
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  </h4>
                  <p className="text-foreground-muted leading-relaxed font-medium">
                    Multicentro Maiquetía, Piso 2,
                    <br />
                    Oficina 20, Parroquia Maiquetía,
                    <br />
                    La Guaira, Venezuela.
                  </p>
                </div>
                <div className="bg-background p-6 border border-border shadow-sm rounded-sm">
                  <h4 className="font-bold text-foreground mb-2 uppercase tracking-wide text-sm flex items-center justify-between">
                    Sede Operativa{" "}
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                  </h4>
                  <p className="text-foreground-muted leading-relaxed font-medium">
                    Puerto de Puerto Cabello,
                    <br />
                    Terminal Marítima, Estado Carabobo,
                    <br />
                    Venezuela.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary/5 rounded-full flex justify-center items-center">
                  <Mail className="text-primary" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Correo Electrónico
                </h3>
              </div>
              <div className="bg-background p-6 border border-border shadow-sm rounded-sm space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    Gerencia Comercial
                  </h4>
                  <div className="flex items-center">
                    <a
                      href="mailto:Gerenciacomercial@serviportve.com"
                      className="text-foreground-muted hover:text-accent font-medium break-all transition-colors"
                    >
                      Gerenciacomercial@serviportve.com
                    </a>
                    <CopyButton text="Gerenciacomercial@serviportve.com" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    Administración
                  </h4>
                  <div className="flex items-center">
                    <a
                      href="mailto:administracion@serviport.ve"
                      className="text-foreground-muted hover:text-accent font-medium break-all transition-colors"
                    >
                      administracion@serviport.ve
                    </a>
                    <CopyButton text="administracion@serviport.ve" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    Contacto General
                  </h4>
                  <div className="flex items-center">
                    <a
                      href="mailto:serviportagentesnavieros@gmail.com"
                      className="text-foreground-muted hover:text-accent font-medium break-all transition-colors"
                    >
                      serviportagentesnavieros@gmail.com
                    </a>
                    <CopyButton text="serviportagentesnavieros@gmail.com" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary/5 rounded-full flex justify-center items-center">
                  <Phone className="text-primary" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Teléfonos</h3>
              </div>
              <div className="bg-background p-6 border border-border shadow-sm rounded-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">
                    Central (Oficina L-V)
                  </span>
                  <div className="flex items-center">
                    <a
                      href="tel:+582123383957"
                      className="text-foreground-muted hover:text-primary font-bold"
                    >
                      +58 212 3383957
                    </a>
                    <CopyButton text="+582123383957" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">
                    Celular Comercial / Admin
                  </span>
                  <div className="flex items-center">
                    <a
                      href="tel:+584129361462"
                      className="text-foreground-muted hover:text-primary font-bold"
                    >
                      +58 412 9361462
                    </a>
                    <CopyButton text="+584129361462" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">
                    Operaciones (Terminal)
                  </span>
                  <div className="flex items-center">
                    <a
                      href="tel:+584242963458"
                      className="text-foreground-muted hover:text-primary font-bold"
                    >
                      +58 424 2963458
                    </a>
                    <CopyButton text="+584242963458" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary/5 rounded-full flex justify-center items-center">
                  <Clock className="text-foreground" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Horario de Atención
                </h3>
              </div>
              <div className="bg-background p-6 border border-border shadow-sm rounded-sm">
                <p className="text-foreground-muted font-medium">
                  De Lunes a Viernes
                  <br />
                  08:00 am a 05:00 pm
                </p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-foreground-muted italic">
                    Nota: Las operaciones en muelle y AGD mantienen horarios
                    24/7 dependiendo del itinerario de buques aprobados.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-7" id="formulario">
            <div className="bg-background shadow-xl shadow-slate-200/50 rounded-sm overflow-hidden flex flex-col h-full border border-border">
              <div className="bg-secondary p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-3xl font-bold mb-2 relative z-10">
                  Escríbenos
                </h2>
                <p className="text-slate-300 font-medium relative z-10">
                  Completa el formulario y nos contactaremos a la brevedad.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-8 md:p-10 lg:p-12 space-y-8 flex-1"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide"
                    >
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      required
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background-muted border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="apellidos"
                      className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide"
                    >
                      Apellidos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="apellidos"
                      required
                      value={formData.apellidos}
                      onChange={(e) =>
                        setFormData({ ...formData, apellidos: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background-muted border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="empresa"
                    className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide"
                  >
                    Empresa (C.A. / S.A.)
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) =>
                      setFormData({ ...formData, empresa: e.target.value })
                    }
                    placeholder="Ej. Comercializadora Sur C.A."
                    className="w-full px-4 py-3 bg-background-muted border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide"
                  >
                    Correo electrónico para contactarte{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="ejemplo@empresa.com"
                    className="w-full px-4 py-3 bg-background-muted border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tipo"
                    className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide"
                  >
                    Tipo de Solicitud
                  </label>
                  <select
                    id="tipo"
                    className="w-full px-4 py-3 bg-background-muted border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-foreground-muted"
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo: e.target.value })
                    }
                  >
                    <option>Cotización</option>
                    <option>Queja</option>
                    <option>Reclamo</option>
                    <option>Sugerencia</option>
                    <option>Información general</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="mensaje"
                    className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide"
                  >
                    Comentario, Mensaje o Sugerencia{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="mensaje"
                    rows={5}
                    required
                    value={formData.mensaje}
                    onChange={(e) =>
                      setFormData({ ...formData, mensaje: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background-muted border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                  ></textarea>
                </div>

                <div className="flex items-start gap-4 p-4 bg-background-muted rounded-sm border border-border">
                  <input
                    type="checkbox"
                    id="privacidad"
                    required
                    checked={formData.privacidad}
                    onChange={(e) =>
                      setFormData({ ...formData, privacidad: e.target.checked })
                    }
                    className="mt-1 w-5 h-5 accent-accent cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="privacidad"
                    className="text-sm text-foreground-muted leading-relaxed cursor-pointer select-none"
                  >
                    He leído y acepto la{" "}
                    <Link
                      to="/politica-de-privacidad"
                      className="text-primary hover:underline font-bold"
                    >
                      Política de Privacidad B2B
                    </Link>
                    . Comprendo que mis datos serán tratados para responder mi
                    solicitud. <span className="text-red-500">*</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-primary text-white font-bold py-4 px-10 rounded-sm hover:bg-primary transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:bg-opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "ENVIANDO..."
                  ) : (
                    <>
                      <Send size={18} /> ENVIAR MENSAJE
                    </>
                  )}
                </button>

                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-sm text-sm font-bold mt-4 ${submitStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
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
        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80"
          alt="Contenedores Serviport"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent mix-blend-multiply opacity-80" />
      </section>
    </div>
  );
}
