import { useState, useCallback } from 'react';

// URL dinámica de la API
const getApiUrl = () => {
  // En producción (Vercel), usar rutas relativas
  if (import.meta.env.PROD) {
    return ''; // Rutas relativas: /api/endpoint
  }
  // En desarrollo, usar localhost
  return 'http://localhost:3001';
};

export const useServerStats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Guardar estadísticas en el servidor (opcional)
  const saveStatsToServer = useCallback(async (userStats, quizHistory, pointsData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${getApiUrl()}/api/stats-save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userStats,
          quizHistory,
          pointsData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar estadísticas');
      }

      const data = await response.json();
      return data;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener plantillas de prompts
  const getPromptTemplates = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${getApiUrl()}/api/prompts-templates`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener plantillas');
      }

      const data = await response.json();
      return data;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar salud del servidor
  const checkServerHealth = useCallback(async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/health`);
      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error('Servidor no disponible');
    }
  }, []);

  // Verificar límites de rate limiting
  const checkRateLimit = useCallback(async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/rate-limit`);
      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error('No se pudo verificar límites');
    }
  }, []);

  return {
    isLoading,
    error,
    saveStatsToServer,
    getPromptTemplates,
    checkServerHealth,
    checkRateLimit
  };
};
