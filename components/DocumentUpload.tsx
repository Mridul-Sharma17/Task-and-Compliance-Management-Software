import React, { useRef, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { documentService } from '../src/services/documentService';

interface DocumentUploadProps {
  taskId: string;
  onUploadSuccess: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ taskId, onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      await documentService.uploadDocument(file, taskId);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50/50 transition-colors cursor-pointer group ${
          dragActive ? 'border-sea-400 bg-sea-50/30' : 'border-slate-300 hover:border-sea-300'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          disabled={uploading}
          className="hidden"
        />
        <Paperclip
          size={24}
          className={`mb-2 transition-colors ${
            dragActive ? 'text-sea-500' : 'group-hover:text-sea-500'
          }`}
        />
        <span className="text-sm font-medium">
          {uploading ? 'Uploading...' : dragActive ? 'Drop file here' : 'Click to upload or drag and drop'}
        </span>
        <span className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</span>
      </div>
    </div>
  );
};

export default DocumentUpload;
