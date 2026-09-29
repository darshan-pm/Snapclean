import type { GeoLocation } from '@/types';

// Approximate bounding box for Bengaluru (classroom prototype boundary)
const BENGALURU_BOUNDS = {
  minLat: 12.80,
  maxLat: 13.20,
  minLng: 77.40,
  maxLng: 77.80,
};

export type LocationError = 'permission_denied' | 'position_unavailable' | 'timeout' | 'unknown';

export function getCurrentLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ error: 'position_unavailable' as LocationError, message: 'Geolocation is not supported by this browser.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (err) => {
        let errorType: LocationError = 'unknown';
        let message = 'Unable to retrieve location.';

        if (err.code === err.PERMISSION_DENIED) {
          errorType = 'permission_denied';
          message = 'Location permission was denied. Please allow location access and try again.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorType = 'position_unavailable';
          message = 'Location information is unavailable. Please try again.';
        } else if (err.code === err.TIMEOUT) {
          errorType = 'timeout';
          message = 'Location request timed out. Please try again.';
        }

        reject({ error: errorType, message });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

export function isInsideBengaluru(lat: number, lng: number): boolean {
  return (
    lat >= BENGALURU_BOUNDS.minLat &&
    lat <= BENGALURU_BOUNDS.maxLat &&
    lng >= BENGALURU_BOUNDS.minLng &&
    lng <= BENGALURU_BOUNDS.maxLng
  );
}
