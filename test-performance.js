import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001';
const API_KEY = 'gsk_test123'; // API key de prueba

// Test data
const testPrompt = `Basado en el siguiente texto, genera 5 preguntas de opción múltiple:

TEXTO:
La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar en energía química. Este proceso ocurre en las hojas, específicamente en los cloroplastos. La clorofila, el pigmento verde de las plantas, absorbe la energía luminosa. Durante la fotosíntesis, las plantas toman dióxido de carbono del aire y agua del suelo, y producen glucosa (azúcar) y oxígeno. La ecuación general de la fotosíntesis es: 6CO₂ + 6H₂O + luz solar → C₆H₁₂O₆ + 6O₂.

Genera preguntas de nivel medio sobre este tema.

Formato requerido:
[
  {
    "question": "Pregunta clara",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correct": 0
  }
]`;

async function testSingleRequest() {
  console.log('🧪 Prueba de solicitud individual...');
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${API_URL}/api/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: testPrompt,
        apiKey: API_KEY
      })
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (!response.ok) {
      const error = await response.json();
      console.log(`❌ Error: ${error.error}`);
      return { success: false, duration, error: error.error };
    }
    
    const data = await response.json();
    console.log(`✅ Éxito - Duración: ${duration}ms`);
    console.log(`📊 Tokens usados: ${data.usage?.total_tokens || 'N/A'}`);
    
    return { success: true, duration, data };
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`❌ Error de conexión: ${error.message}`);
    return { success: false, duration, error: error.message };
  }
}

async function testConcurrentRequests(numRequests = 5) {
  console.log(`🚀 Prueba de carga concurrente (${numRequests} solicitudes)...`);
  const startTime = Date.now();
  
  const promises = Array(numRequests).fill().map((_, index) => 
    testSingleRequest().then(result => ({ ...result, requestId: index + 1 }))
  );
  
  const results = await Promise.all(promises);
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n📈 Resultados de carga concurrente:`);
  console.log(`✅ Exitosas: ${successful.length}/${numRequests}`);
  console.log(`❌ Fallidas: ${failed.length}/${numRequests}`);
  console.log(`⏱️  Tiempo total: ${totalDuration}ms`);
  console.log(`📊 Tiempo promedio: ${Math.round(successful.reduce((sum, r) => sum + r.duration, 0) / successful.length)}ms`);
  console.log(`🔥 Tiempo más rápido: ${Math.min(...successful.map(r => r.duration))}ms`);
  console.log(`🐌 Tiempo más lento: ${Math.max(...successful.map(r => r.duration))}ms`);
  
  if (failed.length > 0) {
    console.log(`\n❌ Errores encontrados:`);
    failed.forEach(f => {
      console.log(`   • Request ${f.requestId}: ${f.error}`);
    });
  }
  
  return {
    totalRequests: numRequests,
    successful: successful.length,
    failed: failed.length,
    totalDuration,
    averageDuration: Math.round(successful.reduce((sum, r) => sum + r.duration, 0) / successful.length),
    results
  };
}

async function testRateLimiting() {
  console.log('🛡️  Prueba de rate limiting...');
  
  const requests = [];
  let rateLimitHit = false;
  
  for (let i = 0; i < 25; i++) { // Más del límite de 20
    const response = await fetch(`${API_URL}/api/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Test prompt ${i}`,
        apiKey: API_KEY
      })
    });
    
    if (response.status === 429) {
      rateLimitHit = true;
      console.log(`🚫 Rate limit activado en la solicitud ${i + 1}`);
      break;
    }
    
    requests.push(response.status);
    
    // Pequeña pausa entre solicitudes
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  if (rateLimitHit) {
    console.log('✅ Rate limiting funciona correctamente');
  } else {
    console.log('⚠️  Rate limiting no se activó (puede necesitar más solicitudes)');
  }
  
  return { rateLimitHit, requestsMade: requests.length };
}

async function testHealthEndpoints() {
  console.log('🏥 Prueba de endpoints de salud...');
  
  const endpoints = [
    '/api/health',
    '/api/rate-limit',
    '/api/prompts/templates'
  ];
  
  for (const endpoint of endpoints) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (response.ok) {
        console.log(`✅ ${endpoint} - ${duration}ms`);
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

async function testValidation() {
  console.log('🔍 Prueba de validaciones...');
  
  const testCases = [
    {
      name: 'Prompt vacío',
      data: { prompt: '', apiKey: API_KEY },
      expectedError: true
    },
    {
      name: 'API key inválida',
      data: { prompt: 'Test prompt', apiKey: 'invalid_key' },
      expectedError: true
    },
    {
      name: 'Prompt muy largo',
      data: { prompt: 'a'.repeat(15000), apiKey: API_KEY },
      expectedError: true
    },
    {
      name: 'Datos válidos',
      data: { prompt: 'Test prompt válido', apiKey: API_KEY },
      expectedError: false
    }
  ];
  
  for (const testCase of testCases) {
    try {
      const response = await fetch(`${API_URL}/api/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });
      
      const hasError = !response.ok;
      
      if (hasError === testCase.expectedError) {
        console.log(`✅ ${testCase.name} - Validación correcta`);
      } else {
        console.log(`❌ ${testCase.name} - Validación incorrecta`);
      }
      
    } catch (error) {
      if (testCase.expectedError) {
        console.log(`✅ ${testCase.name} - Error esperado: ${error.message}`);
      } else {
        console.log(`❌ ${testCase.name} - Error inesperado: ${error.message}`);
      }
    }
  }
}

async function runAllTests() {
  console.log('🧪 Iniciando suite de pruebas de rendimiento...\n');
  
  // Verificar que el servidor esté corriendo
  try {
    await fetch(`${API_URL}/api/health`);
    console.log('✅ Servidor detectado y funcionando\n');
  } catch (error) {
    console.log('❌ Servidor no detectado. Asegúrate de que esté corriendo en el puerto 3001');
    return;
  }
  
  // Ejecutar todas las pruebas
  await testHealthEndpoints();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testValidation();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testSingleRequest();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testConcurrentRequests(3);
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testRateLimiting();
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('🎉 Suite de pruebas completada');
}

// Ejecutar pruebas
runAllTests().catch(console.error);
