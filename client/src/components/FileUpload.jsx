import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, FileUp, Zap } from 'lucide-react';

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
    <div className="w-full">
      <div
        className={`relative group cursor-pointer transition-all duration-300 rounded-[2.5rem] border-2 border-dashed
          ${isDragging
            ? 'border-primary-500 bg-primary-500/5 scale-[0.99]'
            : 'border-surface-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 hover:border-primary-400 dark:hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5'}
          ${fileName ? 'border-emerald-500/30 bg-emerald-500/5' : ''}
          ${isLoading ? 'pointer-events-none opacity-80' : ''}
        `}
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
          className="hidden"
        />

        <div className="p-12 md:p-20 flex flex-col items-center text-center">
          {fileName ? (
            <div className="flex flex-col items-center animate-slide-up">
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                <FileText size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-surface-900 dark:text-surface-50 truncate max-w-xs transition-colors">{fileName}</h3>
                <p className="text-xs text-surface-500 font-bold uppercase tracking-widest">{formatFileSize(fileSize)}</p>
              </div>
              <button
                className="mt-8 p-3 rounded-xl bg-white dark:bg-zinc-900 text-surface-400 hover:text-rose-500 hover:shadow-lg transition-premium border border-surface-100 dark:border-white/5"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-surface-50 to-surface-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center mx-auto group-hover:scale-110 transition-premium shadow-inner relative border border-surface-200 dark:border-white/5">
                <FileUp size={48} className="text-primary-600 dark:text-primary-400 relative z-10" />
                <div className="absolute inset-0 bg-primary-500/10 blur-xl rounded-full scale-0 group-hover:scale-100 transition-premium" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-surface-900 dark:text-surface-50 tracking-tight transition-colors">Sube tu Material</h3>
                <p className="text-surface-500 dark:text-surface-400 font-medium transition-colors">Arrastra tu archivo .txt o haz clic para buscar</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">
                <span className="px-4 py-1.5 bg-surface-100 dark:bg-white/5 rounded-full transition-colors">TXT</span>
                <span className="px-4 py-1.5 bg-surface-100 dark:bg-white/5 rounded-full transition-colors">MAX 1MB</span>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-[4px] rounded-[2.5rem] flex flex-col items-center justify-center gap-6 z-50 animate-fade-in transition-colors">
            <div className="w-16 h-16 border-4 border-primary-100 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin" />
            <span className="text-sm font-black text-primary-900 dark:text-primary-100 uppercase tracking-[0.3em]">Procesando...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3 animate-slide-up transition-colors">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
