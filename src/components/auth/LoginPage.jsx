import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Key, BookOpen, X, ArrowLeft, Copy, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api';
import { auth, provider, signInWithPopup } from '../../firebase';

export default function LoginPage() {
  const { login, googleLogin, authError, setAuthError } = useAuth();
  
  const [activeTab, setActiveTab] = useState('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // Restore remembered email on mount and check for verification status
  useEffect(() => {
    const savedEmail = localStorage.getItem('bookverse_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEmail(rememberMe ? (localStorage.getItem('bookverse_remembered_email') || '') : '');
    setPassword('');
    setAuthError('');
    setSuccessMsg('');
  };

  const handleAutoFillAdmin = () => {
    setActiveTab('admin');
    setEmail('admin@nirpesh.com');
    setPassword('admin123');
    setAuthError('');
    setSuccessMsg('');
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setIsLoading(true);

    try {
      await login(email, password, 'admin', rememberMe);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password handlers
  const openForgotModal = () => {
    setForgotEmail(email || '');
    setForgotError('');
    setForgotSuccess(false);
    setTempPassword('');
    setCopied(false);
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    // If password was reset successfully, pre-fill the login email
    if (forgotSuccess && forgotEmail) {
      setEmail(forgotEmail);
      setPassword('');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);

    try {
      const data = await authAPI.forgotPassword(forgotEmail);
      setTempPassword(data.tempPassword);
      setForgotSuccess(true);
    } catch (error) {
      setForgotError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const success = await googleLogin(
        user.displayName,
        user.email,
        user.photoURL
      );

      if (!success) {
        setIsLoading(false);
      }
    } catch (error) {
      setAuthError('Google Sign-In failed or was cancelled.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden font-sans">
      {/* ── Full-screen Background Image ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url('/Video%20and%20photo/kitabghar%20login.png')` }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* ── Left Side — Branding (visible only on large screens) ── */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 px-16">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-white/90 text-2xl font-bold tracking-tight">किताबघर</span>
          </div>
          <h1 className="text-white text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Your next <br />
            <span className="bg-gradient-to-r from-[#a8d5b0] to-[#7a9b83] bg-clip-text text-transparent">
              favourite book
            </span>
            <br />awaits you.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Discover, borrow, and manage your reading journey all in one beautiful place.
          </p>
        </div>
      </div>

      {/* ── Right Side — Glassmorphism Login Card ── */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4 sm:p-8">
        <div className="w-full max-w-[440px]">

          {/* Mobile branding (small screens only) */}
          <div className="lg:hidden mb-8 px-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/90 text-lg font-bold tracking-tight">किताबघर</span>
            </div>
            <h1 className="text-white text-[28px] font-extrabold leading-tight tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-white/60 text-[14px] leading-relaxed">
              Sign in to continue your reading journey
            </p>
          </div>

          {/* ── Glass Card ── */}
          <div
            className="rounded-[32px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <div className="p-8 sm:p-10">

              {/* Desktop heading inside card */}
              <div className="hidden lg:block mb-8">
                <h2 className="text-white text-[26px] font-bold tracking-tight mb-1">
                  Sign In
                </h2>
                <p className="text-white/50 text-[14px]">
                  Select your portal to continue
                </p>
              </div>

              {/* ── Tab Switcher ── */}
              <div
                className="p-1.5 rounded-full flex mb-8"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {[
                  { key: 'client', label: 'Customer' },
                  { key: 'admin', label: 'Admin' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex-1 py-3 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                      activeTab === tab.key
                        ? 'bg-white text-slate-900 shadow-lg'
                        : 'text-white/60 hover:text-white/90'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Alerts ── */}
              {authError && (
                <div
                  className="w-full p-3.5 mb-6 rounded-2xl text-[13px] font-semibold text-center text-rose-100"
                  style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.3)' }}
                >
                  {authError}
                </div>
              )}

              {/* ── Dynamic Content based on Tab ── */}
              {activeTab === 'client' ? (
                /* Customer View - Google Only */
                <div className="flex flex-col gap-6 items-center pt-2">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 mb-2">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-8 h-8 opacity-80" />
                  </div>
                  <div className="text-center mb-4">
                    <h3 className="text-white text-lg font-bold mb-1">Sign in as Customer</h3>
                    <p className="text-white/50 text-sm">Use your Google account to instantly sign in or register.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-4 bg-white hover:bg-gray-100 text-gray-800 font-bold text-[15px] rounded-2xl shadow-lg shadow-black/20 transition-all flex items-center justify-center gap-3 disabled:opacity-60 active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
                    ) : (
                      <>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Admin View - Form Only */
                <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4">
                  <div
                    className="rounded-2xl p-4 flex items-center gap-4 transition-all focus-within:ring-2 focus-within:ring-[#7a9b83]/50"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <Mail className="w-5 h-5 text-[#a8d5b0] shrink-0" />
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Admin Email</span>
                      <input
                        type="email"
                        required
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-none p-0 outline-none text-[15px] font-semibold text-white placeholder-white/25 bg-transparent mt-0.5"
                      />
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-4 flex items-center gap-4 transition-all focus-within:ring-2 focus-within:ring-[#7a9b83]/50"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <Lock className="w-5 h-5 text-[#a8d5b0] shrink-0" />
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Password</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-none p-0 outline-none text-[15px] font-semibold text-white placeholder-white/25 bg-transparent mt-0.5"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/30 hover:text-white/70 cursor-pointer p-1 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center px-1 py-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <div
                        onClick={(e) => { e.preventDefault(); setRememberMe(!rememberMe); }}
                        className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-all cursor-pointer ${
                          rememberMe
                            ? 'bg-[#7a9b83] border-[#7a9b83]'
                            : 'bg-transparent border-2 border-white/20 group-hover:border-white/40'
                        }`}
                      >
                        {rememberMe && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                      <span
                        className="text-[13px] font-medium text-white/50 group-hover:text-white/70 transition-colors"
                        onClick={() => setRememberMe(!rememberMe)}
                      >
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={openForgotModal}
                      className="text-[13px] font-semibold text-[#a8d5b0] hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 mt-2 bg-gradient-to-r from-[#7a9b83] to-[#5e8568] hover:from-[#688a71] hover:to-[#4e7558] text-white font-bold text-[15px] rounded-2xl shadow-lg shadow-black/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Sign In as Admin</span>
                    )}
                  </button>
                </form>
              )}

              {/* ── Auto-fill Helper for Admin ── */}
              {activeTab === 'admin' && (
                <div className="mt-8 pt-6 flex justify-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    type="button"
                    onClick={handleAutoFillAdmin}
                    className="text-[11px] font-bold text-white/40 hover:text-white/80 transition-colors flex items-center gap-2 uppercase tracking-widest"
                  >
                    <Key className="w-3.5 h-3.5" />
                    Auto-fill Admin credentials
                  </button>
                </div>
              )}

            </div>
          </div>

          <p className="text-center text-white/30 text-[12px] mt-6 font-medium tracking-wide">
            © {new Date().getFullYear()} किताबघर · Online Book Store
          </p>

        </div>
      </div>

      {/* ── Forgot Password Modal ── */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeForgotModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-[420px] rounded-[28px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]"
            style={{
              background: 'rgba(30, 30, 40, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)', // Fix styling on safari
              border: '1px solid rgba(255,255,255,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Close button */}
              <button
                type="button"
                onClick={closeForgotModal}
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {!forgotSuccess ? (
                <>
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#7a9b83]/20 flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-[#a8d5b0]" />
                    </div>
                    <h3 className="text-white text-[22px] font-bold tracking-tight mb-1">
                      Forgot Password?
                    </h3>
                    <p className="text-white/50 text-[14px] leading-relaxed">
                      Enter your email address and we'll reset your password to a temporary one.
                    </p>
                  </div>

                  {forgotError && (
                    <div
                      className="w-full p-3.5 mb-5 rounded-2xl text-[13px] font-semibold text-center text-rose-100"
                      style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.3)' }}
                    >
                      {forgotError}
                    </div>
                  )}

                  <form onSubmit={handleForgotSubmit}>
                    <div
                      className="rounded-2xl p-4 flex items-center gap-4 transition-all focus-within:ring-2 focus-within:ring-[#7a9b83]/50 mb-5"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <Mail className="w-5 h-5 text-[#a8d5b0] shrink-0" />
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Admin Email</span>
                        <input
                          type="email"
                          required
                          placeholder="admin@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full border-none p-0 outline-none text-[15px] font-semibold text-white placeholder-white/25 bg-transparent mt-0.5"
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-4 bg-gradient-to-r from-[#7a9b83] to-[#5e8568] hover:from-[#688a71] hover:to-[#4e7558] text-white font-bold text-[15px] rounded-2xl shadow-lg shadow-black/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] cursor-pointer"
                    >
                      {forgotLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="mt-5 w-full flex items-center justify-center gap-2 text-[13px] font-semibold text-white/40 hover:text-white/70 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#7a9b83]/20 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-7 h-7 text-[#a8d5b0]" />
                    </div>
                    <h3 className="text-white text-[22px] font-bold tracking-tight mb-1">
                      Password Reset!
                    </h3>
                    <p className="text-white/50 text-[14px] leading-relaxed">
                      Your new temporary password is shown below. Please copy it and log in.
                    </p>
                  </div>

                  <div
                    className="rounded-2xl p-4 flex items-center justify-between gap-3 mb-5"
                    style={{
                      background: 'rgba(122, 155, 131, 0.15)',
                      border: '1px solid rgba(122, 155, 131, 0.3)',
                    }}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-[#a8d5b0]/60 font-bold uppercase tracking-widest mb-1">
                        Temporary Password
                      </span>
                      <span className="text-[18px] font-mono font-bold text-[#a8d5b0] tracking-widest select-all">
                        {tempPassword}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        copied
                          ? 'bg-[#7a9b83]/30 text-[#a8d5b0]'
                          : 'bg-white/10 text-white/50 hover:text-white hover:bg-white/20'
                      }`}
                      title="Copy password"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="w-full py-4 bg-gradient-to-r from-[#7a9b83] to-[#5e8568] hover:from-[#688a71] hover:to-[#4e7558] text-white font-bold text-[15px] rounded-2xl shadow-lg shadow-black/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    Go Log In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
