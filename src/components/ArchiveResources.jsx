import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, ExternalLink, Loader, AlertCircle, Search } from "lucide-react";
import { searchArchiveResources, searchArchiveSimple } from "../services/archiveService";

/**
 * Componente que muestra recursos de Internet Archive relacionados al tema
 * Se integra dentro de GuideViewer en la columna de sidebar
 */
const ArchiveResources = ({ topic }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const fetchResources = useCallback(async () => {
    if (!topic) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // Intento principal con filtros académicos
      let results = await searchArchiveResources(topic, 10);

      // Si no hay resultados, usamos el fallback simple
      if (results.length === 0) {
        results = await searchArchiveSimple(topic, 8);
      }

      setResources(results);
    } catch (err) {
      setError("No se pudo conectar con Internet Archive. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [topic]);

  // Cargar automáticamente cuando se monta el componente
  useEffect(() => {
    if (topic) {
      fetchResources();
    }
  }, [topic, fetchResources]);

  // ── Helpers de UI ──────────────────────────────────────────────────────────

  const getTypeColor = (type) => {
    const colors = {
      "Revista científica": "#7c3aed",
      Tesis: "#059669",
      "Actas de congreso": "#d97706",
      "Libro / PDF": "#2563eb",
    };
    return colors[type] || "#6b7280";
  };

  const getTypeIcon = (type) => {
    if (type === "Revista científica") return "🔬";
    if (type === "Tesis") return "🎓";
    if (type === "Actas de congreso") return "📋";
    return "📖";
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!searched && !loading) {
    return (
      <div className="archive-placeholder">
        <Search size={24} style={{ color: "#9ca3af", marginBottom: 8 }} />
        <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
          Los recursos de Internet Archive se cargarán automáticamente.
        </p>
        <button className="archive-search-btn" onClick={fetchResources}>
          Buscar ahora
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="archive-loading">
        <Loader size={24} className="archive-spinner" />
        <p>Buscando en Internet Archive...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="archive-error">
        <AlertCircle size={20} style={{ color: "#ef4444" }} />
        <p>{error}</p>
        <button className="archive-retry-btn" onClick={fetchResources}>
          Reintentar
        </button>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="archive-empty">
        <BookOpen size={24} style={{ color: "#9ca3af" }} />
        <p>No se encontraron recursos para <strong>"{topic}"</strong> en Archive.org.</p>
        <button className="archive-retry-btn" onClick={fetchResources}>
          Buscar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="archive-resources">
      <p className="archive-subtitle">
        {resources.length} recursos encontrados en{" "}
        <a href="https://archive.org" target="_blank" rel="noopener noreferrer">
          Internet Archive
        </a>
        {resources.length > 0 && resources[0].searchTerm && (
          <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginLeft: '4px' }}>
            (con: "{resources[0].searchTerm}")
          </span>
        )}
        :
      </p>

      <div className="archive-list">
        {resources.map((resource, index) => (
          <a
            key={resource.identifier || index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="archive-item"
          >
            {/* Tipo de recurso */}
            <div className="archive-item-header">
              <span
                className="archive-type-badge"
                style={{ backgroundColor: getTypeColor(resource.type) + "20", color: getTypeColor(resource.type) }}
              >
                {getTypeIcon(resource.type)} {resource.type}
              </span>
              {resource.year !== "N/A" && (
                <span className="archive-year">{resource.year}</span>
              )}
            </div>

            {/* Título */}
            <div className="archive-item-title">
              {resource.title}
            </div>

            {/* Autor */}
            {resource.author && resource.author !== "Autor desconocido" && (
              <div className="archive-item-author">✍️ {resource.author}</div>
            )}

            {/* Descripción */}
            <div className="archive-item-desc">{resource.description}</div>

            {/* Footer */}
            <div className="archive-item-footer">
              <ExternalLink size={12} />
              <span>Ver en Archive.org</span>
              {resource.downloads > 0 && (
                <span className="archive-downloads">
                  ⬇️ {resource.downloads.toLocaleString()} descargas
                </span>
              )}
            </div>
          </a>
        ))}
      </div>

      <button className="archive-refresh-btn" onClick={fetchResources}>
        🔄 Actualizar resultados
      </button>
    </div>
  );
};

export default ArchiveResources;
