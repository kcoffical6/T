import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { FiMapPin, FiClock, FiUsers, FiPhone, FiMessageCircle, FiCamera, FiCheck } from 'react-icons/fi'
import { assignmentsApi } from '../services/api'
import { MapComponent } from '../components/MapComponent'
import toast from 'react-hot-toast'

export const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: assignment, isLoading } = useQuery(
    ['assignment', id],
    () => assignmentsApi.getAssignment(id!),
    { enabled: !!id }
  )

  const updateStatusMutation = useMutation(
    ({ status, data }: { status: string; data?: any }) =>
      assignmentsApi.updateStatus(id!, status, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignment', id])
        queryClient.invalidateQueries('driverAssignments')
        toast.success('Status updated successfully!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update status')
      },
    }
  )

  const submitReportMutation = useMutation(
    (data: any) => assignmentsApi.submitReport(id!, data),
    {
      onSuccess: () => {
        toast.success('Report submitted successfully!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to submit report')
      },
    }
  )

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

  if (!assignment) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment not found</h3>
        <p className="text-gray-600">The requested assignment could not be found.</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{assignment.package?.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-1" />
            {formatDate(assignment.startDateTime)}
          </div>
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-1" />
            {formatTime(assignment.startDateTime)}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="card p-0 overflow-hidden">
        <div className="h-64">
          <MapComponent
            pickupLocation={assignment.pickupLocation}
            dropLocation={assignment.dropLocation}
            currentLocation={assignment.currentLocation}
          />
        </div>
      </div>

      {/* Trip Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h2>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              <strong>Pickup:</strong> {assignment.pickupLocation}
            </span>
          </div>
          
          {assignment.dropLocation && (
            <div className="flex items-center text-sm text-gray-600">
              <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                <strong>Drop:</strong> {assignment.dropLocation}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <FiUsers className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              <strong>Passengers:</strong> {assignment.paxCount} travelers
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-4 h-4 mr-2 text-gray-400">🚗</span>
            <span>
              <strong>Vehicle:</strong> {assignment.vehicle?.type} - {assignment.vehicle?.regNo}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                {assignment.guestInfo?.name || assignment.user?.name}
              </div>
              <div className="text-sm text-gray-600">
                {assignment.guestInfo?.phone || assignment.user?.phone}
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="tap-target p-2 bg-green-100 rounded-lg">
                <FiPhone className="w-5 h-5 text-green-600" />
              </button>
              <button className="tap-target p-2 bg-blue-100 rounded-lg">
                <FiMessageCircle className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          {assignment.guestInfo?.email && (
            <div className="text-sm text-gray-600">
              Email: {assignment.guestInfo.email}
            </div>
          )}
        </div>
      </div>

      {/* Special Instructions */}
      {assignment.specialRequests && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h2>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">{assignment.specialRequests}</p>
          </div>
        </div>
      )}

      {/* Package Details */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Package Details</h2>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <strong>Duration:</strong> {assignment.package?.duration || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Description:</strong> {assignment.package?.shortDesc || 'N/A'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="space-y-3">
          {assignment.status === 'accepted' && (
            <button
              onClick={() => updateStatusMutation.mutate({ status: 'ongoing' })}
              disabled={updateStatusMutation.isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <FiCheck className="w-4 h-4" />
              <span>Start Trip</span>
            </button>
          )}
          
          {assignment.status === 'ongoing' && (
            <div className="space-y-2">
              <button
                onClick={() => updateStatusMutation.mutate({ status: 'completed' })}
                disabled={updateStatusMutation.isLoading}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <FiCheck className="w-4 h-4" />
                <span>Complete Trip</span>
              </button>
              
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <FiCamera className="w-4 h-4" />
                <span>Upload Photos</span>
              </button>
            </div>
          )}
          
          {assignment.status === 'completed' && (
            <div className="space-y-2">
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <FiCamera className="w-4 h-4" />
                <span>View Photos</span>
              </button>
              
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <FiMessageCircle className="w-4 h-4" />
                <span>Submit Feedback</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
