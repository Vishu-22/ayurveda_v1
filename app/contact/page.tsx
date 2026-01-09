import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - Gursimran Ayurvedic Clinic",
  description: "Get in touch with us for appointments, inquiries, or consultations.",
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-ayurveda-green mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We&apos;d love to hear from you. Reach out for appointments, questions, or consultations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-ayurveda-green mb-6">
              Get in Touch
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">📍 Address</h3>
                <p className="text-gray-600">
                  123 Wellness Street<br />
                  Ayurveda District<br />
                  City, State 123456<br />
                  India
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">📞 Phone</h3>
                <p className="text-gray-600">
                  +91 98765 43210<br />
                  +91 98765 43211
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">✉️ Email</h3>
                <p className="text-gray-600">
                  info@ayurvedawellness.com<br />
                  appointments@ayurvedawellness.com
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">🕐 Hours</h3>
                <p className="text-gray-600">
                  Monday - Saturday: 9:00 AM - 7:00 PM<br />
                  Sunday: 10:00 AM - 4:00 PM
                </p>
              </div>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
