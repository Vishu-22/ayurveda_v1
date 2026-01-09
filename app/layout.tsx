import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Gursimran Ayurvedic Clinic - Traditional Healing & Modern Wellness",
  description: "Experience authentic Ayurvedic treatments, natural products, and holistic wellness consultations. Book your appointment today.",
  keywords: "ayurveda, wellness, natural healing, ayurvedic treatments, consultation",
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/logo.svg',
  },
  openGraph: {
    title: "Gursimran Ayurvedic Clinic - Traditional Healing & Modern Wellness",
    description: "Experience authentic Ayurvedic treatments, natural products, and holistic wellness consultations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

