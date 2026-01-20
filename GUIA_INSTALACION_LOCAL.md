# Guía de Instalación Local - ResiPlus Clone

## Introducción

Esta guía te permitirá instalar y ejecutar ResiPlus Clone en tu ordenador local para practicar. El software creará automáticamente una base de datos donde se guardarán todos tus datos de práctica.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

### 1. Node.js (Requerido)
**¿Qué es?** Node.js es un entorno de ejecución para JavaScript en el servidor.

**Cómo instalarlo:**
1. Visita [https://nodejs.org/](https://nodejs.org/)
2. Descarga la versión **LTS (Recomendada)**
3. Ejecuta el instalador y sigue los pasos
4. Reinicia tu ordenador

**Verificar instalación:**
```bash
node --version
npm --version
```

### 2. MySQL (Requerido)
**¿Qué es?** MySQL es el gestor de base de datos donde se guardarán tus datos.

**Cómo instalarlo:**
1. Descarga desde [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
2. Selecciona tu sistema operativo
3. Ejecuta el instalador
4. Anota la contraseña de root que configures
5. Inicia el servicio MySQL

**Alternativa más fácil - MySQL en Docker:**
Si tienes Docker instalado, ejecuta:
```bash
docker run --name mysql-resiplus -e MYSQL_ROOT_PASSWORD=root123 -p 3306:3306 -d mysql:8.0
```

---

## Pasos de Instalación

### Paso 1: Descargar el Proyecto

1. Descarga el archivo `resiplus_clone_v2.3.0.zip`
2. Extrae el contenido en una carpeta de tu preferencia
3. Abre una terminal/consola en esa carpeta

### Paso 2: Instalar Dependencias

En la terminal, ejecuta:
```bash
npm install --legacy-peer-deps
```

**Esto puede tardar 2-5 minutos.** El sistema descargará todas las librerías necesarias.

### Paso 3: Configurar Base de Datos

#### Opción A: MySQL Local

1. Abre MySQL Workbench o línea de comandos
2. Conéctate a MySQL con tu usuario root
3. Ejecuta estos comandos:

```sql
CREATE DATABASE resiplus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'resiplus_user'@'localhost' IDENTIFIED BY 'resiplus_password_123';
GRANT ALL PRIVILEGES ON resiplus_db.* TO 'resiplus_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Opción B: PlanetScale (Online - Recomendado)

1. Regístrate en [https://planetscale.com/](https://planetscale.com/)
2. Crea una nueva base de datos llamada `resiplus_db`
3. Obtén la cadena de conexión (connection string)
4. Guarda la cadena de conexión para el paso siguiente

### Paso 4: Crear Archivo .env

En la carpeta raíz del proyecto, crea un archivo llamado `.env` con el siguiente contenido:

**Para MySQL Local:**
```env
# Base de Datos
DATABASE_URL="mysql://resiplus_user:resiplus_password_123@localhost:3306/resiplus_db"

# Autenticación
JWT_SECRET="tu_clave_secreta_super_segura_aqui_12345"
ADMIN_USERNAME="hermana"
ADMIN_PASSWORD="password123"

# Servidor
PORT=3000
NODE_ENV="development"
```

**Para PlanetScale:**
```env
# Base de Datos (reemplaza con tu connection string de PlanetScale)
DATABASE_URL="mysql://[usuario]:[contraseña]@[host]/resiplus_db?sslaccept=strict"

# Autenticación
JWT_SECRET="tu_clave_secreta_super_segura_aqui_12345"
ADMIN_USERNAME="hermana"
ADMIN_PASSWORD="password123"

# Servidor
PORT=3000
NODE_ENV="development"
```

### Paso 5: Crear Tablas en la Base de Datos

En la terminal, ejecuta:
```bash
npm run db:push
```

Esto creará automáticamente todas las tablas necesarias en tu base de datos.

### Paso 6: Iniciar el Servidor

En la terminal, ejecuta:
```bash
npm run dev
```

Deberías ver algo como:
```
> resiplus_clone@1.0.0 dev
> vite & tsx watch server/_core/index.ts

  VITE v7.3.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Paso 7: Acceder a la Aplicación

1. Abre tu navegador web
2. Ve a `http://localhost:5173`
3. Inicia sesión con:
   - **Usuario:** hermana
   - **Contraseña:** password123

¡Listo! Ya puedes comenzar a practicar.

---

## Cambiar Credenciales de Acceso

Para cambiar el usuario y contraseña de acceso:

1. Abre el archivo `.env`
2. Modifica estas líneas:
```env
ADMIN_USERNAME="tu_usuario"
ADMIN_PASSWORD="tu_contraseña"
```
3. Guarda el archivo
4. Reinicia el servidor (Ctrl+C y luego `npm run dev`)

---

## Solución de Problemas

### Error: "Cannot find module 'npm'"
**Solución:** Node.js no está instalado correctamente. Reinstala desde [nodejs.org](https://nodejs.org/)

### Error: "Connection refused" (Base de datos)
**Solución:** MySQL no está corriendo. Inicia el servicio MySQL:
- **Windows:** Busca "Services" y inicia "MySQL80"
- **Mac:** `brew services start mysql`
- **Linux:** `sudo systemctl start mysql`

### Error: "Port 3000 is already in use"
**Solución:** Otro programa usa el puerto 3000. Cambia en `.env`:
```env
PORT=3001
```

### Error: "EACCES: permission denied"
**Solución:** Ejecuta con permisos de administrador o usa `sudo npm install`

### La base de datos no se crea
**Solución:** Ejecuta manualmente:
```bash
npm run db:push
```

---

## Comandos Útiles

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia servidor en desarrollo |
| `npm run build` | Compila para producción |
| `npm run db:push` | Crea/actualiza tablas en BD |
| `npm run db:studio` | Abre interfaz visual de BD |
| `npm run test` | Ejecuta tests |

---

## Datos de Ejemplo

Para cargar datos de ejemplo en la base de datos:

```bash
npm run seed
```

Esto cargará residentes, medicamentos y otros datos de prueba.

---

## Hacer Copias de Seguridad

### Exportar Base de Datos
```bash
mysqldump -u resiplus_user -p resiplus_db > backup_resiplus.sql
```

### Restaurar Base de Datos
```bash
mysql -u resiplus_user -p resiplus_db < backup_resiplus.sql
```

---

## Próximos Pasos

Una vez instalado localmente, puedes:

1. **Practicar localmente** - Usar el software en tu ordenador
2. **Desplegar online** - Seguir la guía "GUIA_DESPLIEGUE_ONLINE.md"
3. **Agregar funciones** - El código está listo para extensiones

---

## Soporte

Si encuentras problemas:

1. Verifica que Node.js y MySQL estén instalados correctamente
2. Revisa el archivo `.env` - asegúrate de que la contraseña sea correcta
3. Consulta los logs en la terminal para mensajes de error específicos
4. Intenta reiniciar el servidor (Ctrl+C y `npm run dev`)

---

**¡Listo para practicar!** 🎉

Ahora puedes acceder a ResiPlus Clone en `http://localhost:5173` y comenzar a practicar con todos los módulos implementados.

