import React from 'react'
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const quickLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Help Center', href: '#' }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' }
  ]

  return (
    <footer className="bg-text text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">⚖️</span>
              <span className="text-xl font-bold">LawAssist</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your personal legal assistant for civil law matters. Get instant, 
              accurate answers and simplified legal document explanations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                support@lawassist.com
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                +91 98765 43210
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                Mumbai, India
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 LawAssist. This service is for civil law information only.
            </p>
            <p className="text-gray-400 text-xs mt-2 md:mt-0">
              Not a substitute for professional legal advice
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
