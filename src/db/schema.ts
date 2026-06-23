import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, uuid, decimal, char, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  razonSocial: text('razon_social'),
  rif: text('rif'),
  roles: text('roles').array(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const empresas = pgTable('empresas', {
  id: uuid('id').defaultRandom().primaryKey(),
  rif: text('rif').unique(),
  razonSocial: text('razon_social'),
  isNaviera: boolean('is_naviera').default(false),
  isArmador: boolean('is_armador').default(false),
  isImportador: boolean('is_importador').default(false),
  isExportador: boolean('is_exportador').default(false),
  isAgenteAduanas: boolean('is_agente_aduanas').default(false),
  isTransportista: boolean('is_transportista').default(false),
  isConsolidador: boolean('is_consolidador').default(false),
  licenciaSeniat: text('licencia_seniat'),
  rubroExportacion: text('rubro_exportacion'),
  agenteAduanasId: uuid('agente_aduanas_id'),
  codigoSrop: text('codigo_srop'),
  codigoSidunea: text('codigo_sidunea'),
  codigoRut: text('codigo_rut'),
  codigoOperadorNvocc: text('codigo_operador_nvocc'),
});

export const navieraPrefijosBic = pgTable('naviera_prefijos_bic', {
  id: serial('id').primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id),
  prefijoBic: char('prefijo_bic', { length: 4 }),
});

export const flotaBuques = pgTable('flota_buques', {
  imo: integer('imo').primaryKey(),
  armadorId: uuid('armador_id').references(() => empresas.id),
  nombre: text('nombre'),
  esloraM: decimal('eslora_m'),
  mangaM: decimal('manga_m'),
  caladoMaxM: decimal('calado_max_m'),
  maxTeuCapacity: integer('max_teu_capacity'),
  layoutBays: integer('layout_bays'),
  layoutRows: integer('layout_rows'),
  layoutTiers: integer('layout_tiers'),
});

export const escalas = pgTable('escalas', {
  id: text('id').primaryKey(), // Ej: 'PC-HOR-169854'
  imoBuque: integer('imo_buque').references(() => flotaBuques.imo),
  viajeId: text('viaje_id'),
  puertoDestino: text('puerto_destino'), // 'VE_PCL', 'VE_LGA', 'VE_GUA', 'VE_MAR'
  estado: text('estado'), // 'PRE_ARRIBO', 'FONDEADO', 'ATRACADO', 'ZARPADO', 'WAITING_SENIAT_APPROVAL', 'PRE_ARRIBO_APPROVED'
  eta: timestamp('eta'),
  etd: timestamp('etd'),
});

export const escalasNavieras = pgTable('escalas_navieras', {
  id: serial('id').primaryKey(),
  escalaId: text('escala_id').references(() => escalas.id),
  navieraId: uuid('naviera_id').references(() => empresas.id),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  navieraId: uuid('naviera_id').references(() => empresas.id),
  exportadorId: uuid('exportador_id'), // Assuming exportador is another empresa
  createdAt: timestamp('created_at').defaultNow(),
});

export const bookingsExportacion = pgTable('bookings_exportacion', {
  id: uuid('id').defaultRandom().primaryKey(),
  exportadorId: uuid('exportador_id').references(() => empresas.id),
  navieraId: uuid('naviera_id').references(() => empresas.id),
  puertoOrigen: text('puerto_origen'),
  puertoDestino: text('puerto_destino'),
  cantidadTeus: integer('cantidad_teus'),
  tipoIsoRequerido: text('tipo_iso_requerido'), // '20_DRY', '40_REEFER'
  estado: text('estado'), // 'DRAFT', 'REQUESTED', 'APPROVED_BY_NAVIERA', 'REJECTED'
  cargoCutOff: timestamp('cargo_cut_off'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contenedores = pgTable('contenedores', {
  numeroBic: text('numero_bic').primaryKey(), // Ej: 'MSKU9081232'
  escalaId: text('escala_id').references(() => escalas.id),
  navieraId: uuid('naviera_id').references(() => empresas.id),
  importadorId: uuid('importador_id'), 
  agenteAduanasId: uuid('agente_aduanas_id').references(() => empresas.id),
  bookingId: uuid('booking_id').references(() => bookings.id),
  bookingExportacionId: uuid('booking_exportacion_id').references(() => bookingsExportacion.id),
  tipoIso: text('tipo_iso'), // Ej: '40R1'
  estadoFisico: text('estado_fisico'), // 'EN_BUQUE', 'EN_PATIO', 'GATE_OUT', 'EMPTY_RETURN'
  estadoFisicoExport: text('estado_fisico_export'), // 'EMPTY_RELEASED', 'STUFFING_AT_PLANT', 'FULL_GATE_IN', 'IN_YARD_EXPORT', 'LOADED_ON_VESSEL'
  pesoVgmKg: decimal('peso_vgm_kg'),
  selectividadSeniat: text('selectividad_seniat'), // 'VERDE', 'AMARILLO', 'ROJO', 'REPARO'
  estibaBay: integer('estiba_bay'),
  estibaRow: integer('estiba_row'),
  estibaTier: integer('estiba_tier'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const inspeccionesGnb = pgTable('inspecciones_gnb', {
  id: uuid('id').defaultRandom().primaryKey(),
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  tipoInspeccion: text('tipo_inspeccion'), // 'ESCANER_NO_INTRUSIVO', 'CANINO', 'VACIADO_TOTAL'
  actaNumero: text('acta_numero'),
  estado: text('estado'), // 'PENDING', 'IN_PROGRESS', 'CLEARED_FOR_EXPORT', 'RETAINED'
  createdAt: timestamp('created_at').defaultNow(),
});

export const declaracionesAduaneras = pgTable('declaraciones_aduaneras', {
  id: uuid('id').defaultRandom().primaryKey(),
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  numeroDua: text('numero_dua').unique(),
  numeroDav: text('numero_dav'),
  fechaRegistro: timestamp('fecha_registro').defaultNow(),
  fechaLiquidacion: timestamp('fecha_liquidacion'),
  montoTributosVes: decimal('monto_tributos_ves'),
  estadoDeclaracion: text('estado_declaracion'), // 'DRAFT', 'TRANSMITIDA', 'PAGADA', 'LEVANTE_OTORGADO', 'REPARO_ACTIVO'
});

export const itemsArancelarios = pgTable('items_arancelarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  declaracionId: uuid('declaracion_id').references(() => declaracionesAduaneras.id),
  codigoArancelario: text('codigo_arancelario'),
  descripcionMercancia: text('descripcion_mercancia'),
});

export const permisosConexos = pgTable('permisos_conexos', {
  id: uuid('id').defaultRandom().primaryKey(),
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  entidad: text('entidad'), // 'INSAI', 'SENCAMER', 'MIN_SALUD', 'MIN_ECO_FINANZAS'
  numeroPermiso: text('numero_permiso'),
  estado: text('estado'), // 'EN_TRAMITE', 'APROBADO', 'RECHAZADO', 'EXENTO'
});

export const certificadosBuque = pgTable('certificados_buque', {
  id: uuid('id').defaultRandom().primaryKey(),
  imoBuque: integer('imo_buque').references(() => flotaBuques.imo),
  tipoCertificado: text('tipo_certificado'), // 'IOPP', 'SMC', 'ISSC', 'P&I_CLUB'
  fechaEmision: timestamp('fecha_emision'),
  fechaVencimiento: timestamp('fecha_vencimiento'),
  archivoUrl: text('archivo_url'),
});

export const pdaArmador = pgTable('pda_armador', {
  escalaId: text('escala_id').primaryKey().references(() => escalas.id),
  armadorId: uuid('armador_id').references(() => empresas.id),
  costoMuellajeEstimado: decimal('costo_muellaje_estimado'),
  costoPracticajeRemolque: decimal('costo_practicaje_remolque'),
  totalPdaUsd: decimal('total_pda_usd'),
  estadoFondeo: text('estado_fondeo'), // 'PENDIENTE', 'EN_REVISION_ERP', 'FONDEADO', 'FDA_CONCILIADA'
});

export const serviciosHusbandry = pgTable('servicios_husbandry', {
  id: uuid('id').defaultRandom().primaryKey(),
  escalaId: text('escala_id').references(() => escalas.id),
  categoria: text('categoria'), // 'AGUA_POTABLE', 'BUNKERING', 'MARPOL_SLUDGE', 'PROVISIONES', 'ASISTENCIA_MEDICA'
  proveedorId: uuid('proveedor_id').references(() => empresas.id),
  cantidad: decimal('cantidad'),
  unidadMedida: text('unidad_medida'),
  costoAprobadoUsd: decimal('costo_aprobado_usd'),
  estado: text('estado'), // 'SOLICITADO', 'EN_PROGRESO', 'COMPLETADO', 'FACTURADO'
});

export const tripulacionSaime = pgTable('tripulacion_saime', {
  id: uuid('id').defaultRandom().primaryKey(),
  escalaId: text('escala_id').references(() => escalas.id),
  nombres: text('nombres'),
  apellidos: text('apellidos'),
  pasaporte: text('pasaporte'),
  nacionalidad: text('nacionalidad'),
  rango: text('rango'), // Captain, Chief Engineer, etc.
  tipoOperacion: text('tipo_operacion'), // 'TRANSITO', 'ON_SIGNER', 'OFF_SIGNER'
  estadoMigratorio: text('estado_migratorio'), // 'ESPERANDO_SAIME', 'SHORE_PASS_APROBADO', 'DENEGADO'
});

export const facturasLocales = pgTable('facturas_locales', {
  id: uuid('id').defaultRandom().primaryKey(),
  importadorId: uuid('importador_id').references(() => empresas.id),
  tipo: text('tipo'), // 'ALMACENAJE_BOLIPUERTOS', 'FLETE_OCEANICO', 'DEMURRAGE', 'MANIOBRAS_TOS'
  montoUsd: decimal('monto_usd'),
  tasaBcvEmision: decimal('tasa_bcv_emision'),
  tasaBcvPago: decimal('tasa_bcv_pago'),
  saldoDiferencialVes: decimal('saldo_diferencial_ves'),
  estado: text('estado'), // 'POR_PAGAR', 'EN_TRANSITO', 'PAGADA', 'SALDO_DEUDOR'
});

export const garantiasVacios = pgTable('garantias_vacios', {
  contenedorBic: text('contenedor_bic').primaryKey().references(() => contenedores.numeroBic),
  montoUsd: decimal('monto_usd'),
  estadoGarantia: text('estado_garantia'), // 'RETENIDA', 'EN_EVALUACION_EIR', 'REEMBOLSADA', 'PENALIZADA'
  montoReembolsado: decimal('monto_reembolsado'),
});

export const auditLogs = pgTable('system_audit_logs', {
  logId: uuid('log_id').defaultRandom().primaryKey(),
  timestampMs: timestamp('timestamp_ms', { withTimezone: true }).defaultNow(),
  cycleId: text('cycle_id'),
  actorId: uuid('actor_id'),
  rolActor: text('rol_actor'),
  accionDesc: text('accion_desc'),
  gravedad: text('gravedad'), // 'INFO_VERDE', 'WARNING_AMARILLO', 'CRITICAL_ROJO'
});

export const portcalls = pgTable('portcalls', {
  id: serial('id').primaryKey(),
  port: text('port').notNull(),
  vesselName: text('vessel_name'),
  eta: timestamp('eta'),
  status: text('status'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const yardMovements = pgTable('yard_movements', {
  id: serial('id').primaryKey(),
  port: text('port').notNull(),
  containerId: text('container_id'),
  fromLocation: text('from_location'),
  toLocation: text('to_location'),
  status: text('status'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const gateEvents = pgTable('gate_events', {
  id: serial('id').primaryKey(),
  port: text('port').notNull(),
  type: text('type'), // IN/OUT
  containerId: text('container_id'),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Assuming relations if needed
export const approvals = pgTable('approvals', {
  id: serial('id').primaryKey(),
  port: text('port').notNull(),
  type: text('type'),
  status: text('status'),
  referenceId: text('reference_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const patios = pgTable('patios', {
  id: serial('id').primaryKey(),
  port: text('port').notNull(),
  name: text('name'),
  capacity: integer('capacity'),
  occupancy: integer('occupancy'),
});

export const crews = pgTable('crews', {
  id: serial('id').primaryKey(),
  port: text('port').notNull(),
  name: text('name'),
  shift: text('shift'),
  status: text('status'),
  membersCount: integer('members_count'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  port: text('port').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role'),
  department: text('department'),
  status: text('status'),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
});

export const hitosLegales = pgTable('hitos_legales', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  date: timestamp('date'),
  status: text('status'),
});

export const eirOrders = pgTable('eir_orders', {
  id: serial('id').primaryKey(),
  port: text('port').notNull(),
  containerId: text('container_id'),
  type: text('type'),
  status: text('status'),
  issuedAt: timestamp('issued_at').defaultNow(),
});



export const tariffs = pgTable('tariffs', {
  id: serial('id').primaryKey(),
  port: text('port'),
  service: text('service'),
  amount: integer('amount'),
  currency: text('currency'),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  port: text('port').notNull(),
  invoiceNumber: text('invoice_number'),
  amount: integer('amount'),
  currency: text('currency'),
  status: text('status'),
  issuedAt: timestamp('issued_at').defaultNow(),
});

export const facturasPendientes = pgTable('facturas_pendientes', {
  id: serial('id').primaryKey(),
  contenedorId: text('contenedor_id'),
  tipo: text('tipo'),
  monto: integer('monto'),
  moneda: text('moneda'),
  estado: text('estado'),
  diasRetraso: integer('dias_retraso'),
  clienteId: text('cliente_id'),
  fechaEmision: timestamp('fecha_emision').defaultNow(),
});

export const consultas = pgTable('consultas', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  message: text('message'),
  status: text('status').default('new'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const conductores = pgTable('conductores', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id),
  cedulaIdentidad: text('cedula_identidad').unique(),
  nombres: text('nombres'),
  apellidos: text('apellidos'),
  telefono: text('telefono'),
  licenciaGradoQuinto: boolean('licencia_grado_quinto'),
  estado: text('estado'), // 'ACTIVO', 'VETADO_BOLIPUERTOS', 'INACTIVO'
});

export const vehiculosFlota = pgTable('vehiculos_flota', {
  placa: text('placa').primaryKey(),
  empresaId: uuid('empresa_id').references(() => empresas.id),
  tipo: text('tipo'), // 'CHUTO', 'REMOLQUE_PLATAFORMA', 'REMOLQUE_ESQUELETO'
  ejes: integer('ejes'),
  capacidadToneladas: decimal('capacidad_toneladas'),
});

export const ventanasHorariasVbs = pgTable('ventanas_horarias_vbs', {
  id: uuid('id').defaultRandom().primaryKey(),
  puertoId: text('puerto_id'), // 'VE_PCL', 'VE_LGA', etc
  fecha: timestamp('fecha', { mode: 'date' }),
  bloqueHora: text('bloque_hora'), // '08:00 - 10:00'
  capacidadMaxima: integer('capacidad_maxima'),
  cuposReservados: integer('cupos_reservados').default(0),
});

export const citasGarita = pgTable('citas_garita', {
  id: uuid('id').defaultRandom().primaryKey(),
  ventanaId: uuid('ventana_id').references(() => ventanasHorariasVbs.id),
  transportistaId: uuid('transportista_id').references(() => empresas.id),
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  conductorId: uuid('conductor_id').references(() => conductores.id),
  placaChuto: text('placa_chuto').references(() => vehiculosFlota.placa),
  placaRemolque: text('placa_remolque').references(() => vehiculosFlota.placa),
  tipoOperacion: text('tipo_operacion'), // 'RETIRO_IMPORTACION', 'INGRESO_EXPORTACION', 'RETIRO_VACIO', 'DEVOLUCION_VACIO'
  tokenQr: text('token_qr').unique(),
  estado: text('estado'), // 'AGENDADA', 'EN_TRANSITO', 'EN_GARITA', 'COMPLETADA', 'RECHAZADA', 'NO_SHOW'
  createdAt: timestamp('created_at').defaultNow(),
});

export const masterBls = pgTable('master_bls', {
  id: text('id').primaryKey(),
  consolidadorId: uuid('consolidador_id').references(() => empresas.id),
  navieraId: uuid('naviera_id').references(() => empresas.id),
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  estadoMaster: text('estado_master'), // 'EN_TRANSITO', 'EN_PUERTO', 'VACIADO_COMPLETO'
});

export const houseBls = pgTable('house_bls', {
  id: text('id').primaryKey(), // Ej: 'HBL-00912A'
  masterBlId: text('master_bl_id').references(() => masterBls.id),
  importadorId: uuid('importador_id').references(() => empresas.id),
  agenteAduanasId: uuid('agente_aduanas_id').references(() => empresas.id),
  descripcionMercancia: text('descripcion_mercancia'),
  pesoKg: decimal('peso_kg'),
  volumenCbm: decimal('volumen_cbm'),
  estadoHbl: text('estado_hbl'), // 'MANIFESTADO', 'EN_RACK', 'RECONOCIMIENTO', 'LEVANTE', 'ENTREGADO'
});

export const inventarioAlmacen = pgTable('inventario_almacen', {
  id: uuid('id').defaultRandom().primaryKey(),
  houseBlId: text('house_bl_id').references(() => houseBls.id),
  rack: text('rack'),
  nivel: text('nivel'),
  posicion: text('posicion'),
  condicionBulto: text('condicion_bulto'), // 'CONFORME', 'SOBRANTE', 'FALTANTE', 'AVERIADO'
});

export const usuariosStaff = pgTable('usuarios_staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  rol: text('rol'), // 'SUPERADMIN', 'GERENTE_OPERACIONES', 'YARD_PLANNER', 'WATER_CLERK', etc.
  puertoAsignado: text('puerto_asignado'), // 'VE_PCL', 'VE_LGA', 'VE_GUA', 'VE_MAR', 'GLOBAL'
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const configuracionGlobal = pgTable('configuracion_global', {
  llave: text('llave').primaryKey(),
  valorJson: text('valor_json'), // We use text for JSON storage
  ultimaActualizacion: timestamp('ultima_actualizacion').defaultNow(),
});

export const scraperJobsLog = pgTable('scraper_jobs_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  fechaEjecucion: timestamp('fecha_ejecucion').defaultNow(),
  buquesIngestados: integer('buques_ingestados'),
  estado: text('estado'), // 'SUCCESS', 'FAILED', 'TIMEOUT_RENDER'
});

export const usersRelations = relations(users, ({ many }) => ({
  // Define when necessary
}));

export const excepcionesOperativas = pgTable('excepciones_operativas', {
  id: uuid('id').defaultRandom().primaryKey(),
  puertoId: text('puerto_id'), // 'VE_PCL', 'VE_LGA', 'VE_GUA', 'VE_MAR'
  tipoExcepcion: text('tipo_excepcion'), // 'FALLA_SISTEMA_ESTADO', 'CLIMA_ADVERSO', 'PARO_SINDICAL', 'PERDON_COMERCIAL'
  fechaInicio: timestamp('fecha_inicio'),
  fechaFin: timestamp('fecha_fin'),
  justificacion: text('justificacion'),
  gerenteId: uuid('gerente_id').references(() => usuariosStaff.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const excepcionesContenedores = pgTable('excepciones_contenedores', {
  id: uuid('id').defaultRandom().primaryKey(),
  excepcionId: uuid('excepcion_id').references(() => excepcionesOperativas.id),
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  diasGraciaInyectados: integer('dias_gracia_inyectados'),
});

export const muellesPuerto = pgTable('muelles_puerto', {
  id: text('id').primaryKey(), // Ej: 'PCL-MUELLE-24'
  puertoId: text('puerto_id'), // 'VE_PCL', 'VE_LGA', 'VE_GUA', 'VE_MAR'
  caladoOperativoM: decimal('calado_operativo_m'),
  estado: text('estado'), // 'OPERATIVO', 'MANTENIMIENTO', 'CLAUSURADO'
});

export const configVbsGarita = pgTable('config_vbs_garita', {
  puertoId: text('puerto_id').primaryKey(),
  capacidadBaseHora: integer('capacidad_base_hora'),
  ultimaActualizacion: timestamp('ultima_actualizacion').defaultNow(),
});

export const sofEventos = pgTable('sof_eventos', {
  id: uuid('id').defaultRandom().primaryKey(),
  escalaId: text('escala_id').references(() => escalas.id),
  oficialId: uuid('oficial_id').references(() => usuariosStaff.id),
  hitoOperativo: text('hito_operativo'), // 'EOP', 'PILOT_ON_BOARD', 'FIRST_LINE_ASHORE', 'GANGWAY_SECURED', 'COMMENCED_DISCHARGE', 'COMPLETED_DISCHARGE', 'CAST_OFF'
  timestampEvento: timestamp('timestamp_evento', { withTimezone: true }),
  comentarios: text('comentarios'),
});

export const movimientosTally = pgTable('movimientos_tally', {
  id: uuid('id').defaultRandom().primaryKey(),
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  escalaId: text('escala_id').references(() => escalas.id),
  tipoMovimiento: text('tipo_movimiento'), // 'DISCHARGE', 'LOAD', 'RESTOW'
  condicionSello: text('condicion_sello'), // 'INTACTO', 'ROTO', 'FALTANTE'
  danosVisibles: boolean('danos_visibles').default(false),
  timestampMovimiento: timestamp('timestamp_movimiento'),
});

export const rendimientoGruas = pgTable('rendimiento_gruas', {
  id: uuid('id').defaultRandom().primaryKey(),
  escalaId: text('escala_id').references(() => escalas.id),
  gruaId: text('grua_id'),
  tipoRegistro: text('tipo_registro'), // 'UPTIME_INICIO', 'DOWNTIME_INICIO', 'DOWNTIME_FIN'
  codigoDemora: text('codigo_demora'), // 'CLIMA', 'FALLA_MECANICA_GRUA', 'ESPERA_CAMION', 'CAMBIO_CUADRILLA'
  minutosPerdidos: integer('minutos_perdidos'),
});

export const bloquesPatio = pgTable('bloques_patio', {
  id: text('id').primaryKey(), // Ej: 'BLOQUE-A-IMPORTACION'
  puertoId: text('puerto_id'), // 'VE_PCL', etc.
  tipoZona: text('tipo_zona'), // 'IMPORTACION', 'EXPORTACION', 'VACIOS', 'REEFER', 'IMO_PELIGROSOS', 'AFORO_SENIAT', 'VACIADO_LCL'
  capacidadTeus: integer('capacidad_teus'),
});

export const posicionesPatio = pgTable('posiciones_patio', {
  id: uuid('id').defaultRandom().primaryKey(),
  bloqueId: text('bloque_id').references(() => bloquesPatio.id),
  bay: integer('bay'),
  row: integer('row'),
  tier: integer('tier'),
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  enchufeReeferActivo: boolean('enchufe_reefer_activo').default(false),
}, (table) => {
  return {
    uqBloqueBayRowTier: unique().on(table.bloqueId, table.bay, table.row, table.tier)
  };
});

export const equiposPesados = pgTable('equipos_pesados', {
  id: text('id').primaryKey(),
  tipo: text('tipo'), // 'RTG', 'REACH_STACKER', 'MONTACARGAS', 'CHUTO_INTERNO'
  estadoOperativo: text('estado_operativo'), // 'ACTIVO', 'MANTENIMIENTO', 'AVERIA'
  operadorActualId: uuid('operador_actual_id').references(() => usuariosStaff.id),
});

export const ordenesTrabajoPatio = pgTable('ordenes_trabajo_patio', {
  id: uuid('id').defaultRandom().primaryKey(),
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  origenPosId: uuid('origen_pos_id').references(() => posicionesPatio.id),
  destinoPosId: uuid('destino_pos_id').references(() => posicionesPatio.id),
  equipoAsignadoId: text('equipo_asignado_id').references(() => equiposPesados.id),
  tipoManiobra: text('tipo_maniobra'), // 'DESCARGA_A_PATIO', 'PATIO_A_GANDOLA', 'REMOCION_IMPRODUCTIVA', 'POSICIONAMIENTO_AFORO'
  estado: text('estado'), // 'PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'
  timestampCreacion: timestamp('timestamp_creacion').defaultNow(),
  timestampCompletada: timestamp('timestamp_completada'),
});

export const eirInspecciones = pgTable('eir_inspecciones', {
  id: uuid('id').defaultRandom().primaryKey(),
  citaVbsId: uuid('cita_vbs_id'), // Need to make this unique and reference garita_citas, but I'll check if garitaCitas exists later. If not just UUID.
  contenedorBic: text('contenedor_bic').references(() => contenedores.numeroBic),
  inspectorId: uuid('inspector_id').references(() => usuariosStaff.id),
  tipoOperacion: text('tipo_operacion'), // 'GATE_IN_FULL', 'GATE_IN_EMPTY', 'GATE_OUT_FULL', 'GATE_OUT_EMPTY'
  precintosDeclarados: text('precintos_declarados').array(),
  precintosFisicos: text('precintos_fisicos').array(),
  condicionTecho: text('condicion_techo'), // 'OK', 'GOLPEADO', 'ROTO', 'SUCIO'
  condicionPaneles: text('condicion_paneles'),
  condicionPiso: text('condicion_piso'),
  tieneAveriaCritica: boolean('tiene_averia_critica').default(false),
  fotoEvidenciaUrls: text('foto_evidencia_urls').array(),
});

export const transaccionesBancarias = pgTable('transacciones_bancarias', {
  id: uuid('id').defaultRandom().primaryKey(),
  clienteId: uuid('cliente_id').references(() => empresas.id),
  montoVes: decimal('monto_ves'),
  montoUsdEquivalente: decimal('monto_usd_equivalente'),
  tasaBcvAplicada: decimal('tasa_bcv_aplicada'),
  referenciaBancaria: text('referencia_bancaria').unique(),
  bancoOrigen: text('banco_origen'),
  bancoDestino: text('banco_destino'),
  estado: text('estado'), // 'POR_CONCILIAR', 'CONCILIADA', 'RECHAZADA'
});

export const notasCreditoDebito = pgTable('notas_credito_debito', {
  id: uuid('id').defaultRandom().primaryKey(),
  facturaId: uuid('factura_id'), // Can reference facturas_locales if exists
  motivo: text('motivo'), // 'DIFERENCIAL_CAMBIARIO', 'DESCUENTO_COMERCIAL', 'ERROR_FACTURACION'
  montoAjuste: decimal('monto_ajuste'),
});

export const bitacoraCorreccionesBl = pgTable('bitacora_correcciones_bl', {
  id: uuid('id').defaultRandom().primaryKey(),
  blId: text('bl_id'), // Can reference master_bls
  campoModificado: text('campo_modificado'),
  valorAnterior: text('valor_anterior'),
  valorNuevo: text('valor_nuevo'),
  estado: text('estado'), // 'SOLICITADA', 'EN_REVISION_SENIAT', 'APROBADA', 'RECHAZADA'
  multaAsociadaId: uuid('multa_asociada_id'),
});

export const incidentesHse = pgTable('incidentes_hse', {
  id: uuid('id').defaultRandom().primaryKey(),
  escalaId: text('escala_id').references(() => escalas.id),
  tipo: text('tipo'), // 'DERRAME_MARPOL', 'ACCIDENTE_LABORAL', 'CONATO_INCENDIO', 'DANO_A_INFRAESTRUCTURA'
  nivelGravedad: integer('nivel_gravedad'),
  paralizacionOperativa: boolean('paralizacion_operativa').default(false),
});

export const simulacionEscalas = pgTable('simulacion_escalas', {
  id: text('id').primaryKey(),
  imoBuque: integer('imo_buque'),
  estadoSimulado: text('estado_simulado'), // 'EN_NAVEGACION', 'FONDEADO', 'ATRACADO_VIRTUALMENTE'
  etaReal: timestamp('eta_real'),
});

export const simulacionContenedores = pgTable('simulacion_contenedores', {
  id: uuid('id').defaultRandom().primaryKey(),
  simulacionEscalaId: text('simulacion_escala_id').references(() => simulacionEscalas.id),
  bloqueAsignado: text('bloque_asignado'),
  bay: integer('bay'),
  row: integer('row'),
  tier: integer('tier'),
  isGhost: boolean('is_ghost').default(true),
});


