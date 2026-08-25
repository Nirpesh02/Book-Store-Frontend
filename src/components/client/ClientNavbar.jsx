import React, { useState } from 'react';
import { Store, Search, ShoppingBag, Heart, User, ShieldAlert, LogOut, X, ShoppingCart, ShieldCheck, Menu } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import MembershipApplyModal from './MembershipApplyModal';

export default function ClientNavbar({ clientTab, setClientTab, onLogout, currentUser, onSwitchToAdmin }) {
  const { searchQuery, setSearchQuery, history, wishlist, cart } = useLibrary();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);

  // Track viewed order IDs in local storage
  const [viewedOrderIds, setViewedOrderIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`viewed_order_ids_${currentUser?._id}`)) || [];
    } catch {
      return [];
    }
  });

  // Active orders count ONLY for logged in customer
  const userActiveOrders = history.filter(
    (h) => h.status === 'Purchased' && h.customerName.toLowerCase() === (currentUser?.name || '').toLowerCase()
  );

  const unreadOrdersCount = userActiveOrders.filter((h) => !viewedOrderIds.includes(h._id || h.id)).length;
  const wishlistCount = wishlist.length;
  const cartCount = cart.length;

  const handleMyOrdersClick = () => {
    setClientTab('my-books');
    const activeIds = userActiveOrders.map(h => h._id || h.id);
    const newViewed = [...new Set([...viewedOrderIds, ...activeIds])];
    setViewedOrderIds(newViewed);
    localStorage.setItem(`viewed_order_ids_${currentUser?._id}`, JSON.stringify(newViewed));
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28 gap-4">
          
          {/* Logo */}
            {/* Logo */}
            <div 
              onClick={() => {
                setClientTab('home');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center cursor-pointer group shrink-0"
            >
              <img 
                src="/Video and photo/Kitabghar logo.png" 
                alt="किताबघर Logo" 
                className="h-14 w-14 sm:h-16 sm:w-16 lg:h-18 lg:w-18 rounded-full object-cover object-center shadow-sm group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Desktop Search Bar */}
            <div className="relative hidden md:block w-48 lg:w-56 xl:w-80 transition-all">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value && clientTab !== 'explore') {
                    setClientTab('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                placeholder="Search by title, author, or genre..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

          {/* Desktop Navigation Items & User Controls */}
          <div className="hidden lg:flex items-center gap-1.5 sm:gap-3">



            <button
              onClick={() => setClientTab('home')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                clientTab === 'home' 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setClientTab('explore')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                clientTab === 'explore' 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Discover
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setClientTab('wishlist')}
              className={`relative p-2 sm:px-3 sm:py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                clientTab === 'wishlist' 
                  ? 'bg-rose-50 text-rose-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart className="w-4 h-4" fill={clientTab === 'wishlist' ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setClientTab('cart')}
              className={`relative p-2 sm:px-3 sm:py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                clientTab === 'cart' 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={handleMyOrdersClick}
              className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                clientTab === 'my-books' 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline whitespace-nowrap">My Orders</span>
              {unreadOrdersCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                  {unreadOrdersCount}
                </span>
              )}
            </button>

            {/* Switch Mode to Admin if user is admin */}
            {onSwitchToAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Switch to Admin Panel"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span className="hidden lg:inline">Admin Panel</span>
              </button>
            )}

            {/* Membership Button (Only for clients) */}
            {currentUser?.role === 'client' && (
              <div className="hidden md:flex items-center ml-2 border-l pl-3 border-slate-200">
                {currentUser?.membershipNumber ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">
                    <ShieldCheck className="w-4 h-4" />
                    Member
                  </div>
                ) : currentUser?.membershipRequestStatus === 'Pending' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200">
                    <ShieldCheck className="w-4 h-4" />
                    Pending Review
                  </div>
                ) : (
                  <button
                    onClick={() => setMembershipModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="whitespace-nowrap">Apply for Membership</span>
                  </button>
                )}
              </div>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => setClientTab('profile')}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  clientTab === 'profile' 
                    ? 'bg-amber-50 border-amber-200 shadow-sm' 
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                }`}
                title="My Profile"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs overflow-hidden ${
                  clientTab === 'profile' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600'
                }`}>
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'
                  )}
                </div>
                <span className={`text-xs font-semibold hidden lg:inline whitespace-nowrap ${
                  clientTab === 'profile' ? 'text-amber-700' : 'text-slate-700'
                }`}>
                  {currentUser?.name || 'Customer'}
                </span>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setClientTab('cart')}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-all flex items-center cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value && clientTab !== 'explore') {
                    setClientTab('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                autoFocus
              />
            </div>
            <button
              onClick={() => { setMobileSearchOpen(false); setSearchQuery(''); }}
              className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 space-y-2 pb-6 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => { setClientTab('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${clientTab === 'home' ? 'bg-amber-50 text-amber-600' : 'text-slate-600'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setClientTab('explore'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${clientTab === 'explore' ? 'bg-amber-50 text-amber-600' : 'text-slate-600'}`}
            >
              Discover
            </button>
            <button
              onClick={() => { setClientTab('wishlist'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${clientTab === 'wishlist' ? 'bg-rose-50 text-rose-600' : 'text-slate-600'}`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" /> Wishlist
              </div>
              {wishlistCount > 0 && <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{wishlistCount}</span>}
            </button>
            <button
              onClick={() => { handleMyOrdersClick(); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${clientTab === 'my-books' ? 'bg-amber-50 text-amber-600' : 'text-slate-600'}`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> My Orders
              </div>
              {unreadOrdersCount > 0 && <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadOrdersCount}</span>}
            </button>
            
            <button
              onClick={() => { setClientTab('profile'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${clientTab === 'profile' ? 'bg-amber-50 text-amber-700' : 'text-slate-600'}`}
            >
              <User className="w-4 h-4" /> My Profile
            </button>

            {onSwitchToAdmin && (
              <button
                onClick={() => { onSwitchToAdmin(); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Admin Panel
              </button>
            )}

            {currentUser?.role === 'client' && (
              <div className="px-4 py-2 mt-2 border-t border-slate-100">
                {currentUser?.membershipNumber ? (
                  <div className="flex items-center gap-2 py-2 text-amber-700 text-sm font-bold">
                    <ShieldCheck className="w-5 h-5" /> Active Member
                  </div>
                ) : currentUser?.membershipRequestStatus === 'Pending' ? (
                  <div className="flex items-center gap-2 py-2 text-slate-500 text-sm font-bold">
                    <ShieldCheck className="w-5 h-5" /> Membership Pending
                  </div>
                ) : (
                  <button
                    onClick={() => { setMembershipModalOpen(true); setMobileMenuOpen(false); }}
                    className="w-full mt-2 flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" /> Apply for Membership
                  </button>
                )}
              </div>
            )}

            {onLogout && (
              <div className="px-4 pt-2 mt-2 border-t border-slate-100">
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-rose-600 bg-rose-50 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Membership Application Modal */}
      <MembershipApplyModal
        isOpen={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
      />
    </header>
  );
}