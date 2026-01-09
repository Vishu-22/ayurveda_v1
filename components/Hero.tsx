import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-ayurveda-green to-ayurveda-green/80 text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Discover the Power of
            <span className="text-ayurveda-gold"> Ancient Ayurveda</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-50 leading-relaxed">
            Experience authentic Ayurvedic treatments and natural wellness solutions 
            for a balanced, healthy life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="bg-ayurveda-gold text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-ayurveda-gold/90 transition-colors text-center"
            >
              Shop Products
            </Link>
            <Link
              href="/contact"
              className="bg-white text-ayurveda-green px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
