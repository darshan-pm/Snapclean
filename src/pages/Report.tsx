import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Image as ImageIcon, MapPin, Loader2, Sparkles, AlertCircle, CheckCircle2, ArrowLeft, FileWarning } from 'lucide-react';
import { analyzeImage } from '@/services/aiService';
import { getCurrentLocation, isInsideBengaluru } from '@/services/locationService';
import { findNearestOffice } from '@/services/officeService';
import { findPossibleDuplicate } from '@/services/complaintService';
import MapView from '@/components/MapView';
import type { AIResult, GeoLocation, CivicOffice } from '@/types';

export default function Report() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imageData, setImageData] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [inBengaluru, setInBengaluru] = useState<boolean | null>(null);
  const [nearestOffice, setNearestOffice] = useState<{ office: CivicOffice; distanceKm: number } | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      setAiResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageData) return;
    setAiLoading(true);
    try {
      const result = await analyzeImage(imageData);
      setAiResult(result);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGetLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      const inside = isInsideBengaluru(loc.latitude, loc.longitude);
      setInBengaluru(inside);
      if (inside) {
        const nearest = findNearestOffice(loc.latitude, loc.longitude);
        setNearestOffice(nearest);

        const dup = findPossibleDuplicate(loc.latitude, loc.longitude);
        if (dup) {
          setDuplicateWarning(`Possible duplicate report found for this location. Existing complaint: ${dup.complaintId}. You can still continue for the classroom demo.`);
        } else {
          setDuplicateWarning(null);
        }
      } else {
        setNearestOffice(null);
        setDuplicateWarning(null);
      }
    } catch (err: any) {
      setLocationError(err.message || 'Unable to retrieve location.');
    } finally {
      setLocationLoading(false);
    }
  };

  const canSubmit = imageData && aiResult?.garbageDetected && location && inBengaluru && nearestOffice;

  const handleSubmit = () => {
    if (!canSubmit || !imageData || !aiResult || !location || !nearestOffice) return;
    navigate('/confirm', {
      state: {
        image: imageData,
        aiResult,
        location,
        office: nearestOffice.office,
        distanceKm: nearestOffice.distanceKm,
      },
    });
  };

  const handleEdit = () => {
    setImageData(null);
    setAiResult(null);
    setLocation(null);
    setInBengaluru(null);
    setNearestOffice(null);
    setDuplicateWarning(null);
    setLocationError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-gray-800">Report Garbage</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Step 1: Image Upload */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">1</span>
            Upload or Capture Image
          </h2>
          <p className="text-sm text-gray-500 mb-4 ml-8">Choose a photo from your gallery or use your camera.</p>

          {!imageData ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload from Gallery
                </button>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-colors border border-gray-200"
                >
                  <Camera className="w-4 h-4" />
                  Capture with Camera
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
            </div>
          ) : (
            <div className="space-y-3">
              <img src={imageData} alt="Uploaded garbage" className="w-full max-h-64 object-contain rounded-xl border border-gray-200" />
              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Change image
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </div>
            </div>
          )}
        </section>

        {/* Step 2: AI Analysis */}
        {imageData && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">2</span>
              Analyze Image
            </h2>
            <p className="text-sm text-gray-500 mb-4 ml-8">Demo AI will check the image for garbage detection.</p>

            {!aiResult ? (
              <button
                onClick={handleAnalyze}
                disabled={aiLoading}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading ? 'Analyzing...' : 'Analyze Image'}
              </button>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">AI Demo Mode</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Garbage Detected:</span><span className="font-medium text-gray-800 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Yes</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Confidence:</span><span className="font-medium text-gray-800">{(aiResult.confidence * 100).toFixed(0)}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Category:</span><span className="font-medium text-gray-800">{aiResult.category}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Mode:</span><span className="font-medium text-gray-800">{aiResult.mode}</span></div>
                </div>
                <p className="text-xs text-gray-400 mt-3">This is a simulated result for classroom demonstration — not a real AI prediction.</p>
              </div>
            )}
          </section>
        )}

        {/* Step 3: GPS Location */}
        {aiResult?.garbageDetected && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">3</span>
              Get Current Location
            </h2>
            <p className="text-sm text-gray-500 mb-4 ml-8">Use your browser's GPS to verify you're in Bengaluru.</p>

            <button
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {locationLoading ? 'Getting location...' : 'Get Current Location'}
            </button>

            {locationError && (
              <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{locationError}</p>
              </div>
            )}

            {location && (
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Latitude:</span><span className="font-mono font-medium text-gray-800">{location.latitude.toFixed(6)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Longitude:</span><span className="font-mono font-medium text-gray-800">{location.longitude.toFixed(6)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Accuracy:</span><span className="font-medium text-gray-800">±{location.accuracy.toFixed(0)} m</span></div>
                </div>

                {/* Bengaluru check */}
                {inBengaluru !== null && (
                  <div className={`rounded-xl p-4 flex items-start gap-2 ${inBengaluru ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                    {inBengaluru ? (
                      <><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /><p className="text-sm text-emerald-700 font-medium">Location verified — Bengaluru</p></>
                    ) : (
                      <><AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-700">SnapClean is currently available only within Bengaluru.</p></>
                    )}
                  </div>
                )}

                {/* Duplicate warning */}
                {duplicateWarning && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2">
                    <FileWarning className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">{duplicateWarning}</p>
                  </div>
                )}

                {/* Map */}
                {inBengaluru && (
                  <>
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <MapView latitude={location.latitude} longitude={location.longitude} accuracy={location.accuracy} label="Your location" />
                    </div>

                    {/* Nearest office */}
                    {nearestOffice && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-blue-700 mb-2">Nearest Civic Office</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Office:</span><span className="font-medium text-gray-800">{nearestOffice.office.name}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Area:</span><span className="font-medium text-gray-800">{nearestOffice.office.area}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Distance:</span><span className="font-medium text-gray-800">{nearestOffice.distanceKm.toFixed(2)} km</span></div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {/* Step 4: Actions */}
        {imageData && (
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors border border-gray-200"
            >
              Edit Report
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Submit Complaint
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
