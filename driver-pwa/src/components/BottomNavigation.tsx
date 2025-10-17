import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiClock, FiMap, FiUser } from 'react-icons/fi'

export const BottomNavigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Home' },
    { path: '/assignments', icon: FiClock, label: 'Trips' },
    { path: '/navigation', icon: FiMap, label: 'Map' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ]

  return (
    <nav className="sticky-bottom safe-area-inset">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 tap-target ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
