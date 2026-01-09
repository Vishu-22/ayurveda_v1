import { ProductReview } from "@/types";

interface ReviewCardProps {
  review: ProductReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-800">{review.user_name}</h4>
          <p className="text-sm text-gray-500">{review.user_email}</p>
        </div>
        <div className="flex items-center gap-1">
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
      </div>
      <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
      {review.created_at && (
        <p className="text-xs text-gray-500 mt-3">
          {new Date(review.created_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
