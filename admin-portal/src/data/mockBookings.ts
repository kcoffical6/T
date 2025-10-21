import { Booking } from "@/app/(dashboard)/bookings/columns";

const STATUSES: Booking["status"][] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
];

const VEHICLE_TYPES = ["Sedan", "SUV", "Van", "Luxury"];
const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
];

const CUSTOMER_NAMES = [
  "John Smith",
  "Emma Johnson",
  "Michael Williams",
  "Sarah Brown",
  "James Wilson",
  "Patricia Taylor",
  "Robert Anderson",
  "Jennifer Thomas",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString();
}

export function generateMockBookings(count: number = 50): Booking[] {
  const bookings: Booking[] = [];

  for (let i = 1; i <= count; i++) {
    const pickup = getRandomElement(LOCATIONS);
    let dropoff: string;
    do {
      dropoff = getRandomElement(LOCATIONS);
    } while (dropoff === pickup);

    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() - Math.floor(Math.random() * 30));

    bookings.push({
      id: `BK${String(i).padStart(4, "0")}`,
      customerName: getRandomElement(CUSTOMER_NAMES),
      contactNumber: `+1${Math.floor(2000000000 + Math.random() * 8000000000)}`,
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      bookingDate: getRandomDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        new Date() // Today
      ),
      status: getRandomElement(STATUSES),
      amount: Math.floor(Math.random() * 500) + 20, // $20-$520
      vehicleType: getRandomElement(VEHICLE_TYPES),
      driver:
        Math.random() > 0.3
          ? {
              id: `DRV${Math.floor(100 + Math.random() * 900)}`,
              name: `Driver ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
            }
          : undefined,
    });
  }

  return bookings;
}

export const mockBookings = generateMockBookings(50);
