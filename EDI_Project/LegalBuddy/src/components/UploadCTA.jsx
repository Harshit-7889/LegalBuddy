import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Shield, AlertTriangle, X } from 'lucide-react';
import { api } from '../services/api';
import { notify } from '../services/notify';

const UploadCTA = ({ role, quota }) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [selectedActions, setSelectedActions] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCriminalBlock, setShowCriminalBlock] = useState(false);

  const maxFileSize = role === 'guest' ? 10 : 25; // MB
  const acceptedTypes = ['PDF', 'DOCX', 'PNG', 'JPG'];

  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.size > maxFileSize * 1024 * 1024) {
      notify.error(`File size must be less than ${maxFileSize}MB`);
      return;
    }

    const fileType = file.name.split('.').pop().toUpperCase();
    if (!acceptedTypes.includes(fileType)) {
      notify.error(`File type must be one of: ${acceptedTypes.join(', ')}`);
      return;
    }

    const fileName = file.name.toLowerCase();
    const criminalKeywords = ['criminal', 'theft', 'murder', 'assault', 'fraud', 'robbery', 'kidnapping'];
    if (criminalKeywords.some(keyword => fileName.includes(keyword))) {
      setShowCriminalBlock(true);
      return;
    }

    setSelectedFile(file);
    setShowConsentModal(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleConsentAccept = () => {
    if (consentAccepted) {
      setShowConsentModal(false);
      setShowActionModal(true);
    }
  };

  const handleActionSubmit = async () => {
    if (!selectedFile) {
      notify.error('Please select a file first.');
      return;
    }
    if (selectedActions.length === 0) {
      notify.error('Please select at least one action.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.uploadDocument(selectedFile, selectedActions);
      notify.success('Document uploaded! Processing has begun.');
      navigate(`/docs/${response.document_id}`);
    } catch (error) {
      notify.error(error.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getQuotaText = () => {
    if (role === 'guest') {
      return `Guest: max 3 uploads/month. No history.`;
    }
    return `You have ${quota.uploadsRemaining} uploads remaining this month.`;
  };

  return (
    <section id="upload-section" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text mb-4 tracking-tight">Upload Your Document</h2>
          <p className="text-body-grey max-w-2xl mx-auto leading-relaxed">
            Get instant analysis, translation, and simplified explanations for your civil law documents.
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
          }`}
          onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">Drag & drop your document here</h3>
          <p className="text-body-grey mb-6">or click to browse files</p>
          <input
            type="file"
            accept=".pdf,.docx,.png,.jpg"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer inline-block"
          >
            Choose File
          </label>
          <p className="text-sm text-body-grey mt-4">
            Accepted: {acceptedTypes.join(', ')} — Max size: {maxFileSize}MB
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-body-grey">{getQuotaText()}</p>
        </div>

        {/* Consent Modal */}
        {showConsentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-text">Consent Required</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-body-grey mb-4">
                  I consent to processing my document. I understand LawAssist provides 
                  informational explanations only and is not a substitute for legal advice.
                </p>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="consent" className="text-sm text-body-grey">
                    I agree to the terms above
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConsentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConsentAccept}
                  disabled={!consentAccepted}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  I Agree & Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Criminal Content Block Modal */}
        {showCriminalBlock && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
                <h3 className="text-xl font-semibold text-text">Criminal Content Detected</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-body-grey mb-4">
                  This document appears to concern criminal law. LawAssist processes civil law only. 
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

        {/* Action Selection Modal */}
        {showActionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text">Choose Actions</h3>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-body-grey mb-4">
                  What would you like to do with your document?
                </p>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedActions.includes('simplify')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActions([...selectedActions, 'simplify']);
                        } else {
                          setSelectedActions(selectedActions.filter(a => a !== 'simplify'));
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="text-sm">Simplify legal language</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedActions.includes('translate')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActions([...selectedActions, 'translate']);
                        } else {
                          setSelectedActions(selectedActions.filter(a => a !== 'translate'));
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="text-sm">Translate to Hindi/Marathi</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedActions.includes('chat')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActions([...selectedActions, 'chat']);
                        } else {
                          setSelectedActions(selectedActions.filter(a => a !== 'chat'));
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="text-sm">Chat with document</span>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActionSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Process Document'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadCTA;