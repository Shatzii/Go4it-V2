'use client';

import { useState } from 'react';
import { Upload, File, Eye, Download, Trash2, Filter, Search, FileText, Award, GraduationCap, User } from 'lucide-react';

interface Document {
  id: number;
  fileName: string;
  documentType: 'transcript' | 'recommendation' | 'essay' | 'resume' | 'highlight_video' | 'other';
  fileSize: number;
  uploadDate: string;
  mimeType: string;
}

export default function DocumentVault() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      fileName: 'High_School_Transcript.pdf',
      documentType: 'transcript',
      fileSize: 245678,
      uploadDate: '2024-01-15',
      mimeType: 'application/pdf',
    },
    {
      id: 2,
      fileName: 'Coach_Recommendation_Letter.pdf',
      documentType: 'recommendation',
      fileSize: 156789,
      uploadDate: '2024-01-10',
      mimeType: 'application/pdf',
    },
    {
      id: 3,
      fileName: 'Athletic_Resume.pdf',
      documentType: 'resume',
      fileSize: 198234,
      uploadDate: '2024-01-08',
      mimeType: 'application/pdf',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'transcript': return GraduationCap;
      case 'recommendation': return Award;
      case 'essay': return FileText;
      case 'resume': return User;
      default: return File;
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'transcript': return 'text-blue-400 bg-blue-600/20';
      case 'recommendation': return 'text-purple-400 bg-purple-600/20';
      case 'essay': return 'text-green-400 bg-green-600/20';
      case 'resume': return 'text-yellow-400 bg-yellow-600/20';
      default: return 'text-slate-400 bg-slate-600/20';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDocumentType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.documentType === filterType;
    return matchesSearch && matchesFilter;
  });

  const documentTypes = [
    { value: 'transcript', label: 'Transcripts' },
    { value: 'recommendation', label: 'Recommendations' },
    { value: 'essay', label: 'Essays' },
    { value: 'resume', label: 'Resumes' },
    { value: 'highlight_video', label: 'Highlight Videos' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Document Vault</h2>
          <p className="text-slate-400 mt-1">Store and manage your recruiting documents securely</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Total Documents</p>
          <p className="text-2xl font-bold text-white">{documents.length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Transcripts</p>
          <p className="text-2xl font-bold text-white">
            {documents.filter(d => d.documentType === 'transcript').length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Recommendations</p>
          <p className="text-2xl font-bold text-white">
            {documents.filter(d => d.documentType === 'recommendation').length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Total Storage</p>
          <p className="text-2xl font-bold text-white">
            {formatFileSize(documents.reduce((sum, d) => sum + d.fileSize, 0))}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
          >
            <option value="all">All Types</option>
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => {
          const Icon = getDocumentIcon(doc.documentType);
          return (
            <div
              key={doc.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${getDocumentColor(doc.documentType)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate mb-1">{doc.fileName}</h3>
                  <p className="text-slate-400 text-sm">{formatDocumentType(doc.documentType)}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Size</span>
                  <span className="text-white">{formatFileSize(doc.fileSize)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Uploaded</span>
                  <span className="text-white">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Format</span>
                  <span className="text-white">{doc.mimeType.split('/')[1].toUpperCase()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <File className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No documents found</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Upload Document</h3>
            
            {/* Uppy Drop Zone - To be integrated */}
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center mb-6">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Drag and drop files here</p>
              <p className="text-slate-400 text-sm mb-4">or click to browse</p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Select Files
              </button>
            </div>

            <div className="mb-6">
              <label className="text-white font-medium block mb-2">Document Type</label>
              <select className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Upload
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
