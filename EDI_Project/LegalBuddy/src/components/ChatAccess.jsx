import React, { useState } from 'react'
import { MessageSquare, AlertCircle } from 'lucide-react'

const ChatAccess = ({ role, quota }) => {
  const [showWarning, setShowWarning] = useState(false)
  const [showCriminalBlock, setShowCriminalBlock] = useState(false)

  const handleChatClick = () => {
    if (role === 'guest') {
      setShowWarning(true)
      return
    }
    
    // TODO: connect to /api/chat/start
    console.log('Starting chat session...')
    alert('Opening chat bot... (Demo mode)')
  }

  const handleChatWithCriminalCheck = (query) => {
    // Check for criminal content (demo - in real app this would be server-side)
    const criminalKeywords = ['criminal', 'theft', 'murder', 'assault', 'fraud', 'robbery', 'kidnapping', 'rape', 'battery']
    const hasCriminalContent = criminalKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    )
    
    if (hasCriminalContent) {
      setShowCriminalBlock(true)
      return
    }
    
    // TODO: connect to /api/chat/start
    console.log('Starting chat session with query:', query)
    alert('Opening chat bot... (Demo mode)')
  }

  const getQuotaText = () => {
    if (role === 'guest') {
      return `Guest limits apply — ${quota.chatsRemaining} queries/day.`
    }
    return `You have ${quota.chatsRemaining} chat queries remaining.`
  }

  return (
    <section className="py-20 bg-neutral">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-2xl font-semibold text-text mb-4">
            Open Chat-only Bot
          </h3>
          
          <p className="text-body-grey mb-6 max-w-md mx-auto">
            Ask general civil-law questions with no file context. Not for criminal law.
          </p>
          
          <button
            onClick={handleChatClick}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors mb-4"
          >
            Start Chat Session
          </button>
          
          <p className="text-sm text-body-grey">
            {getQuotaText()}
          </p>
        </div>

        {/* Criminal Content Block Modal */}
        {showCriminalBlock && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                <h3 className="text-xl font-semibold text-text">Criminal Content Detected</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-body-grey mb-4">
                  This query appears to concern criminal law. LawAssist processes civil law only. 
                  If your matter is criminal, please contact legal aid or the police.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Resources for Criminal Matters:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• National Legal Services Authority (NALSA)</li>
                    <li>• State Legal Services Authority</li>
                    <li>• Local Police Station</li>
                    <li>• Emergency: 100</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCriminalBlock(false)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guest Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-accent mr-2" />
                <h3 className="text-xl font-semibold text-text">Guest Limitations</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-body-grey mb-4">
                  Guest limits apply — {quota.chatsRemaining} queries/day.
                </p>
                <p className="text-sm text-body-grey">
                  Register for unlimited chat access and higher quotas.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWarning(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowWarning(false)
                    // TODO: connect to /api/chat/start
                    console.log('Starting limited chat session...')
                    alert('Starting limited chat session... (Demo mode)')
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Continue with Limits
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ChatAccess
