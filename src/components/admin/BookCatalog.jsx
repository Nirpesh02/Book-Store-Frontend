import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, RefreshCcw, Edit } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import EditBookModal from './EditBookModal';

export default function BookCatalog({ currentUser }) {
  const { books, searchQuery, purchaseBook, deleteBook, restockBook } = useLibrary();
  const { addToast } = useToast();
  const [bookToDelete, setBookToDelete] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);

  const filteredBooks = books.filter(
    (b) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (b.title && b.title.toLowerCase().includes(searchLower)) ||
        (b.englishTitle && b.englishTitle.toLowerCase().includes(searchLower)) ||
        (b.author && b.author.toLowerCase().includes(searchLower)) ||
        (b.category && b.category.toLowerCase().includes(searchLower)) ||
        (b.isbn && b.isbn.toLowerCase().includes(searchLower))
      );
    }
  );

  const confirmDelete = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete._id || bookToDelete.id);
      } catch (error) {
        console.error('Error deleting book:', error);
      }
      setBookToDelete(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Book Inventory</h2>
          <p className="text-xs text-slate-400">Total Books: {filteredBooks.length} titles</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-400 font-medium text-xs uppercase">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Cover</th>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Title & Author</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">ISBN</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBooks.map((book) => (
              <tr key={book._id || book.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-10 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-sm flex items-center justify-center">
                    {book.coverImages && book.coverImages.length > 0 ? (
                      <img src={book.coverImages[0]} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400 text-xs">📖</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-slate-400">{(book._id || book.id)?.slice(-6)}</td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-slate-800">{book.title}</div>
                  <div className="text-xs text-slate-400">{book.author}</div>
                </td>
                <td className="py-4 px-4">{book.category}</td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    {book.discount > 0 ? (
                      <>
                        <span className="font-bold text-emerald-600">
                          Rs. {((book.price || 0) * (1 - book.discount / 100)).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 line-through">Rs. {(book.price || 0).toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-white bg-rose-500 px-1.5 py-0.5 rounded">-{book.discount}%</span>
                        </div>
                      </>
                    ) : (
                      <span className="font-semibold text-amber-600">Rs. {(book.price || 0).toLocaleString()}</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 font-mono text-xs">{book.isbn || 'N/A'}</td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    book.available > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {book.available} / {book.copies}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {book.available > 0 ? (
                      <button
                        onClick={async () => {
                          const result = await purchaseBook(book._id || book.id, currentUser?.name || 'Customer');
                          if (result.success) {
                            addToast(`"${book.title}" sold successfully!`, 'success');
                          } else {
                            addToast(result.message || 'Checkout failed.', 'error');
                          }
                        }}
                        className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        Quick Sell
                      </button>
                    ) : (
                      <button
                        onClick={() => restockBook(book._id || book.id, book.copies)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        title="Restock this book"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        Restock (+{book.copies})
                      </button>
                    )}
                    {(!currentUser || currentUser.adminType === 'permanent' || book.addedBy === currentUser._id || book.addedBy === currentUser.id) && (
                      <>
                        <button
                          onClick={() => setBookToEdit(book)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-blue-200"
                          title="Edit Book Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBookToDelete(book)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-200"
                          title="Delete Book Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {bookToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setBookToDelete(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Confirm Deletion</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-800">"{bookToDelete.title}"</strong> from the inventory? This action cannot be undone.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setBookToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      <EditBookModal 
        isOpen={!!bookToEdit} 
        onClose={() => setBookToEdit(null)} 
        bookToEdit={bookToEdit} 
      />
    </div>
  );
}