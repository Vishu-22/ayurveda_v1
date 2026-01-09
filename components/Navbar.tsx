"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import CartIcon from "./CartIcon";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
    { href: "/gallery", label: "Gallery" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img 
                src="/logo.svg" 
                alt="Gursimran Ayurvedic Clinic Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  // Fallback to text logo if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 bg-ayurveda-green rounded-full flex items-center justify-center';
                  fallback.innerHTML = '<span class="text-white font-bold text-xl">G</span>';
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>
            <span className="text-xl md:text-2xl font-serif font-bold text-ayurveda-green">
              Gursimran Ayurvedic Clinic
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-ayurveda-green transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <CartIcon />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-ayurveda-green transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4">
              <Link
                href="/cart"
                className="block text-center text-gray-700 hover:text-ayurveda-green transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
