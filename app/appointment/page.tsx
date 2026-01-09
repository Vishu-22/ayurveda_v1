import type { Metadata } from "next";
import AppointmentForm from "@/components/AppointmentForm";

export const metadata: Metadata = {
  title: "Book Appointment - Gursimran Ayurvedic Clinic",
  description: "Schedule your Ayurvedic consultation or treatment appointment.",
};

export default function AppointmentPage() {
  return (
    <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-ayurveda-green mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schedule a consultation or treatment session with our Ayurvedic practitioners.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <AppointmentForm />
        </div>
      </div>
    </div>
  );
}
