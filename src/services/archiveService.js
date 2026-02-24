/**
 * Servicio para buscar recursos en Internet Archive (archive.org)
 * API pública - no requiere autenticación para búsquedas básicas
 */

const ARCHIVE_SEARCH_URL = "https://archive.org/advancedsearch.php";

/**
 * Extrae palabras clave de un tema para búsquedas más efectivas
 */
const extractKeywords = (topic) => {
  // Convertir a minúsculas y limpiar
  const cleanTopic = topic.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Reemplazar caracteres especiales por espacios
    .replace(/\s+/g, ' ') // Eliminar espacios múltiples
    .trim();

  // Palabras a ignorar (stop words en español e inglés)
  const stopWords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'en', 'y', 'o', 'pero', 'por', 'para', 'con', 'sin', 'sobre', 'entre', 'hacia', 'hasta', 'the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'without', 'about', 'between', 'through', 'until', 'from', 'to', 'in', 'on', 'at'
  ]);

  // Dividir en palabras y filtrar stop words
  const words = cleanTopic.split(' ')
    .filter(word => word.length > 2) // Ignorar palabras muy cortas
    .filter(word => !stopWords.has(word))
    .slice(0, 5); // Limitar a 5 palabras clave

  return words;
};

/**
 * Genera términos de búsqueda alternativos para un tema
 */
const generateSearchTerms = (topic) => {
  const keywords = extractKeywords(topic);
  const searchTerms = [];

  // Término original (limpio)
  const cleanTopic = topic.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  if (cleanTopic.length > 0) {
    searchTerms.push(cleanTopic);
  }

  // Combinaciones de palabras clave
  if (keywords.length >= 2) {
    // Primera combinación
    searchTerms.push(keywords.slice(0, 2).join(' '));
    // Segunda combinación si hay más palabras
    if (keywords.length > 2) {
      searchTerms.push(keywords.slice(1, 3).join(' '));
    }
  }

  // Palabras clave individuales (más importantes)
  keywords.forEach(keyword => {
    if (keyword.length > 3) { // Solo palabras significativas
      searchTerms.push(keyword);
    }
  });

  // Términos específicos según el contexto
  const topicLower = topic.toLowerCase();
  
  // Historia/Orígenes
  if (topicLower.includes('creacion') || topicLower.includes('origen') || topicLower.includes('inicio') || topicLower.includes('historia')) {
    keywords.forEach(keyword => {
      searchTerms.push(`${keyword} history`);
      searchTerms.push(`${keyword} origins`);
      searchTerms.push(`historia ${keyword}`);
      searchTerms.push(`origenes ${keyword}`);
    });
  }

  // Automóviles/Vehículos
  if (topicLower.includes('automovil') || topicLower.includes('coche') || topicLower.includes('car') || topicLower.includes('vehicle')) {
    searchTerms.push('automobile history');
    searchTerms.push('automotive industry');
    searchTerms.push('car development');
    searchTerms.push('motor vehicle history');
    searchTerms.push('historia automotriz');
    searchTerms.push('industria automotriz');
  }

  // Eliminar duplicados y limitar
  return [...new Set(searchTerms)].slice(0, 8);
};

/**
 * Busca recursos educativos en Internet Archive según el tema
 * @param {string} topic - El tema ingresado por el usuario
 * @param {number} maxResults - Máximo de resultados (default: 12)
 * @returns {Promise<Array>} - Lista de recursos encontrados
 */
export const searchArchiveResources = async (topic, maxResults = 12) => {
  try {
    const searchTerms = generateSearchTerms(topic);
    console.log('Términos de búsqueda para Archive.org:', searchTerms);

    // Intentar con cada término hasta encontrar resultados
    for (const searchTerm of searchTerms) {
      try {
        console.log(`Intentando búsqueda con: "${searchTerm}"`);
        
        // Construimos una query más flexible
        const query = encodeURIComponent(
          `(${searchTerm}) AND (mediatype:(texts)) AND (subject:(education) OR subject:(history) OR subject:(science) OR subject:(technology) OR subject:(academic) OR language:(spanish) OR language:(english))` 
        );

        const fields = "identifier,title,creator,description,subject,language,year,format,downloads";
        const url = `${ARCHIVE_SEARCH_URL}?q=${query}&fl[]=${fields}&rows=${Math.min(maxResults, 6)}&page=1&output=json&sort[]=downloads+desc`;

        const response = await fetch(url);

        if (!response.ok) {
          console.warn(`Error con término "${searchTerm}": ${response.status}`);
          continue;
        }

        const data = await response.json();

        if (data.response?.docs && data.response.docs.length > 0) {
          console.log(`✅ Encontrados ${data.response.docs.length} resultados con: "${searchTerm}"`);
          
          // Transformamos los resultados al formato que usa GuideViewer
          return data.response.docs.map((item) => ({
            identifier: item.identifier,
            title: item.title || "Sin título",
            author: Array.isArray(item.creator)
              ? item.creator.join(", ")
              : item.creator || "Autor desconocido",
            description: truncateDescription(item.description),
            subject: Array.isArray(item.subject) ? item.subject : [item.subject].filter(Boolean),
            language: item.language || "N/A",
            year: item.year || "N/A",
            downloads: item.downloads || 0,
            url: `https://archive.org/details/${item.identifier}`,
            pdfUrl: `https://archive.org/download/${item.identifier}/${item.identifier}.pdf`,
            type: detectResourceType(item),
            searchTerm: searchTerm // Para debugging
          }));
        }
      } catch (error) {
        console.warn(`Error buscando con "${searchTerm}":`, error.message);
        continue;
      }
    }

    // Si ningún término funcionó, intentamos búsqueda muy amplia
    console.log('🔄 Intentando búsqueda amplia como fallback...');
    return await searchArchiveSimple(topic, maxResults);

  } catch (error) {
    console.error("Error al buscar en Internet Archive:", error);
    return [];
  }
};

/**
 * Detecta el tipo de recurso basado en sus metadatos
 */
const detectResourceType = (item) => {
  const title = (item.title || "").toLowerCase();
  const subject = Array.isArray(item.subject)
    ? item.subject.join(" ").toLowerCase()
    : (item.subject || "").toLowerCase();

  if (
    title.includes("journal") ||
    title.includes("revista") ||
    subject.includes("journal") ||
    subject.includes("periodical")
  ) {
    return "Revista científica";
  }
  if (
    title.includes("thesis") ||
    title.includes("tesis") ||
    subject.includes("thesis")
  ) {
    return "Tesis";
  }
  if (
    title.includes("proceedings") ||
    subject.includes("conference")
  ) {
    return "Actas de congreso";
  }
  return "Libro / PDF";
};

/**
 * Trunca la descripción para no mostrar textos muy largos
 */
const truncateDescription = (description) => {
  if (!description) return "Sin descripción disponible.";
  const plain = description.replace(/<[^>]*>/g, ""); // quitar HTML si lo hay
  return plain.length > 180 ? plain.substring(0, 180) + "..." : plain;
};

/**
 * Versión simplificada: solo busca por topic sin filtros adicionales
 * Útil como fallback si la búsqueda principal no da resultados
 */
export const searchArchiveSimple = async (topic, maxResults = 8) => {
  try {
    const query = encodeURIComponent(`${topic} AND mediatype:(texts)`);
    const url = `${ARCHIVE_SEARCH_URL}?q=${query}&fl[]=identifier,title,creator,description,year&rows=${maxResults}&page=1&output=json&sort[]=downloads+desc`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.response?.docs) return [];

    return data.response.docs.map((item) => ({
      identifier: item.identifier,
      title: item.title || "Sin título",
      author: Array.isArray(item.creator) ? item.creator.join(", ") : item.creator || "Desconocido",
      description: truncateDescription(item.description),
      year: item.year || "N/A",
      url: `https://archive.org/details/${item.identifier}`,
      type: "Libro / PDF",
    }));
  } catch (error) {
    console.error("Fallback Archive search failed:", error);
    return [];
  }
};
