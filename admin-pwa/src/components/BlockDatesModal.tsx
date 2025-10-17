import React, { useState } from 'react'
import { FiX, FiCalendar, FiClock } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface BlockDatesModalProps {
  vehicle: any
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading: boolean
}

export const BlockDatesModal: React.FC<BlockDatesModalProps> = ({
  vehicle,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [reason, setReason] = useState('')
  const [blockType, setBlockType] = useState<'single' | 'range'>('single')

  const handleSubmit = () => {
    if (!startDate) {
      alert('Please select a start date')
      return
    }

    if (blockType === 'range' && !endDate) {
      alert('Please select an end date')
      return
    }

    const data = {
      startDate: startDate.toISOString(),
      endDate: blockType === 'range' ? endDate?.toISOString() : startDate.toISOString(),
      reason: reason || 'Maintenance',
      blockedBy: 'admin', // This would come from auth context
    }

    onSubmit(data)
  }

  const handleSingleDateChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(date)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Block Vehicle Dates</h2>
            <button onClick={onClose} className="tap-target">
              <FiX className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Vehicle Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Vehicle Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>{vehicle.type} - {vehicle.regNo}</div>
              <div>{vehicle.capacity} seats • {vehicle.ac ? 'AC' : 'Non-AC'}</div>
            </div>
          </div>

          {/* Block Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Block Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBlockType('single')}
                className={`p-3 rounded-lg border-2 text-center ${
                  blockType === 'single'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <FiCalendar className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Single Date</div>
              </button>
              
              <button
                onClick={() => setBlockType('range')}
                className={`p-3 rounded-lg border-2 text-center ${
                  blockType === 'range'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <FiClock className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Date Range</div>
              </button>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {blockType === 'single' ? 'Select Date' : 'Start Date'}
            </label>
            <DatePicker
              selected={startDate}
              onChange={blockType === 'single' ? handleSingleDateChange : setStartDate}
              dateFormat="MMM dd, yyyy"
              minDate={new Date()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholderText="Select date"
            />
          </div>

          {blockType === 'range' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                dateFormat="MMM dd, yyyy"
                minDate={startDate || new Date()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholderText="Select end date"
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Blocking
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select reason</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Repair">Repair</option>
              <option value="Driver Unavailable">Driver Unavailable</option>
              <option value="Personal Use">Personal Use</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Custom Reason */}
          {reason === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Reason
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter custom reason"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

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
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 btn-primary"
            >
              {isLoading ? 'Blocking...' : 'Block Dates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
