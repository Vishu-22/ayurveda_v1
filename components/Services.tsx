import Link from "next/link";

const services = [
  {
    name: "Panchakarma",
    description: "Complete detoxification and rejuvenation",
    icon: "🌿",
  },
  {
    name: "Abhyanga",
    description: "Traditional oil massage therapy",
    icon: "💆",
  },
  {
    name: "Consultation",
    description: "Personalized health assessment",
    icon: "👨‍⚕️",
  },
  {
    name: "Shirodhara",
    description: "Deep relaxation therapy",
    icon: "🧘",
  },
];

export default function Services() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-ayurveda-green mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Authentic Ayurvedic treatments tailored to your wellness needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-ayurveda-green/5 to-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-ayurveda-green mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/services"
            className="inline-block bg-ayurveda-green text-white px-8 py-3 rounded-md hover:bg-ayurveda-green/90 transition-colors font-semibold"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
