# 🚀 Configuración del Servidor Backend

El servidor backend ha sido movido a la carpeta `server/` y está completamente separado del cliente.

## 📁 Estructura del Proyecto

```
SH/
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Express.js) ← NUEVO
└── ...
```

## 🔧 Instalación del Servidor

```bash
cd server
npm install
```

## ⚙️ Configuración

1. **Crear archivo `.env` en la carpeta `server/`:**

```bash
cd server
cp .env.example .env
```

2. **Editar `.env` con tus configuraciones:**

```env
PORT=3001
NODE_ENV=development
# GROQ_API_KEY=gsk_tu_api_key (opcional si se envía desde el frontend)
```

## ▶️ Ejecución

### Desarrollo (con auto-reload)
```bash
cd server
npm run dev
```

### Producción
```bash
cd server
npm start
```

El servidor se ejecutará en `http://localhost:3001`

## 🌐 Ejecutar Frontend y Backend Juntos

Necesitas **DOS terminales**:

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

## ✅ Verificar que Funciona

Una vez que ambos servidores estén corriendo:

1. **Health Check del Backend:**
   ```
   http://localhost:3001/api/health
   ```

2. **Frontend:**
   ```
   http://localhost:5173 (o el puerto que Vite asigne)
   ```

## 📝 Notas

- El servidor backend está completamente independiente del cliente
- Las funciones serverless en `client/api/` se mantienen para despliegue en Vercel
- El servidor Express en `server/` es para desarrollo local y producción tradicional

