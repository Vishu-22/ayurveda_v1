"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = getTotalPrice();
  const itemCount = getTotalItems();
  const shipping = totalPrice > 1000 ? 0 : 50; // Free shipping over ₹1000
  const tax = totalPrice * 0.18; // 18% GST
  const finalTotal = totalPrice + shipping + tax;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:28',message:'Checkout initiated',data:{cartItemCount:cartItems.length,totalPrice,finalTotal,shipping,tax},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    setIsProcessing(true);
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: finalTotal * 100, // Convert to paise
      };
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:37',message:'Creating order via API',data:{itemsCount:orderPayload.items.length,totalAmount:orderPayload.totalAmount,items:orderPayload.items},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      // Create order with all cart items
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:47',message:'Order creation API response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      const data = await response.json();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:49',message:'Order creation response data',data:{orderId:data.orderId,amount:data.amount,error:data.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:49',message:'Checking Razorpay availability',data:{hasOrderId:!!data.orderId,hasWindow:typeof window !== "undefined",hasRazorpay:!!(typeof window !== "undefined" && (window as any).Razorpay)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion

      if (data.orderId && typeof window !== "undefined" && (window as any).Razorpay) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:50',message:'Razorpay available, initializing payment',data:{orderId:data.orderId,razorpayKey:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.substring(0,10)+'...':'missing'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        const Razorpay = (window as any).Razorpay;
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: finalTotal * 100,
          currency: "INR",
          name: "Gursimran Ayurvedic Clinic",
          description: `Order for ${itemCount} item(s)`,
          order_id: data.orderId,
          handler: async (response: any) => {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:58',message:'Payment handler called',data:{paymentId:response.razorpay_payment_id,orderId:data.orderId,hasSignature:!!response.razorpay_signature},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
            // Verify payment
            const verifyPayload = {
              orderId: data.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            };
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:60',message:'Sending payment verification request',data:{orderId:verifyPayload.orderId,paymentId:verifyPayload.paymentId,itemsCount:verifyPayload.items.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(verifyPayload),
            });

            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:73',message:'Payment verification response received',data:{status:verifyResponse.status,ok:verifyResponse.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion

            const verifyData = await verifyResponse.json();
            
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:75',message:'Payment verification result',data:{success:verifyData.success,error:verifyData.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion

            if (verifyData.success) {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:76',message:'Payment verified successfully, clearing cart and redirecting',data:{cartCleared:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
              // #endregion
              clearCart();
              router.push(`/products?orderSuccess=true`);
            } else {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.tsx:80',message:'Payment verification failed',data:{error:verifyData.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
              // #endregion
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
          setIsProcessing(false);
        });
        razorpay.open();
        setIsProcessing(false);
      } else {
        throw new Error("Payment gateway not available");
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      alert("Error processing checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag size={96} className="mx-auto text-gray-400 mb-6" />
            <h1 className="text-4xl font-serif font-bold text-ayurveda-green mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-ayurveda-green text-white px-8 py-3 rounded-md font-semibold hover:bg-ayurveda-green/90 transition-colors"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-ayurveda-green mb-8">
            Shopping Cart
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-6"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.productId}`}
                    className="w-32 h-32 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center"
                  >
                    {item.product.image_url || item.product.image ? (
                      <img
                        src={item.product.image_url || item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-xl font-semibold text-ayurveda-green hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {item.product.description}
                      </p>
                    )}
                    <p className="text-lg font-bold text-ayurveda-green mt-2">
                      ₹{item.product.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center gap-2 border rounded">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="text-lg font-semibold mt-4">
                      Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-serif font-semibold text-ayurveda-green mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-ayurveda-green">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full bg-ayurveda-green text-white py-3 rounded-md font-semibold hover:bg-ayurveda-green/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Proceed to Checkout"}
                </button>

                <Link
                  href="/products"
                  className="block text-center text-ayurveda-green hover:underline mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
