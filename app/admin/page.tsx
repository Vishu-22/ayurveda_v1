"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Appointment, ContactMessage, Order } from "@/types";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"appointments" | "messages" | "orders" | "products" | "reviews" | "gallery">("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if admin is already logged in
    const adminEmail = localStorage.getItem("adminEmail");
    if (adminEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication (in production, use proper auth)
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      localStorage.setItem("adminEmail", email);
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("Invalid credentials");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "appointments") {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        setAppointments(data.appointments || []);
      } else if (activeTab === "messages") {
        const res = await fetch("/api/contact");
        const data = await res.json();
        // Map created_at to createdAt for consistency
        const mappedMessages = (data.messages || []).map((msg: any) => ({
          ...msg,
          createdAt: msg.created_at || msg.createdAt,
        }));
        setMessages(mappedMessages);
      } else if (activeTab === "orders") {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ayurveda-green/5 to-white">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-serif font-bold text-ayurveda-green mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ayurveda-green"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ayurveda-green"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-ayurveda-green text-white py-3 rounded-md hover:bg-ayurveda-green/90 transition-colors font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ayurveda-green/5 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-ayurveda-green">
            Admin Dashboard
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("adminEmail");
              setIsAuthenticated(false);
              router.push("/");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b">
            <div className="flex flex-wrap">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`px-6 py-4 font-semibold ${
                  activeTab === "appointments"
                    ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                    : "text-gray-600 hover:text-ayurveda-green"
                } transition-colors`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`px-6 py-4 font-semibold ${
                  activeTab === "messages"
                    ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                    : "text-gray-600 hover:text-ayurveda-green"
                } transition-colors`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-6 py-4 font-semibold ${
                  activeTab === "orders"
                    ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                    : "text-gray-600 hover:text-ayurveda-green"
                } transition-colors`}
              >
                Orders
              </button>
              <Link
                href="/admin/products"
                className={`px-6 py-4 font-semibold ${
                  activeTab === "products"
                    ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                    : "text-gray-600 hover:text-ayurveda-green"
                } transition-colors`}
                onClick={() => setActiveTab("products")}
              >
                Products
              </Link>
              <Link
                href="/admin/reviews"
                className={`px-6 py-4 font-semibold ${
                  activeTab === "reviews"
                    ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                    : "text-gray-600 hover:text-ayurveda-green"
                } transition-colors`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </Link>
              <Link
                href="/admin/gallery"
                className={`px-6 py-4 font-semibold ${
                  activeTab === "gallery"
                    ? "border-b-2 border-ayurveda-green text-ayurveda-green"
                    : "text-gray-600 hover:text-ayurveda-green"
                } transition-colors`}
                onClick={() => setActiveTab("gallery")}
              >
                Gallery
              </Link>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <>
                {activeTab === "appointments" && (
                  <div className="space-y-4">
                    {appointments.length === 0 ? (
                      <p className="text-gray-500">No appointments found.</p>
                    ) : (
                      appointments.map((apt) => (
                        <div key={apt.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{apt.name}</h3>
                              <p className="text-gray-600">{apt.email} | {apt.phone}</p>
                              <p className="text-gray-600">{apt.service}</p>
                              <p className="text-sm text-gray-500">
                                {apt.date} at {apt.time}
                              </p>
                              {apt.message && (
                                <p className="mt-2 text-gray-700">{apt.message}</p>
                              )}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                apt.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : apt.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {apt.status || "pending"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "messages" && (
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-gray-500">No messages found.</p>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{msg.subject}</h3>
                            {(msg.createdAt || (msg as any).created_at) && (
                              <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                                {new Date((msg.createdAt || (msg as any).created_at) as string).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                {new Date((msg.createdAt || (msg as any).created_at) as string).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">{msg.name} | {msg.email} | {msg.phone}</p>
                          <p className="mt-2 text-gray-700">{msg.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "orders" && (
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <p className="text-gray-500">No orders found.</p>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">
                                Order #{order.orderId || order.order_id || order.id?.slice(0, 8)}
                              </h3>
                              {order.items && order.items.length > 0 ? (
                                <div className="space-y-2 mb-3">
                                  {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="text-sm text-gray-600">
                                      {item.product?.name || `Product ${item.productId}`} × {item.quantity} - ₹{(item.price_at_purchase / 100).toFixed(2)}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-600 mb-2">
                                  {order.productName || order.product_id || `Product ${order.productId || order.product_id || 'N/A'}`}
                                </p>
                              )}
                              {order.customer_name && (
                                <p className="text-gray-600 text-sm">
                                  Customer: {order.customer_name} ({order.customer_email})
                                </p>
                              )}
                              <p className="text-gray-600 text-sm">Payment ID: {order.paymentId || order.payment_id || 'N/A'}</p>
                              <p className="text-lg font-semibold text-ayurveda-green mt-2">
                                Total: ₹{(order.amount / 100).toFixed(2)}
                              </p>
                              {order.created_at && (
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ml-4 ${
                                order.status === "completed" || order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "failed" || order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status || "pending"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

