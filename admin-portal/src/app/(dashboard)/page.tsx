import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, Users, DollarSign, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

async function fetchDashboardData() {
  try {
    const [bookingsRes, customersRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings?limit=5`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers?limit=1`),
    ]);

    if (!bookingsRes.ok || !customersRes.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const [bookingsData, customersData] = await Promise.all([
      bookingsRes.json(),
      customersRes.json(),
    ]);

    return {
      totalBookings: bookingsData.total,
      recentBookings: bookingsData.data,
      totalCustomers: customersData.total,
      // Calculate revenue (in a real app, this would come from the API)
      totalRevenue: bookingsData.data.reduce(
        (sum: number, booking: any) => sum + (booking.amount || 0),
        0
      ),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const dashboardData = await fetchDashboardData();

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  const { totalBookings, recentBookings, totalCustomers, totalRevenue } =
    dashboardData;

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings.toLocaleString(),
      icon: Calendar,
      href: "/bookings",
    },
    {
      title: "Active Rides",
      value: recentBookings
        .filter((b: any) => b.status === "in-progress")
        .length.toString(),
      icon: Car,
      href: "/bookings?status=in-progress",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      icon: Users,
      href: "/customers",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      href: "/reports",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Link href={stat.href} key={i}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{booking.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : booking.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <button className="flex items-center gap-2 rounded-lg border p-4 text-left hover:bg-accent">
                <Calendar className="h-5 w-5" />
                <div>
                  <p className="font-medium">Create New Booking</p>
                  <p className="text-sm text-muted-foreground">
                    Add a new ride for a customer
                  </p>
                </div>
              </button>
              <button className="flex items-center gap-2 rounded-lg border p-4 text-left hover:bg-accent">
                <Users className="h-5 w-5" />
                <div>
                  <p className="font-medium">Manage Drivers</p>
                  <p className="text-sm text-muted-foreground">
                    View and manage drivers
                  </p>
                </div>
              </button>
              <button className="flex items-center gap-2 rounded-lg border p-4 text-left hover:bg-accent">
                <DollarSign className="h-5 w-5" />
                <div>
                  <p className="font-medium">View Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Generate and view reports
                  </p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
