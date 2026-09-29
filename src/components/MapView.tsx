import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon paths for bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
  label?: string;
  className?: string;
}

export default function MapView({ latitude, longitude, accuracy, label, className }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([latitude, longitude], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current);
    } else {
      mapInstance.current.setView([latitude, longitude], 15);
    }

    const map = mapInstance.current;
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    L.marker([latitude, longitude]).addTo(map).bindPopup(label || 'Your location').openPopup();

    if (accuracy && accuracy > 0) {
      L.circle([latitude, longitude], {
        radius: accuracy,
        color: '#16a34a',
        fillColor: '#22c55e',
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(map);
    }

    setTimeout(() => map.invalidateSize(), 100);
  }, [latitude, longitude, accuracy, label]);

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className={className || 'h-64 w-full rounded-xl'} />;
}
