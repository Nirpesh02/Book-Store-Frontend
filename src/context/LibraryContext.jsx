import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { booksAPI, customersAPI, transactionsAPI, reviewsAPI, settingsAPI, wishlistAPI, membershipAPI } from '../api';

export const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const { currentUser, refreshUser } = useAuth();

  const [books, setBooks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [history, setHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [storeSettings, setStoreSettings] = useState({ membershipDiscountPercentage: 0 });
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('store_wishlist')) || []);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('store_cart')) || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all data when user logs in
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksData, reviewsData, historyData, settingsData, wishlistData] = await Promise.all([
          booksAPI.getAll(),
          reviewsAPI.getAll(),
          currentUser ? transactionsAPI.getAll().catch(() => []) : Promise.resolve([]),
          settingsAPI.getSettings().catch(() => ({ membershipDiscountPercentage: 0 })),
          currentUser ? wishlistAPI.get().catch(() => []) : Promise.resolve([])
        ]);

        setBooks(booksData);
        setReviews(reviewsData);
        setHistory(historyData);
        setStoreSettings(settingsData);
        if (currentUser) {
          setWishlist(wishlistData.map((item) => item.bookId?._id).filter(Boolean));
        }

        if (currentUser && currentUser.role === 'admin') {
          try {
            const customersData = await customersAPI.getAll();
            setCustomers(customersData);
          } catch {
            setCustomers([]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('store_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('store_cart', JSON.stringify(cart));
  }, [cart]);

  // ===== BOOKS =====
  const refreshBooks = async () => {
    try {
      const booksData = await booksAPI.getAll();
      setBooks(booksData);
    } catch (error) {
      console.error('Error refreshing books:', error);
    }
  };

  const addBook = async (newBook) => {
    try {
      const book = await booksAPI.add(newBook);
      setBooks((prev) => [book, ...prev]);
      return book;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  const updateBook = async (bookId, updatedData) => {
    try {
      const updatedBook = await booksAPI.update(bookId, updatedData);
      setBooks((prev) => prev.map((b) => (b._id === bookId ? updatedBook : b)));
      return updatedBook;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await booksAPI.delete(bookId);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };

  const restockBook = async (bookId, currentCopies) => {
    try {
      // We double the total copies, and replenish available stock by the original amount
      const newCopies = currentCopies * 2;
      const newAvailable = currentCopies;
      
      const updatedBook = await booksAPI.update(bookId, { copies: newCopies, available: newAvailable });
      setBooks((prev) => prev.map((b) => (b._id === bookId ? { ...b, copies: updatedBook.copies, available: updatedBook.available } : b)));
    } catch (error) {
      console.error('Error restocking book:', error);
      throw error;
    }
  };

  // ===== CUSTOMERS =====
  const registerCustomer = async (newCustomer) => {
    try {
      const customer = await customersAPI.add(newCustomer);
      setCustomers((prev) => {
        const exists = prev.some((p) => p.email?.toLowerCase() === customer.email?.toLowerCase());
        if (exists) return prev;
        return [customer, ...prev];
      });
      return customer;
    } catch (error) {
      console.error('Error registering customer:', error);
      throw error;
    }
  };

  const toggleCustomerStatus = async (customerId) => {
    try {
      const updated = await customersAPI.toggleStatus(customerId);
      setCustomers((prev) =>
        prev.map((p) =>
          p._id === customerId ? { ...p, status: updated.status } : p
        )
      );
    } catch (error) {
      console.error('Error toggling status:', error);
      throw error;
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await customersAPI.delete(customerId);
      setCustomers((prev) => prev.filter((p) => p._id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  };

  const promoteToSubAdmin = async (customerId) => {
    try {
      const updated = await customersAPI.promote(customerId);
      setCustomers((prev) =>
        prev.map((p) =>
          p._id === customerId ? { ...p, role: updated.role, adminType: updated.adminType } : p
        )
      );
      return updated;
    } catch (error) {
      console.error('Error promoting customer:', error);
      throw error;
    }
  };

  const demoteToCustomer = async (customerId) => {
    try {
      const updated = await customersAPI.demote(customerId);
      setCustomers((prev) =>
        prev.map((p) =>
          p._id === customerId ? { ...p, role: updated.role, adminType: updated.adminType } : p
        )
      );
      return updated;
    } catch (error) {
      console.error('Error demoting customer:', error);
      throw error;
    }
  };

  const removeMembership = async (customerId) => {
    try {
      const result = await membershipAPI.removeMembership(customerId);
      // Update local state — keep the customer but reset membership fields
      setCustomers((prev) =>
        prev.map((p) =>
          p._id === customerId
            ? { ...p, membershipNumber: '', tier: 'Standard', membershipRequestStatus: 'None' }
            : p
        )
      );
      return result;
    } catch (error) {
      console.error('Error removing membership:', error);
      throw error;
    }
  };

  // ===== TRANSACTIONS =====
  const purchaseBook = async (bookId, customerName, quantity = 1, paymentMethod = 'Cash', paymentId = '', pointsToRedeem = 0, providedMembershipId = null, deliveryData = null) => {
    try {
      const response = await transactionsAPI.purchase(bookId, quantity, paymentMethod, paymentId, pointsToRedeem, providedMembershipId, deliveryData);
      const transaction = response.transaction || response;

      if (paymentMethod !== 'eSewa') {
        // Update local book available count
        setBooks((prev) =>
          prev.map((b) => (b._id === bookId ? { ...b, available: b.available - quantity } : b))
        );
      }

      // Add to local history
      setHistory((prev) => [transaction, ...prev]);

      // Refresh auth to get new points balance if points were redeemed or earned
      if (paymentMethod !== 'eSewa') {
        refreshUser();
      }

      return { success: true, esewaData: response.esewaData };
    } catch (error) {
      console.error('Error purchasing book:', error);
      await refreshBooks(); // Refresh to get the actual stock from server
      return { success: false, message: error.message };
    }
  };

  const requestRefund = async (txId) => {
    try {
      const transaction = await transactionsAPI.refund(txId);

      // Update local history
      setHistory((prev) =>
        prev.map((tx) => (tx._id === txId ? { ...tx, status: 'Pending Refund', activity: 'Refund' } : tx))
      );

      return true;
    } catch (error) {
      console.error('Error requesting refund:', error);
      return false;
    }
  };

  const approveRefund = async (bookId, txId, comment = '') => {
    try {
      await transactionsAPI.approveRefund(txId, comment);

      // Find transaction to get quantity
      const tx = history.find(t => (t._id || t.id) === txId);
      const refundQuantity = tx?.quantity || 1;

      // Update local book available count
      setBooks((prev) =>
        prev.map((b) => (b._id === bookId ? { ...b, available: b.available + refundQuantity } : b))
      );

      // Update local history
      setHistory((prev) =>
        prev.map((tx) => (tx._id === txId ? { ...tx, status: 'Refunded', adminComment: comment } : tx))
      );

      return true;
    } catch (error) {
      console.error('Error approving refund:', error);
      return false;
    }
  };

  const rejectRefund = async (txId, comment = '') => {
    try {
      await transactionsAPI.rejectRefund(txId, comment);

      // Update local history
      setHistory((prev) =>
        prev.map((tx) => (tx._id === txId ? { ...tx, status: 'Refund Rejected', adminComment: comment } : tx))
      );

      return true;
    } catch (error) {
      console.error('Error rejecting refund:', error);
      return false;
    }
  };

  const markDelivered = async (txId) => {
    try {
      await transactionsAPI.markDelivered(txId);

      // Update local history
      setHistory((prev) =>
        prev.map((tx) => (tx._id === txId ? { ...tx, deliveryStatus: 'Delivered' } : tx))
      );

      return true;
    } catch (error) {
      console.error('Error marking as delivered:', error);
      return false;
    }
  };

  // ===== REVIEWS =====
  const addReview = async (bookId, customerName, rating, comment) => {
    try {
      const review = await reviewsAPI.add(bookId, rating, comment);
      setReviews((prev) => [review, ...prev]);
      return review;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const deleteReview = useCallback(async (reviewId) => {
    try {
      await reviewsAPI.delete(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }, []);

  const getBookReviews = useCallback((bookId) => {
    return reviews.filter((r) => r.bookId === bookId);
  }, [reviews]);

  const getAverageRating = useCallback((bookId) => {
    const bookReviews = reviews.filter((r) => r.bookId === bookId);
    if (bookReviews.length === 0) return 0;
    const sum = bookReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / bookReviews.length;
  }, [reviews]);

  // ===== WISHLIST (client-side only) =====
  const toggleWishlist = (bookId) => {
    setWishlist((prev) => {
      if (prev.includes(bookId)) {
        return prev.filter((id) => id !== bookId);
      }
      return [...prev, bookId];
    });
  };

  const isInWishlist = useCallback(
    (bookId) => {
      return wishlist.includes(bookId);
    },
    [wishlist]
  );

  // ===== CART =====
  const addToCart = (bookId, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(item => item.bookId === bookId);
      if (existing) {
        return prev.map(item => item.bookId === bookId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { bookId, quantity }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter(item => item.bookId !== bookId));
  };

  const updateCartQuantity = (bookId, quantity) => {
    setCart((prev) => prev.map(item => item.bookId === bookId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const checkoutCart = async (customerName, paymentMethod = 'Cash', paymentId = '', pointsToRedeem = 0, providedMembershipId = null, deliveryData = null) => {
    try {
      const response = await transactionsAPI.purchaseCart(cart, paymentMethod, paymentId, pointsToRedeem, providedMembershipId, deliveryData);
      const transactions = response.transactions || [];

      if (paymentMethod !== 'eSewa') {
        // Update local book available count
        setBooks((prev) => {
          let updatedBooks = [...prev];
          for (const item of cart) {
            updatedBooks = updatedBooks.map((b) =>
              b._id === item.bookId ? { ...b, available: b.available - item.quantity } : b
            );
          }
          return updatedBooks;
        });
      }

      // Add to local history
      setHistory((prev) => [...transactions, ...prev]);

      // Refresh auth to get new points balance if points were redeemed or earned
      if (paymentMethod !== 'eSewa') {
        refreshUser();
      }

      clearCart();
      return { success: true, esewaData: response.esewaData };
    } catch (error) {
      console.error('Checkout failed:', error);
      await refreshBooks(); // Refresh to get the actual stock from server
      return { success: false, message: error.message };
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        customers,
        history,
        reviews,
        wishlist,
        searchQuery,
        loading,
        storeSettings,
        setSearchQuery,
        refreshBooks,
        addBook,
        updateBook,
        deleteBook,
        restockBook,
        registerCustomer,
        toggleCustomerStatus,
        deleteCustomer,
        promoteToSubAdmin,
        demoteToCustomer,
        removeMembership,
        purchaseBook,
        requestRefund,
        approveRefund,
        rejectRefund,
        markDelivered,
        addReview,
        deleteReview,
        getBookReviews,
        getAverageRating,
        toggleWishlist,
        isInWishlist,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkoutCart,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => useContext(LibraryContext);