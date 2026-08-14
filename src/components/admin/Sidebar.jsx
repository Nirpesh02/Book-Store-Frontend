import React from 'react';
import { LayoutDashboard, BookOpen, Users, History, LogOut, Store, Star, User, ShieldCheck, Settings, UserCog } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Inventory', icon: BookOpen },
    { id: 'users', label: 'Customers', icon: Users },
    { id: 'history', label: 'Order History', icon: History },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
  ];

  if (currentUser?.adminType === 'permanent') {
    menuItems.push({ id: 'subadmins', label: 'Sub-Admins', icon: UserCog });
    menuItems.push({ id: 'membership', label: 'Memberships', icon: ShieldCheck });
    menuItems.push({ id: 'settings', label: 'Store Settings', icon: Settings });
  }

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AD';

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between rounded-r-3xl my-3 shadow-2xl transition-all">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2 mb-8">
          <img 
            src="/Video and photo/Kitabghar logo.png" 
            alt="किताबघर Logo" 
            className="h-12 w-12 rounded-full object-cover object-center shadow-sm border-2 border-white/10 shrink-0"
          />
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-wide">किताब घर</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Admin Panel</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-600/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-600/30 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">My Profile</span>
            </button>
          </div>
        </nav>
      </div>

      <div className="p-4 mx-3 mb-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 shrink-0 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30 text-xs overflow-hidden">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold truncate text-slate-200">{currentUser?.name || 'Store Admin'}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || 'Admin'}</p>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            title="Sign Out"
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}