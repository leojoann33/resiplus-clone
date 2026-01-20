# ResiPlus Clone - Documentación de Usuario

## Introducción

**ResiPlus Clone** es un sistema de gestión integral para residencias de mayores, diseñado específicamente para el área de enfermería. Esta aplicación permite gestionar residentes, habitaciones, constantes vitales, medicamentos, escalas de valoración y notas de enfermería de manera eficiente y profesional.

## Características Principales

### 1. Panel de Control (Dashboard)

El panel de control ofrece una vista general del estado de la residencia:

- **Residentes Activos**: Número total de residentes en estado activo
- **Habitaciones**: Total de habitaciones disponibles en el centro
- **Ocupación de Camas**: Visualización en tiempo real de camas ocupadas vs. disponibles
- **Acciones Rápidas**: Acceso directo a las funciones más utilizadas

### 2. Gestión de Residentes

**Funcionalidades disponibles:**

- **Listado completo** de todos los residentes del centro
- **Búsqueda avanzada** por nombre, código o NIF
- **Visualización de información clave**: código, nombre, edad, habitación asignada y estado
- **Estados disponibles**: Activo, Alta, Fallecido

**Información almacenada por residente:**

- Datos personales: NIF, NSS, NSIP, nombre, apellidos, fecha de nacimiento, género
- Datos de ingreso: fecha de admisión, última fecha de admisión, lugar de nacimiento
- Asignación: habitación y número de cama
- Contacto: teléfono, email, contacto de emergencia con relación

### 3. Gestión de Habitaciones

**Funcionalidades disponibles:**

- **Listado de todas las habitaciones** con estado de ocupación
- **Tipos de habitación**: Individual, Doble, Triple, Compartida
- **Información de ubicación**: Código, nombre, planta, ala
- **Estado de ocupación**: Visualización clara de camas ocupadas/disponibles
- **Características**: Baño privado, balcón, accesibilidad

### 4. Módulo de Enfermería

#### 4.1. Constantes Vitales

El sistema permite registrar y hacer seguimiento de las siguientes constantes vitales:

- **Tensión Arterial (TA)**: Sistólica y diastólica
- **Frecuencia Cardíaca (FC)**: Pulsaciones por minuto
- **Frecuencia Respiratoria (FR)**: Respiraciones por minuto
- **Saturación de Oxígeno (SaO2)**: Porcentaje de saturación
- **Temperatura**: En grados Celsius
- **Glucosa**: Nivel de glucosa en sangre
- **Peso**: En kilogramos

**Características:**

- Registro con fecha y hora exacta
- Historial completo por residente
- Filtrado por tipo de medición
- Notas adicionales por registro

#### 4.2. Escalas de Valoración

El sistema incluye soporte para las escalas de valoración más utilizadas en geriatría:

- **Escala de Barthel**: Evaluación de la capacidad funcional para actividades básicas de la vida diaria
- **Escala de Norton**: Evaluación del riesgo de úlceras por presión

**Características:**

- Almacenamiento de datos detallados de cada ítem de la escala
- Cálculo automático de puntuación total
- Interpretación del resultado
- Historial de evaluaciones por residente
- Seguimiento de la evolución del residente

#### 4.3. Notas de Enfermería

Sistema completo de registro de observaciones y notas:

**Categorías disponibles:**

- General
- Constantes vitales
- Medicación
- Nutrición
- Higiene
- Movilidad
- Comportamiento
- Cuidado de heridas
- Incidentes

**Niveles de prioridad:**

- Baja
- Normal
- Alta
- Urgente

**Características:**

- Registro con fecha y hora
- Título y contenido descriptivo
- Clasificación por categoría y prioridad
- Historial completo por residente

### 5. Gestión de Medicamentos

Sistema completo de gestión farmacológica:

**Información registrada:**

- Nombre del medicamento y principio activo
- Dosis y unidad (mg, ml, etc.)
- Vía de administración (oral, intravenosa, subcutánea, etc.)
- Frecuencia de administración
- Tipo de pauta: Aguda o Crónica
- Fechas de inicio y fin
- Días de administración (Lunes a Domingo)
- Horarios específicos de administración
- Indicación terapéutica
- Médico prescriptor

**Vías de administración disponibles:**

- Oral
- Sublingual
- Intravenosa
- Intramuscular
- Subcutánea
- Tópica
- Rectal
- Inhalación
- Oftálmica
- Ótica
- Nasal

**Características:**

- Plan farmacológico completo por residente
- Filtrado de medicación activa/inactiva
- Historial de medicamentos
- Notas adicionales

## Navegación

### Menú Lateral

El menú lateral proporciona acceso rápido a todas las secciones:

- **Inicio**: Panel de control principal
- **Residentes**: Gestión de residentes
- **Habitaciones**: Gestión de habitaciones y camas
- **Enfermería**: Acceso al módulo de enfermería
- **Constantes Vitales**: Registro y consulta de constantes
- **Medicamentos**: Gestión farmacológica
- **Escalas de Valoración**: Evaluaciones Barthel y Norton
- **Notas de Enfermería**: Registro de observaciones

### Diseño Responsive

La aplicación está optimizada para funcionar en:

- **Ordenadores de escritorio**: Navegación lateral permanente
- **Tablets**: Navegación lateral colapsable
- **Móviles**: Menú hamburguesa con navegación lateral deslizable

## Datos de Ejemplo

La aplicación incluye datos de ejemplo para facilitar la familiarización:

- 5 residentes de ejemplo con información completa
- 5 habitaciones configuradas con diferentes características
- Registros de constantes vitales
- Medicamentos de ejemplo con pautas de administración
- Notas de enfermería de diferentes categorías
- Escalas de valoración completadas

## Seguridad y Autenticación

- **Sistema de autenticación OAuth**: Acceso seguro mediante Manus OAuth
- **Roles de usuario**: Administrador y Usuario estándar
- **Sesiones persistentes**: Mantiene la sesión activa de forma segura
- **Cierre de sesión**: Opción disponible en el menú de usuario

## Base de Datos

La aplicación utiliza una base de datos MySQL/TiDB con las siguientes tablas:

- `users`: Usuarios del sistema
- `residents`: Residentes del centro
- `rooms`: Habitaciones y camas
- `vitalSigns`: Constantes vitales
- `assessmentScales`: Escalas de valoración
- `medications`: Medicamentos y pautas
- `nursingNotes`: Notas de enfermería

## Arquitectura Escalable

El sistema está diseñado para permitir la incorporación futura de módulos adicionales:

- **Terapia Ocupacional**: Actividades y seguimiento terapéutico
- **Área Médica**: Historial clínico y consultas médicas
- **Gestión de Personal**: Turnos, horarios y recursos humanos
- **Módulo Económico**: Facturación, pagos y contabilidad

## Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express 4 + tRPC 11
- **Base de Datos**: MySQL/TiDB con Drizzle ORM
- **Autenticación**: Manus OAuth
- **Componentes UI**: shadcn/ui
- **Iconos**: Lucide React

## Soporte y Actualizaciones

Este sistema es una versión inicial funcional con las características principales implementadas. Las funcionalidades marcadas como "disponibles en futuras versiones" en el archivo `todo.md` se irán incorporando en actualizaciones posteriores según las necesidades específicas del centro.

## Recomendaciones de Uso

1. **Realizar copias de seguridad periódicas** de la base de datos
2. **Mantener actualizada** la información de los residentes
3. **Registrar las constantes vitales** de forma regular y sistemática
4. **Revisar el plan farmacológico** periódicamente para mantenerlo actualizado
5. **Utilizar las notas de enfermería** para documentar cualquier incidencia o cambio relevante
6. **Realizar evaluaciones de escalas** según el protocolo del centro

---

**Versión**: 1.0  
**Fecha**: Enero 2026  
**Desarrollado para**: Práctica personal de enfermería en residencias geriátricas
