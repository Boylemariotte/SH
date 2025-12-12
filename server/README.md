# 🚀 Servidor Backend - Quiz Gamificado

Servidor Express.js independiente para la aplicación Quiz Gamificado.

## 📋 Características

- ✅ API RESTful con Express.js
- ✅ Rate limiting (20 peticiones/minuto)
- ✅ Validación de datos con Joi
- ✅ Protección contra contenido malicioso
- ✅ Integración con Groq API
- ✅ Manejo de errores robusto
- ✅ CORS configurado
- ✅ Timeout de 30 segundos para peticiones

## 🏗️ Estructura del Proyecto

```
server/
├── server.js              # Punto de entrada principal
├── routes/                # Rutas de la API
│   ├── quiz.js           # Rutas de generación de quizzes
│   ├── health.js         # Rutas de salud y rate limiting
│   ├── stats.js          # Rutas de estadísticas
│   └── prompts.js        # Rutas de plantillas de prompts
├── middleware/            # Middlewares personalizados
│   ├── contentValidator.js
│   ├── errorHandler.js
│   └── notFoundHandler.js
├── validators/            # Esquemas de validación
│   ├── quizValidator.js
│   └── statsValidator.js
├── package.json
├── .env.example
└── README.md
```

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
cd server
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

## ▶️ Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3001` por defecto.

## 📡 Endpoints Disponibles

### POST `/api/generate-quiz`
Genera un quiz usando la API de Groq.

**Body:**
```json
{
  "prompt": "Genera preguntas sobre JavaScript",
  "apiKey": "gsk_tu_api_key"
}
```

**Response:**
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "llama-3.3-70b-versatile",
  "choices": [...]
}
```

### GET `/api/health`
Verifica el estado del servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### GET `/api/rate-limit`
Obtiene información sobre el rate limiting.

**Response:**
```json
{
  "limit": "20 requests per minute",
  "window": "1 minute",
  "remaining": 15
}
```

### POST `/api/stats/save`
Guarda estadísticas del usuario (actualmente solo las loguea).

**Body:**
```json
{
  "userStats": {},
  "quizHistory": [],
  "pointsData": {}
}
```

### GET `/api/prompts/templates`
Obtiene plantillas de prompts predefinidos.

**Response:**
```json
{
  "templates": {
    "quiz": {...},
    "guide": {...}
  },
  "usage": "Reemplaza {topic} con tu tema específico"
}
```

## 🔒 Seguridad

- **Rate Limiting:** Máximo 20 peticiones por minuto
- **Validación de entrada:** Todos los datos se validan con Joi
- **Protección XSS:** Validación de contenido sospechoso
- **Timeout:** 30 segundos máximo por petición
- **CORS:** Configurado para permitir peticiones del frontend

## 🛠️ Tecnologías

- **Express.js** - Framework web
- **Joi** - Validación de esquemas
- **express-rate-limit** - Rate limiting
- **node-fetch** - Cliente HTTP
- **cors** - Manejo de CORS

## 📝 Notas

- El servidor actúa como proxy entre el frontend y la API de Groq
- La API key puede enviarse desde el frontend en desarrollo o configurarse en variables de entorno
- Las estadísticas actualmente solo se loguean, pero están preparadas para persistencia futura en base de datos

