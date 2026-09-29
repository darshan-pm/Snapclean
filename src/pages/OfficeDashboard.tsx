import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Clock, Trash2, CheckCircle2, Loader2, Inbox } from 'lucide-react';
import { getAllComplaints, updateComplaintStatus } from '@/services/complaintService';
import type { Complaint, ComplaintStatus } from '@/types';

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  Submitted: 'bg-blue-100 text-blue-700',
  Assigned: 'bg-amber-100 text-amber-700',
  Cleaned: 'bg-emerald-100 text-emerald-700',
};

export default function OfficeDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = () => {
    setComplaints(getAllComplaints());
    setLoading(false);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleUpdate = (id: string, status: ComplaintStatus) => {
    updateComplaintStatus(id, status);
    loadComplaints();
  };

  const sorted = [...complaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg text-gray-800">Office Dashboard</h1>
          </div>
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-gray-300 animate-spin" /></div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16">
            <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No complaints yet.</p>
            <Link to="/report" className="text-emerald-600 font-medium text-sm mt-2 inline-block">Report garbage to get started</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map((c) => {
              const created = new Date(c.createdAt);
              return (
                <div key={c.complaintId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <img src={c.image} alt="Garbage" className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-emerald-700">{c.complaintId}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <p className="flex items-center gap-1"><Building2 className="w-3 h-3" />{c.office.area}</p>
                        <p className="flex items-center gap-1"><Clock className="w-3 h-3" />{created.toLocaleString()}</p>
                        <p>AI: {c.aiDetected ? 'Garbage detected' : 'None'} ({(c.aiConfidence * 100).toFixed(0)}%)</p>
                        <p className="font-mono">{c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 px-4 pb-4">
                    <Link
                      to={`/status/${c.complaintId}`}
                      className="flex-1 text-center text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                    >
                      View
                    </Link>
                    {c.status === 'Submitted' && (
                      <button
                        onClick={() => handleUpdate(c.complaintId, 'Assigned')}
                        className="flex-1 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        Mark as Assigned
                      </button>
                    )}
                    {c.status === 'Assigned' && (
                      <button
                        onClick={() => handleUpdate(c.complaintId, 'Cleaned')}
                        className="flex-1 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        Mark as Cleaned
                      </button>
                    )}
                    {c.status === 'Cleaned' && (
                      <div className="flex-1 text-center text-sm font-medium text-emerald-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
