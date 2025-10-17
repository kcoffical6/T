import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { FiX, FiTruck, FiPercent, FiCheck } from 'react-icons/fi'
import { vehiclesApi } from '../services/api'

interface QuickApproveModalProps {
  booking: any
  onClose: () => void
  onApprove: (data: any) => void
  isLoading: boolean
}

export const QuickApproveModal: React.FC<QuickApproveModalProps> = ({
  booking,
  onClose,
  onApprove,
  isLoading,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [commissionOverride, setCommissionOverride] = useState('')
  const [approvalNote, setApprovalNote] = useState('')

  const { data: vehicles } = useQuery(
    'availableVehicles',
    () => vehiclesApi.getAllVehicles(),
    {
      select: (data) => data.filter((v: any) => v.status === 'available')
    }
  )

  const handleApprove = () => {
    const data: any = {}
    
    if (selectedVehicle) {
      data.vehicleId = selectedVehicle
    }
    
    if (commissionOverride) {
      data.commissionOverride = parseFloat(commissionOverride)
    }
    
    if (approvalNote) {
      data.approvalNote = approvalNote
    }

    onApprove(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Quick Approve</h2>
            <button onClick={onClose} className="tap-target">
              <FiX className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>{booking.package?.title}</div>
              <div>{booking.paxCount} travelers • ₹{booking.userVisibleAmount?.toLocaleString()}</div>
              <div>{new Date(booking.startDateTime).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiTruck className="w-4 h-4 inline mr-1" />
              Assign Vehicle (Optional)
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Auto-assign best available</option>
              {vehicles?.map((vehicle: any) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.type} - {vehicle.capacity} seats ({vehicle.regNo})
                </option>
              ))}
            </select>
          </div>

          {/* Commission Override */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiPercent className="w-4 h-4 inline mr-1" />
              Commission Override (Optional)
            </label>
            <div className="relative">
              <input
                type="number"
                value={commissionOverride}
                onChange={(e) => setCommissionOverride(e.target.value)}
                placeholder="Enter percentage (e.g., 15)"
                className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use default commission ({booking.commissionPercent || 10}%)
            </p>
          </div>

          {/* Approval Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Note (Optional)
            </label>
            <textarea
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              placeholder="Add any notes for the customer..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <FiCheck className="w-4 h-4" />
              <span>{isLoading ? 'Approving...' : 'Approve & Send Payment'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
