import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check } from 'lucide-react';

// Helper to center the initial crop
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropperModal({ imageSrc, onCropComplete, onClose }) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const handleConfirm = async () => {
    if (!completedCrop || !imgRef.current) return;
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.imageSmoothingQuality = 'high';
    
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a File from Blob
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        onCropComplete(file);
      }
    }, 'image/jpeg', 1);
  };

  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 shadow-2xl relative border border-slate-100 max-w-lg w-full">
        <button onClick={onClose} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer z-10">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-4">Crop Profile Picture</h2>
        
        <div className="flex justify-center bg-slate-100 rounded-2xl overflow-hidden max-h-[60vh]">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={onImageLoad}
              alt="Crop me"
              style={{ maxHeight: '60vh', objectFit: 'contain' }}
            />
          </ReactCrop>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );
}
