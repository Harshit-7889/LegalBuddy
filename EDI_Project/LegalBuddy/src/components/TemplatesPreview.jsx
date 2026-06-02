import React from 'react'
import { Download, Edit, Eye, CheckCircle, User } from 'lucide-react'

const TemplatesPreview = ({ role, showVerifiedBadge }) => {
  const templates = [
    {
      id: 1,
      title: 'Rental Agreement',
      description: 'Standard residential rental agreement template',
      author: 'Adv. Priya Sharma',
      authorVerified: true,
      downloads: 1247
    },
    {
      id: 2,
      title: 'Affidavit',
      description: 'General purpose affidavit template',
      author: 'Adv. Rajesh Kumar',
      authorVerified: true,
      downloads: 892
    },
    {
      id: 3,
      title: 'Civil Complaint',
      description: 'Civil court complaint filing template',
      author: 'Adv. Meera Singh',
      authorVerified: true,
      downloads: 634
    },
    {
      id: 4,
      title: 'Power of Attorney',
      description: 'General power of attorney template',
      author: 'Adv. Amit Patel',
      authorVerified: true,
      downloads: 1103
    }
  ]

  const canEdit = role === 'lawyer' || role === 'admin'
  const canPublish = role === 'admin'

  const handleDownload = (templateId) => {
    // TODO: connect to /api/templates/download
    console.log('Downloading template:', templateId)
    alert(`Downloading template ${templateId}... (Demo mode)`)
  }

  const handleEdit = (templateId) => {
    // TODO: connect to template editor
    console.log('Editing template:', templateId)
    alert(`Opening template editor for ${templateId}... (Demo mode)`)
  }

  const handlePublish = (templateId) => {
    // TODO: connect to publish API
    console.log('Publishing template:', templateId)
    alert(`Publishing template ${templateId}... (Demo mode)`)
  }

  const handleSuggestEdit = (templateId) => {
    // TODO: connect to suggestion system
    console.log('Suggesting edit for template:', templateId)
    alert(`Opening suggestion form for ${templateId}... (Demo mode)`)
  }

  const handleAuthorClick = (author) => {
    // TODO: connect to author profile modal
    console.log('Viewing author profile:', author)
    alert(`Viewing profile of ${author}... (Demo mode)`)
  }

  return (
    <section className="py-20 bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text mb-4 tracking-tight">Legal Document Templates</h2>
          <p className="text-body-grey max-w-2xl mx-auto leading-relaxed">
            Ready-to-use templates for common civil law documents, created by verified lawyers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text mb-2">
                    {template.title}
                  </h3>
                  <p className="text-body-grey text-sm mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center text-sm text-body-grey">
                    <User className="w-4 h-4 mr-1" />
                    <button
                      onClick={() => handleAuthorClick(template.author)}
                      className="hover:text-primary transition-colors"
                    >
                      {template.author}
                    </button>
                    {template.authorVerified && (
                      <CheckCircle className="w-4 h-4 text-accent ml-1" />
                    )}
                    <span className="ml-2">• {template.downloads} downloads</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDownload(template.id)}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                
                {canEdit && (
                  <button
                    onClick={() => handleEdit(template.id)}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                )}
                
                {canPublish && (
                  <button
                    onClick={() => handlePublish(template.id)}
                    className="flex items-center px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </button>
                )}
                
                {!canEdit && (
                  <button
                    onClick={() => handleSuggestEdit(template.id)}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Suggest Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button className="text-primary hover:text-primary/80 font-medium">
            View All Templates →
          </button>
        </div>
      </div>
    </section>
  )
}

export default TemplatesPreview
