import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);

  // On mount: check if token exists and restore session
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('bookverse_token') || sessionStorage.getItem('bookverse_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Ensure token is in sessionStorage for current session API calls
      if (!sessionStorage.getItem('bookverse_token')) {
        sessionStorage.setItem('bookverse_token', token);
      }

      try {
        const user = await authAPI.getMe();
        setCurrentUser({
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminType: user.adminType,
          tier: user.tier,
          status: user.status,
          avatar: user.avatar,
          membershipRequestStatus: user.membershipRequestStatus || 'None',
          membershipNumber: user.membershipNumber || null,
          pointsBalance: user.pointsBalance || 0,
        });
      } catch (error) {
        // Token expired or invalid
        sessionStorage.removeItem('bookverse_token');
        localStorage.removeItem('bookverse_token');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login Function
  const login = async (email, password, roleFilter, rememberMe = false) => {
    setAuthError('');
    try {
      const data = await authAPI.login(email, password, roleFilter);

      // Store token
      sessionStorage.setItem('bookverse_token', data.token);
      if (rememberMe) {
        localStorage.setItem('bookverse_token', data.token);
        localStorage.setItem('bookverse_remembered_email', email);
      } else {
        localStorage.removeItem('bookverse_token');
        localStorage.removeItem('bookverse_remembered_email');
      }

      setCurrentUser({
        id: data._id,
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        adminType: data.adminType,
        tier: data.tier,
        status: data.status,
        avatar: data.avatar,
        membershipRequestStatus: data.membershipRequestStatus || 'None',
        membershipNumber: data.membershipNumber || null,
        pointsBalance: data.pointsBalance || 0,
      });

      return true;
    } catch (error) {
      setAuthError(error.message || 'Invalid email or password!');
      return false;
    }
  };

  // Register Customer
  const registerCustomer = async (name, email, password) => {
    setAuthError('');
    try {
      const data = await authAPI.register(name, email, password);

      // Do NOT log the user in automatically
      // sessionStorage.setItem('bookverse_token', data.token);

      const newUser = {
        id: data._id,
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        tier: data.tier,
        status: data.status,
      };

      // setCurrentUser(newUser); // Do not set current user yet
      return newUser;
    } catch (error) {
      setAuthError(error.message || 'Registration failed!');
      return false;
    }
  };

  // Logout Function
  const logout = () => {
    sessionStorage.removeItem('bookverse_token');
    localStorage.removeItem('bookverse_token');
    setCurrentUser(null);
    setAuthError('');
    // Also call backend logout (non-blocking)
    authAPI.logout().catch(() => {});
  };

  // Update Profile Function
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authAPI.updateProfile(profileData);
      setCurrentUser(prev => ({
        ...prev,
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        adminType: updatedUser.adminType,
        tier: updatedUser.tier,
        status: updatedUser.status,
        avatar: updatedUser.avatar,
        membershipRequestStatus: updatedUser.membershipRequestStatus || prev?.membershipRequestStatus || 'None',
        membershipNumber: updatedUser.membershipNumber || prev?.membershipNumber || null,
        pointsBalance: updatedUser.pointsBalance || prev?.pointsBalance || 0,
      }));
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  // Refresh User Function (useful after transactions)
  const refreshUser = async () => {
    try {
      const user = await authAPI.getMe();
      setCurrentUser(prev => ({
        ...prev,
        pointsBalance: user.pointsBalance || 0,
        tier: user.tier,
        membershipRequestStatus: user.membershipRequestStatus || 'None',
        membershipNumber: user.membershipNumber || null,
      }));
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-amber-200 text-sm font-medium">Loading किताबघर...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, registerCustomer, logout, updateProfile, refreshUser, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
