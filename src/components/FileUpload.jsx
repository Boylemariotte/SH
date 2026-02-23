import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import '../styles/FileUpload.css';

const FileUpload = ({ onFileUpload, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 1024 * 1024; // 1MB
  const SUPPORTED_TYPES = ['text/plain'];

  const validateFile = (file) => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
      throw new Error('Solo se permiten archivos de texto (.txt)');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El archivo es demasiado grande. Máximo 1MB.');
    }

    return true;
  };

  const processFile = async (file) => {
    try {
      validateFile(file);
      setFileName(file.name);
      setFileSize(file.size);

      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Error al leer el archivo'));
        reader.readAsText(file);
      });

      onFileUpload(text, file.name);
    } catch (err) {
      throw err;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]).catch(err => {
        // Error will be handled by parent component
      });
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]).catch(err => {
        // Error will be handled by parent component
      });
    }
  };

  const clearFile = () => {
    setFileName('');
    setFileSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${isDragging ? 'dragging' : ''} ${fileName ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="file-input"
        />

        {fileName ? (
          <div className="file-info">
            <FileText size={48} className="file-icon" />
            <div className="file-details">
              <div className="file-name">{fileName}</div>
              <div className="file-size">{formatFileSize(fileSize)}</div>
            </div>
            <button
              className="btn btn-secondary clear-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              disabled={isLoading}
              style={{ padding: '0.5rem', minWidth: 'auto', height: 'auto' }}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <Upload size={48} className="upload-icon" />
            <div className="upload-text">
              <h3>Arrastra tu archivo de texto aquí</h3>
              <p>o haz clic para seleccionarlo</p>
              <small>.txt • Máximo 1MB</small>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="upload-overlay">
            <div className="loading-spinner">⏳</div>
            <span>Procesando archivo...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="file-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
