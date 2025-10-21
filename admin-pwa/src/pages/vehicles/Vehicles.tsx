import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { getVehicles } from '@/services/vehicleService';
import { toast } from 'react-toastify';

export function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await getVehicles({ search: searchTerm });
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage your fleet of vehicles</p>
        </div>
        <Button asChild>
          <Link to="/vehicles/new">
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search vehicles..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No vehicles found</p>
              <Button className="mt-4" asChild>
                <Link to="/vehicles/new">Add your first vehicle</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make & Model</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle: any) => (
                  <TableRow key={vehicle._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {vehicle.images && vehicle.images.length > 0 ? (
                          <img
                            src={vehicle.images[0]}
                            alt={vehicle.make}
                            className="h-10 w-16 object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x40?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-16 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                        <div>
                          <div>{vehicle.make} {vehicle.model}</div>
                          <div className="text-xs text-muted-foreground">{vehicle.licensePlate || 'N/A'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{vehicle.type}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.seatingCapacity}</TableCell>
                    <TableCell>₹{vehicle.basePricePerDay?.toLocaleString()}/day</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.isAvailable ? 'default' : 'secondary'}>
                        {vehicle.isAvailable ? 'Available' : 'Not Available'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/vehicles/${vehicle._id}`}>View</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/vehicles/${vehicle._id}/edit`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
