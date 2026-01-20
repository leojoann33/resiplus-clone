# ResiPlus Clone - Inicio Rápido

## 🚀 Instalación en 5 Minutos

### 1. Descargar y Extraer
```bash
unzip resiplus_clone_v2.3.0.zip
cd resiplus_clone
```

### 2. Instalar Dependencias
```bash
npm install --legacy-peer-deps
```

### 3. Crear Archivo .env
Copia `.env.example` como `.env`:
```bash
cp .env.example .env
```

### 4. Crear Base de Datos (MySQL)
```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE resiplus_db;"

# Crear usuario
mysql -u root -p -e "CREATE USER 'resiplus_user'@'localhost' IDENTIFIED BY 'resiplus_password_123';"

# Dar permisos
mysql -u root -p -e "GRANT ALL PRIVILEGES ON resiplus_db.* TO 'resiplus_user'@'localhost'; FLUSH PRIVILEGES;"
```

### 5. Crear Tablas
```bash
npm run db:push
```

### 6. Iniciar Servidor
```bash
npm run dev
```

### 7. Acceder
Abre en tu navegador: `http://localhost:5173`

**Credenciales:**
- Usuario: `hermana`
- Contraseña: `password123`

---

## 📖 Guías Completas

| Guía | Descripción |
|------|------------|
| [GUIA_INSTALACION_LOCAL.md](./GUIA_INSTALACION_LOCAL.md) | Instalación paso a paso en tu ordenador |
| [GUIA_DESPLIEGUE_ONLINE.md](./GUIA_DESPLIEGUE_ONLINE.md) | Desplegar online con Vercel + PlanetScale |
| [DOCUMENTACION_USUARIO.md](./DOCUMENTACION_USUARIO.md) | Cómo usar la aplicación |
| [GUIA_USO_RAPIDA.md](./GUIA_USO_RAPIDA.md) | Referencia rápida de funciones |

---

## 🎯 Funcionalidades Principales

### Módulo de Enfermería
- ✅ Registro de constantes vitales
- ✅ Gráficos de evolución
- ✅ Escalas de valoración (Barthel, Norton)

### Módulo de Úlceras
- ✅ Gestión de úlceras por presión
- ✅ Registro de curas
- ✅ Medidas y tratamientos

### Módulo de Incidencias
- ✅ Registro de incidencias
- ✅ Filtrado y búsqueda
- ✅ Resolución documentada

### Módulo de Datos Médicos
- ✅ Patologías (CIE-10)
- ✅ Alergias
- ✅ Antecedentes médicos
- ✅ Medicamentos y tratamientos
- ✅ Procedimientos médicos

---

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor en desarrollo

# Compilación
npm run build            # Compila para producción

# Base de Datos
npm run db:push          # Crea/actualiza tablas
npm run db:studio        # Abre interfaz visual de BD
npm run seed             # Carga datos de ejemplo

# Testing
npm run test             # Ejecuta tests

# Limpieza
npm run clean            # Limpia archivos generados
```

---

## ⚙️ Configuración

### Cambiar Credenciales de Acceso

Edita el archivo `.env`:
```env
ADMIN_USERNAME="tu_usuario"
ADMIN_PASSWORD="tu_contraseña_segura"
```

Reinicia el servidor:
```bash
npm run dev
```

### Cambiar Puerto

Edita el archivo `.env`:
```env
PORT=3001
```

### Usar Base de Datos Online

Edita el archivo `.env`:
```env
DATABASE_URL="mysql://[usuario]:[contraseña]@[host]/resiplus_db?sslaccept=strict"
```

---

## 🐛 Solución de Problemas

### "Cannot find module"
```bash
npm install --legacy-peer-deps
```

### "Connection refused" (Base de datos)
Asegúrate de que MySQL está corriendo:
- Windows: Busca "Services" e inicia MySQL
- Mac: `brew services start mysql`
- Linux: `sudo systemctl start mysql`

### "Port already in use"
Cambia el puerto en `.env` o cierra la aplicación anterior

### "Build failed"
```bash
npm run clean
npm install --legacy-peer-deps
npm run build
```

---

## 📦 Despliegue Online

Para desplegar en Vercel + PlanetScale, sigue:
[GUIA_DESPLIEGUE_ONLINE.md](./GUIA_DESPLIEGUE_ONLINE.md)

---

## 📚 Documentación

- **Usuarios:** [DOCUMENTACION_USUARIO.md](./DOCUMENTACION_USUARIO.md)
- **Desarrolladores:** [MEJORAS_FASE4.md](./MEJORAS_FASE4.md)
- **Cambios:** [RESUMEN_CAMBIOS_FASE4.md](./RESUMEN_CAMBIOS_FASE4.md)

---

## 🆘 Soporte

Si encuentras problemas:

1. Verifica que Node.js y MySQL estén instalados
2. Revisa el archivo `.env` - asegúrate de que sea correcto
3. Consulta los logs en la terminal
4. Lee las guías completas en la carpeta del proyecto

---

## 📝 Licencia

ResiPlus Clone - Proyecto de Práctica para Residencias Geriátricas
Versión 2.3.0

---

## 🎉 ¡Listo para Practicar!

Accede a `http://localhost:5173` y comienza a practicar con ResiPlus Clone.

