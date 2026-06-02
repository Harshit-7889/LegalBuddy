import React from 'react'
import { MessageSquare, FileText, Shield } from 'lucide-react'

const FeaturesGrid = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI-Powered Legal Bot',
      description: 'Ask civil-law questions with documents as context.'
    },
    {
      icon: FileText,
      title: 'Document Templates',
      description: 'Download & fill templates for civil cases.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Encrypted uploads, consent-first processing.'
    }
  ]

  return (
    <section className="py-20 bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text mb-4 tracking-tight">Powerful Features</h2>
          <p className="text-body-grey max-w-2xl mx-auto leading-relaxed">
            Everything you need to understand and work with civil law documents
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-white rounded-full p-3 shadow-sm mb-6 flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-4">
                  {feature.title}
                </h3>
                <p className="text-body-grey leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesGrid
