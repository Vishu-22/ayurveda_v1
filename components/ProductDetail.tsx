"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus, Star, Package, Weight, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, ProductReview } from "@/types";
import { useCart } from "./CartContext";
import ProductReviews from "./ProductReviews";
import ReviewForm from "./ReviewForm";

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const router = useRouter();
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        router.push("/products");
        return;
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          amount: product.price * quantity * 100, // Convert to paise
        }),
      });

      const data = await response.json();

      if (!data.orderId) {
        throw new Error("Failed to create order");
      }

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const Razorpay = (window as any).Razorpay;
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: product.price * quantity * 100,
          currency: "INR",
          name: "Gursimran Ayurvedic Clinic",
          description: `${product.name} (Qty: ${quantity})`,
          order_id: data.orderId,
          handler: async (response: any) => {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                productId: product.id,
                quantity,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              alert("Payment successful! Your order has been placed.");
              router.push("/products");
            } else {
              alert("Payment verification failed.");
            }
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
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ayurveda-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <button
            onClick={() => router.push("/products")}
            className="text-ayurveda-green hover:underline"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const inStock = product.inStock ?? product.in_stock ?? true;
  
  // Get all available images
  const allImages = (product.images && product.images.length > 0) 
    ? product.images 
    : (product.image_url || product.image ? [product.image_url || product.image] : []);
  
  const currentImage = allImages[selectedImageIndex] || null;

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Product Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 flex items-center justify-center relative">
                {currentImage ? (
                  <>
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect fill='%23e5e7eb' width='600' height='600'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage Not Available%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {selectedImageIndex + 1} / {allImages.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">No Image Available</span>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                          selectedImageIndex === index
                            ? "border-ayurveda-green ring-2 ring-ayurveda-green/50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e5e7eb' width='80' height='80'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='10' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Img%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-serif font-bold text-ayurveda-green mb-4">
                {product.name}
              </h1>

              {product.category && (
                <p className="text-gray-600 mb-4">Category: {product.category}</p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-ayurveda-green">
                  ₹{product.price}
                </span>
                {inStock ? (
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle size={20} />
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>

              {product.description && (
                <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
              )}

              {/* Product Details */}
              <div className="space-y-3 mb-6">
                {product.dosage && (
                  <div className="flex items-start gap-3">
                    <Package size={20} className="text-ayurveda-green mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Dosage:</p>
                      <p className="text-gray-600">{product.dosage}</p>
                    </div>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-start gap-3">
                    <Weight size={20} className="text-ayurveda-green mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Weight:</p>
                      <p className="text-gray-600">{product.weight}</p>
                    </div>
                  </div>
                )}
                {product.sku && (
                  <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 bg-white border-2 border-ayurveda-green text-ayurveda-green py-3 rounded-md hover:bg-ayurveda-green/5 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock || isProcessing}
                  className="flex-1 bg-ayurveda-green text-white py-3 rounded-md hover:bg-ayurveda-green/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                >
                  <ShoppingCart size={20} />
                  {isProcessing ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-4 font-semibold ${
                    activeTab === "description"
                      ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                      : "text-gray-600 hover:text-ayurveda-green"
                  } transition-colors`}
                >
                  Description
                </button>
                <button
                  onClick={() => {
                    setActiveTab("reviews");
                    setShowReviewForm(false); // Reset form visibility when switching to reviews tab
                  }}
                  className={`px-6 py-4 font-semibold ${
                    activeTab === "reviews"
                      ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                      : "text-gray-600 hover:text-ayurveda-green"
                  } transition-colors`}
                >
                  Reviews
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="space-y-6">
                  {product.detailed_description && (
                    <div>
                      <h3 className="text-xl font-semibold text-ayurveda-green mb-3">
                        Detailed Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {product.detailed_description}
                      </p>
                    </div>
                  )}

                  {product.ingredients && (
                    <div>
                      <h3 className="text-xl font-semibold text-ayurveda-green mb-3">
                        Ingredients
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {product.ingredients}
                      </p>
                    </div>
                  )}

                  {product.benefits && (
                    <div>
                      <h3 className="text-xl font-semibold text-ayurveda-green mb-3">
                        Benefits
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {product.benefits}
                      </p>
                    </div>
                  )}

                  {product.usage_instructions && (
                    <div>
                      <h3 className="text-xl font-semibold text-ayurveda-green mb-3">
                        Usage Instructions
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {product.usage_instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <ProductReviews productId={productId} />
                  {!showReviewForm ? (
                    <div className="border-t pt-6 mt-6">
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="w-full bg-ayurveda-green text-white px-6 py-3 rounded-md hover:bg-ayurveda-green/90 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Write a Review
                      </button>
                    </div>
                  ) : (
                    <div className="border-t pt-6 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-ayurveda-green">Write Your Review</h3>
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Cancel review"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <ReviewForm 
                        productId={productId} 
                        onSuccess={() => {
                          setShowReviewForm(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
