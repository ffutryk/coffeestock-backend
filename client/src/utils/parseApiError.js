// Normaliza errores de la API para la UI
export function parseApiError(error) {
  if (!error || !error.response || !error.response.data) return { message: 'Error de red' };
  const data = error.response.data;

  // Manejo de errores de validación de zod (middleware error-handler usa z.flattenError(err))
  if (data.issues && data.issues.fieldErrors) {
    // fieldErrors es un objeto { fieldName: ["msg1", ...] }
    const fieldErrors = {};
    Object.entries(data.issues.fieldErrors).forEach(([key, val]) => {
      if (Array.isArray(val) && val.length > 0) fieldErrors[key] = val.join(', ');
    });
    return { message: data.message || 'Error de validación', fieldErrors };
  }

  // Manejo de AppError (tiene message)
  if (data.message) return { message: data.message };

  // Fallback
  return { message: JSON.stringify(data) };
}
