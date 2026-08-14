import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, ShieldAlert, BadgeInfo, Key, Save, Camera, ShieldCheck } from 'lucide-react';
import ImageCropperModal from './ImageCropperModal';
import { uploadAPI } from '../../api';

export default function UserProfile() {
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: '',
    confirmPassword: '',
    avatar: currentUser?.avatar || '',
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input so selecting the same file again triggers onChange
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadCroppedImage = async (croppedFile) => {
    setSelectedImageSrc(null); // Close modal
    setIsUploading(true);
    const folderName = currentUser?.role === 'admin' ? 'bookverse/Admin Profile' : 'bookverse/Client profile picture';

    try {
      // 1. Get Signature from backend
      const sigData = await uploadAPI.getCloudinarySignature(folderName);
      
      const formDataCloudinary = new FormData();
      formDataCloudinary.append('file', croppedFile);
      formDataCloudinary.append('api_key', sigData.apiKey);
      formDataCloudinary.append('timestamp', sigData.timestamp);
      formDataCloudinary.append('signature', sigData.signature);
      formDataCloudinary.append('folder', folderName);

      // 2. Upload to Cloudinary using signed details
      const response = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
        method: 'POST',
        body: formDataCloudinary
      });
      const data = await response.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, avatar: data.secure_url }));
        addToast("Profile picture uploaded! Don't forget to click 'Save Changes'.", "success");
      } else {
        addToast("Failed to upload image", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      addToast("Error uploading image", "error");
    }
    setIsUploading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      return addToast('Passwords do not match', 'error');
    }

    setIsUpdating(true);

    const updateData = {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    const { success, error } = await updateProfile(updateData);

    if (success) {
      addToast('Profile updated successfully', 'success');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } else {
      addToast(error || 'Failed to update profile', 'error');
    }

    setIsUpdating(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account details and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card Summary */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative group">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-amber-700">
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                </span>
              )}
              
              <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity overflow-hidden">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-semibold">{isUploading ? 'Uploading...' : 'Change'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} disabled={isUploading} />
              </label>
            </div>
            
            {/* Cropper Modal */}
            {selectedImageSrc && (
              <ImageCropperModal
                imageSrc={selectedImageSrc}
                onClose={() => setSelectedImageSrc(null)}
                onCropComplete={uploadCroppedImage}
              />
            )}
            
            <div>
              <h2 className="text-xl font-bold text-slate-800">{currentUser?.name}</h2>
              <p className="text-sm text-slate-400">{currentUser?.email}</p>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Role
                </span>
                <span className="text-xs font-bold capitalize bg-white px-2 py-1 rounded-md shadow-sm">
                  {currentUser?.role}
                </span>
              </div>
              
              {currentUser?.role === 'client' && (
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <BadgeInfo className="w-3.5 h-3.5" /> Tier
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm ${
                    currentUser?.tier === 'Premium Member' ? 'bg-amber-100 text-amber-700' :
                    currentUser?.tier === 'Student' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {currentUser?.tier}
                  </span>
                </div>
              )}

              {currentUser?.membershipNumber && (
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl mt-1">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> ID Number
                  </span>
                  <span className="text-xs font-bold font-mono bg-amber-100 text-amber-800 px-2 py-1 rounded-md border border-amber-200">
                    {currentUser.membershipNumber}
                  </span>
                </div>
              )}

              {currentUser?.role === 'client' && (
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl mt-1">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <span className="text-amber-500">🪙</span> Points
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800">
                      {currentUser?.pointsBalance || 0}
                    </span>
                    <p className="text-[9px] font-semibold text-slate-400 -mt-1">
                      Value: Rs. {((currentUser?.pointsBalance || 0) * 2).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Account Settings</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Info */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Information</h4>
                  {currentUser?.role === 'client' && (
                    <span className="text-[10px] text-slate-400 italic">Name and email cannot be changed by clients.</span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={currentUser?.role === 'client'}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                        currentUser?.role === 'client' 
                          ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={currentUser?.role === 'client'}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                        currentUser?.role === 'client' 
                          ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Change Password</h4>
                <p className="text-xs text-slate-400 -mt-2 mb-4">Leave blank if you do not want to change your password.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1">New Password</label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
