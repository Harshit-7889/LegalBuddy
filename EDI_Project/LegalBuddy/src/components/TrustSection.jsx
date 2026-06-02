import React from 'react'
import { Lock, EyeOff, Database } from 'lucide-react'

const TrustSection = () => {
  const trustFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'Your documents are encrypted and secure from the moment you upload them.'
    },
    {
      icon: EyeOff,
      title: 'Strict Privacy Policy',
      description: 'We never share or train on your data. You are always in control of your information.'
    },
    {
      icon: Database,
      title: 'Secure Storage',
      description: 'All files are stored in industry-leading secure infrastructure.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text mb-4 tracking-tight">Your Security is Our Priority</h2>
          <p className="text-body-grey max-w-2xl mx-auto leading-relaxed">
            We take your privacy and security seriously. Your legal documents are protected with enterprise-grade security measures.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
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

export default TrustSection
