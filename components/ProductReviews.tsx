"use client";

import { useState, useEffect } from "react";
import { ProductReview } from "@/types";
import ReviewCard from "./ReviewCard";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        
        // Calculate average rating
        if (data.reviews && data.reviews.length > 0) {
          const sum = data.reviews.reduce((acc: number, review: ProductReview) => acc + review.rating, 0);
          setAverageRating(sum / data.reviews.length);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-serif font-semibold text-ayurveda-green mb-2">
          Customer Reviews
        </h3>
        {reviews.length > 0 ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-ayurveda-green">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500 ml-2">out of 5</span>
            </div>
            <span className="text-gray-600">
              Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No approved reviews available.</p>
        </div>
      )}
    </div>
  );
}
