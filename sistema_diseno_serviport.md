Sistema de Diseño de Interfaz y Experiencia (UI/UX)
Basado en Landing Page y Home
Este documento define las directrices fundamentales para mantener la integridad visual, la textura, la jerarquía y el dinamismo establecidos en la página de inicio. Está pensado para abstraer las lógicas de diseño a cualquier vista o módulo futuro.
1. Identidad Visual: Color y Tipografía
1.1. Paleta de Colores
El sistema utiliza una paleta de altísimo contraste que evoca seguridad técnica, ambientes marítimos profundos y llamadas a la acción enérgicas.
Primarios (Blue Ocean / Cyan):
primary (#00A9CE): Usado para acentos sutiles, micro-etiquetas (tags), íconos decorativos y bordes enfocados.
primary-dark (#008eac): Usado para estados interactivos (hover) sobre el primary.
Secundarios (Deep Navy):
secondary (#0b1a2e): El pilar del diseño. Usado para seccionar grandes bloques de contenido (ej. ServicesSection) y los superposiciones (overlays) en imágenes y videos.
secondary-dark (#0b1424): Usado para el Hero y fondos extremos que requieren oscuridad absoluta.
Acento (Warning Orange):
accent (#F7941D): Usado estrictamente para interacción primaria: botones principales, llamados a la acción (CTAs) y textos clave que deben romper visualmente (ej. "Tu carga, en manos expertas").
Fondos y Superficies (Neutros):
background (#ffffff): Fondo de páginas default.
background-muted (#f8fafc): Para crear diferenciación de secciones sin usar bordes rígidos (ej. LocationsPartnersSection).
Textos (Foreground):
foreground (#0f172a): Texto principal sobre luz.
foreground-muted (#475569): Párrafos y descripciones sobre luz.
1.2. Tipografía & Jerarquía
Se utiliza una dupla tipográfica enfocada en legibilidad (Sans) y autoridad/presencia (Serif/Display).
Fuentes Base:
Párrafos y UI (Sans): Nunito Sans. Transmite accesibilidad y modernidad técnica.
Títulos y Encabezados (Serif/Display): Sansita. Transmite solidez institucional y confianza. Utiliza font-extrabold o font-black.
Dimensionamiento Responsivo:
Nunca usar un tamaño estático para grandes titulares. Usar fórmulas fluídas (clamp). Ejemplo del Hero: text-[clamp(1.5rem,4.5vw,5rem)].
Gestión del Tracking (Espaciado de letras):
Grandes titulares: tracking-tight e interlineados cortos (leading-[1.05] a leading-[1.15]).
Botones y Micro-etiquetas: tracking-wider a tracking-widest en bloque completo en mayúsculas.
2. Sistema de Layout y Espaciado
2.1. Contenedores y Cuadrículas
Ancho Máximo: Todo el contenido legible debe vivir dentro de un contenedor max-w-[1260px] mx-auto. Esto evita que la web se rompa en pantallas ultra-anchas.
Paddings (Cojines) de Sección:
Las secciones principales usan márgenes amplios en Y: py-12 md:py-16 lg:py-20 (ej. ServicesSection).
Los márgenes en X siempre usan px-4 md:px-6.
Estructuras de Retícula ("Bento Box"):
La página se apoya fuertemente en cuadrículas asimétricas responsivas (CSS Grid).
Elementos visuales mayores ocupan 2 columnas/2 filas (col-span-2 row-span-2), acompañados por módulos satélites de 1 columna/1 fila.
2.2. División de Secciones
Fluidez vs Definición: Minimizar el uso de bordes estáticos en los ejes Y. La separación se logra cambiando el color del fondo (bg-white a bg-background-muted a bg-secondary).
Líneas Divisorias: Si son estrictamente necesarias, se usan líneas muy tenues: border-t border-secondary-dark/10 sobre claro, o border-t border-white/5 sobre oscuro.
3. Lenguaje Visual (Texturas, Gradients y Overlays)
3.1. Tratamiento de Medios (Imágenes y Video)
Regla de Legibilidad sobre Medios: El texto blanco nunca se coloca directamente sobre una foto o video.
Gradients Protectores: Se usan gradientes que nacen del color secundario u oscuro.
Ejemplo Hero: bg-gradient-to-r from-secondary/80 via-secondary/40 to-transparent (Gradiente horizontal).
Ejemplo Tarjetas: bg-gradient-to-t from-secondary via-secondary/40 to-transparent opacity-90 (Gradiente vertical para títulos en el fondo de las cartas).
Efectos Cinematográficos: Las imágenes secundarias de fondo o mapas en tarjetas suelen estar en escala de grises (grayscale opacity-70) y revelan el color al interactuar (hover:grayscale-0 hover:opacity-100).
3.2. Formas y Esquinas (Border-Radius)
Tarjetas y Contenedores: Suavizados orgánicos usando rounded-xl o rounded-2xl. Esto genera un contraste moderno frente a la rudeza industrial de la paleta navbar.
Botones y Micro-UI: Esquinas más rígidas, rounded-md o simplemente rounded para aportar una sensación táctica y corporativa.
Sombras (Depth): Uso extenso de drop-shadows para los textos sobre fondos (generando efecto quemado) y shadow-md / shadow-xl / shadow-2xl para separar los contenedores (bento boxes) de sus fondos de soporte.
4. Patrones de Componentes (Componentization)
4.1. Micro-Etiquetas (Tags de Sección)
Cada nueva sección se anuncia mediante un micro-header visual antes del Título 2 (H2).
Estructura Base:
code
Html
<!-- Patrón Exacto -->
<div className="inline-block px-3 py-1.5 bg-primary text-white font-bold tracking-wider text-xs mb-3 uppercase shadow-sm">
  Nombre de Sección
</div>
4.2. Sistema de Botones y CTAs
Botón Primario Lleno (Acción Core):
Responsabilidad: Llevar al usuario a conversión (Cotizar, Contactar).
Estilos: Fondo Naranja (bg-accent), letras Blancas (text-white), espaciado en mayúsculas (uppercase tracking-wider font-bold), Padding generoso (px-6 py-3).
Hover: hover:bg-orange-500, y añade sombra suave iluminada (shadow-accent/20).
Botón Secundario Outline (Páginas Secundarias):
Responsabilidad: Navegación de descubrimiento (Saber Más, Servicios).
Estilos: border-2 border-accent text-accent hover:text-white hover:bg-accent.
4.3. Listas Interactivas y Acordeones Fluidos
Se detecta un patrón maestro (usado en ServicesSection) donde los ítems de lista no son meros textos, sino bloques interactivos (.group).
Composición de Item Activo vs Inactivo:
Inactivo: class="hover:bg-background/5 border-l-4 border-transparent text-slate-300"
Activo: class="bg-background/10 shadow-md border-l-4 border-primary text-white" (Aparece barra Cyan izquierda como indicador visual táctil).
5. Diseño de Interacciones y Dinamismo (Motion)
La plataforma no es rígida; utiliza un sistema de micro-animaciones constante programado en motion/react.
Efecto de Entrada al Hacer Scroll (Fade & Slide UP): Todo elemento textual en grupo entra a pantalla desde abajo de manera escalonada o en cuña.
Variables de uso: initial={{ opacity: 0, y: 30 }}, whileInView={{ opacity: 1, y: 0 }}, apoyándose en transition={{ duration: 0.6 }}.
Parallax Sensato: Los elementos de fondo no son planos. Se detecta el uso de useScroll(); transfigurando el valor y del background conforme el visitante desciende para generar profundidad de campo.
Feedback Kinestésico Táctil en Hovers:
Las íconos en tarjetas reaccionan subiendo sutilmente su escala y girando (Trust Bar usa whileHover={{ scale: 1.1, rotate: 5 }}).
Flechas de dirección en los enlaces/botones se desplazan al hover de su grupo principal mediante Tailwind: group-hover:translate-x-1.
Transiciones de Estado (Duración de animaciones cruzadas):
El estándar para Tailwind es transition-all duration-300 para UI pequeña (botones).
Para elementos masivos como imágenes en tarjetas (ej. LocationsPartnersSection), usar algo más dramático: duration-500 o duration-700.

