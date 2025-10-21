// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Link } from 'react-router-dom';
// import { Search, Plus, Loader2, Filter, X } from 'lucide-react';

// import { getVehicles } from '@/services/vehicleService';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardHeader } from '@/components/ui/card';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// // Temporary in-memory vehicle types since we're having issues with the constants file
// const vehicleTypes = [
//   { value: 'sedan', label: 'Sedan' },
//   { value: 'suv', label: 'SUV' },
//   { value: 'van', label: 'Van' },
//   { value: 'minivan', label: 'Minivan' },
//   { value: 'luxury', label: 'Luxury' },
//   { value: 'bus', label: 'Bus' },
// ];

// const ITEMS_PER_PAGE = 9;

// export function VehiclesList() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [typeFilter, setTypeFilter] = useState<string>('');
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const { data, isLoading, isError, refetch } = useQuery({
//     queryKey: ['vehicles', { searchTerm, typeFilter, statusFilter, currentPage }],
//     queryFn: () =>
//       getVehicles({
//         search: searchTerm,
//         type: typeFilter,
//         status: statusFilter,
//         page: currentPage,
//         limit: ITEMS_PER_PAGE,
//       } as any), // Temporary any type until we fix the service
//   });

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     refetch();
//   };

//   const handleClearFilters = () => {
//     setSearchTerm('');
//     setTypeFilter('');
//     setStatusFilter('');
//     setCurrentPage(1);
//   };

//   if (isLoading && !data) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         <span className="ml-2">Loading vehicles...</span>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-destructive">Failed to load vehicles. Please try again later.</p>
//         <Button variant="outline" className="mt-4" onClick={() => refetch()}>
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   const totalPages = (data as any)?.totalPages || 1;
//   const hasFilters = Boolean(searchTerm || typeFilter || statusFilter);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Vehicle Fleet</h1>
//           <p className="text-muted-foreground">
//             Manage your vehicle inventory and availability
//           </p>
//         </div>
//         <Button asChild>
//           <Link to="/vehicles/new">
//             <Plus className="mr-2 h-4 w-4" />
//             Add Vehicle
//           </Link>
//         </Button>
//       </div>

//       <Card className="mb-8">
//         <CardHeader className="pb-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
//             <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   type="search"
//                   placeholder="Search by make, model, or type..."
//                   className="pl-10"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </form>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setIsFilterOpen(!isFilterOpen)}
//               >
//                 <Filter className="mr-2 h-4 w-4" />
//                 Filters
//                 {(typeFilter || statusFilter) && (
//                   <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>
//                 )}
//               </Button>
//               {(searchTerm || typeFilter || statusFilter) && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={handleClearFilters}
//                 >
//                   Clear all
//                   <X className="ml-2 h-4 w-4" />
//                 </Button>
//               )}
//             </div>
//           </div>

//           {isFilterOpen && (
//             <div className="pt-4 mt-4 border-t">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-2 block">Vehicle Type</label>
//                   <Select
//                     value={typeFilter}
//                     onValueChange={setTypeFilter}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="All Types" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="">All Types</SelectItem>
//                       {vehicleTypes.map((type) => (
//                         <SelectItem key={type.value} value={type.value}>
//                           {type.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-2 block">Status</label>
//                   <Select
//                     value={statusFilter}
//                     onValueChange={setStatusFilter}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="All Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="">All Status</SelectItem>
//                       <SelectItem value="active">Active</SelectItem>
//                       <SelectItem value="inactive">Inactive</SelectItem>
//                       <SelectItem value="maintenance">In Maintenance</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CardHeader>
//       </Card>

//       {data?.data && data.data.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {Array.isArray((data as any)?.data) && (data as any).data.map((vehicle: any) => (
//             <div key={vehicle._id} className="border rounded-lg overflow-hidden shadow-sm">
//               <div className="p-4">
//                 <h3 className="text-lg font-medium">{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
//                 <p className="text-sm text-gray-500">{vehicle.type}</p>
//                 <p className="mt-2">Seats: {vehicle.seatingCapacity}</p>
//                 <p className="font-medium mt-2">₹{vehicle.basePricePerDay}/day</p>
//                 <div className="mt-4 flex space-x-2">
//                   <Button variant="outline" size="sm" asChild>
//                     <Link to={`/vehicles/${vehicle._id}`}>View</Link>
//                   </Button>
//                   <Button variant="outline" size="sm" asChild>
//                     <Link to={`/vehicles/edit/${vehicle._id}`}>Edit</Link>
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => console.log('Delete', vehicle._id)}
//                   >
//                     Delete
//                   </Button>
//                   <p className="mt-2">Seats: {vehicle.seatingCapacity}</p>
//                   <p className="font-medium mt-2">₹{vehicle.basePricePerDay}/day</p>
//                   <div className="mt-4 flex space-x-2">
//                     <Button variant="outline" size="sm" asChild>
//                       <Link to={`/vehicles/${vehicle._id}`}>View</Link>
//                     </Button>
//                     <Button variant="outline" size="sm" asChild>
//                       <Link to={`/vehicles/edit/${vehicle._id}`}>Edit</Link>
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       onClick={() => console.log('Delete', vehicle._id)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {totalPages > 1 && (
//             <div className="mt-8">
//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       href="#"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         if (currentPage > 1) {
//                           setCurrentPage(currentPage - 1);
//                           window.scrollTo({ top: 0, behavior: 'smooth' });
//                         }
//                       }}
//                       className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
//                     />
//                   </PaginationItem>

//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     // Show first page, last page, current page, and pages around current page
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }

//                     return (
//                       <PaginationItem key={pageNum}>
//                         <PaginationLink
//                           href="#"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             setCurrentPage(pageNum);
//                             window.scrollTo({ top: 0, behavior: 'smooth' });
//                           }}
//                           isActive={pageNum === currentPage}
//                         >
//                           {pageNum}
//                         </PaginationLink>
//                       </PaginationItem>
//                     );
//                   })}

//                   <PaginationItem>
//                     <PaginationNext
//                       href="#"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         if (currentPage < totalPages) {
//                           setCurrentPage(currentPage + 1);
//                           window.scrollTo({ top: 0, behavior: 'smooth' });
//                         }
//                       }}
//                       className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           )}
//                 {vehicle.year} {vehicle.make} {vehicle.model}
//               </h3>
//               <div className="mt-2 text-gray-600">
//                 <p>Type: {vehicle.type}</p>
//                 <p>Seats: {vehicle.seatingCapacity}</p>
//                 <p>Price: ${vehicle.basePricePerDay}/day</p>
//                 <p
//                   className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
//                     vehicle.isAvailable
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Types" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="">All Types</SelectItem>
//                     {vehicleTypes.map((type) => (
//                       <SelectItem key={type.value} value={type.value}>
//                         {type.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <label className="text-sm font-medium mb-2 block">Status</label>
//                 <Select
//                   value={statusFilter}
//                   onValueChange={setStatusFilter}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="">All Status</SelectItem>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="inactive">Inactive</SelectItem>
//                     <SelectItem value="maintenance">In Maintenance</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         )}
//       </CardHeader>
//     </Card>
//           {data.data.map((vehicle) => (
//             <VehicleCard
//               key={vehicle._id}
//               vehicle={vehicle}
//               onDelete={(id) => {
//                 // Handle delete
//                 console.log('Delete vehicle', id);
//               }}
//             />
//           ))}
//         </div>

//         {totalPages > 1 && (
//           <div className="mt-8">
//             <Pagination>
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       if (currentPage > 1) {
//                         setCurrentPage(currentPage - 1);
//                         window.scrollTo({ top: 0, behavior: 'smooth' });
//                       }
//                     }}
//                     className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
//                   />
//                 </PaginationItem>

//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   // Show first page, last page, current page, and pages around current page
//                   let pageNum;
//                   if (totalPages <= 5) {
//                     pageNum = i + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = i + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }

//                   return (
//                     <PaginationItem key={pageNum}>
//                       <PaginationLink
//                         href="#"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setCurrentPage(pageNum);
//                           window.scrollTo({ top: 0, behavior: 'smooth' });
//                         }}
//                         isActive={pageNum === currentPage}
//                       >
//                         {pageNum}
//                       </PaginationLink>
//                     </PaginationItem>
//                   );
//                 })}

//                 <PaginationItem>
//                   <PaginationNext
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       if (currentPage < totalPages) {
//                         setCurrentPage(currentPage + 1);
//                         window.scrollTo({ top: 0, behavior: 'smooth' });
//                       }
//                     }}
//                     className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         )}
//       </>
//     ) : (
//       <div className="text-center py-12 border rounded-lg">
//         <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
//           <Search className="h-6 w-6 text-muted-foreground" />
//         </div>
//         <h3 className="mt-2 text-lg font-medium">No vehicles found</h3>
//         <p className="mt-1 text-muted-foreground">
//           {hasFilters
//             ? 'Try adjusting your search or filter to find what you\'re looking for.'
//             : 'Get started by adding a new vehicle.'}
//         </p>
//         <div className="mt-6">
//           <Button asChild>
//             <Link to="/vehicles/new">
//               <Plus className="mr-2 h-4 w-4" />
//               Add Vehicle
//             </Link>
//           </Button>
//         </div>
//       </div>
//     )}
//   </div>
// );

// // Export as default for lazy loading
// export { VehiclesList as default };

// // This is a workaround for TypeScript to recognize the component as a JSX component
// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       [elemName: string]: any;
//     }
//   }
// }

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Plus, Loader2, Filter, X } from "lucide-react";

import { getVehicles } from "@/services/vehicleService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Temporary in-memory vehicle types since we're having issues with the constants file
const vehicleTypes = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "Van" },
  { value: "minivan", label: "Minivan" },
  { value: "luxury", label: "Luxury" },
  { value: "bus", label: "Bus" },
];

const ITEMS_PER_PAGE = 9;

export default function VehiclesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "vehicles",
      { searchTerm, typeFilter, statusFilter, currentPage },
    ],
    queryFn: () =>
      getVehicles({
        search: searchTerm,
        type: typeFilter,
        status: statusFilter,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      } as any), // Temporary any type until we fix the service
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading vehicles...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          Failed to load vehicles. Please try again later.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const totalPages = (data as any)?.totalPages || 1;
  const hasFilters = Boolean(searchTerm || typeFilter || statusFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Fleet</h1>
          <p className="text-muted-foreground">
            Manage your vehicle inventory and availability
          </p>
        </div>
        <Button asChild>
          <Link to="/vehicles/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by make, model, or type..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {(typeFilter || statusFilter) && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>
                )}
              </Button>
              {(searchTerm || typeFilter || statusFilter) && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear all
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {isFilterOpen && (
            <div className="pt-4 mt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Vehicle Type
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">
                        In Maintenance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray((data as any)?.data) &&
              (data as any).data.map((vehicle: any) => (
                <div
                  key={vehicle._id}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-medium">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {vehicle.type}
                    </p>
                    <p className="mt-2">Seats: {vehicle.seatingCapacity}</p>
                    <p className="font-medium mt-2">
                      ₹{vehicle.basePricePerDay}/day
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/vehicles/${vehicle._id}`}>View</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/vehicles/edit/${vehicle._id}`}>Edit</Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => console.log("Delete", vehicle._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show first page, last page, current page, and pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-2 text-lg font-medium">No vehicles found</h3>
          <p className="mt-1 text-muted-foreground">
            {hasFilters
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Get started by adding a new vehicle."}
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/vehicles/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
