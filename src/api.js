// API helper for connecting frontend to backend
const API_BASE = 'https://book-store-backend-39qh.onrender.com/api';

// Get stored token
const getToken = () => sessionStorage.getItem('bookverse_token');

// Helper for making authenticated requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password, roleFilter) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, roleFilter }),
    }),

  register: (name, email, password) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => apiRequest('/auth/me'),

  updateProfile: (data) => 
    apiRequest('/auth/profile', { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ==================== BOOKS API ====================
export const booksAPI = {
  getAll: () => apiRequest('/books'),

  getById: (id) => apiRequest(`/books/${id}`),

  add: (bookData) =>
    apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    }),

  update: (id, bookData) =>
    apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    }),

  delete: (id) =>
    apiRequest(`/books/${id}`, { method: 'DELETE' }),
};

// ==================== WISHLIST API ====================
export const wishlistAPI = {
  get: () => apiRequest('/books/wishlist'),
  add: (bookId) =>
    apiRequest('/books/wishlist', {
      method: 'POST',
      body: JSON.stringify({ bookId }),
    }),
  remove: (bookId) =>
    apiRequest(`/books/wishlist/${bookId}`, { method: 'DELETE' }),
};

// ==================== TRANSACTIONS API ====================
export const transactionsAPI = {
  getAll: () => apiRequest('/transactions'),

  purchase: (bookId, quantity = 1, paymentMethod = 'Cash', paymentId = '', pointsToRedeem = 0, providedMembershipId = null, deliveryData = null) =>
    apiRequest('/transactions/purchase', {
      method: 'POST',
      body: JSON.stringify({ bookId, quantity, paymentMethod, paymentId, pointsToRedeem, providedMembershipId, deliveryData }),
    }),

  purchaseCart: (items, paymentMethod = 'Cash', paymentId = '', pointsToRedeem = 0, providedMembershipId = null, deliveryData = null) =>
    apiRequest('/transactions/purchase-cart', {
      method: 'POST',
      body: JSON.stringify({ items, paymentMethod, paymentId, pointsToRedeem, providedMembershipId, deliveryData }),
    }),

  verifyEsewaPayment: (data) =>
    apiRequest('/transactions/verify-esewa', {
      method: 'POST',
      body: JSON.stringify({ data }),
    }),

  refund: (transactionId) =>
    apiRequest(`/transactions/refund/${transactionId}`, {
      method: 'POST',
    }),

  approveRefund: (transactionId, comment) =>
    apiRequest(`/transactions/approve-refund/${transactionId}`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    }),

  rejectRefund: (transactionId, comment) =>
    apiRequest(`/transactions/reject-refund/${transactionId}`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    }),

  markDelivered: (transactionId) =>
    apiRequest(`/transactions/mark-delivered/${transactionId}`, {
      method: 'POST',
    }),
};

// ==================== REVIEWS API ====================
export const reviewsAPI = {
  getAll: () => apiRequest('/reviews'),

  getByBook: (bookId) => apiRequest(`/reviews/book/${bookId}`),

  add: (bookId, rating, comment) =>
    apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify({ bookId, rating, comment }),
    }),

  deleteReview: (reviewId) =>
    apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    }),
};

// ==================== UPLOAD API ====================
export const uploadAPI = {
  getCloudinarySignature: (folder) =>
    apiRequest('/upload/signature', {
      method: 'POST',
      body: JSON.stringify({ folder }),
    }),
};

// ==================== CUSTOMERS API ====================
export const customersAPI = {
  getAll: () => apiRequest('/customers'),

  add: (customerData) =>
    apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    }),

  toggleStatus: (id) =>
    apiRequest(`/customers/${id}/toggle-status`, { method: 'PATCH' }),

  delete: (id) =>
    apiRequest(`/customers/${id}`, { method: 'DELETE' }),
};

// ==================== ADMINS API ====================
export const adminAPI = {
  getAll: () => apiRequest('/admins'),

  add: (adminData) =>
    apiRequest('/admins', {
      method: 'POST',
      body: JSON.stringify(adminData),
    }),

  delete: (id) =>
    apiRequest(`/admins/${id}`, { method: 'DELETE' }),
};

// ==================== MEMBERSHIP API ====================
export const membershipAPI = {
  apply: (data) => apiRequest('/membership/apply', { method: 'POST', body: JSON.stringify(data) }),
  getPendingRequests: () => apiRequest('/membership/requests'),
  approveRequest: (userId) => apiRequest(`/membership/approve/${userId}`, { method: 'POST' }),
  rejectRequest: (userId) => apiRequest(`/membership/reject/${userId}`, { method: 'POST' }),
  removeMembership: (userId) => apiRequest(`/membership/remove/${userId}`, { method: 'POST' }),
};

// ==================== SETTINGS API ====================
export const settingsAPI = {
  getSettings: () => apiRequest('/settings'),
  updateSettings: (data) => apiRequest('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};
