import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { VehicleData } from '@/services/vehicleService';

interface VehicleCardProps {
  vehicle: VehicleData;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function VehicleCard({ vehicle, onDelete, isDeleting }: VehicleCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative
        {vehicle.images && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {vehicle.isActive ? (
            <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
          <Badge variant="outline">{vehicle.type}</Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            {vehicle.make} {vehicle.model}
          </CardTitle>
          <div className="text-lg font-semibold">
            ₹{vehicle.basePricePerDay.toFixed(2)}<span className="text-sm text-muted-foreground">/day</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {vehicle.year} • {vehicle.seatingCapacity} Seats
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {vehicle.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {vehicle.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{vehicle.features.length - 3} more
              </Badge>
            )}
          </div>
        )}
        {vehicle.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {vehicle.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium">
              {vehicle.driver?.name?.charAt(0) || 'D'}
            </span>
          </div>
          <div className="text-sm">
            <div className="font-medium">
              {vehicle.driver?.name || 'Driver'}
            </div>
            <div className="text-xs text-muted-foreground">
              {vehicle.driver?.experience} yrs exp
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to={`/vehicles/${vehicle._id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link to={`/vehicles/${vehicle._id}/edit`}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => vehicle._id && onDelete(vehicle._id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
