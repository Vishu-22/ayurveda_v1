import { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-gradient-to-br from-ayurveda-green/5 to-white p-6 rounded-lg shadow-md">
      <div className="flex mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i} className="text-ayurveda-gold text-xl">⭐</span>
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic leading-relaxed">
        &quot;{testimonial.text}&quot;
      </p>
      <div className="border-t pt-4">
        <p className="font-semibold text-ayurveda-green">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.location}</p>
      </div>
    </div>
  );
}
