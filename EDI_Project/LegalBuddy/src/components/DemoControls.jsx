import React from 'react'
import { Settings, User, UserCheck, Shield, Crown } from 'lucide-react'

const DemoControls = ({ currentRole, onRoleChange }) => {
  const roles = [
    { value: 'guest', label: 'Guest', icon: User, color: 'bg-gray-500' },
    { value: 'user', label: 'User', icon: UserCheck, color: 'bg-blue-500' },
    { value: 'lawyer', label: 'Lawyer', icon: Shield, color: 'bg-accent' },
    { value: 'admin', label: 'Admin', icon: Crown, color: 'bg-purple-500' }
  ]

  const currentRoleData = roles.find(role => role.value === currentRole)

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <Settings className="w-4 h-4 mr-2 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">DEV MODE</span>
        </div>
        
        <div className="flex items-center mb-3">
          <div className={`w-3 h-3 rounded-full ${currentRoleData?.color} mr-2`}></div>
          <span className="text-sm text-gray-600">
            role: {currentRoleData?.label}
          </span>
        </div>
        
        <div className="space-y-2">
          {roles.map((role) => {
            const IconComponent = role.icon
            return (
              <button
                key={role.value}
                onClick={() => onRoleChange(role.value)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                  currentRole === role.value
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {role.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DemoControls
