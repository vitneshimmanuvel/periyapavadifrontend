import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Eye, EyeOff, Download, Trash2, LogOut, Shield, Lock, Mail } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function Admin({ setIsAuthenticated, isAuthenticated }) {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file: null,
    isViewable: true,
    isDownloadable: false
  })
  const [uploading, setUploading] = useState(false)
  
  // Login form state - now using email
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments()
    }
  }, [isAuthenticated])

  // Login handler - now using email
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: loginData.email,
        password: loginData.password
      })

      localStorage.setItem('adminToken', response.data.token)
      localStorage.setItem('adminUser', JSON.stringify({
        id: response.data.id,
        email: response.data.email,
        role: response.data.role
      }))
      
      setIsAuthenticated(true)
      navigate('/admin/dashboard')
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setIsAuthenticated(false)
    navigate('/admin/login')
  }

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get(`${API_URL}/documents/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDocuments(response.data)
    } catch (error) {
      console.error('Error fetching documents:', error)
      if (error.response?.status === 401) {
        handleLogout()
      }
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadData.file) {
      alert('Please select a file')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', uploadData.file)
    formData.append('title', uploadData.title)
    formData.append('description', uploadData.description)
    formData.append('isViewable', uploadData.isViewable)
    formData.append('isDownloadable', uploadData.isDownloadable)

    try {
      const token = localStorage.getItem('adminToken')
      await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      alert('Document uploaded successfully!')
      setUploadData({
        title: '',
        description: '',
        file: null,
        isViewable: true,
        isDownloadable: false
      })
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''
      setShowUploadForm(false)
      fetchDocuments()
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.message || error.message))
    } finally {
      setUploading(false)
    }
  }

  const handleTogglePermission = async (id, field, currentValue) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.put(`${API_URL}/documents/${id}`, 
        { [field]: !currentValue },
        { headers: { Authorization: `Bearer ${token}` }}
      )
      fetchDocuments()
    } catch (error) {
      alert('Update failed: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`${API_URL}/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Document deleted successfully')
      fetchDocuments()
    } catch (error) {
      alert('Delete failed: ' + error.message)
    }
  }

  // If not authenticated, show login form with EMAIL
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 mt-2">Erode Periya Pavadi Trust</p>
          </div>

          {/* Login Form - Using Email */}
          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="Enter email address"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated - Show Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Cloudinary Storage</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Upload className="w-5 h-5" />
            {showUploadForm ? 'Cancel Upload' : 'Upload Document'}
          </button>
        </div>

        {showUploadForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">Upload Document</h3>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Document Title *</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  placeholder="e.g., Trust Registration Certificate"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  placeholder="Brief description of the document"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select File * (PDF, DOC, DOCX, JPG, PNG, XLS, XLSX - Max 50MB)
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-600 file:font-semibold hover:file:bg-purple-100"
                  required
                />
                {uploadData.file && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      Selected: <span className="font-semibold">{uploadData.file.name}</span> ({(uploadData.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uploadData.isViewable}
                    onChange={(e) => setUploadData({...uploadData, isViewable: e.target.checked})}
                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-900">Make Viewable to Public</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uploadData.isDownloadable}
                    onChange={(e) => setUploadData({...uploadData, isDownloadable: e.target.checked})}
                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-900">Allow Public Download</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </span>
                ) : (
                  'Upload Document'
                )}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">All Documents ({documents.length})</h3>
          
          {documents.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-medium">No documents uploaded yet</p>
              <p className="text-gray-400 mt-2">Upload your first document</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Title</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Description</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">File Name</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Size</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Viewable</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Downloadable</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-purple-600">{doc.title}</td>
                      <td className="py-4 px-4 text-gray-700 max-w-xs truncate">{doc.description || '-'}</td>
                      <td className="py-4 px-4 text-gray-700">{doc.originalName}</td>
                      <td className="py-4 px-4 text-gray-700">{(doc.fileSize / 1024).toFixed(2)} KB</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleTogglePermission(doc.id, 'isViewable', doc.isViewable)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            doc.isViewable 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {doc.isViewable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          {doc.isViewable ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleTogglePermission(doc.id, 'isDownloadable', doc.isDownloadable)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            doc.isDownloadable 
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          <Download className="w-4 h-4" />
                          {doc.isDownloadable ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
