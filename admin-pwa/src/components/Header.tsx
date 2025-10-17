import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi'

interface HeaderProps {
  onMenuToggle: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiMenu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname === '/pending' && 'Pending Approvals'}
                {location.pathname === '/fleet' && 'Fleet Management'}
                {location.pathname === '/reports' && 'Reports'}
                {location.pathname === '/settings' && 'Settings'}
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user?.name || 'Admin'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiBell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button 
                    onClick={logout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
