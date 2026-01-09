export interface Product {
  id: string;
  name: string;
  description: string;
  detailed_description?: string;
  price: number; // Price in rupees (will be converted to paise for payments)
  image_url?: string;
  image?: string; // For backward compatibility
  images?: string[]; // Array of image URLs
  in_stock?: boolean;
  inStock?: boolean; // For backward compatibility
  stock_quantity?: number;
  category?: string;
  dosage?: string;
  ingredients?: string;
  benefits?: string;
  usage_instructions?: string;
  weight?: string;
  sku?: string;
  created_by?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
}

export interface Appointment {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
  status?: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt?: Date;
  read?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface ProductReview {
  id?: string;
  product_id: string;
  productId?: string; // For backward compatibility
  user_name: string;
  user_email: string;
  rating: number; // 1-5
  review_text: string;
  status?: "pending" | "approved" | "rejected";
  admin_notes?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  orderId?: string; // For backward compatibility
  product_id: string;
  productId?: string; // For backward compatibility
  quantity: number;
  price_at_purchase: number; // Price in paise
  product?: Product; // Populated product data
}

export interface Order {
  id?: string;
  payment_id?: string;
  paymentId?: string; // For backward compatibility
  razorpay_order_id?: string;
  order_id?: string; // For backward compatibility
  orderId?: string; // For backward compatibility
  amount: number; // Total amount in paise
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "failed" | "completed";
  items?: OrderItem[]; // For multi-item orders
  product_id?: string; // For legacy single-item orders
  productId?: string; // For backward compatibility with legacy orders
  created_at?: Date | string;
  createdAt?: Date | string; // For backward compatibility
  updated_at?: Date | string;
}

export interface ShiprocketOrder {
  id?: string;
  order_id: string;
  orderId?: string; // For backward compatibility
  shiprocket_order_id?: string;
  shiprocket_shipment_id?: string;
  tracking_url?: string;
  awb_code?: string;
  status?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface GalleryImage {
  id?: string;
  image_url: string;
  title?: string;
  description?: string;
  category?: string;
  display_order?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

