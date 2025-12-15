import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, Eye, ArrowLeft, Shield, X } from 'lucide-react'
import axios from 'axios'

const API_URL = 'https://periyapavadibackend.vercel.app/api'

function Fileshowup() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewingDoc, setViewingDoc] = useState(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`)
      setDocuments(response.data)
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (doc) => {
    setViewingDoc(doc)
  }

  const closeViewer = () => {
    setViewingDoc(null)
  }

  const handleDownload = (doc) => {
    const url = doc.secureUrl || doc.cloudinaryUrl
    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.download = doc.originalName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('Document URL not available')
    }
  }

  const getFileIcon = (filename) => {
    if (!filename) return '📁'
    const ext = filename.split('.').pop().toLowerCase()
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      xls: '📊',
      xlsx: '📊',
      gif: '🖼️',
      webp: '🖼️'
    }
    return iconMap[ext] || '📁'
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <Shield className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Erode Periya Pavadi Trust</span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Official Documents</h1>
          <p className="text-xl text-white/90">Access all trust-related documents and certifications</p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {documents.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Documents Available</h3>
            <p className="text-lg text-gray-500">Documents will be available soon. Please check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getFileIcon(doc.originalName)}</span>
                    <div className="overflow-hidden">
                      <h3 className="text-xl font-bold truncate">{doc.title}</h3>
                      <p className="text-white/80 text-sm truncate">{doc.originalName}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {doc.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{doc.description}</p>
                  )}
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Size: {formatFileSize(doc.fileSize)}</p>
                    <p>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>

                  {/* Card Actions */}
                  <div className="flex gap-3">
                    {doc.isViewable && (
                      <button
                        onClick={() => handleView(doc)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all hover:-translate-y-0.5"
                      >
                        <Eye className="w-5 h-5" />
                        View
                      </button>
                    )}
                    {doc.isDownloadable && (
                      <button
                        onClick={() => handleDownload(doc)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all hover:-translate-y-0.5"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </button>
                    )}
                    {!doc.isViewable && !doc.isDownloadable && (
                      <p className="text-gray-500 text-center w-full py-2">Not available for viewing</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{viewingDoc.title}</h2>
                <p className="text-sm text-gray-500">{viewingDoc.originalName}</p>
              </div>
              <div className="flex gap-3">
                {/* Only show download if isDownloadable is true */}
                {viewingDoc.isDownloadable && (
                  <a
                    href={viewingDoc.secureUrl || viewingDoc.cloudinaryUrl}
                    download={viewingDoc.originalName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </a>
                )}
                <button
                  onClick={closeViewer}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Document Viewer - Works for ALL file types */}
            <div className="flex-1 overflow-hidden">
              {viewingDoc.mimeType.startsWith('image/') ? (
                // For images - direct display
                <img 
                  src={viewingDoc.secureUrl || viewingDoc.cloudinaryUrl} 
                  alt={viewingDoc.title}
                  className="w-full h-full object-contain bg-gray-100"
                />
              ) : (
                // For ALL other files (PDF, Word, Excel, etc.) - use Google Docs Viewer
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingDoc.secureUrl || viewingDoc.cloudinaryUrl)}&embedded=true`}
                  className="w-full h-full border-0"
                  title={viewingDoc.title}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 Erode Periya Pavadi Trust. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Fileshowup
