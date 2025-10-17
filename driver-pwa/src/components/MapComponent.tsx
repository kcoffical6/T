import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
  pickupLocation: string
  dropLocation?: string
  currentLocation?: { lat: number; lng: number }
}

export const MapComponent: React.FC<MapComponentProps> = ({
  pickupLocation,
  dropLocation,
  currentLocation,
}) => {
  // Default coordinates for South India (Kerala)
  const defaultCenter: [number, number] = [10.8505, 76.2711]
  
  // Mock coordinates - in real app, these would come from geocoding service
  const pickupCoords: [number, number] = [10.8505, 76.2711] // Alleppey
  const dropCoords: [number, number] = dropLocation ? [10.0889, 77.0595] : pickupCoords // Munnar
  
  const currentCoords: [number, number] = currentLocation 
    ? [currentLocation.lat, currentLocation.lng]
    : pickupCoords

  return (
    <MapContainer
      center={pickupCoords}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Pickup Location */}
      <Marker position={pickupCoords}>
        <Popup>
          <div>
            <h3 className="font-semibold text-green-600">Pickup Location</h3>
            <p>{pickupLocation}</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Drop Location */}
      {dropLocation && (
        <Marker position={dropCoords}>
          <Popup>
            <div>
              <h3 className="font-semibold text-red-600">Drop Location</h3>
              <p>{dropLocation}</p>
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Current Location */}
      {currentLocation && (
        <Marker position={currentCoords}>
          <Popup>
            <div>
              <h3 className="font-semibold text-blue-600">Your Location</h3>
              <p>Current position</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
