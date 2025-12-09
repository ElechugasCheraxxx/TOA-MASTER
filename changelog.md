
#### v1.0 (Public Release) - Lanzamiento Público (Basado en v9.0 Beta)
- **Fecha aproximada**: Diciembre 2025 (post-beta).
- **Cambios principales**:
  - Estabilización final: Corrección de bugs menores en la extracción de datos (e.g., regex para campos como coordenadas o DNI técnico).
  - Optimizaciones: Reducción de timeouts en inicialización (de 5000ms a 3000ms) para carga más rápida en páginas lentas de Oracle.
  - Documentación: Añadido de comentarios en código para maintainers y un README implícito en el header (@description expandida).
  - Mejoras menores en UI: Botones con tooltips para campos opcionales y validación básica de inputs (e.g., alertas si campos requeridos están vacíos).
  - No hay cambios estructurales mayores respecto a v9.0; enfocado en usabilidad pública.
- **Notas**: Esta es la versión estable para distribución. Recomendación: Pruebas en producción con usuarios reales de Claro Perú.

#### v9.0 (Beta Final Completo)
- **Fecha aproximada**: Noviembre 2025.
- **Cambios principales**:
  - **DB Expandida**: Nueva estructura jerárquica para `codigosMantenimiento` con "escenarios" (esc) detallados (e.g., CLIENTE, DERIVADO, CAMBIO DE EQUIPO). Añadidos códigos adicionales como AB09-AB11, DE06-DE09, EQ04-EQ18, etc. (más de 50 códigos totales).
  - **Rechazo Técnico Avanzado**: Nueva subcategoría en 'rechazo' para rechazos en campo por motivos técnicos (e.g., Ductos Saturados, TAP Saturado, Factibilidad Técnica). Incluye plantillas específicas con coordenadas, DNI técnico y observaciones automáticas.
  - **Extracción Mejorada**: Regex más precisos para campos como coordenadas cliente/técnico, DNI técnico y tecnología (FTTH/HFC). Auto-detección de tipo de rechazo basada en inputs.
  - **UI Dinámica**: Formularios condicionales para rechazo técnico (e.g., inputs para coordenadas, DNI). Mejora en selects anidados para reproMotivos y rechazoMotivos.
  - **Generación de Plantillas**: Soporte para observaciones automáticas en rechazos (e.g., "PROCEDE RECHAZO, realizar quiebre en TOA"). Formato DD/MM/AAAA estandarizado en fechas.
  - **Fixes**: Corrección de truncamientos en DB (e.g., motivos completos sin "...(truncated)").
- **Notas**: Versión más completa hasta la fecha. Enfocada en cubrir todos los escenarios de TOA (instalación, postventa, mantenimiento, rechazo técnico). Ideal para beta testing.

#### v8.5 (Final Completo)
- **Fecha aproximada**: Noviembre 2025.
- **Cambios principales**:
  - **DB Jerárquica**: Estructura mejorada para `reproMotivos` con subcategorías como "Errores en la generación de la SOT" y "Inconvenientes con la contrata/ista". Añadidos submotiveos detallados (e.g., "Falta de materiales. Detallar material").
  - **Rechazo Técnico Inicial**: Introducción de plantillas para rechazos en campo por motivos técnicos (e.g., Ductos Saturados, TAP Saturado). Incluye campos para técnico, DNI y coordenadas.
  - **UI**: Selects anidados para reproMotivos (MESA/CAMPO > Origen > Motivo). Inputs condicionales para submotiveos específicos.
  - **Generación**: Plantillas con placeholders automáticos para coordenadas y observaciones. Mejora en formato de fechas (DD/MM/AAAA).
  - **Fixes**: Corrección de lógica en rechazo por duplicidad y mala oferta (añadidos campos para paquetes ingresado/correcto).
- **Notas**: Enfoque en rechazos complejos y reprogramaciones. DB crece a ~40% más detallada que v8.0.

#### v8.0 (Final Actualizado)
- **Fecha aproximada**: Noviembre 2025.
- **Cambios principales**:
  - **DB Estructurada**: Jerarquía para `reproMotivos` (MESA/CAMPO > CLARO/CLIENTE > Subcategorías). Añadidos motiveos como "Retiro anticipado de cuadrillas" y "Problemas con SVA".
  - **Reprogramaciones Avanzadas**: Soporte para scopes (MESA/CAMPO) y reagendado por (CLARO/CLIENTE). Formato de fechas con franjas (AM1/PM2).
  - **UI**: Formularios dinámicos con date pickers para fechas y selects para franjas. Botón de copiado con feedback temporal ("¡Copiado!").
  - **Generación**: Plantillas para rechazo con submotiveos automáticos (e.g., duplicidad añade "SE ATENDIÓ CON SOT"). Añadido soporte para fraude con customer ID.
  - **Fixes**: Mejora en extracción de campos (regex para ID Agenda, Habilidad).
- **Notas**: Primera versión "final" con DB jerárquica. Enfocada en escalabilidad para más motiveos.

#### v7.0 / v6.0 (Input Box Edition) - Varias iteraciones
- **Fecha aproximada**: Noviembre 2025.
- **Cambios principales**:
  - **Inputs Interactivos**: Transición a formularios con inputs de texto (e.g., DNI, serie, MAC para activación). Eliminación de edición manual en plantillas.
  - **DB Inicial**: Listas para contratas, codigosMantenimiento (26 códigos), reproMotivos (CLARO/CLIENTE) y rechazoMotivos (MESA/CAMPO con submotiveos).
  - **UI**: Panel flotante con categorías (seguimiento, rechazo, repro, activacion, fueratoa). Selects dinámicos y condicionales (e.g., para tipo de seguimiento).
  - **Generación**: Plantillas con auto-relleno (e.g., ciclo de llamadas, habilitar franja). Soporte para GM_setValue para persistencia de ADP name.
  - **Fixes**: Corrección de truncamientos en DB; añadido de estilos con GM_addStyle.
- **Notas**: Versión que introduce inputs dinámicos y DB estructurada. Dos variantes similares (con y sin "(1)").

#### v4.0 (Pro y Avanzado) - Varias iteraciones
- **Fecha aproximada**: Noviembre 2025.
- **Cambios principales**:
  - **DB Básica**: Introducción de contratas, codigosMantenimiento (~26 códigos), reproMotivos y rechazoMotivos iniciales.
  - **Detección Avanzada**: Auto-detección de tipo de orden (instalacion/postventa/mantenimiento) basado en subTipo/habilidad. Auto-generación de franja desde SLA.
  - **UI**: Panel flotante con toggle, copiar y regenerar. Submenús dinámicos para categorías. Notificaciones temporales.
  - **Generación**: Plantillas para seguimiento, rechazo, repro, activacion y fueratoa. Auto-completado de campos TOA (e.g., Whatsapp).
  - **Avanzado**: Añadido de observer para cambios en DOM (actualización automática). Más submotiveos en rechazo (e.g., oferta, mudanza).
  - **Fixes**: Mejora en regex para extracción (e.g., distrito, SLA inicio/fin).
- **Notas**: Enfoque en automatización. "Pro" es base; "Avanzado" añade detección dinámica.

#### v3.0 (Completo y con Panel de Botones)
- **Fecha aproximada**: Noviembre 2025.
- **Cambios principales**:
  - **UI Flotante**: Panel de botones (abrir/cerrar, copiar, regenerar). Estilos modernos (gradientes, shadows).
  - **Extracción Mejorada**: Regex para más campos (distrito, franja, SLA, codCliente, idAgenda, subTipo).
  - **Generación**: Plantillas para seguimiento (confirma/adelanto), rechazo (cliente/duplicidad). Auto-relleno completo.
  - **Con Panel**: Versión simplificada con menos categorías, enfocada en usabilidad básica.
  - **Fixes**: Detección de vista de actividad vía DOM query.
- **Notas**: Primera versión con panel flotante y notificaciones. Enfoque en simplicidad.

#### v2.0 (Institucional Inicial)
- **Fecha aproximada**: Noviembre 2025.
- **Cambios principales**:
  - **Inicial**: Extracción básica de campos (SOT, cliente, telefono, tecnico, estado, direccion, franja) vía regex.
  - **UI**: Panel flotante simple con botones (abrir/cerrar, copiar, regenerar). Select para categorías (instalacion, postventa, mantenimiento, seguimiento, rechazo).
  - **Generación**: Plantillas dinámicas básicas con auto-relleno (e.g., confirma visita).
  - **Submenús**: Iniciales para seguimiento (confirma/adelanto/mantiene/franja/fuera/ciclo) y rechazo (cliente/duplicidad/facilidades/etc.).
- **Notas**: Versión base. Sin DB estructurada; todo hardcoded.

---

#### Notas Generales del Proyecto
- **Evolución Principal**: De un generador simple (v2.0-3.0) a uno avanzado con DB jerárquica (v8.0+), enfocándose en cubrir todos los escenarios de Claro Perú (TOA/OFSC).
- **Dependencias**: Todas usan Tampermonkey; v6.0+ añaden GM_* para storage y styles.
- **Pendientes para Futuras Versiones**: Integración con API de Oracle (si posible), export a PDF, o soporte móvil.
- **Fuentes**: Basado en análisis de los documentos proporcionados. Si hay más archivos o detalles, el changelog puede refinarse.
