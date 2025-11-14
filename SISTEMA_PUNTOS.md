# 🏆 Sistema de Puntos - Documentación

## 📋 Descripción General

El sistema de puntos gamifica la experiencia de aprendizaje, recompensando a los usuarios por completar quizzes según la dificultad y su rendimiento.

## 🎯 Puntos por Dificultad (100% de Aciertos)

| Dificultad | Emoji | Puntos | Descripción |
|------------|-------|--------|-------------|
| **Fácil** | 😊 | 10 pts | Preguntas básicas para principiantes |
| **Medio** | 🧠 | 20 pts | Nivel intermedio, requiere comprensión |
| **Difícil** | 🔥 | 30 pts | Preguntas avanzadas y desafiantes |
| **Experto** | 💎 | 50 pts | Nivel experto con detalles técnicos |

## 📊 Cálculo de Puntos

### Fórmula

```javascript
if (porcentajeAciertos === 100%) {
  puntos = puntosBase[dificultad]
} else if (porcentajeAciertos >= 50%) {
  puntos = Math.floor(puntosBase[dificultad] * porcentajeAciertos)
} else {
  puntos = 0
}
```

### Ejemplos

#### Quiz Fácil (10 puntos base)
- ✅ 5/5 correctas (100%) → **10 puntos**
- ⚠️ 4/5 correctas (80%) → **8 puntos**
- ⚠️ 3/5 correctas (60%) → **6 puntos**
- ❌ 2/5 correctas (40%) → **0 puntos**

#### Quiz Medio (20 puntos base)
- ✅ 10/10 correctas (100%) → **20 puntos**
- ⚠️ 8/10 correctas (80%) → **16 puntos**
- ⚠️ 5/10 correctas (50%) → **10 puntos**
- ❌ 4/10 correctas (40%) → **0 puntos**

#### Quiz Difícil (30 puntos base)
- ✅ 10/10 correctas (100%) → **30 puntos**
- ⚠️ 7/10 correctas (70%) → **21 puntos**
- ❌ 3/10 correctas (30%) → **0 puntos**

#### Quiz Experto (50 puntos base)
- ✅ 20/20 correctas (100%) → **50 puntos**
- ⚠️ 15/20 correctas (75%) → **37 puntos**
- ⚠️ 10/20 correctas (50%) → **25 puntos**
- ❌ 8/20 correctas (40%) → **0 puntos**

## 💾 Persistencia de Datos

### LocalStorage

Los puntos se guardan automáticamente en el navegador:

```javascript
// Datos guardados
localStorage.setItem('quiz_total_points', totalPoints)
localStorage.setItem('quiz_points_history', JSON.stringify(history))
```

### Estructura del Historial

```javascript
{
  points: 20,              // Puntos ganados
  date: "2025-11-09T...",  // Fecha ISO
  topic: "JavaScript",     // Tema del quiz
  difficulty: "medio",     // Dificultad
  correctAnswers: 10,      // Respuestas correctas
  totalQuestions: 10       // Total de preguntas
}
```

## 🎨 Características Visuales

### 1. Badge de Puntos Totales
- **Ubicación**: Esquina superior derecha
- **Color**: Gradiente morado (#667eea → #764ba2)
- **Animación**: Hover con scale 1.1
- **Icono**: Award (medalla)

### 2. Información de Puntos (Pantalla Input)
- **Diseño**: Card con gradiente rosa (#f093fb → #f5576c)
- **Contenido**: 
  - Puntos por cada dificultad
  - Nota sobre puntos parciales
- **Grid**: 2 columnas para mejor visualización

### 3. Puntos Ganados (Pantalla Resultados)
- **Animación**: slideInUp + pulse
- **Color**: 
  - Verde/Morado si ganaste puntos
  - Gris si no ganaste puntos
- **Tamaño**: Número grande (36px) con icono
- **Badge especial**: "🎯 ¡Perfecto!" si aciertas 100%

### 4. Total Acumulado (Pantalla Resultados)
- **Color**: Gradiente rosa (#f093fb → #f5576c)
- **Icono**: Trophy (trofeo)
- **Tamaño**: 28px bold
- **Ubicación**: Debajo de puntos ganados

## 🔧 Arquitectura Técnica

### Hook Personalizado: `usePoints`

```javascript
const {
  totalPoints,        // Total de puntos acumulados
  pointsHistory,      // Historial de quizzes
  calculatePoints,    // Función para calcular puntos
  addPoints,          // Función para agregar puntos
  resetPoints,        // Función para resetear (testing)
  getStats,           // Obtener estadísticas
  POINTS_BY_DIFFICULTY // Constante con puntos base
} = usePoints();
```

### Funciones Principales

#### `calculatePoints(difficulty, correctAnswers, totalQuestions)`
Calcula los puntos ganados basado en el rendimiento.

**Parámetros:**
- `difficulty`: 'facil' | 'medio' | 'dificil' | 'experto'
- `correctAnswers`: Número de respuestas correctas
- `totalQuestions`: Total de preguntas del quiz

**Retorna:** `number` - Puntos ganados

#### `addPoints(points, quizData)`
Agrega puntos al total y guarda en el historial.

**Parámetros:**
- `points`: Puntos a agregar
- `quizData`: Objeto con información del quiz

#### `getStats()`
Obtiene estadísticas completas del usuario.

**Retorna:**
```javascript
{
  totalPoints: 150,
  totalQuizzes: 8,
  averagePoints: 18,
  quizzesByDifficulty: {
    facil: 3,
    medio: 4,
    dificil: 1
  },
  lastQuiz: { /* último quiz completado */ }
}
```

## 🎮 Flujo de Usuario

### 1. Pantalla de Input
```
┌─────────────────────────────┐
│  [🏆 150 pts]              │  ← Badge de puntos totales
│                             │
│  Study Helper               │
│                             │
│  Tema: _________            │
│  Dificultad: Medio          │
│  Preguntas: 5               │
│                             │
│  ┌─────────────────────┐   │
│  │ Puntos por 100%:    │   │
│  │ 😊 Fácil: 10 pts    │   │
│  │ 🧠 Medio: 20 pts    │   │
│  │ 🔥 Difícil: 30 pts  │   │
│  │ 💎 Experto: 50 pts  │   │
│  └─────────────────────┘   │
│                             │
│  [Generar Quiz con IA]      │
└─────────────────────────────┘
```

### 2. Completar Quiz
- Usuario responde preguntas
- Sistema cuenta aciertos
- Al finalizar → Pantalla de resultados

### 3. Pantalla de Resultados
```
┌─────────────────────────────┐
│  🎉 ¡Felicitaciones!        │
│                             │
│  Score: 500                 │
│  Correctas: 5               │
│  Incorrectas: 0             │
│  Porcentaje: 100%           │
│                             │
│  ┌─────────────────────┐   │
│  │   🏆 +20            │   │ ← Animación pulse
│  │  Puntos Ganados     │   │
│  │ 🎯 ¡Perfecto!       │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  Total Acumulado    │   │
│  │   🏆 170 puntos     │   │
│  └─────────────────────┘   │
│                             │
│  [Nuevo Quiz]               │
└─────────────────────────────┘
```

## 🎨 Animaciones CSS

### `pulse`
```css
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```
**Uso**: Puntos ganados cuando aparecen

### `slideInUp`
```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
**Uso**: Entrada de la tarjeta de puntos ganados

### `bounce`
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```
**Uso**: Celebración de puntos perfectos

## 📱 Responsive Design

El sistema de puntos es completamente responsive:

- **Desktop**: Grid 2 columnas para puntos por dificultad
- **Mobile**: Ajuste automático de tamaños de fuente
- **Tablet**: Optimización de espaciados

## 🔒 Seguridad y Privacidad

- ✅ Datos guardados solo en el navegador del usuario
- ✅ No se envía información a servidores externos
- ✅ El usuario puede limpiar datos borrando localStorage
- ✅ No se recopila información personal

## 🚀 Mejoras Futuras Posibles

1. **Niveles de Usuario**
   - Bronce: 0-100 pts
   - Plata: 101-500 pts
   - Oro: 501-1000 pts
   - Platino: 1001+ pts

2. **Logros/Badges**
   - "Perfeccionista": 10 quizzes al 100%
   - "Estudioso": 50 quizzes completados
   - "Experto": 10 quizzes en nivel experto

3. **Racha de Días**
   - Contador de días consecutivos estudiando
   - Bonus por mantener racha

4. **Tabla de Clasificación**
   - Comparar con otros usuarios (opcional)
   - Rankings por tema

5. **Exportar Estadísticas**
   - Descargar historial en CSV
   - Gráficos de progreso

## 🐛 Debugging

### Ver puntos en consola
```javascript
// En la consola del navegador
localStorage.getItem('quiz_total_points')
localStorage.getItem('quiz_points_history')
```

### Resetear puntos
```javascript
// En la consola del navegador
localStorage.removeItem('quiz_total_points')
localStorage.removeItem('quiz_points_history')
```

### Agregar puntos manualmente (testing)
```javascript
// En la consola del navegador
localStorage.setItem('quiz_total_points', '1000')
```

## 📊 Métricas de Éxito

El sistema de puntos es exitoso si:

1. ✅ Los usuarios completan más quizzes
2. ✅ Los usuarios intentan dificultades más altas
3. ✅ Los usuarios vuelven a usar la aplicación
4. ✅ Los usuarios se sienten motivados a mejorar

## 🎓 Conclusión

El sistema de puntos transforma el aprendizaje en una experiencia gamificada y motivadora, incentivando a los usuarios a:

- 📚 Estudiar más temas
- 🎯 Mejorar su precisión
- 🚀 Desafiarse con niveles más difíciles
- 🏆 Acumular logros visibles

¡Disfruta aprendiendo y acumulando puntos! 🎉
