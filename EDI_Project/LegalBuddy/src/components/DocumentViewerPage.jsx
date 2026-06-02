import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { notify } from '../services/notify';

export default function DocumentViewerPage() {
  const { documentId } = useParams();
  const [doc, setDoc] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('Loading document...');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const pollingInterval = useRef(null);

  useEffect(() => {
    const fetchAndPollDocument = async () => {
      try {
        const documentData = await api.getDocument(documentId);
        setDoc(documentData);

        if (documentData.status === 'indexing_complete') {
          setLoadingStatus(''); // Done loading
          if (pollingInterval.current) clearInterval(pollingInterval.current);
        } else if (documentData.status === 'pipeline_failed' || documentData.status === 'ocr_failed') {
          setLoadingStatus('Processing failed. Please try uploading the document again.');
          if (pollingInterval.current) clearInterval(pollingInterval.current);
        } else {
          setLoadingStatus(`Processing... (Status: ${documentData.status})`);
        }
      } catch (error) {
        notify.error(error.message || 'Failed to load document.');
        setLoadingStatus('Failed to load document.');
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      }
    };

    fetchAndPollDocument(); // Initial fetch
    pollingInterval.current = setInterval(fetchAndPollDocument, 5000); // Poll every 5 seconds

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [documentId]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { sender: 'user', text: question };
    setChatHistory(prev => [...prev, userMessage]);
    setIsAnswering(true);
    setQuestion('');

    try {
        const res = await api.postQuestion(documentId, userMessage.text);
        const aiMessage = { sender: 'ai', text: res.answer };
        setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
        const errorMessage = { sender: 'ai', text: "Sorry, I couldn't get an answer. Please try again." };
        setChatHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsAnswering(false);
    }
  };

  if (loadingStatus) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
            <p className="text-body-grey">{loadingStatus}</p>
        </div>
    );
  }

  if (!doc) {
    return <div className="p-8 text-center">Document not found or you do not have permission to view it.</div>;
  }

  return (
    <div className="flex h-screen bg-neutral">
      {/* Left Panel: Document Text */}
      <div className="w-1/2 p-8 overflow-y-auto bg-white">
        <h2 className="text-2xl font-bold mb-1">Document Text</h2>
        <p className="text-sm text-body-grey mb-4">{doc.filename}</p>
        <pre className="whitespace-pre-wrap font-sans text-sm">{doc.extracted_text || "No text was extracted from this document."}</pre>
      </div>

      {/* Right Panel: Chat Interface */}
      <div className="w-1/2 p-8 flex flex-col border-l bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Chat with your Document</h2>
        <div className="flex-grow overflow-y-auto mb-4 p-4 bg-white rounded-lg border">
          {chatHistory.length === 0 && (
            <div className="text-center text-body-grey h-full flex items-center justify-center">
              Ask a question to get started.
            </div>
          )}
          {chatHistory.map((msg, index) => (
            <div key={index} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-text'}`} style={{maxWidth: '80%'}}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            disabled={isAnswering}
          />
          <Button type="submit" disabled={isAnswering}>
            {isAnswering ? 'Thinking...' : 'Ask'}
          </Button>
        </form>
      </div>
    </div>
  );
}