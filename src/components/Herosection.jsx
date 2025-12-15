import { useNavigate } from 'react-router-dom'
import { FileText, Shield, Users, Award, ChevronRight, Download, Mail, MapPin, Phone } from 'lucide-react'

function Herosection() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Trust & Transparency",
      description: "Complete transparency in all our operations and documentation"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Community Service",
      description: "Dedicated to serving the Erode community with integrity"
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Certified Trust",
      description: "Officially registered and recognized trust organization"
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: "Open Documents",
      description: "Access to all trust documents and important information"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <Shield className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Erode Periya Pavadi Trust</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">About</a>
              <button 
                onClick={() => navigate('/documents')} 
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Documents
              </button>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white animate-fadeIn">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                Erode Periya Pavadi Trust
                <span className="block mt-2 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Building a Better Community
                </span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                A trusted organization dedicated to the welfare and development of Erode community. 
                We believe in transparency, integrity, and service to humanity.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/documents')}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  View Documents
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  className="flex items-center gap-2 px-8 py-4 bg-white/20 text-white backdrop-blur-sm rounded-xl font-bold text-lg hover:bg-white/30 transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Content - Floating Card */}
            <div className="animate-float">
              <div className="bg-white rounded-3xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-purple-100 rounded-2xl">
                    <Shield className="w-16 h-16 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Registered Trust</h3>
                <p className="text-gray-600 leading-relaxed">
                  Official trust organization serving Erode with dedication and commitment to community welfare
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">Our commitment to excellence and community service</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-purple-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Access Our Official Documents</h2>
          <p className="text-xl text-white/90 mb-8">
            View and download all trust-related documents and certifications
          </p>
          <button 
            onClick={() => navigate('/documents')}
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            <Download className="w-6 h-6" />
            View All Documents
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8" />
                <h4 className="text-xl font-bold">Erode Periya Pavadi Trust</h4>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Serving the community with dedication and transparency
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <div className="space-y-3">
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
                <button onClick={() => navigate('/documents')} className="block text-gray-400 hover:text-white transition-colors">Documents</button>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <p>Erode, Tamil Nadu, India</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <p>periyapavadi@gmail.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <p>+91 XXXXX XXXXX</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Erode Periya Pavadi Trust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Herosection
