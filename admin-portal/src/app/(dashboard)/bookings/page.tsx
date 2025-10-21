"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter, X, Loader2, Download } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { columns, type Booking } from "./columns";
import {
  useGetBookingsQuery,
  type PaginatedBookings,
} from "@/features/bookings/bookingsApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import { exportBookingsToCsv, exportBookingsToJson } from "@/lib/export-utils";

const ITEMS_PER_PAGE = 10;

export default function BookingsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Fetch all bookings for export (without pagination)
  const { data: allBookingsData } = useGetBookingsQuery({
    page: 1,
    limit: 1000, // Adjust based on your needs
    search: searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });

  // Update allBookings when data changes
  useEffect(() => {
    if (allBookingsData?.data) {
      setAllBookings(allBookingsData.data);
    }
  }, [allBookingsData]);

  // Handle export to CSV
  const handleExportCsv = () => {
    if (allBookings.length > 0) {
      exportBookingsToCsv(allBookings, "bookings_export");
    }
  };

  // Handle export to JSON
  const handleExportJson = () => {
    if (allBookings.length > 0) {
      exportBookingsToJson(allBookings, "bookings_export");
    }
  };

  // Fetch bookings with query parameters
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetBookingsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });

  // Handle the paginated response
  const bookings = response?.data || [];
  const totalPages = response?.totalPages || 1;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateRange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange(undefined);
  };

  const hasFilters =
    searchTerm || statusFilter !== "all" || dateRange?.from || dateRange?.to;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Manage all bookings in one place
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              disabled={allBookings.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              disabled={allBookings.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
          <Button onClick={() => router.push("/bookings/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by customer name, email, or phone..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.currentTarget.click();
                    }
                  }}
                  className={cn(
                    "inline-flex items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-[240px] text-left",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </span>
                    ) : (
                      <span>{format(dateRange.from, "LLL dd, y")}</span>
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {hasFilters && (
              <Button variant="ghost" onClick={clearFilters} className="px-2">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {hasFilters && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Filter className="mr-2 h-4 w-4" />
            <span>Filtered results</span>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={bookings}
          isLoading={isLoading || isFetching}
          searchKey="customerName"
          pageCount={totalPages}
          pageIndex={currentPage - 1}
          onPageChange={(page) => setCurrentPage(page + 1)}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
