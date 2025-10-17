import React from 'react'
import { FiSettings, FiUser, FiShield, FiDatabase } from 'react-icons/fi'

export const Settings: React.FC = () => {
  const settingsSections = [
    {
      title: 'Account Settings',
      icon: FiUser,
      items: [
        { label: 'Profile Information', description: 'Update your personal details' },
        { label: 'Change Password', description: 'Update your account password' },
        { label: 'Notification Preferences', description: 'Manage email and push notifications' },
      ]
    },
    {
      title: 'System Settings',
      icon: FiSettings,
      items: [
        { label: 'Default Commission Rate', description: 'Set global commission percentage' },
        { label: 'Payment Expiry Time', description: 'Configure payment request timeout' },
        { label: 'Advance Payment Percentage', description: 'Set advance payment amount' },
      ]
    },
    {
      title: 'Security',
      icon: FiShield,
      items: [
        { label: 'Two-Factor Authentication', description: 'Add extra security to your account' },
        { label: 'Login History', description: 'View recent login attempts' },
        { label: 'API Access', description: 'Manage API keys and permissions' },
      ]
    },
    {
      title: 'Data & Backup',
      icon: FiDatabase,
      items: [
        { label: 'Export Data', description: 'Download your data' },
        { label: 'Backup Settings', description: 'Configure automatic backups' },
        { label: 'Data Retention', description: 'Manage data storage policies' },
      ]
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <div key={sectionIndex} className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              </div>
              
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-900 mb-1">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* System Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">App Version</span>
            <span className="font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium text-gray-900">Oct 15, 2025</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Database Status</span>
            <span className="font-medium text-green-600">Connected</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Cache Status</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <button className="w-full text-left p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <div className="font-medium text-red-900 mb-1">Clear Cache</div>
            <div className="text-sm text-red-700">Remove all cached data</div>
          </button>
          <button className="w-full text-left p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <div className="font-medium text-red-900 mb-1">Reset Settings</div>
            <div className="text-sm text-red-700">Restore default configuration</div>
          </button>
        </div>
      </div>
    </div>
  )
}
