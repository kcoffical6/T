import React from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiMapPin, FiUsers, FiCheck, FiX, FiPlay, FiPause, FiCamera, FiMessageCircle } from 'react-icons/fi'

interface AssignmentCardProps {
  assignment: any
  onStatusUpdate: (id: string, status: string, data?: any) => void
  isUpdating: boolean
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onStatusUpdate,
  isUpdating,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'accepted':
        return 'status-approved'
      case 'ongoing':
        return 'status-confirmed'
      case 'completed':
        return 'status-confirmed'
      case 'cancelled':
        return 'status-rejected'
      default:
        return 'status-pending'
    }
  }

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusUpdate(assignment._id, 'accepted')}
              disabled={isUpdating}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <FiCheck className="w-4 h-4" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => onStatusUpdate(assignment._id, 'cancelled')}
              disabled={isUpdating}
              className="flex-1 btn-danger flex items-center justify-center space-x-2"
            >
              <FiX className="w-4 h-4" />
              <span>Decline</span>
            </button>
          </div>
        )
      case 'accepted':
        return (
          <button
            onClick={() => onStatusUpdate(assignment._id, 'ongoing')}
            disabled={isUpdating}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <FiPlay className="w-4 h-4" />
            <span>Start Trip</span>
          </button>
        )
      case 'ongoing':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusUpdate(assignment._id, 'completed')}
              disabled={isUpdating}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <FiCheck className="w-4 h-4" />
              <span>Complete</span>
            </button>
            <button className="flex-1 btn-secondary flex items-center justify-center space-x-2">
              <FiCamera className="w-4 h-4" />
              <span>Photos</span>
            </button>
          </div>
        )
      case 'completed':
        return (
          <div className="flex space-x-2">
            <button className="flex-1 btn-secondary flex items-center justify-center space-x-2">
              <FiCamera className="w-4 h-4" />
              <span>View Photos</span>
            </button>
            <button className="flex-1 btn-secondary flex items-center justify-center space-x-2">
              <FiMessageCircle className="w-4 h-4" />
              <span>Feedback</span>
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{assignment.package?.title}</h3>
            <span className={`status-chip ${getStatusColor(assignment.status)}`}>
              {assignment.status}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiClock className="w-4 h-4 mr-1" />
            {formatDate(assignment.startDateTime)} at {formatTime(assignment.startDateTime)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            ₹{assignment.userVisibleAmount?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">{assignment.paxCount} passengers</div>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="space-y-3 mb-4">
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
      </div>

      {/* Customer Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-1">Customer Details</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>{assignment.guestInfo?.name || assignment.user?.name}</div>
          <div>{assignment.guestInfo?.phone || assignment.user?.phone}</div>
          {assignment.guestInfo?.email && (
            <div>{assignment.guestInfo.email}</div>
          )}
        </div>
      </div>

      {/* Special Instructions */}
      {assignment.specialRequests && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Special Instructions</h4>
          <p className="text-sm text-blue-800">{assignment.specialRequests}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {getStatusActions(assignment.status)}
        
        <div className="flex space-x-2">
          <Link
            to={`/trip/${assignment._id}`}
            className="flex-1 btn-secondary text-center"
          >
            View Details
          </Link>
          <button className="flex-1 btn-secondary flex items-center justify-center space-x-2">
            <FiMessageCircle className="w-4 h-4" />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </div>
  )
}
