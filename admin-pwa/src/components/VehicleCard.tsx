import React from 'react'
import { FiTruck, FiCalendar, FiUsers, FiToggleLeft, FiToggleRight } from 'react-icons/fi'

interface VehicleCardProps {
  vehicle: any
  onToggleAvailability: () => void
  onBlockDates: () => void
  isToggling: boolean
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onToggleAvailability,
  onBlockDates,
  isToggling,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'booked':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sedan':
        return '🚗'
      case 'suv':
        return '🚙'
      case '7-seater':
        return '🚐'
      case 'tempo traveller':
        return '🚌'
      case 'minibus':
        return '🚌'
      case 'bus':
        return '🚌'
      default:
        return '🚗'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getTypeIcon(vehicle.type)}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{vehicle.type}</h3>
            <p className="text-sm text-gray-600">{vehicle.regNo}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`status-chip ${getStatusColor(vehicle.status)}`}>
            {vehicle.status}
          </span>
          <button
            onClick={onToggleAvailability}
            disabled={isToggling}
            className="tap-target"
          >
            {vehicle.status === 'available' ? (
              <FiToggleRight className="w-6 h-6 text-green-600" />
            ) : (
              <FiToggleLeft className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiUsers className="w-4 h-4 mr-2 text-gray-400" />
          <span>{vehicle.capacity} seats</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <FiTruck className="w-4 h-4 mr-2 text-gray-400" />
          <span>{vehicle.luggageCapacity} bags capacity</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-4 h-4 mr-2 text-gray-400">❄️</span>
          <span>{vehicle.ac ? 'AC Available' : 'Non-AC'}</span>
        </div>
      </div>

      {/* Driver Assignment */}
      {vehicle.assignedDriver && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Assigned Driver</h4>
          <div className="text-sm text-gray-600">
            {vehicle.assignedDriver.name} • {vehicle.assignedDriver.phone}
          </div>
        </div>
      )}

      {/* Blocked Dates */}
      {vehicle.availability && vehicle.availability.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Blocked Dates</h4>
          <div className="space-y-1">
            {vehicle.availability.slice(0, 3).map((block: any, index: number) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>
                  {formatDate(block.startDate)} - {formatDate(block.endDate)}
                </span>
                <span className="ml-2 text-xs text-gray-500">({block.reason})</span>
              </div>
            ))}
            {vehicle.availability.length > 3 && (
              <div className="text-xs text-gray-500">
                +{vehicle.availability.length - 3} more blocked periods
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onBlockDates}
          className="flex-1 btn-secondary flex items-center justify-center space-x-2"
        >
          <FiCalendar className="w-4 h-4" />
          <span>Block Dates</span>
        </button>
        
        <button
          onClick={() => {/* View details */}}
          className="flex-1 btn-primary"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
