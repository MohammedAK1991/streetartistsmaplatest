import Map from './ui/components/Map';

interface Performance {
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
const performances: Performance[] = [
  {
    id: '1',
    artistId: 'artist-1',
    locationId: 'location-1',
    startTime: new Date('2024-09-20T18:00:00'),
    endTime: new Date('2024-09-20T20:00:00'),
    description: 'A fantastic performance by DJ Khaled',
    artist: {
      user: {
        name: 'DJ Khaled',
      },
    },
    location: {
      latitude: 40.4168, // Latitude for Madrid
      longitude: -3.7038, // Longitude for Madrid
      name: 'Plaza Mayor',
    },
  },
  {
    id: '2',
    artistId: 'artist-2',
    locationId: 'location-2',
    startTime: new Date('2024-09-21T15:00:00'),
    endTime: new Date('2024-09-21T17:00:00'),
    description: 'A live performance by Coldplay',
    artist: {
      user: {
        name: 'Coldplay',
      },
    },
    location: {
      latitude: 40.423, // Another location in Madrid
      longitude: -3.692, // Slightly different longitude
      name: 'Retiro Park',
    },
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-2">
      <h1 className="mb-2 text-4xl font-bold">Street Artists Map</h1>
      <Map performances={performances} />
    </main>
  );
}
