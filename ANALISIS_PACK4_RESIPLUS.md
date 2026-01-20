# Análisis del Cuarto Pack de Imágenes - ResiPlus Clone

## Resumen General

El cuarto pack contiene **103 imágenes** capturadas de vídeos de capacitación de ResiPlus original. Estas imágenes muestran en detalle cómo funciona el módulo de **Ficha del Residente** y específicamente la sección de **Datos Médicos** con énfasis en:

- Gestión de patologías, alergias y antecedentes
- Gestión de medicamentos y tratamientos
- Importación de códigos CIE-10
- Modificación de tratamientos
- Historial médico completo

---

## Módulos Identificados en el Pack 4

### 1. Ficha del Residente - Datos Médicos

**Ubicación:** Módulo RESIDENTES → Ficha del Residente → Datos Médicos

**Secciones principales:**

#### A. Información General del Residente
- Código del residente
- Nombre completo
- N.I.F. (Número de Identificación Fiscal)
- N.S.S. (Número de Seguridad Social)
- N.S.I.P. (Número de Seguro)
- Tipología
- Estado Civil
- Habitación
- Lugar de Nacimiento
- Sexo
- Edad
- Fecha de Nacimiento
- Fecha de Ingreso
- Última modificación

#### B. Contactos y Familiares del Residente
- Tabla con columnas: Nombre, Nº de Identificación, Fecha Nacimiento, Edad, Parentesco, Observaciones, Orden
- Permite agregar múltiples contactos/familiares

#### C. Direcciones y Teléfonos de Contacto del Familiar
- Domicilio
- Provincia
- Municipio
- Población
- Distrito
- Código Postal
- Teléfono
- 2º Teléfono
- Móvil

#### D. Direcciones y Teléfonos del Residente
- Similar a contactos del familiar

---

### 2. Módulo Médico - Patologías, Alergias y Antecedentes

**Ubicación:** Módulo RESIDENTES → Ficha del Residente → Datos Médicos → Patologías, Alergias y Antecedentes

**Funcionalidades:**

#### A. Gestión de Patologías
- **Búsqueda por Código CIE-10:** Campo para buscar patologías
- **Búsqueda por Descripción:** Campo para búsqueda por texto
- **Importación CIE:** Diálogo para importar códigos CIE-10
  - Selector de CIE del que quiere realizar la importación
  - Búsqueda por código
  - Búsqueda por descripción
  - Búsqueda por enfermedades/lesiones
  - Tabla con códigos y descripciones
  - Checkboxes para seleccionar qué importar (Alergias, Antecedentes, Patologías, Causas Externas)

#### B. Tabla de Patologías
- Código CIE-10
- Descripción de la patología
- Código Unificado
- Baja (checkbox)
- Acciones: Expandir/Contraer

**Ejemplos de Patologías:**
- H10.531 - Blenoconjuntivitis de contacto, ojo derecho
- COVID - COVID 19
- COVID-19 - COVID-19
- E10.9 - Diabetes mellitus tipo 1 sin complicaciones
- I67.4 - Encefalopatía hipertensiva
- I67.9 - Enfermedad cerebrovascular, no especificada
- G20 - Enfermedad de Parkinson
- I48.2 - Fibrilación crónica auricular
- I10 - Hipertensión esencial (primaria)

#### C. Pestañas Disponibles
- **Patologías** - Enfermedades del residente
- **Alergias** - Alergias conocidas
- **Antecedentes** - Antecedentes médicos
- **Procedimientos** - Procedimientos realizados
- **Tipo de diabetes** - Especificación de diabetes
- **Prioridades** - Prioridades médicas
- **Causas Externas** - Causas externas de lesiones

---

### 3. Gestión de Medicamentos y Tratamientos

**Ubicación:** Módulo RESIDENTES → Ficha del Residente → Datos Médicos → Tratamiento

**Funcionalidades:**

#### A. Información del Tratamiento
- **Fecha Orden:** Fecha del tratamiento
- **Médico:** Profesional que prescribe
- **Usuario R+:** Usuario que registra
- **Observaciones:** Notas adicionales

#### B. Relación de Medicamentos del Tratamiento
- **Desde:** Fecha de inicio
- **Hasta:** Fecha de fin (si aplica)
- **H. Desde:** Hora de inicio
- **H. Hasta:** Hora de fin
- **Descripción:** Nombre del medicamento
- **Días de administración:** L, M, X, J, V, S, D (Lunes a Domingo)
- **Variante:** Variaciones en la administración
- **Día:** Días específicos
- **4h, 8h, 12h, etc.:** Intervalos de administración
- **V.I.:** Vía de administración
- **Paula Especial:** Notas especiales
- **Tipo Medicación:** Tipo del medicamento
- **Vía:** Vía de administración
- **Unidad:** Unidad de medida
- **Patología:** Patología relacionada

#### C. Modificación de Tratamientos
- **Diálogo:** "Modificación del tratamiento actual para [RESIDENTE]"
- **Fecha Orden:** Fecha de la modificación
- **Médico:** Médico responsable
- **Usuario R+:** Usuario que realiza la modificación
- **Observaciones:** Notas sobre la modificación
- **Nuevo registro:** Opción para agregar nuevos medicamentos
- **Tabla de medicamentos:** Con todos los campos anteriores
- **Botones:** "Modificar Tratamiento" y "Cancelar"

#### D. Historial de Evolución de la Patología
- **De Fecha:** Fecha inicial
- **A Fecha:** Fecha final
- **Estado:** Estado de la patología
- **Observaciones:** Notas sobre la evolución

---

## Estructura de Datos Observada

### Tabla: Residentes (Ampliada)
```
- id (PK)
- code (Código del residente)
- firstName
- lastName
- nif (Número de Identificación Fiscal)
- nss (Número de Seguridad Social)
- nsip (Número de Seguro)
- typology (Tipología)
- maritalStatus (Estado Civil)
- room (Habitación)
- birthPlace (Lugar de Nacimiento)
- gender (Sexo)
- age (Edad)
- birthDate (Fecha de Nacimiento)
- admissionDate (Fecha de Ingreso)
- lastModified (Última modificación)
```

### Tabla: Pathologies (Nueva)
```
- id (PK)
- residentId (FK)
- cieCode (Código CIE-10)
- description (Descripción)
- unifiedCode (Código Unificado)
- isActive (Baja - checkbox)
- createdAt
- updatedAt
```

### Tabla: Allergies (Nueva)
```
- id (PK)
- residentId (FK)
- allergyCode (Código CIE)
- description (Descripción)
- severity (Severidad)
- isActive
- createdAt
- updatedAt
```

### Tabla: Medications (Ampliada)
```
- id (PK)
- treatmentId (FK)
- medicationName (Nombre del medicamento)
- startDate (Fecha de inicio)
- endDate (Fecha de fin)
- startTime (Hora de inicio)
- endTime (Hora de fin)
- daysOfWeek (L, M, X, J, V, S, D)
- intervals (4h, 8h, 12h, etc.)
- administrationRoute (Vía de administración)
- unit (Unidad)
- pathology (Patología relacionada)
- specialNotes (Notas especiales)
- createdAt
- updatedAt
```

### Tabla: Treatments (Nueva)
```
- id (PK)
- residentId (FK)
- orderDate (Fecha Orden)
- doctor (Médico)
- createdBy (Usuario R+)
- observations (Observaciones)
- status (Estado)
- createdAt
- updatedAt
```

### Tabla: CIE10Codes (Nueva - Maestro)
```
- id (PK)
- code (Código CIE-10)
- description (Descripción)
- category (Categoría)
- createdAt
```

---

## Funcionalidades Principales Identificadas

### 1. Búsqueda y Importación CIE-10
- Búsqueda por código exacto
- Búsqueda por descripción (texto libre)
- Búsqueda por enfermedades/lesiones
- Importación masiva de códigos
- Selección de qué importar (Alergias, Antecedentes, Patologías, Causas Externas)

### 2. Gestión de Patologías
- Agregar patologías
- Eliminar patologías
- Marcar como "Baja" (inactiva)
- Ver historial de evolución
- Código CIE-10 asociado

### 3. Gestión de Medicamentos
- Crear tratamientos
- Agregar medicamentos a tratamientos
- Especificar días de administración (L-D)
- Especificar intervalos de administración (4h, 8h, 12h, etc.)
- Especificar vía de administración
- Modificar tratamientos existentes
- Ver historial de medicamentos

### 4. Gestión de Alergias
- Registrar alergias conocidas
- Especificar severidad
- Código CIE asociado
- Historial de alergias

### 5. Gestión de Antecedentes
- Registrar antecedentes médicos
- Historial completo
- Evolución temporal

---

## Interfaz de Usuario Observada

### Barra de Herramientas Principal
- Botón "Nueva" (crear nuevo residente)
- Botón "Buscar" (búsqueda de residentes)
- Botón "Eliminar" (eliminar residente)
- Botón "Primera Anterior" (navegación)
- Botón "Siguiente Última" (navegación)
- Selector "Ver Altas" (mostrar/ocultar altas)
- Selector "Ver Bajas" (mostrar/ocultar bajas)
- Botón "Actualizar" (refrescar datos)

### Sidebar de Navegación
- Expandible/Colapsable
- Estructura jerárquica
- Secciones principales:
  - General
  - Económico
  - Farmacia
  - ACP
  - Médico (con subsecciones)
    - Patologías, Alergias y Antecedentes
    - Tratamiento
    - Informe Médico
    - Escalas
    - Seguimiento
    - Datos Médicos
    - Sujeciones
    - Valoraciones
    - Análiticas - Pruebas D...
    - Informes
    - Documentos
    - Estancias en Unidade
    - Observaciones
  - Enfermería
  - Trabajador Social
  - Psicólogo
  - Animador Sociocultural
  - Fisioterapeuta
  - Dietista
  - Terapeuta Ocupacional
  - Supervisoras
  - Auxiliares
  - Director
  - Atención Espiritual
  - Pedagogo
  - Podólogo
  - Educador
  - Logopeda
  - Psiquiatra
  - Farmacéutico
  - Administración
  - Recepción

---

## Flujo de Trabajo Observado

### 1. Acceder a Ficha del Residente
1. Módulo RESIDENTES
2. Seleccionar residente
3. Acceder a "Datos Médicos"

### 2. Gestionar Patologías
1. Ir a "Patologías, Alergias y Antecedentes"
2. Pestaña "Patologías"
3. Buscar código CIE-10
4. Importar desde CIE
5. Seleccionar patologías a importar
6. Guardar

### 3. Gestionar Medicamentos
1. Ir a "Tratamiento"
2. Crear nuevo tratamiento
3. Agregar medicamentos
4. Especificar días y horarios
5. Especificar vía de administración
6. Guardar
7. Modificar si es necesario

### 4. Ver Historial
1. Seleccionar patología/medicamento
2. Ver historial de evolución
3. Ver cambios realizados

---

## Conclusión

El cuarto pack de imágenes proporciona una visión detallada del **módulo de Datos Médicos** de ResiPlus, específicamente enfocado en la gestión de patologías, alergias, antecedentes y medicamentos. Este es un módulo crítico que requiere:

- Integración con base de datos CIE-10
- Gestión compleja de medicamentos con múltiples parámetros
- Historial temporal de cambios
- Importación de códigos estándar
- Interfaz intuitiva para médicos y enfermeras

**Análisis completado:** Enero 2026
**Total de imágenes analizadas:** 103
**Funcionalidades identificadas:** Módulo completo de Datos Médicos

