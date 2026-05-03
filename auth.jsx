// Quark Finance — auth.jsx
// Interactive login + i18n dictionary + first-run flag.

const { useState: aState, useEffect: aEffect, useRef: aRef, useCallback: aCb, useMemo: aMemo } = React;

// ─────────────────────────────────────────────────────────────
// i18n
// ─────────────────────────────────────────────────────────────
const Q_I18N = {
  en: {
    'login.eyebrow': 'WELCOME BACK',
    'login.title': 'Sign in to Quark',
    'login.subtitle': 'Your financial intelligence layer.',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.signin': 'Sign in',
    'login.continue': 'Continue with',
    'login.forgot': 'Forgot password?',
    'login.new': 'First time here?',
    'login.create': 'Create account',
    'login.demo': 'Continue as demo',
    'login.secure': 'AES-256 · zero-knowledge · audited Q3 2026',
    'login.tagline': 'See every dollar. Predict every drift.',
    'login.feature.1': 'Synthesize 90 days of transactions',
    'login.feature.2': 'Find leaks before they cost you',
    'login.feature.3': 'Simulate any decision in your digital twin',
    'lang.label': 'Language',
    'common.skip': 'Skip',
    'common.next': 'Next',
    'common.back': 'Back',
    'common.done': 'Done',
    'common.continue': 'Continue',
  },
  es: {
    'login.eyebrow': 'BIENVENIDO DE NUEVO',
    'login.title': 'Inicia sesión en Quark',
    'login.subtitle': 'Tu capa de inteligencia financiera.',
    'login.email': 'Correo',
    'login.password': 'Contraseña',
    'login.signin': 'Iniciar sesión',
    'login.continue': 'Continúa con',
    'login.forgot': '¿Olvidaste tu contraseña?',
    'login.new': '¿Primera vez aquí?',
    'login.create': 'Crear cuenta',
    'login.demo': 'Continuar como demo',
    'login.secure': 'AES-256 · cero-conocimiento · auditado Q3 2026',
    'login.tagline': 'Ve cada dólar. Predice cada desvío.',
    'login.feature.1': 'Sintetiza 90 días de transacciones',
    'login.feature.2': 'Encuentra fugas antes de que te cuesten',
    'login.feature.3': 'Simula cualquier decisión en tu gemelo digital',
    'lang.label': 'Idioma',
    'common.skip': 'Saltar',
    'common.next': 'Siguiente',
    'common.back': 'Atrás',
    'common.done': 'Listo',
    'common.continue': 'Continuar',
  },
};
// ─────────────────────────────────────────────────────────────
// Translation dictionary — English string → Spanish.
// Keys are exact English strings; tr(en) returns translated copy.
// ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  es: {
    'Dashboard':'Panel','Timeline':'Línea de tiempo','AI Copilot':'Copiloto IA','Wallets':'Carteras',
    'Analytics':'Analítica','Predictions':'Predicciones','Digital Twin':'Gemelo Digital',
    'Missions':'Misiones','Risk Radar':'Radar de Riesgo','Quantum Insights':'Insights Cuánticos',
    'AI Models':'Modelos IA','Settings':'Configuración',
    'WORKSPACE / OVERVIEW':'WORKSPACE / RESUMEN','WORKSPACE / SETTINGS':'WORKSPACE / CONFIGURACIÓN',
    'WORKSPACE / WALLETS':'WORKSPACE / CARTERAS','WORKSPACE / ANALYTICS':'WORKSPACE / ANALÍTICA',
    'AI / COPILOT · SESSION 0142':'IA / COPILOTO · SESIÓN 0142',
    'AI / QUANTUM INSIGHTS':'IA / INSIGHTS CUÁNTICOS',
    'INTELLIGENCE / RISK RADAR':'INTELIGENCIA / RADAR DE RIESGO',
    'INTELLIGENCE / DIGITAL TWIN':'INTELIGENCIA / GEMELO DIGITAL',
    'INTELLIGENCE / PREDICTIONS':'INTELIGENCIA / PREDICCIONES',
    'PROGRESSION / MISSIONS':'PROGRESIÓN / MISIONES',
    'INFRASTRUCTURE / AI MODELS':'INFRAESTRUCTURA / MODELOS IA',
    'TIMELINE':'LÍNEA DE TIEMPO',
    'Good evening, Mateo':'Buenas noches, Mateo',
    'Quark synthesized 14 signals while you were away':'Quark sintetizó 14 señales mientras no estabas',
    'Quark · financial reasoning':'Quark · razonamiento financiero',
    '12.4k tokens · 4 tools available':'12.4k tokens · 4 herramientas disponibles',
    'Hidden correlations':'Correlaciones ocultas',
    '47 nodes · 184 edges · drag any sphere · tap to manage':'47 nodos · 184 aristas · arrastra cualquier esfera · toca para gestionar',
    'Active threats & leaks':'Amenazas y fugas activas',
    'Your financial twin · 36mo horizon':'Tu gemelo financiero · horizonte 36 meses',
    'Monte Carlo · 10,000 paths · refreshed nightly':'Monte Carlo · 10,000 caminos · actualizado cada noche',
    'Life event scenarios':'Escenarios de vida',
    'Your financial life · live thread':'Tu vida financiera · hilo en vivo',
    'Transactions, decisions, AI insights, milestones':'Transacciones, decisiones, insights IA, hitos',
    'Active financial missions':'Misiones financieras activas',
    'Multi-provider routing':'Enrutamiento multi-proveedor',
    '6 providers configured · intelligent fallback enabled':'6 proveedores configurados · fallback inteligente activo',
    'All accounts':'Todas las cuentas','Deep analytics':'Analítica profunda',
    'Settings':'Configuración','Workspace · privacy · API · vault':'Workspace · privacidad · API · bóveda',
    'Connect':'Conectar','Ask Quark':'Pregunta a Quark','New thread':'Nuevo hilo','Save all':'Guardar todo',
    'Refresh':'Actualizar','Run scenario':'Correr escenario','Compare':'Comparar','Compare all':'Comparar todo',
    'New scenario':'Nuevo escenario','Run simulation':'Correr simulación','Run refi sim':'Simular refi',
    'Lock rate':'Fijar tasa','Snooze 7d':'Posponer 7d','Cancel now':'Cancelar ya','Downgrade':'Bajar plan',
    'Audit files':'Auditar archivos','Set cap':'Fijar tope','Block weekends':'Bloquear fines',
    'Mute alert':'Silenciar alerta','Connect Wise':'Conectar Wise','Switch card':'Cambiar tarjeta',
    'Tag as expected':'Marcar esperado','Drop Hulu Live':'Bajar Hulu Live','Switch to bundle':'Cambiar a paquete',
    'Keep all':'Conservar todo','Cancel':'Cancelar','Pause 3mo':'Pausar 3 meses',
    'Switch to ClassPass':'Cambiar a ClassPass','Drop rider':'Quitar adicional','Compare quotes':'Comparar cotizaciones',
    'Keep':'Conservar','Last 90d':'Últimos 90d','Resolve all low':'Resolver todos los bajos',
    'Generate mission':'Generar misión','Mark complete':'Marcar completa','Continue':'Continuar',
    'Pin':'Fijar','Edit':'Editar','Export':'Exportar','Find patterns':'Encontrar patrones',
    'Filter by AI':'Filtrar por IA','Onboarding':'Onboarding','Get started':'Comenzar',
    'I already have an account':'Ya tengo cuenta','Vault':'Bóveda','Add provider':'Agregar proveedor',
    'Run fresh scenario · 10k paths':'Correr escenario fresco · 10k caminos',
    'Comparing all profiles':'Comparando todos los perfiles','Browsing completed · 23 total':'Viendo completadas · 23 total',
    'Generating new mission from your patterns…':'Generando misión nueva de tus patrones…',
    'Re-train':'Re-entrenar','Re-training…':'Re-entrenando…',
    'Re-trained on last 90d behavior':'Re-entrenado con comportamiento de últimos 90d',
    'Mission completed · XP awarded':'Misión completa · XP otorgada',
    'Simulate':'Simular','Send':'Enviar',
    'Active':'Activas','Critical':'Críticas','Completed':'Completadas','All':'Todas',
    'ALL':'TODO','HIGH':'ALTO','MED':'MEDIO','LOW':'BAJO',
    'INCOME':'INGRESO','SPEND':'GASTO','RISK':'RIESGO','GOALS':'METAS',
    'Spending':'Gastos','Income':'Ingresos','Merchants':'Comercios',
    'BANK':'BANCO','CREDIT':'CRÉDITO','INVEST':'INVERSIÓN','CRYPTO':'CRYPTO',
    'NET WORTH · USD':'PATRIMONIO · USD','TOTAL · USD':'TOTAL · USD','LIQUID':'LÍQUIDO',
    'DEBT':'DEUDA','CASH FLOW':'FLUJO DE CAJA','BURN':'GASTO',
    'ACCOUNTS':'CUENTAS','ACCOUNT':'CUENTA','SECURITY':'SEGURIDAD',
    'NOTIFICATIONS':'NOTIFICACIONES','DANGER ZONE':'ZONA DE PELIGRO',
    'LIVE PREVIEW':'VISTA EN VIVO','LIVE ROUTING':'ENRUTAMIENTO EN VIVO',
    '24H · CONSUMPTION':'24H · CONSUMO','POLICY':'POLÍTICA','API KEYS':'CLAVES API',
    'CONFIGURED':'CONFIGURADO','RECENT · TODAY':'RECIENTE · HOY',
    'YOUR ARCHETYPE':'TU ARQUETIPO','STATS':'ESTADÍSTICAS',
    'BREAKDOWN':'DESGLOSE','DISTRIBUTION':'DISTRIBUCIÓN',
    'NEURAL FINANCIAL GRAPH':'GRAFO FINANCIERO NEURAL',
    'SYNTHESIZED':'SINTETIZADO','MANAGE NODE':'GESTIONAR NODO',
    'QUARK · WHY THIS MATTERS':'QUARK · POR QUÉ IMPORTA','RECENT':'RECIENTE',
    'ORBITAL SCAN':'SCAN ORBITAL','EXPOSURE · WEIGHTED':'EXPOSICIÓN · PONDERADA',
    'RECOVERABLE · MAX':'RECUPERABLE · MAX','BY CATEGORY':'POR CATEGORÍA',
    'PRIORITY · HIGH':'PRIORIDAD · ALTA','ALL SIGNALS':'TODAS LAS SEÑALES',
    'QUARK · RECOMMENDED FIX':'QUARK · ARREGLO RECOMENDADO',
    'FORECAST CONE · NET WORTH':'CONO FORECAST · PATRIMONIO',
    'STANDARD MODEL':'MODELO ESTÁNDAR','CUSTOM SCENARIO':'ESCENARIO PERSONALIZADO',
    'PSEUDO-MATEO REAL':'PSEUDO-MATEO REAL',
    'DECISION SLIDERS':'SLIDERS DE DECISIÓN',
    'BEHAVIORAL PREDICTIONS':'PREDICCIONES DE COMPORTAMIENTO',
    'TWIN PROFILE':'PERFIL DEL GEMELO','LIFE SCENARIOS':'ESCENARIOS DE VIDA',
    'TIMELINE · IMPACT':'LÍNEA · IMPACTO','THIS MONTH':'ESTE MES','FILTERS':'FILTROS',
    'CONTEXT · ATTACHED':'CONTEXTO · ANEXADO','SUGGESTED PROMPTS':'PROMPTS SUGERIDOS',
    'THREADS':'HILOS','TOOLS · ACTIVE':'HERRAMIENTAS · ACTIVAS',
    'PATRIMONY · WITH FORECAST':'PATRIMONIO · CON FORECAST',
    'PATTERN':'PATRÓN','OPPORTUNITY':'OPORTUNIDAD','GOAL':'META',
    'MONTHLY FLOW':'FLUJO MENSUAL','HEALTH':'SALUD',
    'QUARK · PREVIEW':'QUARK · VISTA','QUANTUM INSIGHTS':'INSIGHTS CUÁNTICOS',
    'Synthesized · last 24h':'Sintetizado · últimas 24h',
    'Sources → Destinations':'Fuentes → Destinos','Financial vitals':'Vitales financieras',
    'Profile':'Perfil','Vault & access':'Bóveda y acceso','What Quark tells you':'Qué te dice Quark',
    'Irreversible':'Irreversible','Live preview · with current settings':'Vista en vivo · con tus ajustes',
    'All wallets':'Todas las carteras','By category':'Por categoría',
    'Where it goes':'A dónde va','Where you actually spend':'Dónde gastas en realidad',
    'Top correlations':'Top correlaciones','What\'s connected to what':'Qué está conectado a qué',
    'Tracked · ranked':'Rastreado · clasificado','Live threat map':'Mapa de amenazas en vivo',
    'Where leaks come from':'De dónde vienen las fugas','Loan #2 · floating rate':'Préstamo #2 · tasa variable',
    'What if you change…':'Qué pasa si cambias…','Your @ +36mo':'Tu @ +36 meses',
    'Custom · @ +36mo':'Personalizado · @ +36 meses','Pseudo-Mateo · @ +36mo':'Pseudo-Mateo · @ +36 meses',
    'Describe what could happen':'Describe qué podría pasar','What you\'ll actually do':'Qué harás en realidad',
    'Pick what you\'re considering':'Elige qué estás considerando','What happens, when':'Qué pasa, cuándo',
    'At a glance':'De un vistazo','Layers':'Capas',
    'Intelligent fallback chain':'Cadena de fallback inteligente',
    '6 providers · 9 models':'6 proveedores · 9 modelos','Routing rules':'Reglas de enrutamiento',
    'Discipline matrix':'Matriz de disciplina',
    'Currency':'Divisa','Language':'Idioma','Risk profile':'Perfil de riesgo',
    'Biometric unlock':'Desbloqueo biométrico','Two-factor auth':'Doble factor',
    'Auto-refresh data':'Auto-actualizar datos','Anonymous telemetry':'Telemetría anónima',
    'Unlock vault':'Abrir bóveda','Export all data':'Exportar mis datos',
    'Clear cache':'Limpiar caché','Delete account':'Eliminar cuenta',
    'Net worth':'Patrimonio','Liquid · USD':'Líquido · USD','Cash flow / mo':'Flujo / mes',
    'Burn rate':'Gasto mensual','Total spend':'Gasto total','Avg / day':'Prom / día',
    'Transactions':'Transacciones','Top category':'Top categoría','Net worth Δ @ 5y':'Δ Patrimonio @ 5a',
    'Net worth Δ @ 10y':'Δ Patrimonio @ 10a','Goal milestone':'Hito meta',
    'Cash reserves drop':'Caída reservas','Mortgage payment':'Pago hipoteca',
    'DCA capacity':'Capacidad DCA','Retire-by':'Jubilar a','Tax bracket shift':'Cambio impositivo',
    'Recovery time':'Tiempo recuperación','Stress index forecast':'Forecast estrés',
    'Career risk':'Riesgo carrera','Emergency fund need':'Fondo emergencia',
    'Insurance update':'Seguro actualizado','529 plan suggested':'529 sugerido',
    'NW needed':'Patrimonio necesario','Required DCA':'DCA requerido',
    'Probability':'Probabilidad','Gap to fix':'Brecha a cerrar',
    'Expected NW @ 5y':'Patrimonio esperado @ 5a','Worst case (P10)':'Peor caso (P10)',
    'Best case (P90)':'Mejor caso (P90)','Volatility':'Volatilidad','Break-even':'Punto equilibrio',
    'Ceiling lift':'Levantar techo','Risk score':'Puntaje riesgo',
    'Tuition':'Matrícula','Opportunity cost':'Costo oportunidad','Income premium':'Premium ingreso',
    'Run forecast':'Correr forecast','Snooze':'Posponer',
    'Skip for now':'Saltar por ahora','Talk to Quark':'Habla con Quark',
    'Enter your finances':'Entra a tus finanzas','Show me':'Muéstrame','Later':'Después',
    '↵ send':'↵ enviar','Ask anything…':'Pregunta lo que sea…',
    'Ask Quark anything…':'Pregunta a Quark lo que sea…',
    'Ask Quark anything · /forecast /explain':'Pregunta a Quark · /forecast /explain',
    'Type a scenario above and Quark will simulate the impact on your twin':
      'Escribe un escenario arriba y Quark simulará el impacto en tu gemelo',
    'No risks in this filter':'Sin riesgos en este filtro',
    'No missions in this filter':'Sin misiones en este filtro',
    'No correlations in':'Sin correlaciones en','category':'categoría',
    'Welcome':'Bienvenida','Profile':'Perfil','Goals':'Metas','Meet Quark':'Conoce a Quark','Done':'Listo',
    'WELCOME':'BIENVENIDA','CONNECT':'CONECTAR','PROFILE':'PERFIL','GOALS':'METAS',
    'MEET QUARK':'CONOCE A QUARK','DONE':'LISTO',
    'Your financial':'Tu salto financiero','quantum leap.':'cuántico.',
    'Let me see':'Déjame ver','your money.':'tu dinero.',
    'Your risk':'Tu perfil','profile.':'de riesgo.',
    'What are you':'¿Qué estás','working toward?':'persiguiendo?',
    'Meet Quark,':'Conoce a Quark,','your AI analyst.':'tu analista IA.',
    'You\'re all set,':'Listo,',
    'Behavioral predictions':'Predicciones de comportamiento',
    'Conservative':'Conservador','Moderate':'Moderado','Aggressive':'Agresivo',
    'Capital preservation':'Preservar capital','Balanced growth':'Crecimiento balanceado','Maximum growth':'Crecimiento máximo',
    'Buy a home':'Comprar casa','Retire early':'Jubilarse pronto','Emergency fund':'Fondo emergencia',
    'Pay off debt':'Pagar deuda','Travel fund':'Fondo viaje','FIRE by 45':'FIRE a los 45',
    'Banking':'Banca','Cards':'Tarjetas','Brokerage':'Brokerage','Loans':'Préstamos','Manual':'Manual',
    'Food':'Comida','Rent':'Renta','Transport':'Transporte','Subscriptions':'Suscripciones',
    'Health':'Salud','Entertainment':'Entretenimiento','Other':'Otro',
    'Mateo Standard':'Mateo Estándar','Personalizado':'Personalizado','Pseudo-Mateo':'Pseudo-Mateo',
    'Sliders + manual scenario':'Sliders + escenario manual',
    'Describe a scenario in words':'Describe un escenario en palabras',
    'AI predicts your real behavior':'IA predice tu comportamiento real',
    'Buy a house':'Comprar casa','Promotion · +30%':'Ascenso · +30%',
    '6-month sabbatical':'Sabático 6 meses','New child':'Nuevo hijo',
    'Early retire @ 50':'Jubilación a 50','25% crypto allocation':'25% en crypto',
    'Career switch':'Cambio de carrera','Master\'s degree':'Maestría',
    'Major life event':'Evento mayor','Income shift':'Cambio de ingreso',
    'Risk-on bet':'Apuesta de riesgo','Long horizon':'Horizonte largo',
    'Chase · Checking':'Chase · Checking','Apple Card':'Apple Card',
    'HYSA · Marcus':'HYSA · Marcus','Fidelity · Taxable':'Fidelity · Imponible',
    'Coinbase':'Coinbase','Vanguard · 401k':'Vanguard · 401k','Cash':'Efectivo',
    'Salary':'Salario','Freelance':'Freelance','Savings rate':'Tasa de ahorro',
    'Stress index':'Índice de estrés','Down payment':'Cuota inicial',
    'Liquidity risk':'Riesgo de liquidez','Index DCA':'DCA Índice',
    'TODAY':'HOY','NOW':'AHORA','yest':'ayer',
    '90d window':'Ventana 90d','Re-synthesize':'Re-sintetizar','Re-synthesizing graph…':'Re-sintetizando grafo…',
    'Window: 90 days':'Ventana: 90 días','Resolving all low signals':'Resolviendo señales bajas',
    'New custom scenario':'Nuevo escenario personalizado',
    'Running fresh scenario · 10k paths':'Corriendo escenario fresco · 10k caminos',
    'Refresh':'Actualizar','Refreshing all · Plaid':'Actualizando todo · Plaid',
    'Quark synthesizing patterns…':'Quark sintetizando patrones…',
    'Export CSV ready':'Export CSV listo','Add account · choose provider':'Agregar cuenta · elegir proveedor',
    'Comparing all scenarios':'Comparando todos los escenarios',
    'Drill into':'Profundizar en','Alert rule':'Regla de alerta',
    'Drill in':'Profundizar','Mute in twin':'Silenciar en gemelo','Track':'Rastrear',
    'tap a sphere':'toca una esfera',
    'Alert rule created':'Regla de alerta creada',
    'Drilling into transactions…':'Profundizando en transacciones…',
    'Excluded from twin':'Excluido del gemelo',
    'Vault unlocked · 142ms':'Bóveda abierta · 142ms',
    'Add account · choose provider · v2':'Agregar cuenta · elegir proveedor',
    'Window: 90d':'Ventana: 90d','Re-synthesizing graph…':'Re-sintetizando grafo…',
    'Comparing all scenarios':'Comparando todos los escenarios',
    'Saved · all changes synced':'Guardado · cambios sincronizados',
    'Avatar updated':'Avatar actualizado','updated':'actualizado',
    'Vault unlocked · 142ms':'Bóveda abierta · 142ms','Cache cleared · 142ms':'Caché limpiada · 142ms',
    'Export started · email when ready':'Exportación iniciada · email cuando esté lista',
    'Account deletion requires email confirmation':'Eliminación requiere confirmación por email',
    'NL → Monte Carlo':'LN → Monte Carlo','Scenario simulated · 10k paths':'Escenario simulado · 10k caminos',
    'simulated':'simulado','behavioral drag −6%':'arrastre comportamiento −6%',
    'STEP':'PASO','REASONING ↓':'RAZONAMIENTO ↓','REASONING TRACE ↓':'TRAZA DE RAZONAMIENTO ↓',
    'New thread':'Nuevo hilo','New thread started':'Hilo nuevo iniciado','SCAN':'SCAN','SCANNING':'ESCANEANDO',
    'simulating':'simulando','Tracked':'Rastreado','ranked':'clasificado',
    'live':'en vivo','manual':'manual','synced':'sincronizado',
    'Real':'Real','Quark forecast (P50)':'Forecast Quark (P50)',
    'Liquidity':'Liquidez','Debt ratio':'Ratio de deuda','Diversif.':'Diversif.','Volatility':'Volatilidad',
    'analyst · terse':'analista · conciso',
    'QUARK SYNTHESIZING':'QUARK SINTETIZANDO',
    'SYNTHESIZING':'SINTETIZANDO',
    'New thread':'Nuevo hilo','THREADS':'HILOS',
    'Ask anything about your finances':'Pregunta lo que sea sobre tus finanzas',
    'P10 · BEAR':'P10 · BAJISTA','P50 · BASE':'P50 · BASE','P90 · BULL':'P90 · ALCISTA',
    'tool · run_forecast':'herramienta · run_forecast',
    'Monte Carlo · 10k paths':'Monte Carlo · 10k caminos',
    'confidence 0.94':'confianza 0.94','confidence 0.91':'confianza 0.91',
    'REASONING TRACE ↓ 4 STEPS · 1.2s':'TRAZA DE RAZONAMIENTO ↓ 4 PASOS · 1.2s',
    '90d transactions':'Transacciones 90d','Portfolio · taxable':'Portafolio · imponible',
    'Goal · house 2026':'Meta · casa 2026','Quark profile':'Perfil Quark',
    'Metric':'Métrica','Spend':'Gasto','Signal':'Señal',
    'Goal':'Meta','Risk':'Riesgo','Asset':'Activo','AI':'IA',
    'Resolved':'Resueltos','low signals':'señales bajas',
    'high':'alto','med':'medio','low':'bajo',
    'if all resolved':'si se resuelven todos',
    'STEPS · {done}/{total}':'PASOS · {done}/{total}',
    'DONE':'HECHO','d remaining':'d restantes',
    'Architect':'Arquitecto','Builder of compounding systems':'Constructor de sistemas compuestos',
    'Consistency':'Consistencia','Precision':'Precisión','Patience':'Paciencia','Adaptability':'Adaptabilidad',
    'healthy':'saludable','REQUEST':'SOLICITUD','ROUTER':'ENRUTADOR','PRIMARY':'PRINCIPAL',
    'traffic':'tráfico','Default':'Por defecto','Reasoning > 4 steps':'Razonamiento > 4 pasos',
    'Bulk classification':'Clasificación masiva','Sensitive (PII)':'Sensible (PII)',
    'Cost cap / day':'Tope costo / día',
    'INITIALIZING':'INICIALIZANDO','READY':'LISTO',
    'Awaiting your data signature.':'Esperando tu firma de datos.','All systems online.':'Todos los sistemas en línea.',
    'Get started':'Comenzar','← Back':'← Atrás',
    'connected':'conectados','goals set':'metas establecidas',
    'QUARK ONLINE · SYNTHESIZING':'QUARK EN LÍNEA · SINTETIZANDO',
    'Hi, Mateo':'Hola, Mateo',
    'on food this week. Want a 60s breakdown?':'en comida esta semana. ¿Quieres un desglose de 60s?',
    'Home':'Inicio','More':'Más',
    'MOBILE PREVIEW · iPhone 14':'VISTA MÓVIL · iPhone 14',
    'Skip · Esc':'Saltar · Esc',
    'Ask Quark or jump to a surface…':'Pregunta a Quark o salta a una superficie…',
    'ESC':'ESC',
    'No surfaces match':'Ninguna superficie coincide','Press ↵ to ask Quark instead.':'Presiona ↵ para preguntar a Quark.',
    'Remember device':'Recordar dispositivo','Verifying…':'Verificando…',
    'Apple':'Apple','Google':'Google','Web3':'Web3',
    'FINANCE / v0.42':'FINANZAS / v0.42',
    'QUARK · ONLINE':'QUARK · EN LÍNEA',
    'QUARK · INDEXING':'QUARK · INDEXANDO',
    'Synthesizing your':'Sintetizando tu',
    'This surface streams from your live data layer. Open it from the spotlight (⌘K) or wait for Quark\'s next pass.':'Esta superficie transmite desde tu capa de datos en vivo. Ábrela desde el spotlight (⌘K) o espera el próximo pase de Quark.',
    'accounts connected':'cuentas conectadas',
    'Quark has already started synthesizing your financial picture.':'Quark ya empezó a sintetizar tu panorama financiero.',
    'trace · 4 sources':'traza · 4 fuentes',
    '14 NEW':'14 NUEVAS',
    'vs last 30d':'vs últimos 30d','last 7d':'últimos 7d','vs avg':'vs promedio','↓ improving':'↓ mejorando',
    'USD · @ now':'USD · @ ahora',
    'across':'en','positive':'positivas',
    'checking + HYSA':'checking + HYSA','card · paid in':'tarjeta · pagada en',
    'account':'cuenta','accounts':'cuentas',
    'txns':'trans','categories · biggest':'categorías · mayor',
    'vs prev':'vs anterior','↑ trending':'↑ tendencia','↓ trending':'↓ tendencia','all-time':'histórico',
    'of total':'del total',
    'last 7 days':'últimos 7 días','last 30 days':'últimos 30 días','last 90 days':'últimos 90 días',
    'last year':'último año','all time':'histórico',
    'Behavioral drag':'Arrastre comportam.','Stress lapses':'Lapsos de estrés',
    'Habit decay':'Decaimiento hábito','Recovery rate':'Tasa recuperación',
    'Predictability':'Predictibilidad','Speed factor':'Factor velocidad',
    'Variance':'Varianza','Confidence':'Confianza','Reach goal':'Alcanzar meta','Re-runs':'Re-ejecuciones',
    'sooner':'antes','later':'después',
    'Free months':'Meses libres','Hours/yr · job':'Horas/año · trabajo',
    'Goal latch':'Meta vinculada',
    'net worth · Nov 2029':'patrimonio · Nov 2029',
    '10,000 PATHS':'10,000 CAMINOS','P50 @ Nov 2029':'P50 @ Nov 2029',
    'behavioral drag −6%':'arrastre comportam. −6%','Δ':'Δ',
    'Monthly DCA':'DCA Mensual','Coffee budget':'Presupuesto café',
    'Equity allocation':'Asignación renta variable','Retirement age':'Edad jubilación',
    'e.g. \'I get promoted in 6 months and increase my DCA 50%\' or \'I take a 6-month sabbatical to travel\'':'ej. \'Me ascienden en 6 meses y aumento mi DCA 50%\' o \'Tomo un sabático de 6 meses para viajar\'',
    'I get promoted, +30% raise':'Me ascienden, +30% aumento',
    'I take a 6-mo sabbatical':'Tomo un sabático de 6 meses',
    'Buy a house at $50k down':'Compro casa con $50k inicial',
    'New baby in 18 months':'Nuevo bebé en 18 meses',
    'I move 20% to crypto':'Muevo 20% a crypto',
    'QUARK · SCENARIO RESULT':'QUARK · RESULTADO ESCENARIO',
    'speed factor':'factor velocidad',
    'Coffee streak persists':'La racha de café persiste',
    '+1 dinner/mo on stress weeks':'+1 cena/mes en semanas estrés',
    'Misses DCA in 2 mos/yr':'Pierde DCA en 2 meses/año',
    'Adds 1 streaming sub/yr':'Agrega 1 sub streaming/año',
    'Vacation overspend in summer':'Sobregasto vacaciones en verano',
    'Q4 gift season +$800':'Temporada regalos Q4 +$800',
    'Down payment goal at 71% complete. Quark estimates close window opens Aug 2026 with current trajectory.':'Meta inicial al 71%. Quark estima ventana de cierre abre Ago 2026 con trayectoria actual.',
    'Based on tenure + role market data, Quark sees 42% probability of promotion in next 6mo. Income +30% would unlock significant DCA.':'Basado en antigüedad + mercado, Quark ve 42% probabilidad de ascenso en próximos 6 meses.',
    'You have a 6-month emergency fund. Taking a sabbatical now would deplete 65% of liquid reserves but is fully feasible.':'Tienes fondo emergencia de 6 meses. Tomar sabático ahora agotaría 65% de reservas líquidas pero es factible.',
    'New dependent adds significant recurring cost. Quark recommends boosting emergency fund to 8mo and adding 529 plan.':'Nuevo dependiente agrega costo recurrente. Quark recomienda aumentar fondo emergencia a 8 meses y agregar plan 529.',
    'Retire-at-50 needs $1.8M nest egg. Current trajectory hits at age 58. Pulling 8 years forward requires 3.2x DCA.':'Jubilar a 50 necesita $1.8M. Trayectoria actual llega a los 58. Adelantar 8 años requiere 3.2x DCA.',
    'Shifting 25% of portfolio to crypto increases expected return but volatility +2.4σ. Worst-case drawdown -42% in 12mo.':'Mover 25% del portafolio a crypto aumenta retorno esperado pero volatilidad +2.4σ. Peor caída -42% en 12 meses.',
    'Lateral move with -15% short-term income but 22% higher 5-year ceiling. Net positive after month 14.':'Movimiento lateral con -15% ingreso corto plazo pero 22% más techo a 5 años. Neto positivo después del mes 14.',
    'Tuition + opportunity cost = $86k. Income premium +25% post-completion. Break-even year 6.':'Matrícula + costo oportunidad = $86k. Premium ingreso +25% post-completación. Equilibrio año 6.',
    'Now':'Ahora',
    'Major':'Mayor','Income':'Ingreso','Horizon':'Horizonte',
    'Life events':'Eventos de vida','Timeline · impact':'Línea · impacto',
    'years':'años',
    'Pseudo-Mateo is trained on your last 90d transactions, sleep correlations, and stress patterns. It predicts the small drifts that compound — the ones you don\'t see coming.':
      'Pseudo-Mateo se entrena con tus últimas 90d de transacciones, correlaciones de sueño y patrones de estrés. Predice los pequeños desvíos que se acumulan — los que no ves venir.',
    'I\'ve already spotted 2 risks and 1 opportunity in your connected accounts. Ready when you are.':'Ya detecté 2 riesgos y 1 oportunidad en tus cuentas conectadas. Listo cuando tú lo estés.',
    'risk · floating rate':'riesgo · tasa variable','opportunity · HYSA':'oportunidad · HYSA','leak · cloud storage':'fuga · almacenamiento nube',
    'Encrypted at rest · zero-knowledge vault':'Cifrados en reposo · bóveda de conocimiento cero',
    'Assumptions: 7.0% nominal CAGR · 0.03% expense ratio · monthly DCA · taxable account.':'Supuestos: 7.0% CAGR nominal · 0.03% ratio de gastos · DCA mensual · cuenta imponible.',
    'Workspace · privacy · API · vault':'Workspace · privacidad · API · bóveda',
    'Daily synthesis':'Síntesis diaria','Each evening · 9pm':'Cada noche · 9pm',
    'Risk signals':'Señales de riesgo','Real-time · high only':'Tiempo real · solo alto',
    'Goal milestones':'Hitos de meta','On every 10% hit':'Cada 10%',
    'Spend anomalies':'Anomalías de gasto','When > 2σ':'Cuando > 2σ',
    'Refi windows':'Ventanas de refi','When opportunity opens':'Al abrir oportunidad',
    'Weekly digest':'Resumen semanal','Sundays · narrative':'Domingos · narrativa',
    'WORKSPACE':'ESPACIO','Level':'Nivel','active':'activas','completed':'completadas',
    'Continuing':'Continuando','pinned to top':'fijada arriba','breaking down sub-tasks':'desglosando subtareas',
    'req':'solicitud','24H':'24H','CONSUMPTION':'CONSUMO',
    'Quark Finance':'Quark Finance',
    "Quark synthesizes your finances using AI — patterns, risks, and opportunities you'd never spot manually.":'Quark sintetiza tus finanzas con IA — patrones, riesgos y oportunidades que nunca detectarías manualmente.',
    "Connect accounts and I'll synthesize 90 days of patterns in under a minute. Read-only. Encrypted.":'Conecta cuentas y sintetizaré 90 días de patrones en menos de un minuto. Solo lectura. Cifrado.',
    'audited Q3 2026':'auditado Q3 2026',
    "Quark adapts every recommendation to your comfort with volatility.":'Quark adapta cada recomendación a tu comodidad con la volatilidad.',
    "Pick your goals. Quark will build a mission plan for each one.":'Elige tus metas. Quark construirá un plan de misión para cada una.',
    "Quark runs continuously in the background — synthesizing insights, spotting risks, and surfacing opportunities before you ask.":'Quark corre continuamente en segundo plano — sintetizando insights, detectando riesgos y surfaced oportunidades antes de que preguntes.',
    'Stats':'Estadísticas',
    'Mobile preview':'Vista móvil','View onboarding':'Ver onboarding',
    'Enter Quark':'Entrar a Quark','FINANCE':'FINANZAS',
    'selected':'seleccionadas','profile':'perfil',
    'Avg':'Prom','day':'día','trending':'tendencia',
    'biggest':'mayor',
  },
  en: {},
};

const QLangContext = React.createContext({ lang: 'en', t: (k)=>k, tr: (en)=>en, setLang: ()=>{} });
function QLangProvider({ children }) {
  const [lang, setLang] = aState(() => localStorage.getItem('quark.lang') || 'en');
  const t = aCb((k) => (Q_I18N[lang] && Q_I18N[lang][k]) || Q_I18N.en[k] || k, [lang]);
  const tr = aCb((en) => {
    if (lang === 'en' || !en) return en;
    const dict = TRANSLATIONS[lang];
    return (dict && dict[en]) || en;
  }, [lang]);
  const set = aCb((l) => {
    setLang(l);
    localStorage.setItem('quark.lang', l);
    try { window.dispatchEvent(new CustomEvent('quark-settings-changed', { detail:{ lang: l } })); } catch {}
  }, []);
  aEffect(() => {
    const onChange = (e) => {
      if (e.detail && e.detail.lang && e.detail.lang !== lang) { setLang(e.detail.lang); }
    };
    window.addEventListener('quark-settings-changed', onChange);
    return () => window.removeEventListener('quark-settings-changed', onChange);
  }, [lang]);
  return <QLangContext.Provider value={{ lang, t, tr, setLang: set }}>{children}</QLangContext.Provider>;
}
function useT() { return React.useContext(QLangContext); }
function useTr() { return React.useContext(QLangContext).tr; }
window.QLangProvider = QLangProvider;
window.useT = useT;
window.useTr = useTr;
window.TRANSLATIONS = TRANSLATIONS;

// ─────────────────────────────────────────────────────────────
// Mouse-reactive ambient field
// ─────────────────────────────────────────────────────────────
function MouseAmbient() {
  const ref = aRef(null);
  aEffect(() => {
    const el = ref.current; if (!el) return;
    let raf, tx = 50, ty = 50, x = 50, y = 50;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
    };
    const tick = () => {
      x += (tx - x) * 0.06; y += (ty - y) * 0.06;
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);
  return (
    <div ref={ref} style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
    }}>
      <div style={{ position:'absolute', inset:0,
        background: 'radial-gradient(circle 600px at var(--mx,50%) var(--my,50%), rgba(157,77,255,0.32), transparent 70%)',
        transition: 'background 0.05s linear',
      }} />
      <div style={{ position:'absolute', inset:0,
        background: 'radial-gradient(circle 900px at calc(100% - var(--mx,50%)) calc(100% - var(--my,50%)), rgba(109,243,255,0.18), transparent 70%)',
      }} />
      <div style={{ position:'absolute', inset:0,
        background: 'radial-gradient(circle 400px at var(--mx,50%) var(--my,50%), rgba(255,122,230,0.16), transparent 65%)',
      }} />
      {/* Grid */}
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:0.10 }}>
        <defs>
          <pattern id="login-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#C084FF" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#login-grid)"/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Animated input
// ─────────────────────────────────────────────────────────────
function QField({ label, type='text', value, onChange, icon, autoFocus }) {
  const [focus, setFocus] = aState(false);
  const has = value && value.length > 0;
  const lifted = focus || has;
  return (
    <label style={{ position: 'relative', display: 'block', marginBottom: 14 }}>
      <div style={{
        position: 'relative',
        background: 'rgba(7,2,15,0.55)',
        border: `1px solid ${focus ? 'rgba(192,132,252,0.65)' : 'var(--q-stroke-2)'}`,
        borderRadius: 12,
        padding: '18px 14px 8px',
        transition: 'all 0.22s cubic-bezier(.2,.8,.2,1)',
        boxShadow: focus ? '0 0 0 3px rgba(157,77,255,0.18), 0 0 24px rgba(157,77,255,0.25)' : 'none',
      }}>
        <span style={{
          position: 'absolute',
          top: lifted ? 6 : 18,
          left: 14,
          fontSize: lifted ? 9.5 : 13,
          letterSpacing: lifted ? '0.18em' : 'normal',
          textTransform: lifted ? 'uppercase' : 'none',
          fontFamily: lifted ? 'Geist Mono, monospace' : 'inherit',
          color: lifted ? 'var(--q-violet-300)' : 'var(--q-text-3)',
          pointerEvents: 'none',
          transition: 'all 0.22s cubic-bezier(.2,.8,.2,1)',
        }}>{label}</span>
        {icon && <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color: focus?'var(--q-violet-300)':'var(--q-text-3)', transition:'color 0.2s' }}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoFocus={autoFocus}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--q-text-1)',
            fontSize: 14,
            fontFamily: 'inherit',
            padding: 0,
          }}
        />
        {/* underline glow */}
        <div style={{
          position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)',
          width: focus ? '90%' : '0%', height: 1.5, borderRadius: 1,
          background: 'linear-gradient(90deg, transparent, #C084FF, transparent)',
          boxShadow: '0 0 8px #9D4DFF',
          transition: 'width 0.32s cubic-bezier(.2,.8,.2,1)',
        }} />
      </div>
    </label>
  );
}

// ─────────────────────────────────────────────────────────────
// Login screen
// ─────────────────────────────────────────────────────────────
function ScreenLogin({ onAuth }) {
  const { t, lang, setLang } = useT();
  const [email, setEmail] = aState('mateo@quark.fi');
  const [pw, setPw] = aState('••••••••••');
  const [loading, setLoading] = aState(false);
  const toast = (typeof useToast === 'function') ? useToast() : (() => {});

  const submit = (e) => {
    e && e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth({ email, mode: 'signin' }); }, 900);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'var(--q-bg-0)',
      overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '1.05fr 1fr',
      animation: 'q-fade-up 0.4s ease-out',
    }}>
      <MouseAmbient />

      {/* Left — visual */}
      <div style={{ position: 'relative', zIndex: 1, padding: 56, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <QLogo size={28} />
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Quark Finance</span>
          <span className="q-chip" style={{ marginLeft: 4 }}>v0.42</span>
          <div style={{ flex: 1 }} />
          <LangSwitch lang={lang} setLang={setLang} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 540, position: 'relative' }}>
          <div className="q-mono" style={{ fontSize: 11, letterSpacing: '0.24em', color: 'var(--q-violet-300)', marginBottom: 18 }}>
            QUARK · FINANCIAL INTELLIGENCE
          </div>
          <h1 style={{ fontSize: 60, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.02, margin: 0, marginBottom: 18,
            background: 'linear-gradient(180deg, #FFFFFF, #C084FF 80%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('login.tagline')}
          </h1>
          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {['login.feature.1','login.feature.2','login.feature.3'].map((k,i) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(157,77,255,0.30), rgba(123,46,255,0.10))',
                  border: '1px solid var(--q-stroke-2)',
                  display: 'grid', placeItems: 'center',
                  boxShadow: '0 0 12px rgba(157,77,255,0.30)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C084FF', boxShadow: '0 0 6px #C084FF' }} />
                </span>
                <span style={{ fontSize: 14, color: 'var(--q-text-2)' }}>{t(k)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating orb */}
        <div style={{ position: 'absolute', right: -120, top: '40%', width: 320, height: 320, pointerEvents: 'none' }}>
          {[180, 240, 320].map((s, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: s, height: s * 0.5, marginLeft: -s/2, marginTop: -s*0.25,
              border: `1px ${i===1?'solid':'dashed'} rgba(192,132,252,${0.30 - i*0.06})`,
              borderRadius: '50%',
              transform: `rotate(${i*30}deg)`,
              animation: `q-orbit ${22 + i*8}s linear ${i%2 ? 'reverse' : ''} infinite`,
            }}>
              <div style={{ position:'absolute', top:-3, left:'50%', width:7, height:7, borderRadius:'50%',
                background: ['#9D4DFF','#6DF3FF','#FF7AE6'][i],
                boxShadow:`0 0 8px ${['#9D4DFF','#6DF3FF','#FF7AE6'][i]}` }} />
            </div>
          ))}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width: 80, height: 80, borderRadius:'50%',
            background:'radial-gradient(circle at 35% 30%, #FFFFFF, #C084FF 30%, #6020E0 70%)',
            boxShadow:'0 0 30px rgba(157,77,255,0.7)',
            animation:'q-pulse 4s ease-in-out infinite',
          }} />
        </div>

        <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <QIcon name="lock" size={11} /> {t('login.secure')}
        </div>
      </div>

      {/* Right — form card */}
      <div style={{ position: 'relative', zIndex: 2, display: 'grid', placeItems: 'center', padding: 40 }}>
        <form onSubmit={submit} className="q-card q-card-elev" style={{
          width: 420, padding: 36, borderRadius: 20,
          background: 'linear-gradient(180deg, rgba(11,6,23,0.85), rgba(11,6,23,0.92))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 0 1px rgba(192,132,252,0.20), 0 30px 80px rgba(0,0,0,0.5), 0 0 80px rgba(157,77,255,0.15)',
          animation: 'q-fade-up 0.5s 0.1s both cubic-bezier(.2,.8,.2,1)',
        }}>
          <div className="q-mono q-eyebrow-violet" style={{ fontSize: 10.5, letterSpacing: '0.22em', marginBottom: 8 }}>
            {t('login.eyebrow')}
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 6px' }}>
            {t('login.title')}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--q-text-3)', margin: '0 0 22px' }}>{t('login.subtitle')}</p>

          <QField label={t('login.email')} value={email} onChange={setEmail} type="email" autoFocus
            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M2.5 4.5L8 9 13.5 4.5"/></svg>} />
          <QField label={t('login.password')} value={pw} onChange={setPw} type="password"
            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2"/></svg>} />

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 4, marginBottom: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, border: '1px solid var(--q-stroke-2)', background:'rgba(157,77,255,0.14)', display:'grid', placeItems:'center' }}>
                <QIcon name="check" size={9}/>
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--q-text-3)' }}>Remember device</span>
            </label>
            <button type="button" onClick={()=>toast('Reset link sent to ' + email)} className="q-btn q-btn-ghost" style={{ padding:'4px 8px', fontSize: 11.5, border:'none' }}>
              {t('login.forgot')}
            </button>
          </div>

          <button type="submit" disabled={loading} className="q-btn q-btn-primary" style={{
            width: '100%', padding: '12px 16px', fontSize: 13.5, justifyContent: 'center',
            opacity: loading ? 0.7 : 1, cursor: loading?'progress':'pointer',
            position: 'relative', overflow: 'hidden',
          }}>
            {loading ? (<><span className="q-pulse-dot"/> Verifying…</>) : (<>{t('login.signin')} <QIcon name="arrow-right" size={12}/></>)}
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0 14px' }}>
            <span style={{ flex:1, height:1, background:'var(--q-stroke-1)' }}/>
            <span className="q-mono" style={{ fontSize:10, letterSpacing:'0.18em', color:'var(--q-text-3)' }}>{t('login.continue')}</span>
            <span style={{ flex:1, height:1, background:'var(--q-stroke-1)' }}/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { k:'apple', l:'Apple', svg: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11.4 8.5c0-1.5 1.2-2.2 1.3-2.3-0.7-1-1.8-1.2-2.2-1.2-0.9-0.1-1.8 0.5-2.3 0.5-0.5 0-1.2-0.5-2-0.5-1 0-2 0.6-2.5 1.5-1.1 1.9-0.3 4.6 0.7 6.1 0.5 0.7 1.1 1.5 1.9 1.5 0.8 0 1-0.5 2-0.5 1 0 1.2 0.5 2 0.5 0.8 0 1.4-0.7 1.9-1.5 0.6-0.9 0.9-1.7 0.9-1.7-0.1 0-1.7-0.7-1.7-2.4zM10 4c0.4-0.5 0.7-1.2 0.6-2-0.6 0-1.4 0.4-1.8 0.9-0.4 0.4-0.8 1.2-0.7 1.9 0.7 0.1 1.4-0.4 1.9-0.8z"/></svg> },
              { k:'google', l:'Google', svg: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14.4 8.2c0-0.5 0-1-0.1-1.4H8v2.6h3.6c-0.2 0.9-0.6 1.6-1.4 2.1v1.7h2.2c1.3-1.2 2-2.9 2-5z"/><path d="M8 14.5c1.9 0 3.5-0.6 4.6-1.7l-2.2-1.7c-0.6 0.4-1.4 0.7-2.4 0.7-1.8 0-3.4-1.2-3.9-2.9H1.8v1.8C2.9 12.9 5.3 14.5 8 14.5z"/><path d="M4.1 9c-0.1-0.4-0.2-0.8-0.2-1.2 0-0.4 0.1-0.8 0.2-1.2V4.7H1.8C1.3 5.6 1 6.7 1 7.8s0.3 2.2 0.8 3.1L4.1 9z"/><path d="M8 4.1c1 0 2 0.4 2.7 1l2-2C11.5 2 9.9 1.5 8 1.5c-2.7 0-5.1 1.6-6.2 3.9l2.3 1.8C4.6 5.4 6.2 4.1 8 4.1z"/></svg> },
              { k:'wallet', l:'Web3', svg: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M11 8h2"/></svg> },
            ].map(p => (
              <button key={p.k} type="button" onClick={()=>toast(`Auth via ${p.l} · sandbox`)} className="q-btn q-btn-ghost"
                style={{ padding:'10px 8px', fontSize: 11.5, justifyContent:'center', gap:6 }}>
                {p.svg} {p.l}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px dashed var(--q-stroke-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11.5, color: 'var(--q-text-3)' }}>{t('login.new')}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={()=>{ localStorage.removeItem('quark.firstrun'); onAuth({email:'demo@quark.fi', mode: 'create'}); }} className="q-btn q-btn-ghost" style={{ padding:'5px 10px', fontSize:11.5 }}>
                {t('login.create')}
              </button>
              <button type="button" onClick={()=>onAuth({email:'demo@quark.fi', mode: 'demo'})} className="q-btn" style={{ padding:'5px 10px', fontSize:11.5 }}>
                {t('login.demo')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function LangSwitch({ lang, setLang }) {
  return (
    <div style={{ display:'flex', gap:3, background:'rgba(7,2,15,0.5)', padding:3, borderRadius:8, border:'1px solid var(--q-stroke-1)' }}>
      {[['en','EN'],['es','ES']].map(([k,l])=>(
        <button key={k} onClick={()=>setLang(k)} className="q-btn q-btn-ghost"
          style={{ padding:'4px 10px', fontSize:10.5, border:'none', fontWeight:500,
            background: lang===k?'rgba(157,77,255,0.22)':'transparent',
            color: lang===k?'var(--q-violet-300)':'var(--q-text-3)' }}>{l}</button>
      ))}
    </div>
  );
}

window.ScreenLogin = ScreenLogin;
window.LangSwitch = LangSwitch;
