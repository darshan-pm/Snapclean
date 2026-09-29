export interface AIResult {
  garbageDetected: boolean;
  confidence: number;
  category: string;
  mode: string;
}

export interface CivicOffice {
  id: number;
  name: string;
  area: string;
  latitude: number;
  longitude: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export type ComplaintStatus = 'Submitted' | 'Assigned' | 'Cleaned';

export interface Complaint {
  complaintId: string;
  image: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  aiDetected: boolean;
  aiConfidence: number;
  aiMode: string;
  office: CivicOffice;
  createdAt: string;
  status: ComplaintStatus;
}
