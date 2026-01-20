# Guía de Instalación - ResiPlus Clone

Esta guía te ayudará a instalar y ejecutar **ResiPlus Clone** en tu ordenador (Mac o Windows).

## Requisitos Previos

Antes de comenzar, necesitas tener instalado lo siguiente en tu ordenador:

### 1. Node.js (versión 18 o superior)

Node.js es el entorno que permite ejecutar la aplicación.

**Para Mac:**
1. Visita [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Verifica la instalación abriendo Terminal y ejecutando:
   ```bash
   node --version
   ```

**Para Windows:**
1. Visita [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Verifica la instalación abriendo Command Prompt y ejecutando:
   ```bash
   node --version
   ```

### 2. Git (opcional, pero recomendado)

Git te permite descargar y actualizar el código fácilmente.

**Para Mac:**
- Git suele venir preinstalado. Verifica ejecutando en Terminal:
  ```bash
  git --version
  ```
- Si no está instalado, descárgalo desde [git-scm.com](https://git-scm.com/)

**Para Windows:**
- Descarga Git desde [git-scm.com](https://git-scm.com/)
- Ejecuta el instalador con las opciones por defecto

## Instalación Paso a Paso

### Paso 1: Obtener el Código

Tienes dos opciones:

**Opción A: Descargar como ZIP**
1. Descarga el archivo ZIP del proyecto
2. Descomprímelo en una carpeta de tu elección (por ejemplo, `Documentos/ResiPlus`)

**Opción B: Clonar con Git (recomendado)**
1. Abre Terminal (Mac) o Command Prompt (Windows)
2. Navega a la carpeta donde quieres instalar:
   ```bash
   cd ~/Documents
   ```
3. Clona el repositorio (si está en un repositorio Git):
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   ```

### Paso 2: Instalar Dependencias

1. Abre Terminal (Mac) o Command Prompt (Windows)
2. Navega a la carpeta del proyecto:
   ```bash
   cd ruta/a/resiplus_clone
   ```
3. Instala las dependencias ejecutando:
   ```bash
   npm install
   ```
   
   Este proceso puede tardar varios minutos. Descargará todas las bibliotecas necesarias.

### Paso 3: Configurar la Base de Datos

La aplicación necesita una base de datos MySQL. Tienes dos opciones:

**Opción A: Usar la base de datos en la nube (recomendado para principiantes)**

La aplicación ya está configurada para usar una base de datos en la nube. No necesitas hacer nada adicional.

**Opción B: Instalar MySQL localmente**

Si prefieres tener la base de datos en tu ordenador:

1. **Para Mac:**
   - Descarga MySQL desde [mysql.com](https://dev.mysql.com/downloads/mysql/)
   - O instala con Homebrew: `brew install mysql`

2. **Para Windows:**
   - Descarga MySQL Installer desde [mysql.com](https://dev.mysql.com/downloads/installer/)
   - Ejecuta el instalador y sigue las instrucciones

3. Crea un archivo `.env` en la carpeta raíz del proyecto con:
   ```
   DATABASE_URL=mysql://usuario:contraseña@localhost:3306/resiplus
   ```

4. Crea la base de datos:
   ```bash
   npm run db:push
   ```

### Paso 4: Cargar Datos de Ejemplo (Opcional)

Para familiarizarte con la aplicación, puedes cargar datos de ejemplo:

```bash
node seed-data.mjs
```

Esto creará:
- 5 residentes de ejemplo
- 5 habitaciones
- Constantes vitales de muestra
- Medicamentos de ejemplo
- Notas de enfermería
- Escalas de valoración

### Paso 5: Iniciar la Aplicación

1. En la carpeta del proyecto, ejecuta:
   ```bash
   npm run dev
   ```

2. Verás un mensaje similar a:
   ```
   Server running on http://localhost:3000/
   ```

3. Abre tu navegador web (Chrome, Safari, Firefox, etc.) y visita:
   ```
   http://localhost:3000
   ```

4. La aplicación se abrirá y te pedirá que inicies sesión.

## Uso Diario

### Iniciar la Aplicación

Cada vez que quieras usar la aplicación:

1. Abre Terminal (Mac) o Command Prompt (Windows)
2. Navega a la carpeta del proyecto:
   ```bash
   cd ruta/a/resiplus_clone
   ```
3. Ejecuta:
   ```bash
   npm run dev
   ```
4. Abre el navegador en `http://localhost:3000`

### Detener la Aplicación

Para detener la aplicación:

1. En la ventana de Terminal/Command Prompt donde está ejecutándose
2. Presiona `Ctrl + C` (tanto en Mac como en Windows)
3. Confirma con `Y` si te lo pregunta

## Instalación en el Ordenador de tu Hermana

Para instalar la aplicación en otro ordenador:

1. **Copia la carpeta completa** del proyecto en una memoria USB
2. **En el nuevo ordenador**, asegúrate de tener Node.js instalado (ver Requisitos Previos)
3. Copia la carpeta del proyecto a una ubicación permanente
4. Abre Terminal/Command Prompt y navega a la carpeta
5. Ejecuta `npm install` para instalar las dependencias
6. Sigue los pasos 4 y 5 de la instalación

## Solución de Problemas Comunes

### Error: "node: command not found"

**Solución:** Node.js no está instalado o no está en el PATH. Reinstala Node.js desde nodejs.org.

### Error: "Cannot find module"

**Solución:** Las dependencias no están instaladas. Ejecuta `npm install` en la carpeta del proyecto.

### Error: "Port 3000 is already in use"

**Solución:** El puerto 3000 está ocupado. Puedes:
- Cerrar otras aplicaciones que usen ese puerto
- O cambiar el puerto editando el archivo de configuración

### La aplicación se ve mal o no carga

**Solución:**
1. Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
2. Prueba con otro navegador
3. Verifica que el servidor esté ejecutándose correctamente

### Error de base de datos

**Solución:**
1. Verifica que la variable `DATABASE_URL` esté configurada correctamente
2. Si usas MySQL local, asegúrate de que el servidor MySQL esté ejecutándose
3. Ejecuta `npm run db:push` para crear/actualizar las tablas

## Actualizaciones

Para actualizar la aplicación cuando haya nuevas versiones:

**Si usaste Git:**
```bash
cd ruta/a/resiplus_clone
git pull
npm install
npm run db:push
```

**Si descargaste ZIP:**
1. Descarga la nueva versión
2. Reemplaza los archivos (¡cuidado con no borrar tu base de datos!)
3. Ejecuta `npm install`
4. Ejecuta `npm run db:push`

## Copias de Seguridad

### Respaldar la Base de Datos

**Si usas MySQL local:**
```bash
mysqldump -u usuario -p resiplus > backup_resiplus_$(date +%Y%m%d).sql
```

**Si usas la base de datos en la nube:**
- Las copias de seguridad se realizan automáticamente
- Puedes exportar los datos desde el panel de administración

### Restaurar desde una Copia de Seguridad

```bash
mysql -u usuario -p resiplus < backup_resiplus_20260116.sql
```

## Recursos Adicionales

- **Documentación de Usuario**: Ver archivo `DOCUMENTACION_USUARIO.md`
- **Lista de Tareas**: Ver archivo `todo.md` para conocer el estado de desarrollo
- **Soporte**: Para problemas técnicos, consulta la documentación o contacta con el desarrollador

## Consideraciones de Seguridad

1. **No compartas** tus credenciales de acceso
2. **Cambia las contraseñas** por defecto si las hay
3. **Mantén actualizado** Node.js y las dependencias
4. **Realiza copias de seguridad** periódicas de la base de datos
5. **No expongas** la aplicación a Internet sin medidas de seguridad adicionales

## Notas Finales

- Esta aplicación está diseñada para **uso local y personal**
- Para uso en producción en una residencia real, se recomienda contratar servicios profesionales de hosting y seguridad
- La aplicación funciona mejor en navegadores modernos (Chrome, Firefox, Safari, Edge)
- Se recomienda una conexión a Internet estable para el correcto funcionamiento

---

**¿Necesitas ayuda?**

Si encuentras problemas durante la instalación, revisa la sección de Solución de Problemas o consulta la documentación completa en `DOCUMENTACION_USUARIO.md`.
