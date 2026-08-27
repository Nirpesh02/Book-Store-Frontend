import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, CreditCard, Send } from 'lucide-react';
import { initiateEsewaPayment } from '../../utils/esewaHelper';

export default function Cart({ currentUser, onExplore }) {
  const { books, cart, updateCartQuantity, removeFromCart, checkoutCart, storeSettings } = useLibrary();
  const { addToast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [membershipIdInput, setMembershipIdInput] = useState('');
  const [isMembershipVerified, setIsMembershipVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('Store Pickup');
  const [deliveryAddressDetail, setDeliveryAddressDetail] = useState('');

  // Join cart state with book data
  const cartItems = cart.map(cartItem => {
    const book = books.find(b => (b._id || b.id) === cartItem.bookId);
    return { ...cartItem, book };
  }).filter(item => item.book);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const totalBookDiscount = cartItems.reduce((sum, item) => {
    const discountAmt = item.book.price * ((item.book.discount || 0) / 100);
    return sum + (discountAmt * item.quantity);
  }, 0);

  const subtotalAfterBookDiscounts = subtotal - totalBookDiscount;

  let memberDiscountAmount = 0;
  if (currentUser?.membershipNumber && storeSettings?.membershipDiscountPercentage > 0 && isMembershipVerified) {
    memberDiscountAmount = subtotalAfterBookDiscounts * (storeSettings.membershipDiscountPercentage / 100);
  }

  const finalCartTotal = subtotalAfterBookDiscounts - memberDiscountAmount;

  const maxPointsToRedeem = Math.min(
    currentUser?.pointsBalance || 0,
    Math.floor(finalCartTotal / 2)
  );

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  let deliveryCharge = 0;
  let estimatedDeliveryHours = 0;

  if (deliveryZone !== 'Store Pickup') {
    if (totalQuantity >= 3 && deliveryZone !== 'Outside Gauradaha') {
      deliveryCharge = 0;
    } else {
      if (deliveryZone === 'Gauradaha Bajar') deliveryCharge = 50;
      else if (deliveryZone === 'Gauradaha Outside Bajar') deliveryCharge = 150;
      else if (deliveryZone === 'Outside Gauradaha') deliveryCharge = 100 * totalQuantity;
    }
    if (deliveryZone === 'Outside Gauradaha') estimatedDeliveryHours = 24;
    else estimatedDeliveryHours = 12;
  }

  const discountFromPoints = pointsToRedeem * 2;
  const total = Math.max(0, finalCartTotal - discountFromPoints) + deliveryCharge;

  const hasOutOfStockItems = cartItems.some(item => item.quantity > item.book.available);

  const isDeliveryInfoIncomplete = deliveryZone === 'Store Pickup' || (deliveryPhone.length !== 10 || !deliveryAddressDetail.trim());

  const handleCheckout = async (paymentMethod = 'Cash') => {
    const isVerificationRequired = currentUser?.membershipNumber && storeSettings?.membershipDiscountPercentage > 0;

    // If user is a member and discount is active, they MUST be verified
    if (isVerificationRequired && !isMembershipVerified) {
      setVerificationError('Please verify your Membership ID first.');
      return;
    }

    setIsCheckingOut(true);
    const providedMembershipId = isVerificationRequired && isMembershipVerified ? membershipIdInput : null;
    
    if (deliveryZone !== 'Store Pickup' && deliveryPhone.length !== 10) {
      addToast('Please enter a valid 10-digit phone number for delivery.', 'error');
      setIsCheckingOut(false);
      return;
    }
    if (deliveryZone !== 'Store Pickup' && !deliveryAddressDetail.trim()) {
      addToast('Please enter specific delivery address details.', 'error');
      setIsCheckingOut(false);
      return;
    }

    const deliveryData = { deliveryPhone, deliveryZone, deliveryAddressDetail };
    const result = await checkoutCart(currentUser?.name || 'Customer', paymentMethod, '', pointsToRedeem, providedMembershipId, deliveryData);
    setIsCheckingOut(false);
    
    if (result.success) {
      if (paymentMethod === 'eSewa' && result.esewaData) {
        initiateEsewaPayment(result.esewaData);
      } else {
        addToast('Order placed successfully! Thank you for shopping with us.', 'success', 10000);
        onExplore();
      }
    } else {
      addToast(result.message || 'Checkout failed. Please try again.', 'error');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            Shopping Cart
          </h2>
        </div>
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <ShoppingCart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-600 font-bold text-xl">Your cart is empty</p>
          <p className="text-slate-400 text-sm mt-2 mb-6">Looks like you haven't added any books yet.</p>
          <button 
            onClick={onExplore}
            className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-8">
        <ShoppingCart className="w-6 h-6 text-orange-500" />
        Shopping Cart
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.bookId} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 relative">
                {item.book.coverImages && item.book.coverImages.length > 0 ? (
                  (item.book.coverImages[0].match(/\.(mp4|webm|ogg)$/i) || item.book.coverImages[0].includes('/video/upload/')) ? (
                    <video src={item.book.coverImages[0]} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                  ) : (
                    <img src={item.book.coverImages[0]} alt={item.book.title} className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{item.book.title}</h3>
                  <p className="text-sm font-semibold text-slate-500">{item.book.author}</p>
                  
                  {/* Stock Warning */}
                  {item.book.available === 0 ? (
                    <span className="inline-block mt-2 text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                      Out of Stock
                    </span>
                  ) : item.quantity > item.book.available ? (
                    <span className="inline-block mt-2 text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                      Only {item.book.available} available
                    </span>
                  ) : null}
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-amber-600">
                        Rs. {(item.book.price * (1 - (item.book.discount || 0) / 100)).toFixed(2)}
                      </span>
                      {item.book.discount > 0 && (
                        <span className="text-xs font-semibold text-slate-400 line-through">
                          Rs. {item.book.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md overflow-hidden shadow-sm w-fit">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() => updateCartQuantity(item.bookId, item.quantity - 1)}
                        className="px-3 py-1.5 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 transition-all font-bold border-r border-slate-200"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-slate-800 bg-white py-1.5">{item.quantity}</span>
                      <button
                        disabled={item.quantity >= item.book.available}
                        onClick={() => updateCartQuantity(item.bookId, item.quantity + 1)}
                        className="px-3 py-1.5 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 transition-all font-bold border-l border-slate-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.bookId)}
                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-sm font-medium text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="text-slate-800">Rs. {subtotal.toFixed(2)}</span>
              </div>
              {totalBookDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Book Discount</span>
                  <span>-Rs. {totalBookDiscount.toFixed(2)}</span>
                </div>
              )}
              {memberDiscountAmount > 0 && (
                <div className="flex justify-between text-amber-600 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100 -mx-2 px-2">
                  <span>👑 Member Discount ({storeSettings.membershipDiscountPercentage}%)</span>
                  <span>-Rs. {memberDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              {currentUser?.membershipNumber ? (
                currentUser?.pointsBalance > 0 ? (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex justify-between items-center text-amber-600">
                      <span className="font-bold flex items-center gap-1">🪙 Kitabghar Points</span>
                      <span className="text-xs font-semibold bg-amber-50 px-2 py-1 rounded-md border border-amber-100">Bal: {currentUser.pointsBalance}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="range" 
                        min="0" 
                        max={maxPointsToRedeem} 
                        value={pointsToRedeem} 
                        onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-slate-500 font-semibold px-1">
                        <span>0</span>
                        {pointsToRedeem > 0 && <span className="text-amber-600">{pointsToRedeem} pts (-Rs. {discountFromPoints.toFixed(2)})</span>}
                        <span>{maxPointsToRedeem}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 flex flex-col items-center text-center">
                      <span className="text-xl mb-1">🪙</span>
                      <span className="text-xs font-bold text-slate-600">Kitabghar Points</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">Complete this purchase to start earning points!</span>
                    </div>
                  </div>
                )
              ) : (
                <div className="pt-4 border-t border-slate-200">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col items-center text-center">
                    <span className="text-xl mb-1">👑</span>
                    <span className="text-xs font-bold text-amber-800">Premium Feature</span>
                    <span className="text-[10px] text-amber-700/70 mt-0.5">Apply for membership to start earning and redeeming points!</span>
                  </div>
                </div>
              )}

              {deliveryZone !== 'Store Pickup' && (
                <div className="flex justify-between text-slate-800">
                  <span>Delivery Charge</span>
                  <span className={deliveryCharge === 0 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                    {deliveryCharge === 0 ? 'FREE' : `+Rs. ${deliveryCharge}`}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-base text-slate-800 font-bold">Total</span>
                <span className="text-2xl font-black text-amber-600">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {showPaymentOptions ? (
              <div className="mt-6 space-y-3 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-700">Select Payment Method:</span>
                  <button onClick={() => setShowPaymentOptions(false)} className="text-xs font-semibold text-slate-400 hover:text-slate-600">Cancel</button>
                </div>

                {/* Delivery Section */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
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
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                      />
                      <textarea
                        placeholder="Specific Delivery Address Details"
                        value={deliveryAddressDetail}
                        onChange={(e) => setDeliveryAddressDetail(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none bg-white"
                      />
                      <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-200">
                        <span className="text-slate-500">Estimated Delivery Time:</span>
                        <span className="text-slate-700">Up to {estimatedDeliveryHours} Hours</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Membership Verification */}
                {currentUser?.membershipNumber && storeSettings?.membershipDiscountPercentage > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                    <label className="block text-xs font-bold text-slate-700 mb-2">Verify Membership ID (Required)</label>
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
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
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
                    {isMembershipVerified && <p className="text-emerald-600 text-xs font-bold mt-2">✅ Congratulations! You got {storeSettings?.membershipDiscountPercentage}% discount on this purchase!</p>}
                    {verificationError && <p className="text-rose-500 text-xs font-bold mt-2">❌ {verificationError}</p>}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={isCheckingOut || hasOutOfStockItems || (currentUser?.membershipNumber && storeSettings?.membershipDiscountPercentage > 0 && !isMembershipVerified) || isDeliveryInfoIncomplete}
                      onClick={() => handleCheckout('eSewa')}
                      className="w-full py-4 px-4 bg-white hover:bg-slate-50 border-2 border-[#60bb46] text-[#60bb46] text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? (
                         <div className="w-5 h-5 border-2 border-[#60bb46]/20 border-t-[#60bb46] rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="bg-[#60bb46] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] mr-1">e</span>
                          Pay with eSewa
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-slate-500 font-medium bg-slate-100 py-1.5 rounded-lg border border-slate-200">
                      Test ID: <span className="font-bold text-slate-700">9806800001</span> • Pass: <span className="font-bold text-slate-700">Nepal@123</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={isCheckingOut || hasOutOfStockItems || (currentUser?.membershipNumber && storeSettings?.membershipDiscountPercentage > 0 && !isMembershipVerified) || isDeliveryInfoIncomplete}
                      onClick={() => handleCheckout('Khalti')}
                      className="w-full py-4 px-4 bg-white hover:bg-slate-50 border-2 border-[#df2028] text-[#df2028] text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 flex justify-center items-center gap-2 h-[56px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? (
                         <div className="w-5 h-5 border-2 border-[#df2028]/20 border-t-[#df2028] rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 ml-0.5 -mt-1 transform rotate-45" fill="currentColor" />
                          Pay with khalti <span className="text-[9px] -ml-1 mt-1 font-medium tracking-tight">by IME</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-medium py-1">
                      Testing Mode (Mock)
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700 text-center font-medium flex items-center justify-center gap-1.5">
                    <span className="text-[14px]">⚠️</span> Note: These payment methods are for testing purposes only. Real transactions will be enabled after the testing phase is complete.
                  </p>
                </div>
              </div>
            ) : (
              <button
                disabled={isCheckingOut || hasOutOfStockItems}
                onClick={() => setShowPaymentOptions(true)}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
