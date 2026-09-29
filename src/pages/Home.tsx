import { Link } from 'react-router-dom';
import { Trash2, MapPin, Camera, TrendingUp, ShieldCheck, Leaf } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-800">SnapClean Bengaluru</span>
          </div>
          <span className="text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
            College Prototype — Demo Mode
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            Civic Tech for a Cleaner City
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            SnapClean Bengaluru
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            Photograph a garbage pile. Alert the nearest civic office. Get it cleaned.
          </p>
          <p className="text-sm text-amber-600 font-medium mb-8">
            College Prototype — Demo Mode
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/report"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <Camera className="w-5 h-5" />
              Report Garbage
            </Link>
            <Link
              to="/office"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all border border-gray-200 shadow-sm hover:shadow-md"
            >
              <TrendingUp className="w-5 h-5" />
              Track Complaint
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">1. Photograph</h3>
            <p className="text-sm text-gray-500">
              Upload a photo of the garbage pile from your gallery or capture it with your camera.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">2. Analyze & Locate</h3>
            <p className="text-sm text-gray-500">
              Demo AI detects the garbage. GPS confirms you're in Bengaluru and finds the nearest civic office.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">3. Track Progress</h3>
            <p className="text-sm text-gray-500">
              Submit your complaint and track its status from Submitted to Assigned to Cleaned.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
