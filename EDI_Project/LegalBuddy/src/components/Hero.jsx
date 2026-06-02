import React from 'react';
import { MessageSquare, Upload, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ role }) => {
  const navigate = useNavigate();

  const handleScrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-neutral to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-3 px-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-text leading-tight mb-6">
              Understand Any Civil Law Document in Minutes.
            </h1>
            <p className="text-lg text-body-grey mb-8 leading-relaxed">
              Simplify complex legal notices, translate them into your language, and get clear answers from our AI assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button onClick={() => navigate('/chat')} className="bg-accent text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors flex items-center justify-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Ask the AI Bot
              </button>
              <button onClick={handleScrollToUpload} className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload a Document
              </button>
            </div>
            <p className="text-sm text-body-grey">
              Guest limits apply — register for full history & higher quota.
            </p>
          </div>

          {/* Right Column - 40% */}
          <div className="lg:col-span-2 relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">
                  AI Legal Assistant
                </h3>
                <p className="text-body-grey">
                  Upload your civil law documents and get instant, simplified explanations
                </p>
              </div>
            </div>
            
            {/* Guest Mode Banner */}
            {role === 'guest' && (
              <div className="absolute -top-2 -right-2 bg-accent text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                Guest Mode — Limited features
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
