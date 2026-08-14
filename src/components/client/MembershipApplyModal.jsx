import React, { useState } from 'react';
import { X, ShieldCheck, Upload, MapPin, Camera, AlertCircle } from 'lucide-react';
import { membershipAPI, uploadAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function MembershipApplyModal({ isOpen, onClose }) {
  const { refreshUser } = useAuth();
  const { addToast } = useToast();

  const [citizenshipFront, setCitizenshipFront] = useState('');
  const [citizenshipBack, setCitizenshipBack] = useState('');
  const [location, setLocation] = useState('');
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locatingGPS, setLocatingGPS] = useState(false);

  if (!isOpen) return null;

  const uploadImage = async (file, side) => {
    const setter = side === 'front' ? setCitizenshipFront : setCitizenshipBack;
    const setUploading = side === 'front' ? setUploadingFront : setUploadingBack;

    setUploading(true);
    const folderName = 'bookverse/Client profile picture';

    try {
      const sigData = await uploadAPI.getCloudinarySignature(folderName);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp);
      formData.append('signature', sigData.signature);
      formData.append('folder', folderName);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.secure_url) {
        setter(data.secure_url);
        addToast(`Citizenship ${side} uploaded!`, 'success');
      } else {
        addToast(`Failed to upload citizenship ${side}`, 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      addToast('Error uploading image', 'error');
    }
    setUploading(false);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await response.json();
          if (data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation(`${latitude}, ${longitude}`);
          }
        } catch {
          setLocation(`${latitude}, ${longitude}`);
        }
        setLocatingGPS(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        addToast('Could not get your location. Please type it manually.', 'error');
        setLocatingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!citizenshipFront || !citizenshipBack) {
      return addToast('Please upload both front and back of your Citizenship.', 'error');
    }
    if (!location.trim()) {
      return addToast('Please provide your location.', 'error');
    }

    setSubmitting(true);
    try {
      await membershipAPI.apply({
        citizenshipFront,
        citizenshipBack,
        location: location.trim(),
      });
      addToast('Membership application submitted successfully!', 'success');
      refreshUser();
      onClose();
    } catch (error) {
      addToast(error.message || 'Failed to apply for membership', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Apply for Membership</h2>
              <p className="text-xs text-slate-400">Premium members get exclusive discounts</p>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            To verify your identity, please upload clear photos of both sides of your Citizenship document and provide your current location. All fields are <strong>compulsory</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Citizenship Front */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-600" /> Citizenship — Front Side *
            </label>
            {citizenshipFront ? (
              <div className="relative group">
                <img
                  src={citizenshipFront}
                  alt="Citizenship Front"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setCitizenshipFront('')}
                  className="absolute top-2 right-2 bg-slate-900/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploadingFront ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/50'}`}>
                {uploadingFront ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-amber-600 font-semibold">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500 font-medium">Click to upload front side</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) uploadImage(e.target.files[0], 'front');
                    e.target.value = '';
                  }}
                  disabled={uploadingFront}
                />
              </label>
            )}
          </div>

          {/* Citizenship Back */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-600" /> Citizenship — Back Side *
            </label>
            {citizenshipBack ? (
              <div className="relative group">
                <img
                  src={citizenshipBack}
                  alt="Citizenship Back"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setCitizenshipBack('')}
                  className="absolute top-2 right-2 bg-slate-900/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploadingBack ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/50'}`}>
                {uploadingBack ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-amber-600 font-semibold">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500 font-medium">Click to upload back side</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) uploadImage(e.target.files[0], 'back');
                    e.target.value = '';
                  }}
                  disabled={uploadingBack}
                />
              </label>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" /> Your Location *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Kathmandu, Bagmati, Nepal"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locatingGPS}
                title="Auto-detect my location"
                className="px-3 py-2 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-600 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                {locatingGPS ? (
                  <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 ml-1">Type your address manually or click the pin icon to auto-detect.</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || uploadingFront || uploadingBack || !citizenshipFront || !citizenshipBack || !location.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-all mt-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting Application...' : 'Submit Membership Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
