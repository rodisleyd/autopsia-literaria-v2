import React, { useState, useRef } from 'react';
import { ICONS } from '../constants';
import { handleFileUpload } from '../services/fileService';

interface FileUploadProps {
  onUpload: (text: string) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const allowedExtensions = ['.txt', '.pdf', '.docx'];
    const isAllowed = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isAllowed) {
      setError("Formato não suportado. Envie arquivos .txt, .pdf ou .docx.");
      return;
    }

    try {
      setError(null);
      const text = await handleFileUpload(file);
      if (!text || text.trim().length < 50) {
        throw new Error("O arquivo parece estar vazio ou tem pouco texto para análise.");
      }
      onUpload(text);
    } catch (err: any) {
      setError(err.message || "Erro ao processar o arquivo.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full group/upload">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-500 flex flex-col items-center justify-center gap-6 ${dragActive
          ? 'border-violet bg-violet/5 scale-[1.02]'
          : 'border-[var(--border-card)] hover:border-violet/50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.pdf,.docx"
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className={`w-14 h-14 rounded-full bg-violet/10 flex items-center justify-center text-violet ${dragActive ? 'scale-110 rotate-12' : ''} transition-all duration-500 shadow-sm border border-violet/5`}>
          <ICONS.Upload size={24} />
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold font-serif italic mb-2">
            {isLoading ? "Processando Obra..." : "Arraste seu manuscrito aqui"}
          </p>
          <p className="text-sm opacity-50 font-medium tracking-wide">SUPORTA .TXT, .PDF E .DOCX</p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm flex items-center gap-3 font-medium animate-in fade-in slide-in-from-bottom-2">
            <ICONS.Warning size={18} /> {error}
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-page)]/90 backdrop-blur-md rounded-2xl z-20">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-violet/20 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-violet border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <div className="text-center">
                <p className="text-violet font-black uppercase tracking-[0.3em] text-xs mb-2 animate-pulse">Iniciando Autópsia</p>
                <p className="text-[10px] opacity-40 uppercase font-black tracking-widest leading-none">AI Deep Analysis</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
