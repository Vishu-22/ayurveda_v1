import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Services - Gursimran Ayurvedic Clinic",
  description: "Explore our range of Ayurvedic treatments and wellness services.",
};

const services = [
  {
    id: 1,
    name: "Panchakarma Therapy",
    description: "A comprehensive detoxification and rejuvenation program that cleanses the body of toxins and restores balance.",
    duration: "7-21 days",
    price: "Starting from ₹15,000",
  },
  {
    id: 2,
    name: "Abhyanga Massage",
    description: "Traditional full-body oil massage that promotes relaxation, improves circulation, and nourishes the skin.",
    duration: "60-90 minutes",
    price: "₹2,500",
  },
  {
    id: 3,
    name: "Shirodhara",
    description: "A deeply relaxing therapy where warm herbal oil is poured over the forehead, calming the mind and nervous system.",
    duration: "45 minutes",
    price: "₹3,500",
  },
  {
    id: 4,
    name: "Ayurvedic Consultation",
    description: "Comprehensive health assessment including dosha analysis, lifestyle recommendations, and personalized treatment plans.",
    duration: "60 minutes",
    price: "₹1,500",
  },
  {
    id: 5,
    name: "Herbal Steam Bath",
    description: "Therapeutic steam treatment using medicinal herbs to open pores, detoxify, and improve skin health.",
    duration: "30 minutes",
    price: "₹1,800",
  },
  {
    id: 6,
    name: "Nasya Therapy",
    description: "Nasal administration of medicated oils to treat sinus issues, headaches, and improve mental clarity.",
    duration: "20 minutes",
    price: "₹2,000",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-ayurveda-green mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our range of authentic Ayurvedic treatments designed to restore balance and promote wellness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-2xl font-serif font-semibold text-ayurveda-green mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <span>⏱️ {service.duration}</span>
                  <span className="font-semibold text-ayurveda-green">{service.price}</span>
                </div>
                <Link
                  href="/appointment"
                  className="block w-full text-center bg-ayurveda-green text-white py-2 rounded-md hover:bg-ayurveda-green/90 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-serif font-semibold text-ayurveda-green mb-4">
            Customized Treatment Plans
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We offer personalized treatment packages tailored to your specific health needs and wellness goals. 
            Contact us to discuss a customized plan.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-ayurveda-gold text-white px-8 py-3 rounded-md hover:bg-ayurveda-gold/90 transition-colors font-semibold"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
