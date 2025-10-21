import { Booking } from "@/app/(dashboard)/bookings/columns";

export function exportBookingsToCsv(
  bookings: Booking[],
  filename: string = "bookings"
) {
  // Define CSV headers
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

  // Convert bookings to CSV rows
  const rows = bookings.map((booking) => {
    return [
      `"${booking.id}"`,
      `"${booking.customerName}"`,
      `"${booking.contactNumber}"`,
      `"${booking.pickupLocation}"`,
      `"${booking.dropoffLocation}"`,
      `"${new Date(booking.bookingDate).toLocaleString()}"`,
      `"${booking.status}"`,
      `"$${booking.amount.toFixed(2)}"`,
      `"${booking.vehicleType}"`,
      `"${booking.driver?.name || "Unassigned"}"`,
    ].join(",");
  });

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBookingsToJson(
  bookings: Booking[],
  filename: string = "bookings"
) {
  const dataStr = JSON.stringify(bookings, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const link = document.createElement("a");
  link.setAttribute("href", dataUri);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.json`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
