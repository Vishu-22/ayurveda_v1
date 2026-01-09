"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";

export default function CartIcon() {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center p-2 text-gray-700 hover:text-ayurveda-green transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-ayurveda-green text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}
