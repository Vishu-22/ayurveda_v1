"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const reviewSchema = z.object({
  user_name: z.string().min(2, "Name must be at least 2 characters"),
  user_email: z.string().email("Invalid email address"),
  rating: z.number().min(1).max(5),
  review_text: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
        if (onSuccess) {
          onSuccess();
        }
        // Reload page after 2 seconds to show new review (pending approval)
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-semibold text-ayurveda-green mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              id="user_name"
              {...register("user_name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ayurveda-green focus:border-transparent"
            />
            {errors.user_name && (
              <p className="text-red-500 text-sm mt-1">{errors.user_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">
              Your Email *
            </label>
            <input
              type="email"
              id="user_email"
              {...register("user_email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ayurveda-green focus:border-transparent"
            />
            {errors.user_email && (
              <p className="text-red-500 text-sm mt-1">{errors.user_email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating *
          </label>
          <select
            id="rating"
            {...register("rating", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ayurveda-green focus:border-transparent"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Very Good</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Fair</option>
            <option value={1}>1 - Poor</option>
          </select>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="review_text" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review *
          </label>
          <textarea
            id="review_text"
            rows={5}
            {...register("review_text")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ayurveda-green focus:border-transparent"
            placeholder="Share your experience with this product..."
          />
          {errors.review_text && (
            <p className="text-red-500 text-sm mt-1">{errors.review_text.message}</p>
          )}
        </div>

        {submitStatus === "success" && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Thank you! Your review has been submitted and is pending approval.
          </div>
        )}

        {submitStatus === "error" && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Something went wrong. Please try again later.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-ayurveda-green text-white py-3 rounded-md hover:bg-ayurveda-green/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
