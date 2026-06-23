import { useState } from "react";
import { ArrowLeft, ArrowRight, MailCheck, Bell, Newspaper, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, addDoc } from "@/src/lib/db-wrapper";
import { db } from "../lib/firebase";

export function NewsletterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    interests: {
      news: true,
      ops: false,
      regulatory: false,
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        interests: { news: true, ops: false, regulatory: false },
      });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      alert("Hubo un error con la suscripción. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: {
        ...prev.interests,
        [id]: !prev.interests[id as keyof typeof prev.interests],
      },
    }));
  };

  return (
    <div className="w-full bg-background-muted min-h-[100dvh]">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 md:mb-6 md:mx-0 mx-auto">
            <Bell className="text-accent" size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Suscripción al Boletín
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Mantente informado con noticias, recursos portuarios, normativas y
            perspectivas directo en tu bandeja de entrada.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full flex justify-center">
          <div className="w-full max-w-2xl">
            {submitted ? (
              <div className="bg-background p-10 md:p-16 shadow-xl border border-border rounded-sm text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MailCheck className="text-green-600" size={40} />
                </div>
                <h2 className="text-3xl font-extrabold text-foreground mb-4">
                  ¡Suscripción Exitosa!
                </h2>
                <p className="text-foreground-muted font-medium text-lg mb-8">
                  Gracias. Hemos registrado tu correo en nuestra base de datos.
                  Pronto comenzarás a recibir nuestras actualizaciones.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-bold hover:text-foreground transition-colors uppercase tracking-wider text-sm"
                >
                  Suscribir otro correo
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-background p-8 md:p-12 shadow-xl border border-border rounded-sm space-y-6"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider"
                  >
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-3 bg-background-muted border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider"
                  >
                    Correo Electrónico
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
                    htmlFor="company"
                    className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider"
                  >
                    Empresa (Opcional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Nombre de tu empresa"
                    className="w-full px-4 py-3 bg-background-muted border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="block text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                    Áreas de Interés
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.interests.news}
                        onChange={() => handleCheckboxChange("news")}
                        className="w-5 h-5 accent-accent cursor-pointer"
                      />
                      <span className="text-foreground-muted font-medium group-hover:text-accent transition-colors">
                        Noticias Corporativas y Proyectos
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.interests.ops}
                        onChange={() => handleCheckboxChange("ops")}
                        className="w-5 h-5 accent-accent cursor-pointer"
                      />
                      <span className="text-foreground-muted font-medium group-hover:text-accent transition-colors">
                        Operaciones Portuarias e Infraestructura
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.interests.regulatory}
                        onChange={() => handleCheckboxChange("regulatory")}
                        className="w-5 h-5 accent-accent cursor-pointer"
                      />
                      <span className="text-foreground-muted font-medium group-hover:text-accent transition-colors">
                        Normativa Aduanera y Legal
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-white font-bold py-4 px-6 rounded-sm hover:bg-orange-500 transition-colors uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Confirmar Suscripción"
                    )}{" "}
                    <ArrowRight size={20} />
                  </button>
                </div>
                <p className="text-xs text-center text-foreground-muted mt-4 leading-relaxed">
                  Al suscribirte, aceptas nuestra{" "}
                  <Link
                    to="/politica-de-privacidad"
                    className="text-primary hover:underline"
                  >
                    Política de Privacidad
                  </Link>
                  . Podrás darte de baja en cualquier momento usando el enlace
                  al final de nuestros correos.
                </p>
              </form>
            )}

            <div className="mt-12 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-foreground-muted font-bold hover:text-foreground transition-colors uppercase tracking-wider text-sm"
              >
                <ArrowLeft size={18}  /> VOLVER AL INICIO
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
