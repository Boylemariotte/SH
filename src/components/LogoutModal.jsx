import React from 'react';
import { AlertTriangle } from 'lucide-react';

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">
          <AlertTriangle size={32} color="#f59e0b" />
        </div>
        <h2 className="modal-title">¿Cerrar sesión?</h2>
        <p className="modal-desc">
          Se eliminarán tu historial, estadísticas y puntos guardados localmente.
          Esta acción no se puede deshacer.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Sí, cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
