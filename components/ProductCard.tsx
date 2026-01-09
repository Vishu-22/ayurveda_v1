"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "./CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, isInCart } = useCart();
  const inStock = product.inStock ?? product.in_stock ?? true;

  const handleBuyNow = async () => {
    if (typeof window === "undefined") return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          amount: product.price * 100, // Convert to paise
        }),
      });

      const data = await response.json();
      
      if (!data.orderId) {
        throw new Error("Failed to create order");
      }

      // Wait for Razorpay to be loaded
      if (!(window as any).Razorpay) {
        alert("Payment gateway is loading. Please try again in a moment.");
        setIsLoading(false);
        return;
      }

      // Initialize Razorpay
      const Razorpay = (window as any).Razorpay;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: product.price * 100,
        currency: "INR",
        name: "Gursimran Ayurvedic Clinic",
        description: product.name,
        order_id: data.orderId,
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              productId: product.id,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            alert("Payment successful! Your order has been placed.");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#2d5016",
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-200 flex items-center justify-center relative overflow-hidden">
          {(() => {
            // Use first image from images array, fallback to image_url/image
            const primaryImage = (product.images && product.images.length > 0) 
              ? product.images[0] 
              : (product.image_url || product.image);
            
            return primaryImage ? (
              <>
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                {product.images && product.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    +{product.images.length - 1}
                  </div>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-sm">Product Image</span>
            );
          })()}
        </div>
      </Link>
      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xl font-semibold text-ayurveda-green mb-2 hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-ayurveda-green">
            ₹{product.price}
          </span>
          {inStock ? (
            <span className="text-sm text-green-600 font-semibold">In Stock</span>
          ) : (
            <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex-1 bg-white border-2 border-ayurveda-green text-ayurveda-green py-2 rounded-md hover:bg-ayurveda-green/5 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            <Plus size={18} />
            {isInCart(product.id) ? "In Cart" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!inStock || isLoading}
            className="flex-1 bg-ayurveda-green text-white py-2 rounded-md hover:bg-ayurveda-green/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            <ShoppingCart size={18} />
            {isLoading ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

