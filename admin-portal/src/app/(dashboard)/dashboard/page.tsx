"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Car, Clock, Users, DollarSign, Package } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: "Total Bookings",
      value: "1,234",
      icon: Calendar,
      change: "+12% from last month",
    },
    {
      title: "Active Drivers",
      value: "42",
      icon: Users,
      change: "+3 this week",
    },
    {
      title: "Available Vehicles",
      value: "28",
      icon: Car,
      change: "+2 recently added",
    },
    {
      title: "Revenue",
      value: "$24,780",
      icon: DollarSign,
      change: "+8.1% from last month",
    },
  ];

  const recentBookings = [
    {
      id: "BK001",
      customer: "John Doe",
      vehicle: "Toyota Camry",
      date: "2023-10-20",
      status: "Completed",
      amount: "$120",
    },
    {
      id: "BK002",
      customer: "Jane Smith",
      vehicle: "Honda Civic",
      date: "2023-10-21",
      status: "In Progress",
      amount: "$95",
    },
    {
      id: "BK003",
      customer: "Robert Johnson",
      vehicle: "Ford Mustang",
      date: "2023-10-19",
      status: "Upcoming",
      amount: "$150",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name || "Admin"}!
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Package className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {booking.customer}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.vehicle}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {booking.date}
                    </div>
                    <div className="text-right">{booking.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Add New Driver
            </Button>
            <Button variant="outline" className="justify-start">
              <Car className="mr-2 h-4 w-4" />
              Add New Vehicle
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
