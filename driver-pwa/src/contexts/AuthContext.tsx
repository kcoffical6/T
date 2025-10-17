import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useMutation, useQuery } from 'react-query'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'

interface Driver {
  id: string
  name: string
  phone: string
  licenseNo: string
  rating: number
}

interface AuthContextType {
  driver: Driver | null
  isLoading: boolean
  login: (phone: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if driver is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('driver_token')
    if (token) {
      // Verify token and get driver info
      authApi.getProfile()
        .then((driverData) => {
          setDriver(driverData)
        })
        .catch(() => {
          localStorage.removeItem('driver_token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const loginMutation = useMutation(
    ({ phone, password }: { phone: string; password: string }) =>
      authApi.login(phone, password),
    {
      onSuccess: (data) => {
        localStorage.setItem('driver_token', data.access_token)
        setDriver(data.driver)
        toast.success('Welcome back!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Login failed')
      },
    }
  )

  const login = async (phone: string, password: string) => {
    await loginMutation.mutateAsync({ phone, password })
  }

  const logout = () => {
    localStorage.removeItem('driver_token')
    setDriver(null)
    toast.success('Logged out successfully')
  }

  const isAuthenticated = !!driver

  const value: AuthContextType = {
    driver,
    isLoading,
    login,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
