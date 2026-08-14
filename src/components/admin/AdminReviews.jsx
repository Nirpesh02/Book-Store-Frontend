import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import StarRating from '../common/StarRating';
import { MessageSquare, Star, Trash2 } from 'lucide-react';

export default function AdminReviews() {
  const { reviews, books, searchQuery, deleteReview } = useLibrary();

  const filteredReviews = reviews.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      books.find((b) => (b._id || b.id) === r.bookId)?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-2xl">
            <MessageSquare className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-800">{totalReviews}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-2xl">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-800">{avgRating}</p>
              <StarRating rating={Number(avgRating)} size="sm" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-2xl">
            <Star className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">5-Star Reviews</p>
            <p className="text-2xl font-bold text-slate-800">{fiveStarCount}</p>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Customer Reviews</h2>
            <p className="text-xs text-slate-400">All customer ratings & feedback across the store</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
            {filteredReviews.length} Reviews
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-medium text-xs uppercase">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Book</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.map((review) => {
                const book = books.find((b) => (b._id || b.id) === review.bookId);
                return (
                  <tr key={review._id || review.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          {book?.coverImages && book.coverImages.length > 0 ? (
                            <img src={book.coverImages[0]} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="flex items-center justify-center w-full h-full text-xs">📖</span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-800 text-xs">{book?.title || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{review.customerName}</td>
                    <td className="py-3.5 px-4">
                      <StarRating rating={review.rating} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-xs text-slate-500 line-clamp-2 max-w-xs">{review.comment}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{review.date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteReview(review._id || review.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            No reviews found.
          </div>
        )}
      </div>
    </div>
  );
}
