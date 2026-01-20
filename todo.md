# ResiPlus Clone - Lista de Tareas

## Fase 1: Arquitectura de Base de Datos
- [x] Diseñar esquema de tabla de residentes
- [x] Diseñar esquema de tabla de habitaciones y camas
- [x] Diseñar esquema de tabla de constantes vitales
- [x] Diseñar esquema de tabla de escalas de valoración
- [x] Diseñar esquema de tabla de medicamentos y pautas
- [x] Diseñar esquema de tabla de observaciones de enfermería
- [x] Implementar esquema en drizzle/schema.ts
- [x] Ejecutar migración de base de datos

## Fase 2: Gestión de Residentes y Habitaciones
- [x] Crear procedimientos tRPC para CRUD de residentes
- [x] Crear procedimientos tRPC para CRUD de habitaciones
- [x] Implementar helpers de base de datos en server/db.ts
- [x] Crear página de listado de residentes
- [ ] Crear formulario de alta de residente (Funcionalidad disponible en futuras versiones)
- [ ] Crear formulario de edición de residente (Funcionalidad disponible en futuras versiones)
- [ ] Crear página de ficha completa de residente (Funcionalidad disponible en futuras versiones)
- [x] Implementar búsqueda y filtrado de residentes
- [x] Crear página de gestión de habitaciones
- [ ] Implementar asignación de camas a residentes (Funcionalidad disponible en futuras versiones)

## Fase 3: Módulo de Enfermería
- [x] Crear procedimientos tRPC para registro de constantes vitales
- [x] Crear procedimientos tRPC para escalas de valoración
- [x] Implementar historial de constantes por residente
- [ ] Crear formulario de registro de TA, FC, FR, SaO2
- [ ] Crear formulario de registro de Temperatura y Glucosa
- [ ] Crear formulario de registro de Peso
- [ ] Implementar escala de Barthel
- [ ] Implementar escala de Norton
- [ ] Crear vista de historial de constantes con gráficos
- [ ] Crear sistema de observaciones de enfermería

## Fase 4: Gestión de Medicamentos
- [x] Crear procedimientos tRPC para CRUD de medicamentos
- [x] Implementar sistema de pautas de administración
- [ ] Crear formulario de alta de medicamento
- [ ] Implementar selector de días de semana (L-D)
- [ ] Implementar selector de horarios
- [ ] Implementar tipos de pauta (Aguda/Crónica)
- [ ] Implementar vías de administración
- [ ] Crear vista de plan farmacológico por residente
- [ ] Crear historial de medicamentos

## Fase 5: Interfaz de Usuario
- [x] Diseñar y crear componente de navegación lateral
- [x] Implementar estructura de módulos principales
- [x] Crear dashboard principal
- [x] Implementar tema visual profesional sanitario
- [x] Crear componente de búsqueda avanzada
- [x] Implementar filtros múltiples para residentes
- [x] Optimizar responsive design
- [x] Añadir iconos y elementos visuales

## Fase 6: Pruebas y Entrega
- [x] Escribir tests unitarios para procedimientos críticos
- [x] Probar flujos completos de usuario
- [x] Verificar integridad de datos
- [x] Crear checkpoint final
- [x] Generar documentación de usuario
- [x] Preparar guía de instalación

## Nuevas Funcionalidades - Formularios de Residentes

### Formulario de Alta de Residente
- [ ] Crear componente de formulario con react-hook-form y zod
- [ ] Implementar campos de datos personales (NIF, NSS, nombre, apellidos, fecha nacimiento)
- [ ] Implementar campos de admisión y ubicación
- [ ] Implementar campos de contacto y emergencia
- [ ] Añadir validación de campos obligatorios
- [ ] Integrar con selector de habitaciones disponibles
- [ ] Crear página de nuevo residente
- [ ] Conectar con procedimiento tRPC de creación

### Formulario de Edición de Residente
- [ ] Crear página de edición de residente
- [ ] Cargar datos existentes del residente
- [ ] Permitir modificación de todos los campos
- [ ] Implementar procedimiento tRPC de actualización
- [ ] Añadir botón de edición en listado de residentes
- [ ] Implementar navegación entre ficha y edición

### Validación y UX
- [ ] Validar formato de NIF español
- [ ] Validar formato de NSS
- [ ] Mostrar mensajes de error claros
- [ ] Implementar feedback de éxito/error
- [ ] Añadir confirmación antes de guardar cambios


## Completado - Formularios de Alta y Edición (16 Ene 2026)

- [x] Añadir campos médicos al esquema de base de datos (medicalNotes, allergies, specialNeeds)
- [x] Ejecutar migración de base de datos
- [x] Crear componente ResidentForm con validación completa
- [x] Implementar página de nuevo residente (/residents/new)
- [x] Implementar página de edición de residente (/residents/:id/edit)
- [x] Crear procedimientos tRPC para create y update
- [x] Integrar formularios con sistema de habitaciones
- [x] Añadir botones de navegación en listado de residentes
- [x] Escribir tests unitarios para CRUD de residentes
- [x] Todos los tests pasan correctamente (7/7)


## Rediseño Interfaz Estilo Windows Clásico (16 Ene 2026)

### Barra de Menú Superior
- [x] Crear componente MenuBar con menús desplegables
- [x] Implementar menú "Archivo" (Nuevo, Abrir, Guardar, Salir)
- [x] Implementar menú "Residentes" (Nuevo Residente, Listado, Buscar)
- [x] Implementar menú "Enfermería" (Constantes, Escalas, Medicamentos, Notas)
- [x] Implementar menú "Habitaciones" (Gestión de Habitaciones, Asignaciones)
- [x] Implementar menú "Herramientas" (Configuración, Preferencias)
- [x] Implementar menú "Ayuda" (Manual, Acerca de)

### Barra de Herramientas
- [x] Crear barra de herramientas con iconos de acceso rápido
- [x] Añadir botones: Nuevo Residente, Guardar, Buscar, Imprimir
- [x] Implementar tooltips en botones de herramientas

### Layout Principal
- [x] Crear WindowsLayout component (reemplaza DashboardLayout)
- [x] Implementar área de trabajo central estilo Windows
- [x] Añadir barra de estado inferior con información del sistema
- [x] Aplicar estilos visuales tipo Windows (bordes, sombras, colores)

### Adaptación de Páginas
- [x] Adaptar Home/Dashboard al nuevo layout
- [x] Adaptar página de Residentes al nuevo layout
- [x] Adaptar página de Habitaciones al nuevo layout
- [x] Adaptar formularios de alta/edición al nuevo layout
- [x] Eliminar o adaptar navegación lateral

### Estilos y UX
- [x] Aplicar paleta de colores estilo Windows clásico
- [x] Ajustar tipografía para mayor legibilidad
- [x] Implementar comportamiento de menús desplegables al hover/click
- [ ] Añadir atajos de teclado (Alt+F para Archivo, etc.)


## Corrección de Errores en Páginas (16 Ene 2026)

- [ ] Identificar páginas que no cargan correctamente
- [ ] Revisar errores en consola del navegador
- [ ] Corregir imports y referencias rotas
- [ ] Verificar que todas las rutas funcionan correctamente
- [ ] Probar navegación entre páginas


## Análisis Exhaustivo de ResiPlus para Clon Fiel (16 Ene 2026)

### ANÁLISIS COMPLETADO - Elementos clave identificados
- [x] Analizar imágenes clave de ResiPlus
- [x] Identificar navegación principal horizontal
- [x] Identificar árbol de navegación lateral
- [x] Identificar estructura de Enfermería
- [x] Identificar tipos de controles vitales
- [x] Identificar estructura de tablas y formularios

## Reconstrucción Fiel de ResiPlus - En Progreso

### Análisis de Imágenes
- [ ] Analizar las 172 imágenes sistemáticamente
- [ ] Documentar estructura de menús y navegación exacta
- [ ] Identificar todas las pantallas principales
- [ ] Documentar colores, fuentes y estilos exactos
- [ ] Mapear flujos de trabajo de enfermería
- [ ] Identificar todos los formularios y campos
- [ ] Documentar tablas y listados

### Rediseño Visual Exacto
- [ ] Replicar paleta de colores exacta de ResiPlus
- [ ] Implementar tipografía idéntica
- [ ] Recrear iconografía y elementos visuales
- [ ] Ajustar espaciados y márgenes
- [ ] Implementar bordes y sombras exactos

### Navegación y Menús
- [ ] Replicar estructura de menús exacta
- [ ] Implementar árbol de navegación idéntico
- [ ] Recrear breadcrumbs y rutas
- [ ] Implementar atajos de teclado de ResiPlus

### Formularios y Pantallas
- [ ] Recrear ficha de residente idéntica
- [ ] Implementar formulario de constantes vitales exacto
- [ ] Recrear escalas de valoración (Barthel, Norton)
- [ ] Implementar gestión de medicamentos fiel
- [ ] Recrear notas de enfermería
- [ ] Implementar todos los campos y validaciones

### Flujos de Trabajo
- [ ] Implementar flujo de alta de residente
- [ ] Implementar flujo de registro de constantes
- [ ] Implementar flujo de administración de medicamentos
- [ ] Implementar flujo de escalas de valoración
- [ ] Implementar flujo de notas de enfermería


### Fase 1: Navegación Principal (CRÍTICO)
- [x] Crear barra de módulos horizontal: RESIDENTES, FARMACIA, COMERCIAL, PERSONAL, PROVEEDORES, ALMACENES, ECONÓMICO, CALIDAD, CONFIGURACIÓN, SEGURIDAD, PLANIFICADOR, SERVICIOS GENERALES, AYUDA
- [x] Implementar segunda fila con iconos grandes y texto descriptivo
- [x] Crear componente de árbol de navegación lateral colapsable
- [x] Implementar secciones: General, Económico, Farmacia, ACP, Médico, Enfermería, Trabajador Social, Psicólogo, etc.

### Fase 2: Módulo de Enfermería (PRIORIDAD MÁXIMA)
- [x] Crear subsección "Controles" con lista desplegable de tipos
- [x] Implementar tipos de controles: Control TA, Control FC, Control FR, Control peso, Control SatO2, Control tª, Control diuresis, Control deposición, etc.
- [x] Crear subsección "Escalas" (Barthel, Norton, etc.)
- [ ] Crear subsección "Seguimiento"
- [ ] Crear subsección "Valoración de Cuidado"
- [ ] Crear subsección "Valoraciones"
- [ ] Crear subsección "Informes"
- [ ] Crear subsección "Documentos"
- [ ] Crear subsección "Observaciones"

### Fase 3: Formularios de Controles Vitales
- [ ] Crear formulario de Control TA (sistólica/diastólica)
- [ ] Crear formulario de Control FC
- [ ] Crear formulario de Control FR
- [ ] Crear formulario de Control peso
- [ ] Crear formulario de Control SatO2
- [ ] Crear formulario de Control temperatura
- [ ] Implementar opciones de filtrado: "Mostrar datos entre fechas", "Mostrar los últimos 10 datos", "Mostrar los últimos 25 datos"
- [ ] Implementar selectores de fecha con formato largo

### Fase 4: Gestión de Medicamentos (Estilo ResiPlus)
- [ ] Recrear ventana modal "Elaboración de un nuevo tratamiento"
- [ ] Implementar tabla con checkboxes para días de la semana (L M X J V S D)
- [ ] Añadir columnas: Desde, H.Desde, Hasta, H.Hasta, Descripción, Pauta Especial, Tipo Medicación, Vía, Unidad, Patología
- [ ] Implementar sistema de colores: verde claro para activos, amarillo para destacados
- [ ] Añadir campo de alergias con scroll

### Fase 5: Tablas y Listados
- [ ] Implementar filas alternadas (blanco/azul claro #D9EAF7)
- [ ] Añadir categorías expandibles/colapsables con iconos ▼/▶
- [ ] Implementar scroll horizontal y vertical
- [ ] Añadir barra de herramientas: Actualizar, Exportar, Organización, Cerrar

### Fase 6: Datos del Residente (Siempre Visible)
- [ ] Crear sección superior fija con: Código, NIF, NSS, NSIP, Nombre, Tipología, Est.Civil, Habitación, Lugar Nac., F.Nacimiento, Sexo, Edad, F.Ingreso, Cama, Ult.Ingreso
- [ ] Mantener visible en todas las pantallas del módulo de residente

### Fase 7: Estilos Visuales Exactos
- [x] Replicar azul oscuro de barra superior (#1B5A9E)
- [x] Implementar azul claro para filas alternadas (#D9EAF7)
- [ ] Usar verde claro para estados activos (#E0FFE0)
- [ ] Usar amarillo claro para elementos destacados
- [ ] Implementar gris claro para navegación lateral
- [ ] Ajustar fuentes y tamaños de texto



## Continuación - Funcionalidades de Enfermería (16 Ene 2026)

### Formularios de Registro de Constantes Vitales
- [x] Crear diálogo modal para registro de Control TA (sistólica/diastólica)
- [x] Crear diálogo modal para registro de Control FC
- [x] Crear diálogo modal para registro de Control FR
- [x] Crear diálogo modal para registro de Control peso
- [x] Crear diálogo modal para registro de Control SatO2
- [x] Crear diálogo modal para registro de Control temperatura
- [x] Implementar validación de rangos normales para cada constante
- [x] Añadir campo de observaciones en cada formulario
- [x] Implementar guardado de constantes en base de datos

### Escalas de Valoración
- [x] Crear página de Escalas de Valoración
- [x] Implementar Escala de Barthel completa con 10 ítems
- [x] Implementar Escala de Norton completa con 5 ítems
- [x] Calcular automáticamente puntuación total
- [x] Mostrar interpretación según rangos (Barthel: 0-20 dependencia total, 21-60 grave, 61-90 moderada, 91-99 leve, 100 independiente)
- [x] Mostrar interpretación Norton (≤12 riesgo alto, 13-14 riesgo medio, >14 riesgo bajo)
- [x] Guardar escalas en base de datos con fecha de evaluación
- [ ] Mostrar historial de escalas por residente

### Datos del Residente Siempre Visible
- [ ] Crear componente ResidentHeader con datos principales
- [ ] Mostrar: Código, NIF, NSS, NSIP, Nombre, Tipología, Estado Civil, Habitación
- [ ] Mostrar: Lugar Nacimiento, F.Nacimiento, Sexo, Edad, F.Ingreso, Cama, Último Ingreso
- [ ] Integrar ResidentHeader en todas las páginas de enfermería
- [ ] Mantener visible al hacer scroll (sticky header)


## Continuación - Gestión de Medicamentos y Funcionalidades Avanzadas (16 Ene 2026)

### Gestión de Medicamentos
- [x] Crear página de Medicamentos por residente
- [x] Implementar formulario de nuevo medicamento
- [x] Añadir campos: nombre, principio activo, dosis, vía de administración
- [x] Implementar selector de días de semana (L, M, X, J, V, S, D)
- [x] Implementar selector de horarios múltiples
- [x] Añadir tipo de pauta (aguda/crónica)
- [x] Crear tabla de medicamentos activos con filtros
- [x] Implementar edición y eliminación de medicamentos
- [x] Guardar pautas en base de datos

### Historial Temporal y Gráficos
- [ ] Crear componente de gráfico de líneas para constantes vitales
- [ ] Implementar gráfico de evolución de TA (sistólica/diastólica)
- [ ] Implementar gráfico de evolución de peso
- [ ] Implementar gráfico de evolución de glucosa
- [ ] Añadir selector de rango de fechas
- [ ] Mostrar valores mínimo, máximo y promedio
- [ ] Integrar gráficos en página de Controles

### Ficha Completa del Residente
- [ ] Crear página ResidentProfile con pestañas
- [ ] Implementar pestaña "Datos Personales"
- [ ] Implementar pestaña "Constantes Vitales"
- [ ] Implementar pestaña "Medicamentos"
- [ ] Implementar pestaña "Escalas de Valoración"
- [ ] Implementar pestaña "Notas de Enfermería"
- [ ] Añadir navegación entre pestañas
- [ ] Mostrar resumen en cada pestaña

### Tests y Validación
- [x] Escribir tests para gestión de medicamentos
- [x] Probar flujos completos de pautas de administración
- [ ] Verificar gráficos con datos reales
- [ ] Crear checkpoint final


## Finalización Completa del Software (16 Ene 2026)

### Ficha Completa del Residente
- [ ] Crear página de ficha completa con pestañas
- [ ] Implementar pestaña de Datos Personales
- [ ] Implementar pestaña de Constantes Vitales
- [ ] Implementar pestaña de Medicamentos
- [ ] Implementar pestaña de Escalas de Valoración
- [ ] Implementar pestaña de Notas de Enfermería
- [ ] Añadir navegación entre pestañas

### Registro de Administración de Medicamentos
- [ ] Crear página de registro diario de medicamentos
- [ ] Mostrar tabla por horarios (desayuno, comida, cena, noche)
- [ ] Permitir marcar medicamento como administrado
- [ ] Registrar fecha/hora y usuario que administró
- [ ] Mostrar alertas de medicamentos pendientes

### Notas de Enfermería
- [ ] Crear página de notas de enfermería
- [ ] Implementar formulario de nueva nota
- [ ] Mostrar historial de notas por residente
- [ ] Añadir filtros por fecha y tipo

### Mejoras Finales
- [ ] Optimizar rendimiento de consultas
- [ ] Añadir más datos de ejemplo
- [ ] Verificar todos los flujos de trabajo
- [ ] Crear documentación actualizada


## Mejoras Finales - Completar Software (16 Ene 2026)

### Datos de Prueba Variados
- [ ] Añadir 20+ residentes con datos variados
- [ ] Incluir residentes de diferentes edades (65-100 años)
- [ ] Incluir diferentes estados (activo, hospitalizado, fallecido)
- [ ] Añadir constantes vitales históricas para varios residentes
- [ ] Añadir medicamentos variados para diferentes residentes
- [ ] Añadir escalas de valoración completadas

### Impresión de Informes en PDF
- [ ] Crear componente de impresión de ficha del residente
- [ ] Implementar generación de PDF de ficha completa
- [ ] Añadir impresión de listado de medicación
- [ ] Añadir impresión de historial de constantes
- [ ] Añadir botones de impresión en las páginas correspondientes

### Guía de Uso Rápida
- [x] Crear documento de guía rápida en Markdown
- [x] Añadir sección: Cómo registrar constantes vitales
- [x] Añadir sección: Cómo añadir medicamentos
- [x] Añadir sección: Cómo completar escalas de valoración
- [x] Añadir sección: Cómo ver ficha del residente
- [x] Incluir capturas de pantalla de cada flujo (Descripciones detalladas incluidas)
