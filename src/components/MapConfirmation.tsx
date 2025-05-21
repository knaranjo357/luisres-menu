import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface MapConfirmationProps {
  address: string;
  onConfirm: (confirmed: boolean) => void;
}

const MapConfirmation: React.FC<MapConfirmationProps> = ({ address, onConfirm }) => {
  const [coordinates, setCoordinates] = React.useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.status === 'OK' && data.results[0]) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordinates({ lat, lng });
        } else {
          setError('No se pudo encontrar la dirección');
        }
      } catch (err) {
        setError('Error al cargar el mapa');
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      geocodeAddress();
    }
  }, [address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wood-dark"></div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-4">{error || 'No se pudo cargar el mapa'}</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onConfirm(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Corregir dirección
          </button>
          <button
            onClick={() => onConfirm(true)}
            className="px-4 py-2 bg-wood-dark text-white rounded-lg hover:bg-wood-medium"
          >
            Continuar de todos modos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 rounded-lg overflow-hidden">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          zoom={15}
          center={coordinates}
          gestureHandling="greedy"
          mapId="restaurant-map"
        >
          <Marker position={coordinates} />
        </Map>
      </APIProvider>
      
      <div className="mt-4 flex gap-2 justify-center">
        <button
          onClick={() => onConfirm(false)}
          className="px-4 py-2 border border-wood-dark text-wood-dark rounded-lg hover:bg-wood-dark/5"
        >
          Corregir dirección
        </button>
        <button
          onClick={() => onConfirm(true)}
          className="px-4 py-2 bg-wood-dark text-white rounded-lg hover:bg-wood-medium"
        >
          Confirmar ubicación
        </button>
      </div>
    </div>
  );
};

export default MapConfirmation;