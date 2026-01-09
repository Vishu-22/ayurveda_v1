import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Gursimran Ayurvedic Clinic",
  description: "Learn about our mission, values, and commitment to authentic Ayurvedic healing.",
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-ayurveda-green/5 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-ayurveda-green mb-8 text-center">
            About Gursimran Ayurvedic Clinic
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-serif text-ayurveda-green mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At Gursimran Ayurvedic Clinic, we are dedicated to bringing the ancient wisdom of Ayurveda 
                to modern life. Our mission is to provide authentic, personalized healing experiences 
                that restore balance and promote holistic well-being.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe that true wellness comes from understanding the unique constitution of 
                each individual and providing treatments that align with nature's rhythms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-ayurveda-green mb-4">What is Ayurveda?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ayurveda, the "science of life," is a 5,000-year-old healing system from India. 
                It emphasizes the balance between mind, body, and spirit through natural remedies, 
                dietary practices, and lifestyle modifications.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our practitioners are trained in traditional Ayurvedic principles and combine 
                this ancient knowledge with modern understanding to provide comprehensive care.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-ayurveda-green mb-4">Our Approach</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-ayurveda-green mb-2">Personalized Care</h3>
                  <p className="text-gray-600">
                    Every treatment is tailored to your unique constitution (dosha) and health needs.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-ayurveda-green mb-2">Natural Remedies</h3>
                  <p className="text-gray-600">
                    We use only authentic, natural ingredients sourced from trusted suppliers.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-ayurveda-green mb-2">Holistic Healing</h3>
                  <p className="text-gray-600">
                    We address the root cause, not just symptoms, for lasting wellness.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-serif text-ayurveda-green mb-4">Our Team</h2>
              <p className="text-gray-700 leading-relaxed">
                Our team consists of certified Ayurvedic practitioners with years of experience 
                in traditional healing practices. We are committed to continuous learning and 
                staying true to authentic Ayurvedic principles while adapting to modern needs.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
