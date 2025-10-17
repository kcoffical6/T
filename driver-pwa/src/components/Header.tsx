import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FiMenu, FiBell, FiUser, FiMapPin } from 'react-icons/fi'

export const Header: React.FC = () => {
  const { driver, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 safe-area-inset">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="tap-target">
              <FiMenu className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">XYZ Driver</h1>
              <p className="text-sm text-gray-500">
                {driver?.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="tap-target relative">
              <FiBell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="tap-target">
              <FiMapPin className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="relative">
              <button className="tap-target">
                <FiUser className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
