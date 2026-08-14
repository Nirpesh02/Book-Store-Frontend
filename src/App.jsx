import React, { useState } from 'react';

//context components
import { LibraryProvider } from './context/LibraryContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

//authentication components
import LoginPage from './components/auth/LoginPage';

// Admin Components
import Sidebar from './components/admin/Sidebar';
import DashboardOverview from './components/admin/DashboardOverview';
import BookCatalog from './components/admin/BookCatalog';
import UserManagement from './components/admin/UserManagement';
import BorrowingHistory from './components/admin/BorrowingHistory';
import AdminReviews from './components/admin/AdminReviews';
import AddBookModal from './components/admin/AddBookModal';
import AddPatronModal from './components/admin/AddPatronModal';
import SubAdminManagement from './components/admin/SubAdminManagement';
import MembershipRequests from './components/admin/MembershipRequests';
import StoreSettings from './components/admin/StoreSettings';

// Client Components
import ClientNavbar from './components/client/ClientNavbar';
import ClientCatalog from './components/client/ClientCatalog';
import MyBorrowedBooks from './components/client/MyBorrowedBooks';
import BookDetailsModal from './components/client/BookDetailsModal';
import OurStory from './components/client/OurStory';
import Wishlist from './components/client/Wishlist';
import Cart from './components/client/Cart';

// common components
import Navbar from './components/common/Navbar';
import ToastContainer from './components/common/Toast';
import Footer from './components/common/Footer';
import UserProfile from './components/common/UserProfile';

import PaymentSuccess from './components/client/PaymentSuccess';

function MainLayout() {
  const { currentUser, logout } = useAuth();
  
  // Admin Tabs & View mode
  const [adminTab, setAdminTab] = useState('dashboard');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isPatronModalOpen, setIsPatronModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(null); // 'admin' | 'client' | null (defaults to role)

  // Client Tabs
  const [clientTab, setClientTab] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);

  // eSewa Callback Route Handling
  if (window.location.pathname === '/payment-success') {
    return <PaymentSuccess onNavigateHome={() => window.location.href = '/'} />;
  }

  // Reset view mode whenever user changes or logs out
  React.useEffect(() => {
    setViewMode(null);
  }, [currentUser?._id]);

  if (!currentUser) {
    return <LoginPage />;
  }

  // Strictly enforce: Customer accounts can NEVER enter admin mode
  const effectiveMode = currentUser.role === 'admin' ? (viewMode || 'admin') : 'client';

  if (effectiveMode === 'admin' && currentUser.role === 'admin') {

    return (
      <div className="flex h-screen overflow-hidden bg-slate-100 p-3 sm:p-5 gap-6">
        <Sidebar activeTab={adminTab} setActiveTab={setAdminTab} currentUser={currentUser} onLogout={logout} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full">
                Admin Panel: {currentUser.name}
              </span>
              <button
                onClick={() => setViewMode('client')}
                className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                👁 Preview Store View
              </button>
            </div>
            <button
              onClick={logout}
              className="text-xs font-semibold px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-200 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          <Navbar
            onOpenAddBook={() => setIsBookModalOpen(true)}
            onOpenAddPatron={() => setIsPatronModalOpen(true)}
          />

          <div className="flex-1 overflow-y-auto pr-2 pb-10">
            {adminTab === 'dashboard' && <DashboardOverview onNavigate={setAdminTab} />}
            {adminTab === 'catalog' && <BookCatalog currentUser={currentUser} />}
            {adminTab === 'users' && <UserManagement />}
            {adminTab === 'history' && <BorrowingHistory />}
            {adminTab === 'reviews' && <AdminReviews />}
            {adminTab === 'subadmins' && currentUser?.adminType === 'permanent' && <SubAdminManagement />}
            {adminTab === 'membership' && currentUser?.adminType === 'permanent' && <MembershipRequests />}
            {adminTab === 'settings' && currentUser?.adminType === 'permanent' && <StoreSettings />}
            {adminTab === 'profile' && <UserProfile />}
          </div>
        </main>

        <AddBookModal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
        <AddPatronModal isOpen={isPatronModalOpen} onClose={() => setIsPatronModalOpen(false)} />
        <ToastContainer />
      </div>
    );
  }

  // If logged in as CLIENT or Admin previewing Client view
  return (
    <div className={`min-h-screen ${clientTab === 'home' ? 'bg-[#f4ebd9]/30' : 'bg-[#fcfaf7]'} text-slate-800 flex flex-col`}>
      <ClientNavbar
        clientTab={clientTab}
        setClientTab={setClientTab}
        onLogout={logout}
        currentUser={currentUser}
        onSwitchToAdmin={currentUser.role === 'admin' ? () => setViewMode('admin') : null}
      />

      <main className="flex-1">
        {(clientTab === 'explore' || clientTab === 'home') && (
          <ClientCatalog 
            currentUser={currentUser} 
            clientTab={clientTab}
            onSelectBook={(book) => setSelectedBook(book)} 
            onNavigateToStory={() => setClientTab('our-story')}
            onNavigateToDiscover={() => setClientTab('explore')}
          />
        )}
        {clientTab === 'our-story' && <OurStory onExplore={() => setClientTab('explore')} />}
        {clientTab === 'my-books' && <MyBorrowedBooks currentUser={currentUser} onExplore={() => setClientTab('explore')} />}
        {clientTab === 'wishlist' && <Wishlist currentUser={currentUser} onSelectBook={(book) => { setSelectedBook(book); setIsBookModalOpen(true); }} />}
        {clientTab === 'cart' && <Cart currentUser={currentUser} onExplore={() => setClientTab('explore')} />}
        {clientTab === 'profile' && <UserProfile />}
      </main>

      {clientTab === 'explore' ? (
        <div className="w-full bg-[#2c1f17] text-[#d1c0a8] py-8 flex items-center justify-center mt-auto shadow-inner">
          <p className="text-sm sm:text-base font-serif tracking-wide">
            © 2026 किताबघर — Celebrating Nepali Literature
          </p>
        </div>
      ) : (
        <Footer />
      )}

      <BookDetailsModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        currentUser={currentUser}
      />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </LibraryProvider>
    </AuthProvider>
  );
}