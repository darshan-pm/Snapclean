import type { Complaint } from '@/types';

const STORAGE_KEY = 'snapclean_complaints';
const ID_COUNTER_KEY = 'snapclean_id_counter';

function getNextComplaintId(): string {
  const counter = parseInt(localStorage.getItem(ID_COUNTER_KEY) || '0', 10);
  const next = counter + 1;
  localStorage.setItem(ID_COUNTER_KEY, String(next));
  return `SCB-2026-${String(next).padStart(4, '0')}`;
}

export function getAllComplaints(): Complaint[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Complaint[];
  } catch {
    return [];
  }
}

export function getComplaintById(id: string): Complaint | undefined {
  return getAllComplaints().find((c) => c.complaintId === id);
}

export function createComplaint(
  data: Omit<Complaint, 'complaintId' | 'createdAt' | 'status'>
): Complaint {
  const complaint: Complaint = {
    ...data,
    complaintId: getNextComplaintId(),
    createdAt: new Date().toISOString(),
    status: 'Submitted',
  };

  const complaints = getAllComplaints();
  complaints.push(complaint);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return complaint;
}

export function updateComplaintStatus(
  id: string,
  status: Complaint['status']
): void {
  const complaints = getAllComplaints();
  const idx = complaints.findIndex((c) => c.complaintId === id);
  if (idx !== -1) {
    complaints[idx].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }
}

/**
 * Simple duplicate detection: checks if an existing complaint
 * is within a small distance of the new GPS coordinates.
 */
export function findPossibleDuplicate(
  lat: number,
  lng: number,
  thresholdKm: number = 0.1
): Complaint | undefined {
  const complaints = getAllComplaints();
  for (const c of complaints) {
    const dLat = c.latitude - lat;
    const dLng = c.longitude - lng;
    // Quick rough check in degrees, convert to approximate km
    const approxKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
    if (approxKm <= thresholdKm) {
      return c;
    }
  }
  return undefined;
}
