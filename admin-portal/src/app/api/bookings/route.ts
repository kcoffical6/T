import { NextResponse } from "next/server";
import { mockBookings } from "@/data/mockBookings";
import { Booking } from "@/app/(dashboard)/bookings/columns";
import { format } from "date-fns";

interface GetBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Helper function to filter and sort bookings
function processBookings(bookings: Booking[], params: GetBookingsParams) {
  let filteredBookings = [...bookings];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredBookings = filteredBookings.filter(
      (booking) =>
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.contactNumber.includes(params.search!) ||
        booking.id.toLowerCase().includes(searchLower) ||
        booking.pickupLocation.toLowerCase().includes(searchLower) ||
        booking.dropoffLocation.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (params.status) {
    filteredBookings = filteredBookings.filter(
      (booking) => booking.status === params.status
    );
  }

  // Apply date range filter
  if (params.startDate) {
    const startDate = new Date(params.startDate);
    filteredBookings = filteredBookings.filter(
      (booking) => new Date(booking.bookingDate) >= startDate
    );
  }

  if (params.endDate) {
    const endDate = new Date(params.endDate);
    endDate.setHours(23, 59, 59, 999); // End of the day
    filteredBookings = filteredBookings.filter(
      (booking) => new Date(booking.bookingDate) <= endDate
    );
  }

  // Apply sorting
  if (params.sortBy) {
    filteredBookings.sort((a, b) => {
      let aValue: any = a[params.sortBy as keyof Booking];
      let bValue: any = b[params.sortBy as keyof Booking];

      if (params.sortBy === "bookingDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return params.sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return params.sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  return filteredBookings;
}

// Helper function to convert bookings to CSV
function convertToCsv(bookings: Booking[]): string {
  const headers = [
    "Booking ID",
    "Customer Name",
    "Contact Number",
    "Pickup Location",
    "Dropoff Location",
    "Booking Date",
    "Status",
    "Amount",
    "Vehicle Type",
    "Driver",
  ];

  const rows = bookings.map((booking) => {
    return [
      `"${booking.id}"`,
      `"${booking.customerName}"`,
      `"${booking.contactNumber}"`,
      `"${booking.pickupLocation}"`,
      `"${booking.dropoffLocation}"`,
      `"${format(new Date(booking.bookingDate), "PPpp")}"`,
      `"${booking.status}"`,
      `"$${booking.amount.toFixed(2)}"`,
      `"${booking.vehicleType}"`,
      `"${booking.driver?.name || "Unassigned"}"`,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exportFormat = searchParams.get("export");

  const params: GetBookingsParams = {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    sortBy: searchParams.get("sortBy") || "bookingDate",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  };

  // Process the bookings with filters and sorting
  const filteredBookings = processBookings(mockBookings, params);

  // Handle export requests
  if (exportFormat) {
    const exportData = processBookings(mockBookings, {
      ...params,
      // Remove pagination for exports to get all matching records
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    });

    if (exportFormat === "csv") {
      const csvContent = convertToCsv(exportData);
      const filename = `bookings_export_${format(new Date(), "yyyy-MM-dd")}.csv`;

      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } else if (exportFormat === "json") {
      return new Response(JSON.stringify(exportData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="bookings_export_${format(new Date(), "yyyy-MM-dd")}.json"`,
        },
      });
    }
  }

  // Apply pagination with default values
  const total = filteredBookings.length;
  const page = params.page || 1;
  const limit = params.limit || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    data: paginatedBookings,
    total,
    page: page,
    limit: limit,
    totalPages,
  });
}
