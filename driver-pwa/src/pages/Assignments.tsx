import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { FiClock, FiMapPin, FiUsers, FiCheck, FiX, FiPlay, FiPause } from 'react-icons/fi'
import { assignmentsApi } from '../services/api'
import { AssignmentCard } from '../components/AssignmentCard'
import toast from 'react-hot-toast'

export const Assignments: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'ongoing' | 'completed'>('all')
  const queryClient = useQueryClient()

  const { data: assignments, isLoading } = useQuery(
    'driverAssignments',
    assignmentsApi.getAssignments
  )

  const updateStatusMutation = useMutation(
    ({ id, status, data }: { id: string; status: string; data?: any }) =>
      assignmentsApi.updateStatus(id, status, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('driverAssignments')
        toast.success('Status updated successfully!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update status')
      },
    }
  )

  const filteredAssignments = assignments?.filter((assignment: any) => {
    if (filter === 'all') return true
    return assignment.status === filter
  }) || []

  const handleStatusUpdate = (assignmentId: string, status: string, data?: any) => {
    updateStatusMutation.mutate({ id: assignmentId, status, data })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
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
    <div className="space-y-4">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">My Assignments</h2>
            <p className="text-gray-600">
              {filteredAssignments.length} trips {filter !== 'all' && `(${filter})`}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'ongoing', label: 'Ongoing' },
            { key: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="card text-center py-12">
            <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'You have no assignments yet' 
                : `No ${filter} assignments at the moment`
              }
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment: any) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={updateStatusMutation.isLoading}
            />
          ))
        )}
      </div>
    </div>
  )
}
