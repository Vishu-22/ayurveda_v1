import Link from "next/link";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The Panchakarma therapy was life-changing. I feel rejuvenated and more balanced than ever.",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    text: "Excellent consultation and personalized treatment plan. My chronic back pain has significantly improved.",
  },
  {
    id: 3,
    name: "Anita Patel",
    location: "Bangalore",
    rating: 5,
    text: "The Abhyanga massage is incredibly relaxing. I've been coming here monthly and always leave feeling refreshed.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-ayurveda-green mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from people who have transformed their wellness journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/testimonials"
            className="inline-block bg-ayurveda-green text-white px-8 py-3 rounded-md hover:bg-ayurveda-green/90 transition-colors font-semibold"
          >
            Read More Testimonials
          </Link>
        </div>
      </div>
    </section>
  );
}
