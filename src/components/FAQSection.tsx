import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "¿En qué puertos opera Serviport?",
    answer: "Operamos directamente en el Puerto de Puerto Cabello (sede principal y operativa), donde gestionamos nuestros servicios logística integral, y mantenemos una oficina comercial estratégica en La Guaira para atender la región capital."
  },
  {
    question: "¿Qué tipo de carga manejan?",
    answer: "Nuestra infraestructura y maquinaria pesada nos permite manejar carga contenerizada (FCL/LCL), carga a granel (descarga directa a silos), carga general y suelta (breakbulk), carga refrigerada (reefers) mediante conexión eléctrica, y carga peligrosa siguiendo estrictamente normativas IMDG."
  },
  {
    question: "¿Cómo puedo cotizar un servicio logístico?",
    answer: "Puedes utilizar nuestro Cotizador en Línea integrado en el área de Herramientas Digitales para especificar tu carga y obtener una cotización. Alternativamente, puedes contactar a nuestro equipo en la sección Contacto."
  },
  {
    question: "¿Qué incluye el servicio de Agenciamiento Naviero?",
    answer: "Actuamos como agentes integrales: representación legal ante autoridades como INEA, SENIAT y Bolipuertos, tramitación de zarpes, coordinación de remolcadores, así como servicios de \"Husbandry\" a la nave (víveres, combustible, provisiones y reparaciones)."
  },
  {
    question: "¿Qué beneficios ofrece el Almacén General de Depósito (AGD)?",
    answer: "Nuestro AGD propio es una instalación autorizada que te permite realizar procesos de nacionalización aduanal con plena trazabilidad y seguridad a través de Serviport OS. Incluye áreas descubiertas organizadas por nivel de fila, almacenamiento bajo techo para carga delicada, y resguardo 24/7."
  },
  {
    question: "¿Ofrecen transporte de mercancías desde el puerto a mi ciudad?",
    answer: "Sí, a través de nuestra flota propia y alianzas de transporte, cubrimos la distribución en todo el territorio nacional, trasladando tu carga de forma segura desde el puerto directamente a los almacenes de tu empresa."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50 py-20 px-6 border-t border-gray-200" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-[#0b1a2e]/5 rounded-full flex items-center justify-center mb-6">
             <MessageCircleQuestion className="text-[#F7941D]" size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1a2e] mb-4">Preguntas Frecuentes</h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            Resuelve tus dudas rápidamente sobre nuestras operativas, coberturas y gestión aduanera de nuestros servicios logísticos portuarios.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white border rounded-sm transition-all duration-300 ${openIndex === index ? 'border-[#00A9CE] shadow-md' : 'border-gray-200 shadow-sm hover:border-gray-300'}`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A9CE]"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className={`text-lg font-bold pr-8 transition-colors ${openIndex === index ? 'text-[#0b1a2e]' : 'text-gray-700'}`}>
                  {faq.question}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-[#00A9CE]/10 text-[#00A9CE]' : 'bg-gray-100 text-gray-400'}`}>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} />
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
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100/50 mt-2">
                       {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
           <p className="text-gray-600 mb-4 font-medium">¿Aún tienes dudas adicionales?</p>
           <Link to="/contacto" className="inline-flex items-center justify-center bg-[#0b1a2e] text-white font-bold py-3 px-8 rounded-sm hover:bg-slate-800 transition-colors">
              Ir a la sección de contacto
           </Link>
        </div>
      </div>
    </section>
  );
}
