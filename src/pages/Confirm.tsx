import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, MapPin, Building2, ArrowLeft, Sparkles, FileWarning } from 'lucide-react';
import { createComplaint } from '@/services/complaintService';
import { findPossibleDuplicate } from '@/services/complaintService';
import MapView from '@/components/MapView';
import type { AIResult, GeoLocation, CivicOffice } from '@/types';
import { useState } from 'react';

interface ConfirmState {
  image: string;
  aiResult: AIResult;
  location: GeoLocation;
  office: CivicOffice;
  distanceKm: number;
}

export default function Confirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ConfirmState | null;
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState<string | null>(null);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No report data found. Please start from the report page.</p>
          <button onClick={() => navigate('/report')} className="text-emerald-600 font-medium">Go to Report Garbage</button>
        </div>
      </div>
    );
  }

  const { image, aiResult, location: geo, office, distanceKm } = state;

  const handleSubmit = () => {
    const dup = findPossibleDuplicate(geo.latitude, geo.longitude);
    // Still allow submission even if duplicate — classroom demo
    const complaint = createComplaint({
      image,
      latitude: geo.latitude,
      longitude: geo.longitude,
      accuracy: geo.accuracy,
      aiDetected: aiResult.garbageDetected,
      aiConfidence: aiResult.confidence,
      aiMode: aiResult.mode,
      office,
    });
    setComplaintId(complaint.complaintId);
    setSubmitted(true);
  };

  if (submitted && complaintId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Complaint Submitted!</h2>
          <p className="text-sm text-gray-500 mb-4">Your complaint has been stored successfully.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Complaint ID</p>
            <p className="text-lg font-mono font-bold text-emerald-700">{complaintId}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/status/${complaintId}`)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              View Complaint Status
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors border border-gray-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/report')} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-gray-800">Confirm & Submit</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <p className="text-sm text-gray-500">Review your report details below before submitting.</p>

        {/* Photo */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Photo</h2>
          <img src={image} alt="Reported garbage" className="w-full max-h-64 object-contain rounded-xl border border-gray-200" />
        </section>

        {/* AI Result */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            AI Analysis Result
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Garbage Detected:</span><span className="font-medium text-gray-800">{aiResult.garbageDetected ? 'Yes' : 'No'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">AI Confidence:</span><span className="font-medium text-gray-800">{(aiResult.confidence * 100).toFixed(0)}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">AI Mode:</span><span className="font-medium text-amber-600">{aiResult.mode}</span></div>
          </div>
        </section>

        {/* GPS */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            GPS Location
          </h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-gray-500">Latitude:</span><span className="font-mono font-medium text-gray-800">{geo.latitude.toFixed(6)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Longitude:</span><span className="font-mono font-medium text-gray-800">{geo.longitude.toFixed(6)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">GPS Accuracy:</span><span className="font-medium text-gray-800">±{geo.accuracy.toFixed(0)} m</span></div>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <MapView latitude={geo.latitude} longitude={geo.longitude} accuracy={geo.accuracy} label="Complaint location" />
          </div>
        </section>

        {/* Nearest Office */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            Nearest Civic Office
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Office:</span><span className="font-medium text-gray-800">{office.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Area:</span><span className="font-medium text-gray-800">{office.area}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Distance:</span><span className="font-medium text-gray-800">{distanceKm.toFixed(2)} km</span></div>
          </div>
        </section>

        {/* Duplicate check */}
        {(() => {
          const dup = findPossibleDuplicate(geo.latitude, geo.longitude);
          if (!dup) return null;
          return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2">
              <FileWarning className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">Possible duplicate report found for this location. Existing complaint: {dup.complaintId}. You can still continue for the classroom demo.</p>
            </div>
          );
        })()}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/report')}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors border border-gray-200"
          >
            Edit Report
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Submit Complaint
          </button>
        </div>
      </main>
    </div>
  );
}
