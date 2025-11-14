# Configuración de Groq API

La API de Hugging Face antigua ya no está disponible. Ahora usamos **Groq** que es gratuita y muy rápida.

## Pasos para obtener tu API Key de Groq:

1. Ve a https://console.groq.com/
2. Crea una cuenta gratuita (puedes usar Google, GitHub, etc.)
3. Una vez dentro, ve a "API Keys" en el menú lateral
4. Haz clic en "Create API Key"
5. Copia la API key generada

## Configurar la API Key:

1. Abre el archivo `.env` en la raíz del proyecto
2. Agrega o reemplaza con:
   ```
   VITE_GROQ_API_KEY=tu_api_key_aqui
   ```
3. Guarda el archivo
4. Recarga la página del navegador

## Ejecutar el proyecto:

Necesitas ejecutar DOS comandos en terminales separadas:

### Terminal 1 - Servidor Proxy:
```bash
npm run server
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

## Ventajas de Groq:

- ✅ Completamente gratuito
- ✅ Muy rápido (más rápido que Hugging Face)
- ✅ Modelos potentes (Llama 3.3 70B)
- ✅ Sin problemas de CORS
- ✅ API estable y confiable
