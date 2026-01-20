# Guía de Despliegue Online - ResiPlus Clone

## Introducción

Esta guía te permitirá desplegar ResiPlus Clone en línea para que tu hermana pueda acceder desde cualquier lugar. Usaremos:

- **Vercel** - Para alojar la aplicación (frontend + backend)
- **PlanetScale** - Para la base de datos MySQL en la nube

**Ventajas:**
- ✅ Acceso desde cualquier dispositivo
- ✅ Base de datos en la nube
- ✅ Datos persistentes
- ✅ Dominio personalizado (opcional)
- ✅ Certificado SSL gratuito
- ✅ Escalable automáticamente

---

## Parte 1: Preparar el Proyecto

### Paso 1: Crear Repositorio en GitHub

1. Crea una cuenta en [GitHub](https://github.com/) si no tienes
2. Crea un nuevo repositorio llamado `resiplus-clone`
3. Clona el repositorio en tu ordenador:

```bash
git clone https://github.com/tu_usuario/resiplus-clone.git
cd resiplus-clone
```

### Paso 2: Copiar Archivos del Proyecto

1. Copia todos los archivos de ResiPlus Clone a la carpeta clonada
2. Desde la terminal, en la carpeta del proyecto:

```bash
git add .
git commit -m "Initial commit: ResiPlus Clone v2.3.0"
git push origin main
```

### Paso 3: Crear Archivo .gitignore

Crea un archivo `.gitignore` en la raíz del proyecto:

```
node_modules/
dist/
.env
.env.local
.env.*.local
*.log
.DS_Store
```

---

## Parte 2: Configurar PlanetScale (Base de Datos)

### Paso 1: Crear Cuenta en PlanetScale

1. Visita [https://planetscale.com/](https://planetscale.com/)
2. Haz clic en "Sign Up"
3. Regístrate con GitHub (más fácil)
4. Completa el perfil

### Paso 2: Crear Base de Datos

1. En el dashboard de PlanetScale, haz clic en "Create a database"
2. Nombre: `resiplus_db`
3. Región: Selecciona la más cercana a ti
4. Haz clic en "Create database"

### Paso 3: Obtener Connection String

1. En la base de datos creada, haz clic en "Connect"
2. Selecciona "Node.js" como lenguaje
3. Copia la cadena de conexión (connection string)
4. Guárdala en un lugar seguro, la necesitarás en Vercel

**Ejemplo de connection string:**
```
mysql://[usuario]:[contraseña]@[host]/resiplus_db?sslaccept=strict
```

### Paso 4: Crear Tablas

1. En PlanetScale, haz clic en "Console"
2. Copia y pega el contenido del archivo `drizzle/schema.ts`
3. Ejecuta los comandos SQL para crear las tablas

**Alternativa más fácil:**
Usa Drizzle Studio (explicado más adelante)

---

## Parte 3: Configurar Vercel (Hosting)

### Paso 1: Crear Cuenta en Vercel

1. Visita [https://vercel.com/](https://vercel.com/)
2. Haz clic en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel en GitHub

### Paso 2: Importar Proyecto

1. En el dashboard de Vercel, haz clic en "New Project"
2. Selecciona tu repositorio `resiplus-clone`
3. Haz clic en "Import"

### Paso 3: Configurar Variables de Entorno

En la sección "Environment Variables", agrega:

```
DATABASE_URL = [Tu connection string de PlanetScale]
JWT_SECRET = tu_clave_secreta_super_segura_aqui_12345
ADMIN_USERNAME = hermana
ADMIN_PASSWORD = password123
NODE_ENV = production
```

### Paso 4: Configurar Build Settings

1. **Framework Preset:** Vite
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Install Command:** `npm install --legacy-peer-deps`

### Paso 5: Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el despliegue (2-5 minutos)
3. Vercel te dará una URL como: `https://resiplus-clone-xxxxx.vercel.app`

---

## Parte 4: Crear Tablas en PlanetScale

### Opción A: Usando Drizzle Studio (Recomendado)

1. En tu proyecto local, ejecuta:
```bash
npm run db:studio
```

2. Se abrirá una interfaz web
3. Conecta con tu base de datos de PlanetScale
4. Las tablas se crearán automáticamente

### Opción B: Manualmente en PlanetScale Console

1. En PlanetScale, abre "Console"
2. Copia el contenido de `drizzle/schema.ts`
3. Ejecuta los comandos SQL

---

## Parte 5: Verificar Despliegue

### Paso 1: Acceder a la Aplicación

1. Abre la URL proporcionada por Vercel
2. Deberías ver la pantalla de login

### Paso 2: Iniciar Sesión

- **Usuario:** hermana
- **Contraseña:** password123

### Paso 3: Probar Funcionalidades

1. Crea un residente de prueba
2. Registra constantes vitales
3. Verifica que los datos se guardan en la base de datos

---

## Configuración Avanzada

### Dominio Personalizado

1. En Vercel, ve a "Settings" → "Domains"
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

### Variables de Entorno Adicionales

Para producción, considera agregar:

```env
# Seguridad
CORS_ORIGIN = https://tu-dominio.com
RATE_LIMIT = 100

# Logging
LOG_LEVEL = info
DEBUG = false

# Email (opcional)
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = tu-email@gmail.com
SMTP_PASSWORD = tu-app-password
```

### Monitoreo

1. En Vercel, ve a "Analytics"
2. Monitorea uso de CPU, memoria y base de datos
3. Recibe alertas si hay problemas

---

## Solución de Problemas

### Error: "Database connection failed"
**Solución:**
1. Verifica que el connection string sea correcto
2. Asegúrate de que PlanetScale esté activo
3. Reinicia el despliegue en Vercel

### Error: "Build failed"
**Solución:**
1. Verifica los logs en Vercel
2. Asegúrate de que todas las dependencias estén instaladas
3. Ejecuta `npm install --legacy-peer-deps` localmente

### Aplicación lenta
**Solución:**
1. Verifica el uso de base de datos en PlanetScale
2. Optimiza queries si es necesario
3. Considera upgrade de plan

### No puedo iniciar sesión
**Solución:**
1. Verifica las credenciales en variables de entorno
2. Asegúrate de que JWT_SECRET sea el mismo en local y Vercel
3. Limpia cache del navegador (Ctrl+Shift+Del)

---

## Actualizar Aplicación

Cuando hagas cambios en el código:

1. Haz commit y push a GitHub:
```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

2. Vercel se redesplegará automáticamente
3. Espera 2-5 minutos a que termine

---

## Hacer Copias de Seguridad

### Exportar Base de Datos desde PlanetScale

1. En PlanetScale, ve a "Console"
2. Ejecuta:
```sql
SELECT * FROM residents;
SELECT * FROM vital_signs;
-- etc para cada tabla
```

3. Exporta los datos como CSV o JSON

### Restaurar Base de Datos

1. En PlanetScale Console, ejecuta los INSERT statements
2. O usa Drizzle Studio para importar datos

---

## Costos

### Plan Gratuito

| Servicio | Costo | Límites |
|----------|-------|---------|
| Vercel | Gratis | 100 GB/mes ancho de banda |
| PlanetScale | Gratis | 5 GB almacenamiento |
| Dominio | $10-15/año | Opcional |

### Plan Pagado (si crece)

- Vercel Pro: $20/mes
- PlanetScale Pro: $29/mes
- Total: ~$50/mes

---

## Próximos Pasos

Una vez desplegado online:

1. **Compartir URL** con tu hermana
2. **Crear cuenta** con credenciales personalizadas
3. **Monitorear uso** desde Vercel dashboard
4. **Hacer backups** regularmente
5. **Actualizar** cuando haya nuevas funciones

---

## Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs

# Redeploy
vercel --prod

# Ver variables de entorno
vercel env ls

# Conectar a base de datos local
npm run db:studio

# Crear backup
mysqldump -u user -p database > backup.sql
```

---

## Seguridad

### Recomendaciones

1. **Cambiar credenciales por defecto**
   - Modifica ADMIN_USERNAME y ADMIN_PASSWORD en .env
   - Usa contraseña fuerte (mínimo 12 caracteres)

2. **Proteger JWT_SECRET**
   - Usa una cadena aleatoria larga
   - No la compartas públicamente

3. **HTTPS**
   - Vercel proporciona SSL gratuito
   - Siempre usa HTTPS

4. **Firewall de PlanetScale**
   - Restringe acceso a IPs conocidas (opcional)

---

## Conclusión

¡Tu aplicación ResiPlus Clone está ahora disponible online! 🎉

Tu hermana puede acceder desde cualquier lugar usando:
- **URL:** https://tu-dominio.vercel.app
- **Usuario:** hermana
- **Contraseña:** password123

Todos los datos se guardarán en PlanetScale y estarán disponibles siempre.

