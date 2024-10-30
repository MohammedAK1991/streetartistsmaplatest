'use client';

import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { FaMusic } from 'react-icons/fa';
import { renderToString } from 'react-dom/server';
import { createRoot } from 'react-dom/client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

import styles from './map.module.css';

const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GMAPS_KEY;
const defaultCenter = { lat: 51.505, lng: -0.09 };

const getIconDataUrl = (IconComponent, color) => {
  const svgString = encodeURIComponent(
    renderToString(<IconComponent size={30} color={color} />),
  );
  return `data:image/svg+xml;charset=UTF-8,${svgString}`;
};

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

const CustomInfoWindowContent = ({
  performance,
}: {
  performance: Performance;
}) => (
  <Card className={styles.infoWindow}>
    <CardHeader>
      <CardTitle>{performance.artist.user.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{performance.location.name}</p>
      <p>
        {new Date(performance.startTime).toLocaleString()} -{' '}
        {new Date(performance.endTime).toLocaleString()}
      </p>
      <p>{performance.description}</p>
    </CardContent>
  </Card>
);

export default function Map({ performances }: MapProps) {
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(13);
  const [selectedPerformance, setSelectedPerformance] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (selectedPerformance) {
      const performance = performances.find(
        (p) => p.id === selectedPerformance,
      );
      if (performance) {
        setCenter({
          lat: performance.location.latitude,
          lng: performance.location.longitude,
        });
      }
    }
  }, [selectedPerformance, performances]);

  const renderMarkers = (map, maps) => {
    const iconDataUrl = getIconDataUrl(FaMusic, '#2563eb'); // Using blue-600 from Tailwind

    performances.forEach((performance) => {
      const marker = new maps.Marker({
        position: {
          lat: performance.location.latitude,
          lng: performance.location.longitude,
        },
        map,
        icon: {
          url: iconDataUrl,
          scaledSize: new maps.Size(30, 30),
        },
        title: performance.artist.user.name,
      });

      const infoWindow = new maps.InfoWindow({
        content: `<div class="${styles.customInfoWindow}">${performance.artist.user.name}</div>`,
      });

      marker.addListener('click', () => {
        const contentDiv = document.createElement('div');
        const root = createRoot(contentDiv);
        root.render(<CustomInfoWindowContent performance={performance} />);
        infoWindow.setContent(contentDiv);
        infoWindow.open(map, marker);
      });
    });
  };

  return (
    <div className="flex flex-col h-full w-full min-h-[600px]">
      <Select onValueChange={(value) => setSelectedPerformance(value)}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Select a performance" />
        </SelectTrigger>
        <SelectContent>
          {performances.map((performance) => (
            <SelectItem key={performance.id} value={performance.id}>
              {performance.artist.user.name} at {performance.location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-row h-full max-h-[600px]">
        <div className="flex-1">
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAP_KEY }}
            center={center}
            zoom={zoom}
            options={{ styles: mapStyles }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
          />
        </div>
        {performances.length > 0 && (
          <ScrollArea className="hidden p-4 w-72 md:block">
            {performances.map((performance) => (
              <Card
                key={performance.id}
                className="mb-4 cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedPerformance(performance.id)}
              >
                <CardHeader>
                  <CardTitle>{performance.artist.user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{performance.location.name}</p>
                  <p>{new Date(performance.startTime).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#e0f7fa' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#00796b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#80deea' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00796b' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#b2dfdb' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#004d40' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#b2ebf2' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#004d40' }],
  },
];
