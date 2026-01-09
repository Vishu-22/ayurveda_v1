"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductReview } from "@/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews?status=${filter === "all" ? "" : filter}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchReviews();
      } else {
        alert("Failed to update review status");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Error updating review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ayurveda-green/5 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">Loading reviews...</div>
        </div>
      </div>
    );
  }

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-ayurveda-green/5 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-ayurveda-green hover:text-ayurveda-green/80 transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>
        <h1 className="text-4xl font-serif font-bold text-ayurveda-green mb-8">
          Review Moderation
        </h1>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-4 font-semibold ${
                filter === "all"
                  ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                  : "text-gray-600 hover:text-ayurveda-green"
              } transition-colors`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-4 font-semibold relative ${
                filter === "pending"
                  ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                  : "text-gray-600 hover:text-ayurveda-green"
              } transition-colors`}
            >
              Pending ({pendingCount})
              {pendingCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-6 py-4 font-semibold ${
                filter === "approved"
                  ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                  : "text-gray-600 hover:text-ayurveda-green"
              } transition-colors`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-6 py-4 font-semibold ${
                filter === "rejected"
                  ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                  : "text-gray-600 hover:text-ayurveda-green"
              } transition-colors`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No reviews found for the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{review.user_name}</h3>
                        <span className="text-sm text-gray-500">{review.user_email}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            review.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : review.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {review.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating ? "text-ayurveda-gold" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
                      {review.created_at && (
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                      {review.admin_notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <strong>Admin Notes:</strong> {review.admin_notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {review.status === "pending" && (
                    <div className="flex gap-3 mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleStatusChange(review.id!, "approved")}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-semibold"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(review.id!, "rejected")}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-semibold"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
