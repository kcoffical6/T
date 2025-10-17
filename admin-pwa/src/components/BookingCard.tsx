import React from "react";
import {
  FiUser,
  FiMapPin,
  FiCalendar,
  FiCheck,
  FiX,
  FiClock,
} from "react-icons/fi";

interface BookingCardProps {
  booking: any;
  onQuickApprove: () => void;
  onQuickReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onQuickApprove,
  onQuickReject,
  isApproving,
  isRejecting,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {booking.package?.title}
            </h3>
            {booking.priority && (
              <span
                className={`status-chip ${getPriorityColor(booking.priority)}`}
              >
                {booking.priority}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiClock className="w-4 h-4 mr-1" />
            {formatDate(booking.createdAt)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            ₹{booking.userVisibleAmount?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            {booking.paxCount} travelers
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiUser className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            {booking.guestInfo?.name || booking.user?.name}
            {booking.guestInfo?.email && ` (${booking.guestInfo.email})`}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>{booking.pickupLocation}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            {formatDate(booking.startDateTime)} at{" "}
            {formatTime(booking.startDateTime)}
          </span>
        </div>

        {booking.returnDateTime && (
          <div className="flex items-center text-sm text-gray-600">
            <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              Return: {formatDate(booking.returnDateTime)} at{" "}
              {formatTime(booking.returnDateTime)}
            </span>
          </div>
        )}
      </div>

      {/* Special Requests */}
      {booking.specialRequests && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Special Requests
          </h4>
          <p className="text-sm text-gray-600">{booking.specialRequests}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onQuickApprove}
          disabled={isApproving}
          className="flex-1 btn-primary flex items-center justify-center space-x-2"
        >
          <FiCheck className="w-4 h-4" />
          <span>{isApproving ? "Approving..." : "Quick Approve"}</span>
        </button>

        <button
          onClick={onQuickReject}
          disabled={isRejecting}
          className="flex-1 btn-danger flex items-center justify-center space-x-2"
        >
          <FiX className="w-4 h-4" />
          <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
        </button>
      </div>
    </div>
  );
};
