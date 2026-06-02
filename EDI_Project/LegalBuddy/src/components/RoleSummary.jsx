import React from 'react'
import { User, UserCheck, Shield, Crown, Info } from 'lucide-react'

const RoleSummary = () => {
  const roles = [
    {
      name: 'Guest',
      icon: User,
      description: 'Limited uploads, no history, watermark on exports',
      privileges: [
        '3 uploads per month',
        'No document history',
        'Watermarked exports',
        'Limited chat queries'
      ]
    },
    {
      name: 'Registered User',
      icon: UserCheck,
      description: 'History & higher quota, no watermark',
      privileges: [
        '50 uploads per month',
        'Full document history',
        'Watermark-free exports',
        'Unlimited chat queries'
      ]
    },
    {
      name: 'Verified Lawyer',
      icon: Shield,
      description: 'Can submit templates & moderate suggestions',
      privileges: [
        '100 uploads per month',
        'Template submission rights',
        'Content moderation access',
        'Verified badge display'
      ]
    },
    {
      name: 'Admin',
      icon: Crown,
      description: 'Manage users, review flagged documents',
      privileges: [
        'Unlimited uploads',
        'User management',
        'Content review queue',
        'System administration'
      ]
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text mb-4 tracking-tight">Choose Your Access Level</h2>
          <p className="text-body-grey max-w-2xl mx-auto leading-relaxed">
            Different roles provide different levels of access and features. 
            Click on any role to learn more about the privileges.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => {
            const IconComponent = role.icon
            return (
              <div
                key={role.name}
                className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{role.name}</h3>
                    <p className="text-sm text-body-grey">{role.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {role.privileges.map((privilege, idx) => (
                    <div key={idx} className="flex items-center text-sm text-body-grey">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                      {privilege}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:text-primary/80">
                  <Info className="w-4 h-4 mr-1" />
                  Learn more
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RoleSummary
