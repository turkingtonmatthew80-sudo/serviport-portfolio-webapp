import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function PrivacyPage() {
  return (
    <div className="w-full bg-background-muted min-h-[100dvh]">
      {/* HERO SECTION */}
      <section className="bg-secondary text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-background/10 rounded-full flex items-center justify-center mb-4 md:mb-6 md:mx-0 mx-auto">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            Política de Privacidad B2B
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            Cláusulas de confidencialidad de la información comercial,
            manifiestos y datos navieros introducidos al sistema.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background-muted flex justify-center w-full">
        <div className="max-w-[1260px] mx-auto w-full">
          <div className="bg-background p-6 md:p-12 shadow-sm border border-border/50 rounded-sm">
            <div className="prose prose-lg text-foreground-muted max-w-none">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Quiénes Somos
              </h3>
              <p className="mb-8">
                La dirección de nuestra web es: https://serviportve.com.
                Responsable del tratamiento: Serviport Agentes Navieros, C.A.,
                RIF J-50161779-1.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Qué Datos Recopilamos
              </h3>
              <p className="mb-8">
                Cuando los visitantes dejan comentarios en la web o solicitan
                cotización de nuestros servicios, recopilamos los datos que se
                muestran en el formulario de comentarios o solicitud, así como
                la dirección IP del visitante y la cadena de agentes de usuario
                del navegador para ayudar a la detección de spam. Si subes
                imágenes a la web, deberías evitar subir imágenes con datos de
                ubicación (GPS EXIF) incluidos.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Cookies
              </h3>
              <p className="mb-8">
                Si dejas un comentario en nuestro sitio puedes elegir guardar tu
                nombre, dirección de correo electrónico y web en cookies. Esto
                es para tu comodidad, para que no tengas que volver a rellenar
                tus datos cuando dejes otro comentario. Estas cookies tendrán
                una duración de un año. Si tienes una cuenta y te conectas a
                este sitio, instalaremos una cookie temporal para determinar si
                tu navegador acepta cookies.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Con Quién Compartimos Tus Datos
              </h3>
              <p className="mb-8">
                Los datos o solicitudes suministradas solo serán usadas para los
                fines descritos en los formularios (envío de cotizaciones,
                captación de solicitud de información o resolución de quejas o
                reclamos), pudiendo almacenar datos de uso estrictamente interno
                a fines de cumplir con las políticas de calidad y procedimientos
                de las normas de calidad aplicadas por la empresa. En Serviport
                tomamos muy en serio la protección de tus datos.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Cuánto Tiempo Conservamos Tus Datos
              </h3>
              <p className="mb-8">
                Si dejas un comentario o una solicitud, el formulario y sus
                metadatos se conservan indefinidamente. Esto es para que podamos
                reconocer y aprobar comentarios sucesivos automáticamente, en
                lugar de mantenerlos en una cola de moderación.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Qué Derechos Tienes Sobre Tus Datos
              </h3>
              <p className="mb-8">
                Si tienes una cuenta o has dejado comentarios o solicitudes en
                esta web, puedes solicitar recibir un archivo de exportación de
                los datos personales que tenemos sobre ti, incluyendo cualquier
                dato que nos hayas proporcionado. También puedes solicitar que
                eliminemos cualquier dato personal que tengamos sobre ti. Esto
                no incluye ningún dato que estemos obligados a conservar con
                fines legales o de seguridad.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary font-bold hover:text-foreground transition-colors uppercase tracking-wider text-sm"
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
