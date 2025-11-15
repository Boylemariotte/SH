# 🚀 Deploy en Vercel - Quiz Gamificado

## 📋 **Estado: VERCEL READY** ✅

- **Frontend:** React + Vite
- **Backend:** Serverless Functions
- **API:** Groq Integration
- **Deploy:** Automático con GitHub

---

## 🎯 **Pasos para Deploy**

### **1. Subir a GitHub**

```bash
# Asegurarse que todo está commiteado
git add .
git commit -m "Ready for Vercel deploy"
git push origin main
```

### **2. Conectar con Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Sign up con GitHub
3. Click "New Project"
4. Selecciona tu repo `SH`
5. Configura variables de entorno

### **3. Variables de Entorno**

En Vercel dashboard → Settings → Environment Variables:

```env
VITE_GROQ_API_KEY=gsk_tu_api_key_real
VITE_API_URL=https://tu-proyecto.vercel.app
```

**Importante:** No necesitas `VITE_API_URL` en Vercel, las funciones API están en el mismo dominio.

---

## 🔧 **Configuración Automática**

### **vercel.json** ✅
- Configura serverless functions
- Build automático con `npm run build`
- Rutas API correctamente mapeadas

### **Serverless Functions** ✅
```
/api/generate-quiz    → api/generate-quiz.js
/api/health          → api/health.js
/api/stats/save      → api/stats/save.js
/api/prompts/templates → api/prompts/templates.js
/api/rate-limit      → api/rate-limit.js
```

---

## ⚡ **Comandos Útiles**

```bash
# Build local para testing
npm run build

# Preview local
npm run preview

# Deploy manual (si tienes Vercel CLI)
vercel --prod
```

---

## 🧪 **Post-Deploy Testing**

1. **Health Check:**
   ```
   https://tu-proyecto.vercel.app/api/health
   ```

2. **Frontend:**
   ```
   https://tu-proyecto.vercel.app
   ```

3. **API Test:**
   ```bash
   curl -X POST https://tu-proyecto.vercel.app/api/generate-quiz \
   -H "Content-Type: application/json" \
   -d '{"prompt":"Test","apiKey":"gsk_your_key"}'
   ```

---

## 📊 **Ventajas de Vercel**

✅ **Frontend + Backend juntos**  
✅ **Sin problemas de CORS**  
✅ **Deploy automático**  
✅ **CDN global**  
✅ **HTTPS automático**  
✅ **Preview deployments**  
✅ **Analytics integrado**  

---

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Build fails:**
   ```bash
   npm run build -- --force
   ```

2. **API not found:**
   - Revisa estructura `/api/`
   - Verifica `vercel.json`

3. **Environment variables:**
   - Deben empezar con `VITE_`
   - Re-deploy después de cambiarlas

4. **CORS issues:**
   - Configurado en cada función
   - Headers automáticos

---

## 📈 **Monitoreo**

### **Vercel Dashboard:**
- **Analytics:** Tráfico y rendimiento
- **Logs:** Errores y debugging
- **Functions:** Uso de serverless
- **Deployments:** Historial de cambios

---

## 🎉 **¡Listo para Producción!**

**Tiempo estimado de deploy:** 5-10 minutos  
**Costo:** Gratis para uso moderado  
**Escalabilidad:** Automática

**Tu aplicación está optimizada para Vercel:**
- Serverless functions
- Build optimizado
- Variables de entorno configuradas
- CORS habilitado

---

## 🔄 **Actualizaciones Futuras**

```bash
# Para actualizar producción
git add .
git commit -m "Update feature"
git push origin main
# Vercel deploy automático 🚀
```

**¡Felicidades! Tu quiz gamificado está listo para Vercel.**
