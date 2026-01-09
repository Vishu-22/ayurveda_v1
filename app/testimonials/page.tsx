import type { Metadata } from "next";
import TestimonialCard from "@/components/TestimonialCard";

export const metadata: Metadata = {
  title: "Testimonials - Gursimran Ayurvedic Clinic",
  description: "Read what our clients say about their experiences with our Ayurvedic treatments.",
};

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The Panchakarma therapy was life-changing. I feel rejuvenated and more balanced than ever. The practitioners are knowledgeable and caring.",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    text: "Excellent consultation and personalized treatment plan. My chronic back pain has significantly improved with their Ayurvedic approach.",
  },
  {
    id: 3,
    name: "Anita Patel",
    location: "Bangalore",
    rating: 5,
    text: "The Abhyanga massage is incredibly relaxing. I've been coming here monthly and always leave feeling refreshed and centered.",
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Pune",
    rating: 5,
    text: "Authentic Ayurvedic products and genuine care. The team really understands holistic wellness. Highly recommended!",
  },
  {
    id: 5,
    name: "Meera Desai",
    location: "Ahmedabad",
    rating: 5,
    text: "Shirodhara therapy helped me manage my stress and sleep better. The entire experience was peaceful and therapeutic.",
  },
  {
    id: 6,
    name: "Arjun Reddy",
    location: "Hyderabad",
    rating: 5,
    text: "Professional service with traditional values. The consultation was thorough, and the treatment plan was tailored to my needs.",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-ayurveda-green mb-4">
            Client Testimonials
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from our clients about their transformative wellness journeys.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}
