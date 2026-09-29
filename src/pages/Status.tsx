import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Building2, CheckCircle2, Clock, Circle, Camera, Sparkles } from 'lucide-react';
import { getComplaintById } from '@/services/complaintService';
import MapView from '@/components/MapView';
import type { Complaint } from '@/types';

const TIMELINE: Complaint['status'][] = ['Submitted', 'Assigned', 'Cleaned'];

export default function Status() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!complaintId) return;
    const c = getComplaintById(complaintId);
    setComplaint(c || null);
    setLoading(false);
  }, [complaintId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-400">Loading...</p></div>;
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <p className="text-gray-500 mb-2">Complaint not found.</p>
          <p className="text-sm text-gray-400 mb-4">ID: {complaintId}</p>
          <Link to="/office" className="text-emerald-600 font-medium">View all complaints</Link>
        </div>
      </div>
    );
  }

  const currentStep = TIMELINE.indexOf(complaint.status);
  const created = new Date(complaint.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-gray-800">Complaint Status</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Complaint ID */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-xs text-gray-500 mb-1">Complaint ID</p>
          <p className="text-2xl font-mono font-bold text-emerald-700">{complaint.complaintId}</p>
        </div>

        {/* Photo */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Camera className="w-4 h-4 text-gray-400" />Photo</h2>
          <img src={complaint.image} alt="Reported garbage" className="w-full max-h-64 object-contain rounded-xl border border-gray-200" />
        </section>

        {/* AI Result */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-500" />AI Result</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Garbage Detected:</span><span className="font-medium text-gray-800">{complaint.aiDetected ? 'Yes' : 'No'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">AI Confidence:</span><span className="font-medium text-gray-800">{(complaint.aiConfidence * 100).toFixed(0)}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">AI Mode:</span><span className="font-medium text-amber-600">{complaint.aiMode}</span></div>
          </div>
        </section>

        {/* Location & Office */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" />Location</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-gray-500">Latitude:</span><span className="font-mono font-medium text-gray-800">{complaint.latitude.toFixed(6)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Longitude:</span><span className="font-mono font-medium text-gray-800">{complaint.longitude.toFixed(6)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">GPS Accuracy:</span><span className="font-medium text-gray-800">±{complaint.accuracy.toFixed(0)} m</span></div>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
            <MapView latitude={complaint.latitude} longitude={complaint.longitude} label="Complaint location" />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2"><Building2 className="w-4 h-4" />Nearest Office</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Office:</span><span className="font-medium text-gray-800">{complaint.office.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Area:</span><span className="font-medium text-gray-800">{complaint.office.area}</span></div>
            </div>
          </div>
        </section>

        {/* Date/Time */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" />Date & Time</h2>
          <p className="text-sm text-gray-600">{created.toLocaleString()}</p>
        </section>

        {/* Timeline */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Status Timeline</h2>
          <div className="space-y-0">
            {TIMELINE.map((step, idx) => {
              const isDone = idx <= currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={step} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    {isDone ? (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrent ? 'bg-emerald-600' : 'bg-emerald-100'}`}>
                        <CheckCircle2 className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-emerald-600'}`} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Circle className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                    {idx < TIMELINE.length - 1 && (
                      <div className={`w-0.5 h-8 ${idx < currentStep ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-emerald-700' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
                      {step}
                      {isCurrent && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Current</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex gap-3">
          <Link to="/office" className="flex-1 text-center bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors border border-gray-200">
            Office Dashboard
          </Link>
          <Link to="/" className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
