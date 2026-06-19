# **Arquitectura Maestra ServiPort - Sistema de Logística y Operaciones Portuarias V2.0**

*Documento Oficial de Arquitectura del Ecosistema B2B Portuario - ServiPort.*
*Incluye Resoluciones Arquitectónicas Críticas (Fase Cierre de Diseño).*

---

## 1. Módulos y Arquitectura Base (Infraestructura, ACID y Free Tier)

El sistema opera bajo una arquitectura de micro-servicios Serverless alojados en Firebase (Firestore, Auth, Functions/Node.js) y renderizado en el entorno Edge. Para mitigar limitaciones del Tier Gratuito y cuotas de Firebase, se han implementado resoluciones críticas:

### 1.1 Bifurcación Jerárquica de IDs (Resolución #1)
Debido al límite estricto de 1MB por documento en Firestore, el ciclo de vida operativo (CycleID) se fragmenta jerárquicamente:
- **`VesselCycleID` (Macro-eventos del Buque):** Registra eventos de escala, ETA/ETD, atracos, despachos INEA y operaciones generales del navío.
- **`ContainerCycleID` (Micro-eventos de Contenedor FCL):** Registra movimientos (descarga, yard, gate out). Posee un `vesselRef` apuntando al `VesselCycleID`.
- **`BookingCycleID` (Asignaciones Comerciales):** Vincula las cargas de exportación o re-embarque.
> **Integración Torre de Control:** El Frontend agrega la vista consolidada resolviendo consultas compuestas (indexes) con un límite de paginación o snapshot, salvando de forma determinista la cuota de peso por documento.

### 1.2 Auditoría Obligatoria y Unicidad en `arrayUnion` (Resolución #2)
Los `audit_logs` embebidos en los documentos transaccionales se rigen bajo reglas estrictas para evitar la deduplicación silenciosa de Firebase:
-  Cada inyección dentro de un array de logs es un objeto estricto: `{ logId: "uuid-v4", timestamp_ms: 1718000000000, accion: "Descripción", severity: "INFO|WARNING|CRITICAL", operator: "user@domain.com" }`
- Solo mediante este modelo se asegura el registro cronológico frente a reconexiones asíncronas de redes móviles (offline).

### 1.3 Resolución LWW Jerárquica y Conflictos Offline (Resolución #3)
El ecosistema implementa *Last Write Wins* (LWW) pero con **Peso de Estado**:
- Si ocurre una colisión al reconectarse, el backend evalúa el timestamp subyacente y el "Peso Numérico" de los estados.
- **Ejemplo Práctico:** Un contenedor marcado globalmente como `GATE_OUT` (peso 100) bloqueará transaccionalmente un evento de `YARD_MOVE` (peso 50) emitido desde el dispositivo offline de un estibador. Esto lanza un log `CRITICAL: Movimiento Fantasma rechazo por terminalidad del ciclo`.

### 1.4 Rendering 2D Agregado y Costo Cero (Resolución #4)
Para dibujar el mapa visual 2D del Terminal Portuario (Almacenamiento/Yard) sin incurrir en miles de lecturas y costos en Firestore:
- Un Web Worker interno (o Cron Job en Node.js) recopilará agresivamente las tablas transaccionales cada *N* minutos.
- Este generará un UNICO documento json compilado: `tos_snapshots/PCL_latest`.
- El frontend en React (mediante `react-konva`) suscribirá o leerá exclusivamente este documento para plasmar hasta 50,000 TEUs con una sola lectura Firestore.

### 1.5 Keep-Alive Híbrido para el Scraper de Buques (Resolución #5)
El servicio de monitoreo marítimo emplea un Scraper en un entorno temporal que puede hibernar ("spin-down").
- Se usa `cron-job.org` apuntando a la ruta `GET /api/health` para evitar que las instancias gratuitas "duerman".
- Un **CRON Schedule interno** ejecuta agresivamente el scraping cada 6 horas vía Firebase Admin SDK para sincronizar.
- El panel *SuperAdmin* ofrece un botón de "Forzar Sincronización" (Fallback Push) que esquiva este ciclo y lanza la actualización de la tabla buques instantáneamente.

---

## 2. Lógica Operativa, Manejo Físico y Casos Borde (TOS / GARITA)

### 2.1 EIR Físico Dinámico y Control de Averías (Resolución #6)
El proceso de pesaje y control `Gate In` / `Gate Out` en Garita requiere un Checklist Interactivo:
- El Inspector de Puerta debe marcar el estado de las compuertas, precintos, lona (Flat Racks) y topes.
- Marcar cualquier defecto activa automáticamente el estado `DAMAGE_REPORTED`.
- **Efectos:** Alerta en tiempo real a la Torre de Control y disparo de notificación B2B a la línea naviera, bloqueando o previniendo disputas legales sobre responsabilidades de reparación de equipos y lavados especiales.

### 2.2 Flujo de Desconsolidación LCL en Almacén AGD (Resolución #7)
Para carga fraccionada, el contenedor general ingresa al recinto aduanero:
- Al recibir la orden de desconsolidación, el contenedor madre (FCL) hace transición a `EMPTY_AT_DEPOT`.
- El Backend emite subsecuentes `CargoCycleID` hijos vinculados a los *House Bill of Lading (HBL)*.
- Se reasignan estos pallets/cajas a estanterías ("racks") lógicas 2D del almacén físico.
- El trigger financiero muta automágicamente la base de liquidación de TEU de Almacenaje a *Tonelada Métrica / Metro Cúbico (W/M)* tarifaria.

### 2.3 "Días de Gracia" en Relojes Críticos (Resolución #8)
Ante contingencias (fallas eléctricas, incidentes portuarios, decretos de feriados, fallas aduaneras mayores):
- El Administrador/Gerente posee una función maestra para pausar y/o inyectar "Días de Feriado o Gracia" ("Grace Days") masivamente.
- La ejecución paraliza o retasa temporalmente los relojes de `Demurrage` (deuda Naviera) y `Detention/Sobrestadía` (deuda Patio Bolipuertos) sobre lotes de contenedores seleccionados, generando un log auditable con su respectiva justificación (Ej: "Apagón Nacional - 24H Detenidos").

### 2.4 Reparos Aduaneros SENIAT y Bloqueo en Canal Rojo (Resolución #9)
El ecosistema implementa la semántica estricta del SIDUNEA (Simulado):
- Todo contenedor cuyo dictamen caiga en canal **ROJO** (Reconocimiento Físico) que registre una discrepancia o hallazgo por parte de las autoridades se le imputa el estatus aduanero `SENIAT_REPARO`.
- **Hard Lock transaccional:** Bajo este estatus, el `Gate Out` queda inhabilitado a nivel de base de datos.
- Para lograr la extricación del bloqueo, el Agente Aduanal B2B adherido al portal debe comprobar documentalmente el pago de multa mediante la subida / registro de una "DUA Rectificativa" y refrendo liquidado.

---

## 3. Arquitectura Transversal ERP: Finanzas y Cumplimiento

### 3.1 Diferencial Cambiario Automático (Resolución #10)
En economías de tipo de cambio variable y duales (Bs. vs USD/BCV):
- Si una proforma se oficia el día Lunes a Tasa X, y el pago es materializado (Transferencia/BioPago) el día Viernes con una Tasa Y depreciada:
- Un worker interno cruza el `timestamp` del registro bancario vs Tasa Histórica BCV del día.
- De calcularse un impago por devaluación, el sistema mantiene en suspensión la liberación aduanera y genera una Sub-Factura: "Deuda Remanente por Diferencial Cambiario". Las DA (Disbursement Accounts) de buques navieros no cierran ciclo sin esta conciliación previa en 0.00.

### 3.2 Ciclo de Devolución de Vacíos y Depósito en Garantía (Resolución #11)
El reloj de `Demurrage` no culmina con el abandono de puerto importación (`Gate Out`), el proceso culmina con el acto del `EMPTY_RETURN_GATE_IN` en el Depot de vacíos asignado.
- Al cruzar los portales de retorno, el ciclo cierra definitivamente.
- Si el EIR final ("Equipment Interchange Receipt") determina estatus *Limpio (Condition: Sound)* y dentro del plazo Free-Time, el ERP automatiza y transacciona una orden Cuentas Por Pagar de "Reembolso 100% Depósito de Garantía" al importador/forwarder.
- Si hay demoras o marca EIR con estado `DAMAGE_REPORTED` (avería física / requiere limpieza), el sistema ejerce una deducción liquidable sobre dicho depósito previo.

### 3.3 Habilitaciones Aduaneras - Operaciones Overtime (Resolución #12)
Se ha implementado una barrera horaria aduanera de estricto cumplimiento:
- Todas las programaciones de atraque, estiba o despachos terrestres que caigan fuera de días u horarios hábiles desencadenan el flag automático transaccional temporal `REQUIRES_HABILITACION`.
- Las mecánicas que gatilla el ecosistema incluyen:
  1. Trigger de confirmación y autorización enviada remotamente al bot administrativo de Telegram, simulando autoridades de Aduana Marítima para oficializar el servicio fuera de horario (Overtime).
  2. Ajuste automático inyectando el *Fee* de Guardia o Habilitación en la Factura Pro-Forma B2B.
  3. Inyección del porcentaje de Ley de Trabajadores en la Planilla Nominal ("Nómina - Overtime Multiplier") para la cuadrilla de estibadores activa en el muelle.

### 3.4 Inmutabilidad Estricta y "Cartas de Corrección" (Resolución #13)
Basado en el cumplimiento real, una vez un instrumento documental comercial es rubricado (Manifiestos o Bill of Lading declarados válidos), aplican candados de inmutabilidad:
- **`Hard Lock` de Firestore Security Rules:** El documento base se congela. Las operaciones `update()` convencionales hacia estos dominios son rechazadas unívocamente.
- Para enmendar el récord por correcciones de peso consignado, correcciones de RIF del importador o descripciones HS Code, entra de rigor el flujo `CARTA_DE_CORRECCION`.
- El flujo requiere someter un *Request Payload* justificando fallos documentales, requiere Aprobación de Firma Autorizada Gerencial (Trigger Telegram / Panel), revoca la anterior emitiendo la nueva versión documentada, anexando un Log de Trazabilidad Auditable a perpetuidad exigido por ley aduanera.

---

## 4. Estructuras de Datos Maestras y Catálogos

Las librerías y catálogos estandarizados (Buques, Puertos, Navieras y Entes Competentes) persisten de forma global a nivel base de datos (`/src/lib/registryService.ts`) integrándose vertical y fluidamente como `Foreign Keys` visuales en todas las vistas de renderizado frontal, cumpliendo el principio SOLID y DRY, alimentando el flujo informativo y evitando redundancias manuales pre-configuradas. Cada entidad en el registro, proveniente de entidades *top-tier* globales y contrastadas, respeta el principio de Cero Entradas Fantasma para la arquitectura.

---
**FIN DEL DOCUMENTO MAESTRO V2.0**
*Aprobado: Arquitecto ServiPort.*
