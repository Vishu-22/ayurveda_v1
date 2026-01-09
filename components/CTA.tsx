import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-ayurveda-green to-ayurveda-green/80 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          Ready to Begin Your Wellness Journey?
        </h2>
        <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
          Book a consultation today and discover how Ayurveda can transform your health and well-being.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/appointment"
            className="bg-ayurveda-gold text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-ayurveda-gold/90 transition-colors"
          >
            Book Appointment
          </Link>
          <Link
            href="/contact"
            className="bg-white text-ayurveda-green px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
