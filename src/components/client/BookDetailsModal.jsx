import React, { useState, useEffect } from 'react';
import { X, BookOpen, CheckCircle, Send, Star, Trash2, Maximize2, Download, Minus, Plus, Quote, Heart, ShoppingCart, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { initiateEsewaPayment } from '../../utils/esewaHelper';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import StarRating from '../common/StarRating';

export default function BookDetailsModal({ book: initialBook, isOpen, onClose, currentUser }) {
  const { books, purchaseBook, addReview, deleteReview, getBookReviews, getAverageRating, toggleWishlist, isInWishlist, addToCart, storeSettings } = useLibrary();
  const { addToast } = useToast();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [membershipIdInput, setMembershipIdInput] = useState('');
  const [isMembershipVerified, setIsMembershipVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('Store Pickup');
  const [deliveryAddressDetail, setDeliveryAddressDetail] = useState('');

  const bookId = initialBook?._id || initialBook?.id;
  const book = books.find((b) => (b._id || b.id) === bookId) || initialBook;

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setShowPaymentOptions(false);
      setMembershipIdInput('');
      setIsMembershipVerified(false);
      setVerificationError('');
      setDeliveryPhone('');
      setDeliveryZone('Store Pickup');
      setDeliveryAddressDetail('');
    }
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const bookReviews = getBookReviews(bookId);
  const avgRating = getAverageRating(bookId);
  const coverImages = book.coverImages || [];

  const handleBuy = async (paymentMethod = 'Cash') => {
    const isVerificationRequired = currentUser?.membershipNumber && storeSettings?.membershipDiscountPercentage > 0;

    // If user is a member and discount is active, they MUST be verified
    if (isVerificationRequired && !isMembershipVerified) {
      setVerificationError('Please verify your Membership ID first.');
      return;
    }

    const providedMembershipId = isVerificationRequired && isMembershipVerified ? membershipIdInput : null;

    if (deliveryZone !== 'Store Pickup' && deliveryPhone.length !== 10) {
      addToast('Please enter a valid 10-digit phone number for delivery.', 'error');
      return;
    }
    if (deliveryZone !== 'Store Pickup' && !deliveryAddressDetail.trim()) {
      addToast('Please enter specific delivery address details.', 'error');
      return;
    }

    const deliveryData = { deliveryPhone, deliveryZone, deliveryAddressDetail };
    const result = await purchaseBook(bookId, currentUser?.name || 'Customer', quantity, paymentMethod, '', 0, providedMembershipId, deliveryData);
    if (result.success) {
      if (paymentMethod === 'eSewa' && result.esewaData) {
        initiateEsewaPayment(result.esewaData);
      } else {
        addToast(`"${book.title}" (x${quantity}) purchased successfully!`, 'success', 10000);
        onClose();
      }
    } else {
      addToast(result.message || 'Checkout failed. Please try again.', 'error');
    }
  };

  const handleAddToCart = () => {
    addToCart(bookId, quantity);
    addToast(`"${book.title}" added to cart!`, 'success');
    onClose();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating || !reviewComment.trim()) return;

    try {
      await addReview(bookId, currentUser?.name || 'Customer', reviewRating, reviewComment.trim());
      addToast('Review submitted successfully!', 'success');
      setReviewRating(0);
      setReviewComment('');
    } catch (error) {
      addToast('Failed to submit review', 'error');
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev < coverImages.length - 1 ? prev + 1 : 0));
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : coverImages.length - 1));
  };

  const isDeliveryInfoIncomplete = deliveryZone === 'Store Pickup' || (deliveryPhone.length !== 10 || !deliveryAddressDetail.trim());

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="absolute right-5 top-5 flex items-center gap-3 z-10">
          <button 
            onClick={() => toggleWishlist(bookId)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
            title={isInWishlist(bookId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className="w-5 h-5" fill={isInWishlist(bookId) ? 'currentColor' : 'none'} color={isInWishlist(bookId) ? '#f43f5e' : 'currentColor'} />
          </button>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Info */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="flex flex-col gap-3 shrink-0">
            <div 
              className="w-40 h-56 bg-slate-100 rounded-2xl flex items-center justify-center text-amber-500 overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative group"
              onClick={() => coverImages.length > 0 && setIsFullScreen(true)}
            >
              {coverImages.length > 0 ? (
                <>
                  <img src={coverImages[selectedImageIndex]} alt={book.title} className="w-full h-full object-cover transition-all group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-8 h-8 text-white" />
                  </div>
                  
                  {coverImages.length > 1 && (
                    <>
                      <button 
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {book.discount > 0 && (
                    <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 bg-rose-500 text-white rounded-md shadow-md shadow-rose-500/30">
                      Offer
                      -{book.discount}%
                    </span>
                  )}
                </>
              ) : (
                <BookOpen className="w-10 h-10" />
              )}
            </div>
            
            {/* Image Gallery Thumbnails */}
            {coverImages.length > 1 && (
              <div className="flex gap-2 w-40 overflow-x-auto pb-1">
                {coverImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`shrink-0 w-12 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? 'border-amber-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-1.5 flex-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{book.category}</span>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">{book.title}</h2>
            <p className="text-sm text-slate-500">by {book.author}</p>

            {/* Rating Summary */}
            <div className="flex items-center gap-2 pt-1">
              <StarRating rating={avgRating} size="md" />
              <span className="text-sm font-semibold text-slate-600">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({bookReviews.length} reviews)</span>
            </div>

            <p className="text-xs text-slate-400 font-mono pt-1">ISBN: {book.isbn || '978-0000000000'}</p>
            
            <div className="flex items-center gap-2 pt-1">
              <p className="text-2xl font-bold text-amber-600">
                Rs. {((book.price || 0) * (1 - (book.discount || 0) / 100) * quantity).toLocaleString()}
              </p>
              {book.discount > 0 && (
                <p className="text-sm font-medium text-slate-400 line-through">
                  Rs. {((book.price || 0) * quantity).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="relative p-6 mt-4 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 rounded-2xl border border-amber-100/80 shadow-[inset_0_0_20px_rgba(251,191,36,0.05)] group">
            <div className="absolute -top-3 left-6 bg-white px-3 py-0.5 border border-amber-100 rounded-full flex items-center gap-1.5 shadow-sm">
              <Quote className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Synopsis</span>
            </div>
            <p className="text-[15px] text-amber-950/90 leading-relaxed font-serif font-medium pt-2 relative z-10 text-justify tracking-wide">
              {book.description}
            </p>
          </div>
        )}

        {/* Buy Section */}
        <div className="flex flex-col gap-4 mt-2">
          {book.available > 0 ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-600">Quantity</span>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md overflow-hidden shadow-sm">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 transition-all cursor-pointer font-bold border-r border-slate-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-800 bg-white py-1.5">{quantity}</span>
                <button
                  disabled={quantity >= book.available}
                  onClick={() => setQuantity((q) => Math.min(book.available, q + 1))}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 transition-all cursor-pointer font-bold border-l border-slate-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1 ml-auto">
                <CheckCircle className="w-3.5 h-3.5" /> In Stock ({book.available})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Out of Stock
              </span>
            </div>
          )}

          {showPaymentOptions ? (
            <div className="mt-2 space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">Select Payment Method:</span>
                <button onClick={() => setShowPaymentOptions(false)} className="text-xs font-semibold text-slate-400 hover:text-slate-600">Cancel</button>
              </div>

              {/* Delivery Section */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 mb-3 space-y-3">
                <label className="block text-xs font-bold text-slate-700">Delivery Information</label>
                <select 
                  value={deliveryZone} 
                  onChange={(e) => setDeliveryZone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                >
                  <option value="Store Pickup" disabled>Store Pickup (Free)</option>
                  <option value="Gauradaha Bajar">Gauradaha Bajar</option>
                  <option value="Gauradaha Outside Bajar">Gauradaha Outside Bajar</option>
                  <option value="Outside Gauradaha">Outside Gauradaha</option>
                </select>

                {deliveryZone !== 'Store Pickup' && (
                  <>
                    <input
                      type="text"
                      placeholder="10-digit Phone Number"
                      value={deliveryPhone}
                      onChange={(e) => setDeliveryPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <textarea
                      placeholder="Specific Delivery Address Details"
                      value={deliveryAddressDetail}
                      onChange={(e) => setDeliveryAddressDetail(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                    />
                    <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100">
                      <span className="text-slate-500">Delivery Charge:</span>
                      <span className={(quantity >= 3 && deliveryZone !== 'Outside Gauradaha') ? "text-emerald-600" : "text-amber-600"}>
                        {(quantity >= 3 && deliveryZone !== 'Outside Gauradaha') ? 'FREE (3+ Books)' : `Rs. ${deliveryZone === 'Gauradaha Bajar' ? 50 : deliveryZone === 'Gauradaha Outside Bajar' ? 150 : 100 * quantity}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">Estimated Time:</span>
                      <span className="text-slate-700">Up to {deliveryZone === 'Outside Gauradaha' ? 24 : 12} Hours</span>
                    </div>
                  </>
                )}
              </div>

              {/* Membership Verification */}
              {currentUser?.membershipNumber && storeSettings?.membershipDiscountPercentage > 0 && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 mb-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Verify Membership ID (Required)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. KB-12345"
                      value={membershipIdInput}
                      onChange={(e) => {
                        setMembershipIdInput(e.target.value);
                        setIsMembershipVerified(false);
                        setVerificationError('');
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <button
                      onClick={() => {
                        if (membershipIdInput.trim() === currentUser.membershipNumber) {
                          setIsMembershipVerified(true);
                          setVerificationError('');
                        } else {
                          setIsMembershipVerified(false);
                          setVerificationError('Invalid membership number');
                        }
                      }}
                      className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                  {isMembershipVerified && <p className="text-emerald-600 text-xs font-bold mt-1.5">✅ Congratulations! You got {storeSettings?.membershipDiscountPercentage}% discount on this purchase!</p>}
                  {verificationError && <p className="text-rose-500 text-xs font-bold mt-1.5">❌ {verificationError}</p>}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    disabled={book.available === 0 || (currentUser?.membershipNumber && storeSettings?.membershipDiscountPercentage > 0 && !isMembershipVerified) || isDeliveryInfoIncomplete}
                    onClick={() => handleBuy('eSewa')}
                    className="py-3.5 px-4 bg-white hover:bg-slate-50 border-2 border-[#60bb46] text-[#60bb46] text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="bg-[#60bb46] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] mr-1">e</span>
                    eSewa
                  </button>
                  <p className="text-[10px] text-center text-slate-500 font-medium bg-slate-100 py-1 rounded border border-slate-200">
                    Test ID: <span className="font-bold text-slate-700">9806800001</span> • Pass: <span className="font-bold text-slate-700">Nepal@123</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    disabled={book.available === 0 || (currentUser?.membershipNumber && storeSettings?.membershipDiscountPercentage > 0 && !isMembershipVerified) || isDeliveryInfoIncomplete}
                    onClick={() => handleBuy('Khalti')}
                    className="py-3.5 px-4 bg-white hover:bg-slate-50 border-2 border-[#df2028] text-[#df2028] text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 flex justify-center items-center gap-2 h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 ml-0.5 -mt-1 transform rotate-45" fill="currentColor" />
                    khalti <span className="text-[9px] -ml-1 mt-1 font-medium tracking-tight">by IME</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-medium py-1">
                    Testing Mode (Mock)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                disabled={book.available === 0}
                onClick={() => setShowPaymentOptions(true)}
                className="py-3.5 bg-[#1cc0eb] hover:bg-[#15a3c9] text-white text-sm font-bold rounded-lg shadow-md shadow-[#1cc0eb]/20 disabled:opacity-50 transition-all cursor-pointer active:scale-95 text-center flex justify-center items-center gap-2"
              >
                Buy Now
              </button>
              <button
                disabled={book.available === 0}
                onClick={handleAddToCart}
                className="py-3.5 bg-[#f57d26] hover:bg-[#de6a15] text-white text-sm font-bold rounded-lg shadow-md shadow-[#f57d26]/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-center flex justify-center items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200"></div>

        {/* Write a Review */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Write a Review
          </h3>

          <form onSubmit={handleSubmitReview} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Your Rating:</span>
              <StarRating rating={reviewRating} onRate={setReviewRating} size="md" />
              {reviewRating > 0 && (
                <span className="text-xs text-amber-600 font-bold">{reviewRating}/5</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts about this book..."
                className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all"
              />
              <button
                type="submit"
                disabled={!reviewRating || !reviewComment.trim()}
                className="px-5 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-40 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Existing Reviews */}
        {bookReviews.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">
              Customer Reviews ({bookReviews.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {bookReviews.map((review) => (
                <div key={review._id || review.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold overflow-hidden">
                        {review.userId?.avatar ? (
                          <img src={review.userId.avatar} alt={review.customerName} className="w-full h-full object-cover" />
                        ) : (
                          review.customerName[0]?.toUpperCase() || 'C'
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{review.customerName}</p>
                        <p className="text-[10px] text-slate-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StarRating rating={review.rating} size="sm" />
                      {review.customerName === (currentUser?.name || 'Customer') && (
                        <button
                          onClick={async () => {
                            try {
                              await deleteReview(review._id || review.id);
                              addToast('Review deleted', 'info');
                            } catch {
                              addToast('Failed to delete review', 'error');
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete your review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookReviews.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs">
            No reviews yet. Be the first to share your thoughts!
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {isFullScreen && coverImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col items-center justify-center p-4 backdrop-blur-sm group" onClick={() => setIsFullScreen(false)}>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFullScreen(false); }}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>
          
          {coverImages.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white bg-white/5 hover:bg-white/20 rounded-full transition-all z-50 cursor-pointer active:scale-95 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white bg-white/5 hover:bg-white/20 rounded-full transition-all z-50 cursor-pointer active:scale-95 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <img 
            src={coverImages[selectedImageIndex]} 
            alt="Fullscreen View" 
            className="max-w-[95vw] max-h-[80vh] object-contain rounded-xl shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="mt-8 flex gap-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={async () => {
                try {
                  const response = await fetch(coverImages[selectedImageIndex]);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${book.title.replace(/\s+/g, '_')}_cover.jpg`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  addToast('Failed to download image', 'error');
                }
              }}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
            >
              <Download className="w-4 h-4" /> Save Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}