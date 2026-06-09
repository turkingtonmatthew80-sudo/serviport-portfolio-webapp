export interface NewsArticle {
  id: string;
  title: string;
  category:
    | "Noticia"
    | "Nota de Prensa"
    | "Aviso Operativo"
    | "Blog"
    | "Caso de Éxito";
  date: string;
  image: string;
  excerpt: string;
  content: string;
  author?: string;
  country?: string;
  featured?: boolean;
}

export const newsData: NewsArticle[] = [
  {
    id: "beyond-execution-strategic-value",
    title:
      "Más Allá de la Ejecución: El Valor Estratégico del Agenciamiento Portuario Moderno",
    category: "Blog",
    date: "Jun 4, 2026",
    image:
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800",
    excerpt:
      "En las operaciones marítimas de hoy, cada hora cuenta. Cómo la planificación anticipada y las tecnologías predictivas están transformando las escalas en puerto.",
    content: `En las operaciones marítimas de hoy, cada hora cuenta. Una sola escala en puerto (port call) puede implicar la coordinación de múltiples servicios técnicos y administrativos que determinan la rentabilidad final del viaje. En Serviport, entendemos que el agenciamiento moderno va mucho más allá de la simple ejecución de trámites.

### La Evolución del Rol del Agente

Tradicionalmente, el agente naviero era un facilitador local. Hoy en día, dadas las complejidades de las regulaciones globales y la presión por la eficiencia en costos, nos hemos convertido en consultores estratégicos. La capacidad de anticipar cuellos de botella en puertos venezolanos, desde la congestión en muelles hasta los tiempos de espera para el bunkering, es lo que diferencia a un servicio excepcional de uno estándar.

### Digitalización y Transparencia

Nuestra plataforma Serviport OS ha sido fundamental en este cambio de paradigma. Al proporcionar trazabilidad en tiempo real y digitalización completa de documentos como el Disbursement Account y el EIR, los armadores y navieras tienen visibilidad total, lo que reduce la incertidumbre y fomenta una toma de decisiones más rápida y fundamentada.

### Hacia un Futuro Colaborativo

La verdadera eficiencia no se logra en aislamiento. Requiere una colaboración fluida entre la Autoridad Portuaria, el SENIAT, operadores logísticos y los Agentes. Serviport continúa liderando iniciativas para estandarizar procesos y adoptar ventanas de tiempo (berth windows) más precisas, asegurando que Venezuela se mantenga como un hub competitivo y confiable en la región.`,
    author: "Dirección de Operaciones",
    featured: true,
  },
  {
    id: "update-biofouling-regulations-2026",
    title: "Actualización: Nuevas Regulaciones Locales Efectivas en Junio 2026",
    category: "Noticia",
    date: "Jun 2, 2026",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Detalles sobre las últimas actualizaciones normativas emitidas por el INEA para todas las embarcaciones que arriban a puertos venezolanos.",
    content: `El Instituto Nacional de los Espacios Acuáticos (INEA) ha emitido una actualización clave a sus regulaciones operativas que entran en rigor a partir de este mes de Junio de 2026. Esta normativa afecta principalmente los procedimientos de notificación de arribo y la documentación de gestión ambiental para buques mercantes.

### Principales Puntos de la Actualización

1. **Notificación de Arribo Anticipada:** El plazo para someter los avisos de llegada se ha extendido para permitir una revisión más minuciosa por parte de las autoridades de sanidad y aduana. Se requerirá un mínimo de 72 horas de antelación.
2. **Gestión de Biofouling:** En alineación con las iniciativas internacionales de la OMI, se instituyen nuevas inspecciones aleatorias para verificar los certificados de manejo de agua de lastre y evitar la transferencia de especies invasoras.
3. **Documentación Digital:** Se insta a priorizar la transmisión de documentos a través de canales electrónicos EDI para agilizar el proceso de liberación y fondeo.

Desde Serviport, nuestro departamento legal y operativo ya se ha adaptado a estas normativas, asegurando que todos los buques representados por nuestra agencia experimenten cero fricciones o demoras a su llegada a Puerto Cabello y La Guaira. Recomendamos a todos nuestros clientes armadores actualizar la documentación de a bordo de acuerdo con esta circular.`,
    country: "Venezuela",
  },
  {
    id: "serviport-launches-new-consolidation-service",
    title:
      "Serviport Lanza Nuevo Servicio de Consolidación LCL en Puerto Cabello",
    category: "Nota de Prensa",
    date: "Jun 1, 2026",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Expandimos nuestras capacidades de almacén para ofrecer consolidación y desconsolidación de carga a importadores medianos.",
    content: `**PUERTO CABELLO, 1 de Junio de 2026** – Serviport Agentes Navieros, C.A., líder en logística portuaria integral, anuncia hoy la inauguración de sus nuevas instalaciones techadas dentro del Almacén General de Depósito (AGD), diseñadas específicamente para optimizar los servicios de carga consolidada (LCL).

Esta expansión añade 2.500 metros cuadrados de área cubierta equipada con estanterías de alta densidad y áreas segregadas para la revisión aduanera rápida, permitiendo a Serviport incrementar el volumen de desconsolidación en un 40%.

"Con el incremento de las importaciones fraccionadas de PyMEs en Venezuela, detectamos la urgencia de proveer un servicio LCL ágil y seguro," declaró el Gerente General de Serviport. "Nuestros clientes ahora pueden realizar el reconocimiento de sus mercancías, el pago de tributos y el despacho en un tiempo récord, todo bajo la seguridad y cobertura de nuestra infraestructura y sistema de trazabilidad Serviport OS."

El servicio, que comenzó sus operaciones formales esta mañana, ya cuenta con alianzas con importantes forwarders internacionales y promete revolucionar la cadena de frío, al incluir también zonas de baja temperatura para carga perecedera fraccionada.`,
  },
  {
    id: "puerto-cabello-operational-status",
    title: "Estatus Operativo del Puerto de Puerto Cabello",
    category: "Aviso Operativo",
    date: "May 28, 2026",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Actualización sobre las condiciones climáticas y tiempos de espera de atraque en la terminal principal de contenedores.",
    content: `**Aviso Informativo a Navieras y Armadores**

Debido a las fuertes precipitaciones experimentadas en la región central del país durante las últimas 48 horas, se informa lo siguiente respecto a las operaciones en el Puerto de Puerto Cabello:

1. **Estado de Navegación:** El canal de acceso y la rada de espera operan con normalidad. La Capitanía de Puerto mantiene permitidas las maniobras de atraque y desatraque para buques de todos los calados sin restricciones por lluvia.
2. **Operaciones de Estiba:** Las labores de descarga de granos a cielo abierto y carga suelta (breakbulk) se encuentran actualmente pausadas por protocolos de seguridad de la carga hasta la mejora de las condiciones climáticas. Las operaciones de contenedores (FCL/LCL) continúan operando a una capacidad del 80%.
3. **Tiempos de Espera (Berthing Delay):** Se registra una demora promedio de 12 a 18 horas para la asignación de muelles (berths) para buques de carga general. Para buques portacontenedores, el tiempo de espera se mantiene bajo las 6 horas.
4. **Transporte Terrestre:** Las rutas hacia la capital por la autopista Valencia - Caracas reportan tráfico pesado; recomendamos a los transportistas aliados reprogramar sus ventanas de gate-out en el sistema Serviport OS.

El equipo de operaciones de Serviport mantiene monitoreo continuo 24/7 y notificará cualquier cambio en este estatus a los clientes afectados directamente a través de Serviport OS.`,
    country: "Venezuela",
  },
  {
    id: "bulk-shipping-watch-newsletter-may-2026",
    title: "Boletín Mensual de Análisis Marítimo - Mayo 2026",
    category: "Noticia",
    date: "May 25, 2026",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Una mirada en profundidad a las estadísticas de carga manejadas el pasado mes y proyecciones para el segundo semestre.",
    content: `En Serviport nos complace compartir los resultados de nuestras operaciones portuarias y agenciamiento durante el mes de Mayo de 2026, un mes que ha mostrado una estabilización positiva en los volúmenes de importación contenerizada en Venezuela.

### Resumen Estadístico
Durante Mayo, Serviport gestionó un total de 48 escalas en Puerto Cabello y 12 en La Guaira, lo que representa un incremento del 15% en comparación interanual. El volumen total movilizado a través de nuestras cuadrillas de estiba ascendió a más de 12.000 TEUs. 

### Tendencias de Carga a Granel
Destacamos el repunte sostenido en la importación de carga a granel, especialmente trigo y maíz amarillo, los cuales han saturado positivamente nuestra infraestructura de silos, demostrando una coordinación excelente para la descarga directa a los camiones y reduciendo el dwell time general.

### Perspectivas para Junio y Julio
Los modelos proyectivos integrados en Serviport OS indican que la temporada de aprovisionamiento de las industrias manufactureras para el cierre de año comenzará temprano. Advertimos a nuestros clientes planificar el fletamento y reservar posición en el Almacén General de Depósito (AGD) con al menos dos semanas de antelación para asegurar capacidad.`,
  },
  {
    id: "vendor-consolidation-efficiency-or-risk",
    title:
      "Consolidación de Proveedores en la Marítima: ¿Impulso a la Eficiencia o Riesgo Operativo?",
    category: "Blog",
    date: "May 20, 2026",
    image:
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Analizamos los pros y los contras de depender de un solo socio logístico en las cadenas de suministro modernas.",
    content: `Para armadores y dueños de carga (BCOs), gestionar operaciones a nivel mundial o nacional significa coordinar con docenas, a veces cientos, de proveedores logísticos y de agenciamiento. Recientemente se ha observado una tendencia hacia la consolidación de proveedores para simplificar la facturación y la comunicación. Pero, ¿hasta qué punto es esto beneficioso?

### La Ventaja de un Aliado Único en Venezuela
Al evaluar el mercado venezolano, la fragmentación de responsabilidades puede ser costosa. Contratar una agencia protectora, otra empresa distinta para la estiba, y un tercer proveedor de transporte terrestre añade capas de complejidad administrativa y diluye la responsabilidad en caso de averías o demoras. 

Cuando Serviport ofrece la solución integral —que abarca el agenciamiento naviero ante el SENIAT, la operación física de los reach stackers en patio, y el almacenaje aduanero en AGD— los clientes obtienen un flujo uniforme. Un solo Disbursement Account, una sola plataforma (Serviport OS) para rastrear, y un equipo centralizado de operaciones, lo que erradica la dependencia entre proveedores desalineados.

### ¿Existen Riesgos Financieros o de Flexibilidad?
El riesgo clásico de la consolidación es poner "todos los huevos en la misma cesta". ¿Qué pasa si el proveedor se queda sin capacidad de equipo? 
Es aquí donde Serviport destaca mediante su infraestructura escalable y su resiliencia apoyada en sus Alianzas Estratégicas y Transportistas autorizados. Nuestro sistema integra flota de terceros dentro del estándar operativo Serviport OS, asegurando que siempre exista holgura y opciones alternativas sin que el cliente tenga que re-negociar con nuevos proveedores desde cero.

La consolidación es, sin duda, un multiplicador de la eficiencia, siempre que el proveedor central (hub) posea activos reales y solvencia tecnológica frente a las contingencias del entorno.`,
    author: "Gerencia Comercial",
  },
  {
    id: "thriving-liner-partnership-delivers-stellar-boutique-results",
    title:
      "Resultados Boutique: Cómo nuestra Alianza Estratégica Optimiza la Operación LCL",
    category: "Caso de Éxito",
    date: "May 15, 2026",
    image:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Un análisis detallado de la optimización del supply chain para un importador regional de autopartes.",
    content: `**El Reto:**
Un distribuidor nacional de repuestos automotrices enfrentaba retrasos crónicos al consolidar mercancía proveniente de tres continentes diferentes. Los costos por la estadía extendida de la carga en los patios públicos de Bolipuertos mermaban sus márgenes de ganancia, y la falta de un sistema de trazabilidad generaba quejas constantes entre sus sub-distribuidores.

**La Solución Implementada:**
Serviport diseñó a medida una hoja de ruta "hub-and-spoke" local. En lugar de despachar aduaneramente cada contenedor en el caos del muelle, instruimos el traslado inmediato (in-bond) de la mercancía bajo precinto aduanero hacia nuestro Almacén General de Depósito (AGD).
A través del Módulo de Importadores de Serviport OS, el cliente obtuvo visión del estatus del reconocimiento aduanero a nivel de ítem. Adicionalmente, agrupamos los procedimientos de vaciado de contenedores, segregación del LCL, y preparación de paletas bajo techo climatizado.

**Los Resultados:**
En los primeros tres meses de la alianza, el tiempo promedio entre la llegada del buque y la salida del transporte hacia la capital se redujo en un impresionante 45%. Los costos por "demurrage" de equipos se redujeron a cero, ya que los contenedores vacíos se retornaban de inmediato desde nuestro propio patio anexo, permitiendo al importador un ahorro financiero sustancial e incremental durante todo el 2026.`,
  },
  {
    id: "beyond-algorithms-human-maritime-connection",
    title:
      "Más allá del algoritmo: el irremplazable valor humano en la agencia portuaria",
    category: "Blog",
    date: "May 10, 2026",
    image:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Cómo la Inteligencia Artificial de logística complementa pero nunca reemplazará el conocimiento tácito de nuestro Water Clerk.",
    content: `La revolución tecnológica en Serviport OS es innegable. Sistemas que automatizan el cálculo de proformas, optimizan la densidad del Almacén General de Depósito y envían actualizaciones fotográficas EDI desde las garitas de control. Pero una operación marítima segura nunca depende únicamente de código.

### La Última Milla del Análisis Humano
Imaginemos una situación en donde el sistema proyecta la hora de atraque usando ETA basados en AIS satelitales. Sin embargo, un súbito chubasco limita la visibilidad en el canal de navegación. El algoritmo puede reprogramar automáticamente el evento para tres horas después, asumiendo lo peor. 
Es aquí donde la experiencia del Water Clerk y su permanente comunicación vía radio con Capitanía de Puerto intervienen. Sabe interpretar no sólo los datos, sino percibir el matiz y las decisiones discrecionales del Harbor Master para adaptar la maniobra de manera experta.

### La Adaptación en la Estiba
Durante la descarga de mercadería "Project Cargo" (maquinaria extra-dimensionada), la planificación computarizada establece los centro de gravedad, pero son las cuadrillas en el barco quienes sienten el vaivén y el viento sobre la cubierta, deteniendo una operación crítica antes de que ocurra una deformación o daño.

En Serviport no vemos la tecnología como automatización para sustituir a los humanos, sino como un 'Exo-Esqueleto' para empoderarlos. Los tableros del Yard Planner le ahorran el trabajo burocrático de rastrear posiciones para que use toda su inteligencia en lidiar creativa y velozmente con las imprecisiones incontrolables del mundo real del comercio exterior.`,
    author: "Dirección de Tecnología",
  },
  {
    id: "la-guaira-operational-disruption",
    title: "Mantenimiento Vial en Accesos al Puerto de La Guaira",
    category: "Aviso Operativo",
    date: "May 5, 2026",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Información sobre trabajos de infraestructura que podrían impactar mínimamente los tiempos de tránsito terrestre de sus contenedores.",
    content: `**Circular de Tránsito Terrestre - Región Capital**

Se les notifica a nuestros aliados comerciales y clientes BCOs que autoridades gubernamentales han iniciado labores de repavimentación y mantenimiento mayor en las vías perimetrales de acceso distribuidor que conecta la autopista Caracas-La Guaira con la zona primaria aduanera.

1. **Impacto:** Restricciones parciales por un solo canal para vehículos pesados durante la franja horaria de 08:00 AM a 03:00 PM. Podría experimentarse un retraso en turnos de arrime de aproximadamente 45 minutos hacia nuestra oficina comercial y terminal designada.
2. **Duración Esperada:** Los trabajos están programados hasta el viernes 15 de Mayo de 2026.
3. **Recomendaciones:** El equipo logístico de Serviport ya está redirigiendo la flota propia hacia ventanas de acceso nocturnas y horas valle, reprogramando automáticamente las confirmaciones de EIR y las órdenes de carga emitidas por Serviport OS. 

Mantenemos garantizada la seguridad e interconexión de todas las descargas originadas desde Puerto de La Guaira. Agradecemos su previsión en base a este comunicado.`,
    country: "Venezuela",
  },
  {
    id: "elevates-bunker-survey-capabilities",
    title:
      "Elevamos Capacidades de Soporte: Nuevos Estándares en Inspección de Bunkering",
    category: "Blog",
    date: "Apr 28, 2026",
    image:
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "La garantía en volumen y calidad de combustible es prioritaria para nuestros servicios de Husbandry a los armadores.",
    content: `El suministro de combustible marítimo (Bunkering) en Venezuela y el mundo representa a menudo el mayor costo individual de un viaje marítimo. Como Agentes Protectores, Serviport entiende que resguardar los costos operativos del armador involucra medidas contundentes. Recientemente hemos reforzado nuestras pautas para la supervición e inspección de despacho.

### ¿Cómo Aseguramos Integridad?
La industria experimenta retos sobre calidad fuera de especificaciones o anomalías de cantidad por densidad asimétrica al momento del trasvase hacia la motonave. 
Hemos incrementado sustancialmente la capacitación técnica a nuestros encuestadores (Surveyors) locales, implementando tecnología in-situ de medición, reduciendo la dependencia exclusivamente de la tabla volumétrica tradicional del buque tanque suplidor y las sondas capilares de a bordo. 

Garantizamos ahora reportes inmediatos bajo la robusta aplicación Serviport OS, asegurando que todos nuestros clientes globales tengan control y constancia en PDF de que han consumido estrictamente la energía contratada durante su repostaje.`,
    author: "Operaciones de Husbandry",
  },
  {
    id: "keeping-his-eye-on-the-ball-team",
    title:
      "Con un Ojo en el Balón: Liderazgo y Trabajo en Equipo en Operaciones de Estiba",
    category: "Blog",
    date: "Apr 20, 2026",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Entrevista a Carlos Martínez, supervisor del patio de contenedores, sobre los desafíos logísticos diarios.",
    content: `Carlos Martínez es Jefe de Cuadrilla y uno de los operadores con mayor antigüedad liderando la instrumentación en patio de carga general. En medio de un descanso entre descarga directas en Puerto Cabello, ahondamos en sus prioridades. 

**Pregunta: ¿Qué es lo más desafiante de las operaciones Breakbulk?**
**R:** Definitivamente lo heterogéneo que resulta. Con el ISO contenedor es casi mecánico, muy estructurado. Pero la carga general suelta o de proyecto exige improvisar con rigor las eslingas y calcular rápidamente las tensiones en cada guaya de la gúa flotante, vigilando la presión a los trabajadores. 

**P: ¿Cómo fomenta un ambiente seguro?**
**R:** Nunca damos a la rutina por inofensiva. Los accidentes en puerto son casi siempre fruto de subestimar maniobras estándar. Aplicamos estricta la cultura corporativa de "Parar e Informar". Si una brisa excede el umbral, paramos totalmente. La capacitación contante bajo la ISO 9001:2015 hace que las normas fluyan natural por cada compañero. Mi deber es estar atento a sus fatigas y asegurarlos.

Carlos prosigue con su turno con el chaleco naranja bien ceñido y el radiocomunicador alertando de la entrada de nuevos chasis FCL hacia el AGD exportación de Serviport, recordándonos que en todo gigante naviero hay una inmensa maquinaria humana.`,
    author: "Recursos Humanos",
  },
  {
    id: "teamwork-overcomes-project-challenges",
    title:
      "Trabajo en Equipo Supera los Desafíos de Fletamento de Carga Proyecto",
    category: "Caso de Éxito",
    date: "Apr 10, 2026",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600",
    excerpt:
      "Descarga exitosa de componentes eólicos masivos a pesar de los obstáculos portuarios regionales.",
    content: `**El Desafío:**
A Serviport se le encomendó la recepción y almacenaje en tránsito de múltiples aspas eólicas y tubos generadores para un proyecto energético regional en un período crítico de alta ocupación de plataformas en los muelles de Venezuela Occidental, usando fletamento marítimo inter-puertos.

El largo sobredimensionado requeriría invadir zonas del circuito que detendrían simultáneamente la logística portuaria en todo el tramo este del Puerto de atraque asignado. Adicionalmente, el seguro de las piezas prohibía de tajo movimientos nocturnos.

**La Solución:**
El departamento de agenciamiento naviero colaboró de cerca un mes antes de la llegada de la carga; orquestando la remoción de dos barcos pesqueros y planificando una ventana estrecha sincronizada milimétricamente con dos grúas terrestres móviles de alta carga de más de 100 Toneladas.
Luego, en un despliegue sin igual en Serviport, procedimos al cierre temporal e ingreso escalonado de un convoy de dieciocho lowboys especiales. En tan sólo 11 horas diurnas procedimos con la descarga integral de todo el barco fletado de aspas.

**El Resultado:**
La estadía del port call finalizó dos días enteros por debajo del margen estipulado, salvando cientos de miles de dólares en sobre-tarifas de fletamento "Stand-by", y sin interrumpir operaciones rutinarias en la red vecina, consolidando nuestra habilidad en la logística "Llave en Mano" para Venezuela.`,
  },
];
