# Informe Completo del Proyecto: Quiz Gamificado con IA

## 1. Contenido del Proyecto
El proyecto **"Quiz Gamificado"** es una plataforma educativa interactiva diseñada para potenciar el aprendizaje mediante la generación automática de contenido de estudio. Utiliza inteligencia artificial para crear cuestionarios (quizzes) y guías de estudio personalizadas sobre cualquier tema que el usuario desee.

El núcleo de la aplicación combina tecnologías web modernas (React) con potentes modelos de lenguaje (LLMs) para ofrecer una experiencia de "micro-learning" gamificada, similar a aplicaciones como Duolingo, pero flexible a cualquier materia.

## 2. Funcionalidades Aplicadas

### Generación de Contenido con IA
- **Modo Quiz:** Generación de preguntas de opción múltiple (3, 5, 10, 15 o 20 preguntas) sobre cualquier tema.
- **Niveles de Dificultad:** Adaptación del contenido a 4 niveles:
  - 😊 Fácil (Principiante)
  - 🧠 Medio (Intermedio)
  - 🔥 Difícil (Avanzado)
  - 💎 Experto (Nivel Universitario)
- **Guías de Estudio:** Creación de material de lectura estructurado con introducción, conceptos clave, ejemplos y aplicaciones prácticas.
- **Estudio desde Archivo:** Capacidad para subir documentos de texto y generar quizzes o guías basados específicamente en ese contenido.

### Sistema de Gamificación
- **Puntos y Recompensas:** Algoritmo de puntuación basado en la dificultad y racha de aciertos.
- **Vidas:** Sistema de 3 vidas (corazones) que se pierden al fallar respuestas.
- **Rachas (Streaks):** Contador de días consecutivos de estudio para fomentar el hábito.
- **Feedback Visual:** Animaciones de celebración, barras de progreso y tarjetas de resultados detalladas.

### Gestión de Usuario
- **Historial:** Almacenamiento local de los últimos quizzes realizados.
- **Estadísticas:** Panel con métricas de rendimiento (precisión, total de quizzes, racha actual).

### Arquitectura Técnica
- **Backend Proxy:** Servidor Express intermedio para manejar las peticiones a la IA, gestionar CORS y aplicar límites de velocidad (Rate Limiting de 20 req/min).
- **Validación:** Uso de `Joi` para validar la integridad de los datos de entrada y salida.

## 3. Modelo de IA e Integración con Groq

El proyecto ha migrado de Hugging Face a **Groq** para mejorar drásticamente la velocidad y calidad de las respuestas.

- **Proveedor:** Groq Cloud
- **Modelo Utilizado:** `llama-3.3-70b-versatile`
  - Este es un modelo de código abierto de Meta (Llama 3.3), optimizado por Groq para inferencia de ultra-baja latencia.
  - Capacidad de 70 billones de parámetros, lo que le permite entender contextos complejos y generar contenido educativo de alta calidad en español.
- **Implementación:**
  - Las peticiones se envían a través del proxy local (`server.js`) a `https://api.groq.com/openai/v1/chat/completions`.
  - Se utiliza "Prompt Engineering" avanzado para forzar al modelo a responder estrictamente en formato JSON (para quizzes) o Markdown estructurado (para guías), garantizando que la aplicación pueda procesar la respuesta sin errores.

## 4. Descripción de UI/UX (Interfaz y Experiencia de Usuario)

### Diseño Visual (UI)
El diseño sigue una estética **"Duo-style"** (inspirada en aplicaciones de gamificación modernas):
- **Paleta de Colores:** Gradientes vibrantes en tonos violeta, azul y índigo (`#6B46C1` a `#805AD5`), transmitiendo una sensación moderna y enérgica.
- **Componentes:**
  - Tarjetas con bordes redondeados (20px) y sombras suaves (`box-shadow`) para dar profundidad.
  - Iconografía consistente usando la librería `lucide-react`.
  - Tipografía `Inter` para máxima legibilidad en pantallas.

### Experiencia de Usuario (UX)
- **Fluidez:** Transiciones suaves entre pantallas (Inicio -> Carga -> Quiz -> Resultados).
- **Interactividad:**
  - Efectos `hover` en botones y opciones de respuesta.
  - Feedback inmediato: Las respuestas correctas se iluminan en verde y las incorrectas en rojo al instante.
- **Estados de Carga:** Pantallas de carga informativas con barras de progreso y mensajes dinámicos ("Generando preguntas...", "Analizando tema...") para mantener al usuario enganchado mientras la IA "piensa".
- **Responsividad:** Diseño totalmente adaptativo que funciona en escritorio y dispositivos móviles.

## 5. Estado Actual del Proyecto

El proyecto se encuentra en una fase avanzada de desarrollo (**Beta Funcional**):

- ✅ **Core Funcional:** La generación de quizzes y guías funciona correctamente con la integración de Groq.
- ✅ **Persistencia:** Los datos del usuario se guardan localmente (LocalStorage).
- ✅ **Despliegue:** Configurado para ser desplegado en plataformas como Vercel (Frontend) y Render (Backend), con scripts de construcción (`npm run build`) listos.
- 🔄 **Áreas de Mejora Potencial:**
  - Persistencia en base de datos real (actualmente es LocalStorage).
  - Autenticación de usuarios (Login/Registro).
  - Modo multijugador o rankings globales.

En resumen, es una aplicación educativa robusta, visualmente atractiva y tecnológicamente moderna que aprovecha la velocidad de Groq para ofrecer una experiencia de usuario fluida.
