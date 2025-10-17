import React from 'react'
import { useQuery } from 'react-query'
import { FiClock, FiMapPin, FiUsers, FiTruck, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { assignmentsApi } from '../services/api'

export const Dashboard: React.FC = () => {
  const { data: assignments, isLoading } = useQuery(
    'driverAssignments',
    assignmentsApi.getAssignments
  )

  const todayAssignments = assignments?.filter((assignment: any) => {
    const today = new Date().toDateString()
    const assignmentDate = new Date(assignment.startDateTime).toDateString()
    return assignmentDate === today
  }) || []

  const upcomingAssignments = assignments?.filter((assignment: any) => {
    const today = new Date()
    const assignmentDate = new Date(assignment.startDateTime)
    return assignmentDate > today
  }) || []

  const completedToday = assignments?.filter((assignment: any) => {
    const today = new Date().toDateString()
    const assignmentDate = new Date(assignment.startDateTime).toDateString()
    return assignmentDate === today && assignment.status === 'completed'
  }) || []

  const stats = [
    {
      title: 'Today\'s Trips',
      value: todayAssignments.length,
      icon: FiClock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: completedToday.length,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Upcoming',
      value: upcomingAssignments.length,
      icon: FiAlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total This Week',
      value: assignments?.length || 0,
      icon: FiTruck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="card">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="card">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900">Good Morning!</h1>
        <p className="text-gray-600">Ready for today's adventures?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Today's Schedule */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
        {todayAssignments.length === 0 ? (
          <div className="text-center py-8">
            <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips today</h3>
            <p className="text-gray-600">Enjoy your day off!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAssignments.map((assignment: any) => (
              <div key={assignment._id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{assignment.package?.title}</h3>
                  <span className={`status-chip ${
                    assignment.status === 'completed' ? 'status-confirmed' :
                    assignment.status === 'ongoing' ? 'status-approved' :
                    'status-pending'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {assignment.pickupLocation}
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="w-4 h-4 mr-2" />
                    {assignment.paxCount} passengers
                  </div>
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 mr-2" />
                    {new Date(assignment.startDateTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors">
            <FiMapPin className="w-6 h-6 text-green-600 mb-2" />
            <div className="font-medium text-green-900">Start Navigation</div>
            <div className="text-sm text-green-700">Get directions</div>
          </button>
          
          <button className="p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors">
            <FiClock className="w-6 h-6 text-blue-600 mb-2" />
            <div className="font-medium text-blue-900">View Schedule</div>
            <div className="text-sm text-blue-700">See all trips</div>
          </button>
        </div>
      </div>
    </div>
  )
}
