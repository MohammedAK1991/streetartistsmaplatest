'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype?._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Custom icon for performances
const performanceIcon = new L.Icon({
  iconUrl: '/performance-marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface Performance {
  id: string;
  artistId: string;
  locationId: string;
  startTime: Date;
  endTime: Date;
  description: string;
  artist: {
    user: {
      name: string;
    };
  };
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

interface MapProps {
  performances: Performance[];
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function Map({ performances }: MapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Default to a central location if geolocation fails
          setUserLocation([51.505, -0.09]);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Default to a central location if geolocation is not supported
      setUserLocation([51.505, -0.09]);
    }
  }, []);

  if (!userLocation) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      className="h-[800px] w-full my-1"
    >
      <ChangeView center={userLocation} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={userLocation}>
        <Popup>You are here</Popup>
      </Marker>
      {performances.map((performance) => (
        <Marker
          key={performance.id}
          position={[
            performance.location.latitude,
            performance.location.longitude,
          ]}
          icon={performanceIcon}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{performance.artist.user.name}</h3>
              <p>{performance.location.name}</p>
              <p>
                {new Date(performance.startTime).toLocaleString()} -{' '}
                {new Date(performance.endTime).toLocaleString()}
              </p>
              <p>{performance.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
