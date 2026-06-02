import React from 'react'
import { Upload, Search, MessageSquare } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Upload or paste your document',
      description: 'Simply drag and drop your civil law document or paste text directly into our secure platform.'
    },
    {
      number: 2,
      icon: Search,
      title: 'Our AI reads & finds the clauses',
      description: 'Advanced AI analyzes your document, identifies key legal clauses, and understands the context.'
    },
    {
      number: 3,
      icon: MessageSquare,
      title: 'Get simplified text, translation, and chatable context',
      description: 'Receive simplified explanations, translations in Hindi/Marathi, and chat with your document for specific questions.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text mb-4 tracking-tight">How It Works</h2>
          <p className="text-body-grey max-w-2xl mx-auto leading-relaxed">
            Get legal document assistance in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={step.number} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text mb-4">
                  {step.title}
                </h3>
                <p className="text-body-grey leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
