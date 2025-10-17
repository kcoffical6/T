import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FiClock } from "react-icons/fi";
import { bookingsApi } from "../services/api";
import { QuickApproveModal } from "../components/QuickApproveModal";
import { BookingCard } from "../components/BookingCard";
import toast from "react-hot-toast";

export const PendingApprovals: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: pendingBookings, isLoading } = useQuery(
    "pendingBookings",
    bookingsApi.getPendingApprovals,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const approveMutation = useMutation(
    ({ id, data }: { id: string; data: any }) =>
      bookingsApi.approveBooking(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pendingBookings");
        setShowApproveModal(false);
        toast.success("Booking approved successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to approve booking"
        );
      },
    }
  );

  const rejectMutation = useMutation(
    ({ id, reason }: { id: string; reason: string }) =>
      bookingsApi.rejectBooking(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pendingBookings");
        toast.success("Booking rejected");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to reject booking"
        );
      },
    }
  );

  const handleQuickApprove = (booking: any) => {
    setSelectedBooking(booking);
    setShowApproveModal(true);
  };

  const handleQuickReject = (booking: any) => {
    const reason = prompt("Reason for rejection (optional):");
    if (reason !== null) {
      rejectMutation.mutate({ id: booking._id, reason });
    }
  };

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
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Approvals
            </h2>
            <p className="text-gray-600">
              {pendingBookings?.length || 0} bookings awaiting approval
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FiClock className="w-6 h-6 text-amber-500" />
            <span className="text-sm font-medium text-amber-600">
              Live Updates
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {pendingBookings?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {pendingBookings?.filter((b: any) => b.priority === "high")
              .length || 0}
          </div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {pendingBookings?.length === 0 ? (
          <div className="card text-center py-12">
            <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Pending Approvals
            </h3>
            <p className="text-gray-600">All bookings have been processed</p>
          </div>
        ) : (
          pendingBookings?.map((booking: any) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onQuickApprove={() => handleQuickApprove(booking)}
              onQuickReject={() => handleQuickReject(booking)}
              isApproving={approveMutation.isLoading}
              isRejecting={rejectMutation.isLoading}
            />
          ))
        )}
      </div>

      {/* Quick Approve Modal */}
      {showApproveModal && selectedBooking && (
        <QuickApproveModal
          booking={selectedBooking}
          onClose={() => setShowApproveModal(false)}
          onApprove={(data) =>
            approveMutation.mutate({ id: selectedBooking._id, data })
          }
          isLoading={approveMutation.isLoading}
        />
      )}
    </div>
  );
};
