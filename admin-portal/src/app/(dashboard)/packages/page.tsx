"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Package } from "@/types/package";
import { useGetPackagesQuery } from "@/features/packages/packagesApi";

export default function PackagesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const { data, isLoading } = useGetPackagesQuery({
    search: searchTerm || undefined,
    region: regionFilter !== "all" ? regionFilter : undefined,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRegionFilter("all");
  };

  const hasFilters =
    searchTerm || statusFilter !== "all" || regionFilter !== "all";

  // Filter packages based on search and filters
  const list = (data?.packages as Package[]) || [];
  const filteredPackages = list.filter((pkg) => {
    const matchesSearch = pkg.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && pkg.isActive) ||
      (statusFilter === "inactive" && !pkg.isActive);
    const matchesRegion = regionFilter === "all" || pkg.region === regionFilter;

    return matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tour Packages</h2>
          <p className="text-muted-foreground">
            Manage all tour packages in one place
          </p>
        </div>
        <Button onClick={() => router.push("/packages/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Package
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                <SelectItem value="kerala">Kerala</SelectItem>
              </SelectContent>
            </Select>

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
            <span>Filtered results: {filteredPackages.length} packages</span>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={filteredPackages}
          isLoading={isLoading}
          searchKey="title"
        />
      </div>
    </div>
  );
}
