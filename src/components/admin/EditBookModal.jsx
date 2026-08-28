import React, { useState } from 'react';
import { X, Upload, Link, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import { uploadAPI } from '../../api';

const SAMPLE_COVERS = [
  { name: 'Fiction', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sci-Fi', url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80' },
  { name: 'History', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80' },
  { name: 'Self-Help', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80' },
];

const CATEGORIES = [
  "Fiction", "Story", "Non-Fiction", "Sci-Fi & Fantasy", "Mystery & Thriller",
  "Romance", "History", "Biography & Memoir", "Self-Help & Personal Development",
  "Business & Economics", "Children's Books", "Education & Textbooks", "Poetry", "Religious/ धार्मिक"
];

export default function EditBookModal({ isOpen, onClose, bookToEdit }) {
  const { updateBook } = useLibrary();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    englishTitle: '',
    author: '',
    category: 'Fiction',
    isbn: '',
    price: '',
    discount: 0,
    copies: 1,
    coverImages: [],
    description: '',
    isNewRelease: false,
  });

  React.useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        englishTitle: bookToEdit.englishTitle || '',
        author: bookToEdit.author || '',
        category: bookToEdit.category || 'Fiction',
        isbn: bookToEdit.isbn || '',
        price: bookToEdit.price || '',
        discount: bookToEdit.discount || 0,
        copies: bookToEdit.copies || 1,
        coverImages: bookToEdit.coverImages || [],
        description: bookToEdit.description || '',
        isNewRelease: bookToEdit.isNewRelease || false,
      });
    }
  }, [bookToEdit]);

  const [imageMode, setImageMode] = useState('url'); // 'url' | 'file'
  const [tempUrl, setTempUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    
    setIsLoading(true); // Disable button while uploading

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      addToast("Cloudinary configuration missing in .env", "error");
      setIsLoading(false);
      return;
    }
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.secure_url) {
          setFormData((prev) => ({ 
            ...prev, 
            coverImages: [...prev.coverImages, data.secure_url]
          }));
          addToast("Image uploaded successfully!", "success");
        } else {
          addToast("Failed to upload image", "error");
        }
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        addToast("Error uploading image", "error");
      }
    }
    
    setIsLoading(false);
  };

  const handleAddUrl = () => {
    if (tempUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        coverImages: [...prev.coverImages, tempUrl.trim()]
      }));
      setTempUrl('');
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      coverImages: prev.coverImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;
    if (formData.coverImages.length === 0) {
      addToast('Please add at least one cover image', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await updateBook(bookToEdit._id || bookToEdit.id, formData);
      addToast(`"${formData.title}" updated successfully!`, 'success');
      onClose();
    } catch (error) {
      addToast(error.message || 'Failed to add book', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800">Edit Book Details</h2>
          <p className="text-xs text-slate-400">Update information for the selected book</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cover Images Upload / URL Section */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-600" /> Book Images
              </label>
              <div className="flex bg-slate-200 p-0.5 rounded-lg text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    imageMode === 'url' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <Link className="w-3 h-3 inline mr-1" /> Web URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    imageMode === 'file' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <Upload className="w-3 h-3 inline mr-1" /> Upload File
                </button>
              </div>
            </div>

            {/* Input by Image URL */}
            {imageMode === 'url' ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="flex-1 p-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <button 
                  type="button" 
                  onClick={handleAddUrl}
                  className="px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold hover:bg-amber-600 transition-colors"
                >
                  Add
                </button>
              </div>
            ) : (
              /* Input by File Upload */
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-600 hover:file:bg-amber-100 cursor-pointer"
                />
              </div>
            )}

            {/* Quick Sample Covers */}
            <div className="pt-1">
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Quick sample cover:
              </span>
              <div className="flex gap-2 flex-wrap">
                {SAMPLE_COVERS.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      coverImages: [...prev.coverImages, sample.url], 
                      category: prev.category === 'Fiction' ? sample.name : prev.category 
                    }))}
                    className="px-2.5 py-1 bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-600 border border-slate-200 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
                  >
                    🖼 {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Image Previews */}
            {formData.coverImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 mt-2">
                {formData.coverImages.map((imgUrl, index) => (
                  <div key={index} className="relative shrink-0 w-20 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                    <img src={imgUrl} alt={`Cover preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-slate-900/80 text-white p-1 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Book Title (Original)</label>
            <input
              type="text"
              required
              placeholder="e.g. मुना मदन"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">English/Romanized Title (For Search)</label>
            <input
              type="text"
              required
              placeholder="e.g. Muna Madan"
              value={formData.englishTitle}
              onChange={(e) => setFormData({ ...formData, englishTitle: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Author Name</label>
            <input
              type="text"
              required
              placeholder="e.g. लक्ष्मीप्रसाद देवकोटा"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Price (Rs.)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="14.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Stock Qty</label>
              <input
                type="number"
                min="1"
                required
                value={formData.copies}
                onChange={(e) => setFormData({ ...formData, copies: e.target.value })}
                className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">ISBN Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 978-0141182636"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
              />
            </div>
            <div className="flex-1 flex items-end pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNewRelease}
                  onChange={(e) => setFormData({ ...formData, isNewRelease: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <span className="text-sm font-semibold text-slate-700">Mark as New Release</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
            <textarea
              required
              rows="3"
              placeholder="A brief description of the book..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-all mt-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}