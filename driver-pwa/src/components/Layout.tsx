import React from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNavigation } from './BottomNavigation'
import { Header } from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="mobile-container">
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
}
