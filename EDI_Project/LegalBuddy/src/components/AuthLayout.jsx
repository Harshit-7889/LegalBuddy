import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-primary text-white p-12">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <span className="text-4xl">⚖️</span>
            <span className="text-3xl font-bold">LawAssist</span>
          </Link>
          <p className="text-center text-lg opacity-80">
            Understand any civil law document in minutes. Secure, simple, and reliable.
          </p>
        </div>
        <div className="w-full md:w-1/2 bg-white p-8">
          <div className="max-w-sm mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-text tracking-tight">{title}</h2>
              <p className="text-body-grey mt-2">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}


