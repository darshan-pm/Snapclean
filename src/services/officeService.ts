import { sampleOffices } from '@/data/offices';
import type { CivicOffice } from '@/types';

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Haversine formula — calculates the great-circle distance
 * between two GPS points in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface NearestOfficeResult {
  office: CivicOffice;
  distanceKm: number;
}

export function findNearestOffice(
  userLat: number,
  userLng: number
): NearestOfficeResult {
  let nearest = sampleOffices[0];
  let minDistance = haversineDistance(userLat, userLng, nearest.latitude, nearest.longitude);

  for (let i = 1; i < sampleOffices.length; i++) {
    const dist = haversineDistance(userLat, userLng, sampleOffices[i].latitude, sampleOffices[i].longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = sampleOffices[i];
    }
  }

  return { office: nearest, distanceKm: minDistance };
}
