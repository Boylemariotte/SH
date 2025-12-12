// Middleware de manejo de errores global
export const errorHandler = (err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    type: 'global_error',
    timestamp: new Date().toISOString()
  });
};

