// Validar que el prompt no contenga contenido malicioso básico
export const validateContent = (prompt) => {
  const suspiciousPatterns = [/<script/i, /javascript:/i, /eval\(/i];
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(prompt));
  return !hasSuspiciousContent;
};

