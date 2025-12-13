"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, Star } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getAllReviews, deleteReview, type Review } from "@/lib/api/reviews";
import StarRating from "@/components/reviews/StarRating";

export default function AdminReviewsPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();

  const [reviews, setReviews] = useState<(Review & { product?: { id: string; title: string; slug: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllReviews({
        limit,
        offset: (page - 1) * limit,
        rating: ratingFilter !== "all" ? parseInt(ratingFilter) : undefined,
        sortBy: "newest",
      });

      if (response.success && response.data) {
        setReviews(response.data);
        if (response.pagination) {
          setTotal(response.pagination.total);
        }
      } else {
        setError(response.error || "Failed to load reviews");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchReviews();
    }
  }, [isAdmin, page, ratingFilter]);

  const handleDelete = async (reviewId: string, productId: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await deleteReview(reviewId, productId);
      if (response.success) {
        await fetchReviews(); // Refresh list
      } else {
        alert(response.error || "Failed to delete review");
      }
    } catch (err) {
      alert("An unexpected error occurred");
      console.error("Delete review error:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews Management</h1>
        <p className="text-gray-600">Manage all product reviews</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input-base pl-10"
              />
            </div>
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
            className="form-input-base"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-lg shadow-sm">
          {error}
        </div>
      )}

      {/* Reviews Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No reviews found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {(review as any).product?.title || "Unknown Product"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{review.user.name}</div>
                      <div className="text-sm text-gray-500">{review.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StarRating rating={review.rating} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md">
                        {review.comment ? (
                          <p className="line-clamp-2">{review.comment}</p>
                        ) : (
                          <span className="text-gray-400">No comment</span>
                        )}
                      </div>
                      {(review.variantSize || review.variantColor) && (
                        <div className="mt-1 flex gap-2">
                          {review.variantSize && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              Size: {review.variantSize}
                            </span>
                          )}
                          {review.variantColor && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              Color: {review.variantColor}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(review.id, review.productId)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {Math.ceil(total / limit) > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} reviews
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="form-button-secondary"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(Math.ceil(total / limit), p + 1))}
                  disabled={page >= Math.ceil(total / limit)}
                  className="form-button-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}






