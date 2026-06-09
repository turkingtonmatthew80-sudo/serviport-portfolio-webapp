import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "¿En qué puertos opera Serviport?",
    answer:
      "Operamos directamente en el Puerto de Puerto Cabello (sede principal y operativa), donde gestionamos nuestros servicios logística integral, y mantenemos una oficina comercial estratégica en La Guaira para atender la región capital.",
  },
  {
    question: "¿Qué tipo de carga manejan?",
    answer:
      "Nuestra infraestructura y maquinaria pesada nos permite manejar carga contenerizada (FCL/LCL), carga a granel (descarga directa a silos), carga general y suelta (breakbulk), carga refrigerada (reefers) mediante conexión eléctrica, y carga peligrosa siguiendo estrictamente normativas IMDG.",
  },
  {
    question: "¿Cómo puedo cotizar un servicio logístico?",
    answer:
      "Puedes utilizar nuestro Cotizador en Línea integrado en el área de Herramientas Digitales para especificar tu carga y obtener una cotización. Alternativamente, puedes contactar a nuestro equipo en la sección Contacto.",
  },
  {
    question: "¿Qué incluye el servicio de Agenciamiento Naviero?",
    answer:
      'Actuamos como agentes integrales: representación legal ante autoridades como INEA, SENIAT y Bolipuertos, tramitación de zarpes, coordinación de remolcadores, así como servicios de "Husbandry" a la nave (víveres, combustible, provisiones y reparaciones).',
  },
  {
    question: "¿Qué beneficios ofrece el Almacén General de Depósito (AGD)?",
    answer:
      "Nuestro AGD propio es una instalación autorizada que te permite realizar procesos de nacionalización aduanal con plena trazabilidad y seguridad a través de Serviport OS. Incluye áreas descubiertas organizadas por nivel de fila, almacenamiento bajo techo para carga delicada, y resguardo 24/7.",
  },
  {
    question: "¿Ofrecen transporte de mercancías desde el puerto a mi ciudad?",
    answer:
      "Sí, a través de nuestra flota propia y alianzas de transporte, cubrimos la distribución en todo el territorio nacional, trasladando tu carga de forma segura desde el puerto directamente a los almacenes de tu empresa.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="bg-background-muted py-12 md:py-16 lg:py-20 px-4 md:px-6 border-t border-border"
      id="faq"
    >
      <div className="max-w-[900px] mx-auto w-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-4 md:mb-8 shrink-0"
        >
          <div className="inline-block px-2 py-1 bg-primary text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            Soporte y Dudas
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-2 leading-[1.15]">
            Preguntas Frecuentes
          </h2>
        </motion.div>

        <div className="space-y-2 md:space-y-3 flex-1">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-background border rounded-sm transition-all duration-300 shrink-0 ${openIndex === index ? "border-primary shadow-md" : "border-border shadow-sm hover:border-border"}`}
            >
              <button
                className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span
                  className={`text-sm md:text-base font-bold pr-4 transition-colors ${openIndex === index ? "text-foreground" : "text-foreground-muted"}`}
                >
                  {faq.question}
                </span>
                <div
                  className={`shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? "bg-primary/10 text-primary" : "bg-gray-100 text-foreground-muted"}`}
                >
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-4 md:p-6 pt-0 text-foreground-muted leading-relaxed border-t border-border/50 mt-2 text-xs md:text-sm">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-center flex flex-col items-center"
        >
          <p className="text-foreground-muted mb-4 font-medium text-sm md:text-base">
            ¿Aún tienes dudas adicionales?
          </p>
          <Link
            to="/contacto"
            className="group bg-secondary text-white px-6 md:px-8 py-3 rounded font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 text-center text-xs md:text-sm uppercase tracking-wider w-fit"
          >
            IR A LA SECCIÓN DE CONTACTO
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
