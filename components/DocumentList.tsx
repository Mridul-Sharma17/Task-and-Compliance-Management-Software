import React, { useState, useEffect } from 'react';
import { Download, Eye, Trash2, FileText } from 'lucide-react';
import { documentService, Document } from '../src/services/documentService';
import { useAuth } from '../src/contexts/AuthContext';

interface DocumentListProps {
  taskId: string;
  onDocumentDeleted: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ taskId, onDocumentDeleted }) => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [taskId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await documentService.getDocuments(taskId);
      setDocuments(docs);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (doc: Document) => {
    try {
      const url = await documentService.getDownloadUrl(doc.file_path);
      window.open(url, '_blank');
    } catch (err: any) {
      alert('Failed to open document: ' + err.message);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const url = await documentService.getDownloadUrl(doc.file_path);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      a.click();
    } catch (err: any) {
      alert('Failed to download document: ' + err.message);
    }
  };

  const handleDelete = async (doc: Document) => {
    // Check permissions: only owner or admin can delete
    if (profile?.role !== 'admin' && doc.uploaded_by !== user?.id) {
      alert('You can only delete your own documents');
      return;
    }

    if (!confirm(`Delete "${doc.file_name}"?`)) {
      return;
    }

    try {
      setDeleting(doc.id);
      await documentService.deleteDocument(doc.id, doc.file_path);
      setDocuments(documents.filter(d => d.id !== doc.id));
      onDocumentDeleted();
    } catch (err: any) {
      alert('Failed to delete document: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  if (loading) {
    return <div className="text-sm text-slate-400">Loading documents...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (documents.length === 0) {
    return <div className="text-sm text-slate-400">No documents uploaded yet</div>;
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors group"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText size={18} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {doc.file_name}
              </p>
              <p className="text-xs text-slate-400">
                {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            <button
              onClick={() => handleView(doc)}
              title="View"
              className="p-2 rounded-lg text-slate-400 hover:text-sea-600 hover:bg-white transition-colors"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleDownload(doc)}
              title="Download"
              className="p-2 rounded-lg text-slate-400 hover:text-sea-600 hover:bg-white transition-colors"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => handleDelete(doc)}
              disabled={deleting === doc.id}
              title="Delete"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
