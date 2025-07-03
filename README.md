# LabSuite Full Stack 🧪

Sistema completo de gestión de laboratorio con frontend Vue.js y backend Node.js, configurado para desarrollo y producción con PM2 y nginx.

## 📁 Estructura del Proyecto

```
LabSuite-full/
├── apirest-rowesuite-v5/         # 🔧 Backend (Node.js + Fastify + MongoDB + SQL Server)
├── LABSUITE-FRONTEND-V5/         # 🎨 Frontend (Vue.js 3 + Vuetify)
├── ecosystem.config.js           # ⚙️ Configuración PM2
├── start-frontend.js             # 🚀 Script de inicio para frontend
├── package.json                  # 📦 Scripts globales
├── dev.config.js                 # 🔧 Configuraciones centralizadas
├── PM2-GUIDE.md                  # 📖 Guía específica de PM2
├── setup.js                      # 🛠️ Script de configuración automática
├── LabSuite.code-workspace       # 💻 Workspace de VS Code
└── README.md                     # 📖 Este archivo
```

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js** 18+ 
- **npm** (para backend)
- **pnpm** (para frontend)
- **PM2** (gestor de procesos)
- **MongoDB** (puerto 21017-21019 con ReplicaSet)
- **SQL Server** (puerto 1433)
- **nginx** (proxy y servidor web)

### Configuración Inicial
```bash
# 1. Instalar dependencias
npm run install:all

# 2. Instalar PM2 globalmente
npm install -g pm2

# 3. Configurar variables de entorno
cp apirest-rowesuite-v5/.env.example apirest-rowesuite-v5/.env
cp LABSUITE-FRONTEND-V5/.env.example LABSUITE-FRONTEND-V5/.env

# 4. Iniciar todo el stack
npm run dev
```

## 🔧 Scripts Disponibles

### 📦 Gestión de Dependencias
```bash
npm run install:all          # Instalar todas las dependencias
npm run backend:install      # Solo backend (npm)
npm run frontend:install     # Solo frontend (pnpm)
```

### 🚀 Desarrollo
```bash
npm run dev                  # Iniciar todo con PM2
npm run dev:backend          # Solo backend con PM2
npm run dev:frontend         # Solo frontend con PM2
npm run backend:dev          # Solo backend (manual)
npm run frontend:dev         # Solo frontend (manual)
```

### 📊 Monitoreo y Control PM2
```bash
npm run logs                 # Ver logs de todos los procesos
npm run logs:backend         # Solo logs del backend
npm run logs:frontend        # Solo logs del frontend
npm run status               # Estado de todos los procesos
npm run monit                # Monitor interactivo de PM2
npm run restart              # Reiniciar todos los procesos
npm run reload               # Reload sin downtime
npm run stop                 # Parar todos los procesos
npm run kill                 # Matar todos los procesos PM2
```

### 🏗️ Build y Testing
```bash
npm run backend:build        # Build del backend
npm run frontend:build       # Build del frontend
npm run test                 # Ejecutar todos los tests
npm run lint                 # Linter en todo el proyecto
npm run clean               # Limpiar node_modules y dist
npm run reset               # Reset completo del proyecto
```

## 🌐 URLs y Configuración

### URLs de Desarrollo

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación Vue.js (directo) |
| **Frontend (nginx)** | http://localhost:8080 | Aplicación Vue.js (proxy) |
| **Backend API** | http://localhost:3100 | API REST |
| **API via nginx** | http://localhost:8080/api/ | API REST (proxy) |

### Configuración de nginx

El sistema usa nginx como proxy reverso para evitar problemas de CORS:

```nginx
# Frontend directo: localhost:5173
# Frontend via nginx: localhost:8080
# Backend directo: localhost:3100
# Backend via nginx: localhost:8080/api/
```

**Flujo de datos:**
```
Frontend (localhost:5173) → API calls (localhost:8080/api/) → nginx → Backend (localhost:3100)
```

## 📋 Configuración Específica de LabSuite

### Variables de Entorno del Backend

```env
# Puerto del servidor
PORT=3100

# MongoDB con ReplicaSet
MONGO_URI=mongodb://rowlabs-user:password@localhost:21017,localhost:21018,localhost:21019/DEVROWLAB?replicaSet=rowelab&authSource=DEVROWLAB

# SQL Server
SQL_SERVER_HOST_DB1=127.0.0.1
SQL_SERVER_PORT_DB1=1433
SQL_SERVER_USER_DB1=sa
SQL_SERVER_PASSWORD_DB1=password
SQL_SERVER_DATABASE_DB1=DEVROWLAB

# JWT y Autenticación
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Configuración de entorno
NODE_ENV=development
```

### Variables de Entorno del Frontend

```env
# URLs de API
VITE_API_BASE_URL=http://localhost:8080/api/v1/
VITE_IMAGE_BASE_URL=http://localhost:8080

# Configuración de aplicación
VITE_APP_NAME=LabSuite
VITE_APP_VERSION=5.0.0

# Configuración de desarrollo
VITE_DEV_MODE=true
```

### Configuración de Autenticación

El sistema de autenticación de LabSuite usa los siguientes campos:

```javascript
// Formato de login correcto
const loginData = {
  userCode: "11801",           // Código de usuario
  password: "contraseña",      // Contraseña
  authType: "Crome",          // Tipo de autenticación (para Chrome)
  appName: "LabSuite",        // Nombre de la aplicación
  userAgent: "navegador info", // Información del navegador
  remember: false             // Recordar sesión
}
```

#### Tipos de Autenticación Válidos (`authType`)
- ✅ `"standard"` (por defecto)
- ✅ `"ldap"` (Active Directory)
- ✅ `"sso"` (Single Sign-On)
- ✅ `"Crome"` (Chrome - se normaliza a standard)
- ✅ `"chrome"` (Chrome - se normaliza a standard)
- ✅ `"Chrome"` (Chrome - se normaliza a standard)
- ✅ `"CHROME"` (Chrome - se normaliza a standard)
- ✅ `"local"` (Local - se normaliza a standard)

**Importante**: Para Chrome usar `"Crome"` (no "Chrome") según la configuración del backend.

## 🔧 Arquitectura del Sistema

### Backend (apirest-rowesuite-v5)
- **Framework**: Node.js + Fastify
- **Package Manager**: npm
- **Base de datos**: MongoDB (ReplicaSet) + SQL Server
- **Puerto**: 3100
- **Autenticación**: JWT + Roles
- **Módulos principales**:
  - Control Lab Traceability
  - Gestión de Equipos
  - Gestión de Procesos
  - Sistema de Auditoría
  - Auto-scheduler

### Frontend (LABSUITE-FRONTEND-V5)
- **Framework**: Vue.js 3 + Composition API
- **Package Manager**: pnpm
- **UI Library**: Vuetify
- **Build Tool**: Vite
- **Puerto**: 5173
- **State Management**: Pinia
- **Router**: Vue Router
- **Componentes principales**:
  - Dashboard
  - Control Labs
  - Gestión de Equipos
  - Reportes
  - Configuración

## 🐳 Configuración de PM2

### Procesos Incluidos

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'labsuite-backend',
      script: 'src/main.js',
      cwd: './apirest-rowesuite-v5',
      env: {
        NODE_ENV: 'development',
        PORT: 3100
      },
      watch: ['src'],
      ignore_watch: ['node_modules', 'logs'],
      exec_mode: 'fork',
      instances: 1
    },
    {
      name: 'labsuite-frontend',
      script: '../start-frontend.js',
      cwd: './LABSUITE-FRONTEND-V5',
      env: {
        NODE_ENV: 'development'
      },
      watch: false,
      exec_mode: 'fork',
      instances: 1
    }
  ]
}
```

### Comandos PM2 Útiles

```bash
# Ver estado detallado
pm2 status
pm2 show labsuite-backend
pm2 show labsuite-frontend

# Logs específicos
pm2 logs labsuite-backend
pm2 logs labsuite-frontend

# Reiniciar procesos específicos
pm2 restart labsuite-backend
pm2 restart labsuite-frontend

# Monitor interactivo
pm2 monit

# Métricas web
pm2 web
```

## 🔍 Troubleshooting

### Problema: CORS Error
**Síntoma**: Error de CORS en el navegador
**Solución**: 
- Verificar que nginx esté corriendo
- Usar `http://localhost:8080/api/` en lugar de `http://localhost:3100/api/`
- Revisar configuración nginx

### Problema: authType validation error
**Síntoma**: "body/authType must be equal to one of the allowed values"
**Solución**: 
- Verificar que authType sea uno de los valores válidos
- Para Chrome usar `"Crome"` 
- Incluir `appName: "LabSuite"`

### Problema: Base de datos no conecta
**Síntoma**: Error de conexión a MongoDB o SQL Server
**Solución**:
```bash
# Verificar MongoDB ReplicaSet
mongo --host localhost:21017 --eval "db.isMaster()"

# Verificar SQL Server
sqlcmd -S localhost,1433 -U sa -P password -Q "SELECT @@VERSION"
```

### Problema: PM2 no inicia
**Síntoma**: Procesos PM2 no responden
**Solución**:
```bash
# Limpiar PM2
pm2 kill
pm2 flush

# Reiniciar
npm run dev

# Verificar logs
pm2 logs --lines 50
```

### Problema: Puertos ocupados
**Síntoma**: EADDRINUSE error
**Solución**:
```bash
# Windows
netstat -ano | findstr :3100
netstat -ano | findstr :5173
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:3100
kill -9 <pid>
```

### Problema: Frontend no se actualiza
**Síntoma**: Cambios no reflejan en el navegador
**Solución**:
- Verificar que el proceso PM2 esté corriendo
- Reiniciar proceso frontend: `pm2 restart labsuite-frontend`
- Limpiar caché del navegador (Ctrl+Shift+R)

## 🔒 Seguridad

### Variables de Entorno Sensibles
```env
# Nunca commitear estas variables
JWT_SECRET=
MONGO_URI=
SQL_SERVER_PASSWORD_DB1=
```

### Configuración de Producción
```bash
# Usar PM2 en modo cluster
pm2 start ecosystem.config.js --env production

# Configurar logs
pm2 install pm2-logrotate

# Monitoreo
pm2 install pm2-server-monit
```

## 📊 Monitoreo y Logs

### Ubicación de Logs
```
# Backend
./apirest-rowesuite-v5/logs/

# PM2
~/.pm2/logs/
```

### Comandos de Monitoreo
```bash
# Logs en tiempo real
npm run logs

# Logs filtrados
pm2 logs --lines 100 labsuite-backend

# Monitor de recursos
pm2 monit

# Información del sistema
pm2 info labsuite-backend
```

## 🚀 Deploy a Producción

### Configuración de nginx para Producción
```nginx
# /etc/nginx/sites-available/labsuite
server {
    listen 80;
    server_name labsuite.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:3100/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### PM2 para Producción
```bash
# Iniciar en modo producción
pm2 start ecosystem.config.js --env production

# Configurar inicio automático
pm2 startup
pm2 save

# Monitoreo con PM2 Plus
pm2 plus
```

## 🤝 Contribución

### Workflow de Desarrollo
```bash
# 1. Crear rama
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar
npm run dev

# 3. Testing
npm run test
npm run lint

# 4. Commit
git add .
git commit -m "feat: agregar nueva funcionalidad"

# 5. Push
git push origin feature/nueva-funcionalidad
```

### Convenciones
- **Commits**: Usar conventional commits
- **Branches**: feature/, bugfix/, hotfix/
- **Testing**: Escribir tests para nuevas funcionalidades
- **Documentation**: Actualizar README cuando sea necesario

## 📞 Soporte

### Información de Contacto
- **Documentación**: Ver archivos en `/docs/`
- **Issues**: Crear issue en el repositorio
- **Logs**: Revisar logs de PM2 y aplicación

### Comandos de Diagnóstico
```bash
# Estado completo del sistema
npm run status

# Logs detallados
npm run logs

# Información del sistema
pm2 info labsuite-backend
pm2 info labsuite-frontend

# Verificar conexiones
netstat -an | grep :3100
netstat -an | grep :5173
netstat -an | grep :8080
```

---

**LabSuite** - Sistema completo de gestión de laboratorio con tecnologías modernas y configuración optimizada para desarrollo y producción. # LabSuite-FullStack
