import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FiUser, FiPhone, FiCreditCard, FiStar, FiLogOut } from 'react-icons/fi'

export const Profile: React.FC = () => {
  const { driver, logout } = useAuth()

  const stats = [
    {
      title: 'Total Trips',
      value: '127',
      icon: FiStar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Rating',
      value: '4.8',
      icon: FiStar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'This Month',
      value: '23',
      icon: FiStar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FiUser className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">{driver?.name}</h1>
            <p className="text-gray-600">Professional Driver</p>
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">4.8 (127 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card text-center">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          )
        })}
      </div>

      {/* Personal Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FiUser className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Full Name</div>
              <div className="text-sm text-gray-600">{driver?.name}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FiPhone className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Phone Number</div>
              <div className="text-sm text-gray-600">{driver?.phone}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FiCreditCard className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">License Number</div>
              <div className="text-sm text-gray-600">{driver?.licenseNo}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-900">Sarah Mitchell</div>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              "Excellent driver! Very professional and knowledgeable about the local area. Made our trip memorable."
            </p>
            <div className="text-xs text-gray-500 mt-2">2 days ago</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-900">Michael Johnson</div>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              "Great service! Punctual and friendly. Highly recommend for any tour."
            </p>
            <div className="text-xs text-gray-500 mt-2">1 week ago</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        <div className="space-y-3">
          <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="font-medium text-gray-900">Notification Preferences</div>
            <div className="text-sm text-gray-600">Manage push notifications</div>
          </button>
          
          <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="font-medium text-gray-900">Privacy Settings</div>
            <div className="text-sm text-gray-600">Control your data sharing</div>
          </button>
          
          <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="font-medium text-gray-900">Help & Support</div>
            <div className="text-sm text-gray-600">Get help and contact support</div>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="card">
        <button
          onClick={logout}
          className="w-full btn-danger flex items-center justify-center space-x-2"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
