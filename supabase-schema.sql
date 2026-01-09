-- Supabase Database Schema for Gursimran Ayurvedic Clinic Website
-- Run this SQL in your Supabase SQL Editor

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  service VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table (updated for multi-item orders)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id VARCHAR(255) NOT NULL,
  razorpay_order_id VARCHAR(255) NOT NULL UNIQUE,
  amount INTEGER NOT NULL, -- Total amount in paise
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  shipping_address TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table (for multi-item orders)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase INTEGER NOT NULL, -- Price in paise at time of purchase
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table (enhanced for e-commerce)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  detailed_description TEXT,
  price INTEGER NOT NULL, -- Price in paise
  image_url VARCHAR(500),
  images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  category VARCHAR(100),
  dosage VARCHAR(255),
  ingredients TEXT,
  benefits TEXT,
  usage_instructions TEXT,
  weight VARCHAR(50),
  sku VARCHAR(100) UNIQUE,
  created_by VARCHAR(255), -- Admin user email/ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table (optional - for dynamic testimonials)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Items Table (for server-side cart sync if needed later)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255), -- Can be session ID or user ID
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, session_id)
);

-- Shiprocket Orders Table
CREATE TABLE IF NOT EXISTS shiprocket_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  shiprocket_order_id VARCHAR(255) UNIQUE,
  shiprocket_shipment_id VARCHAR(255),
  tracking_url VARCHAR(500),
  awb_code VARCHAR(100),
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_status ON product_reviews(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_order_id ON shiprocket_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shiprocket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (insert only for contact/appointments)
-- Adjust these policies based on your security requirements

-- Contact Messages: Allow anyone to insert, but restrict reads
CREATE POLICY "Allow public insert on contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Appointments: Allow anyone to insert, but restrict reads
CREATE POLICY "Allow public insert on appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Orders: Allow anyone to insert, but restrict reads
CREATE POLICY "Allow public insert on orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Products: Allow public read access
CREATE POLICY "Allow public read on products"
  ON products FOR SELECT
  USING (true);

-- Gallery Images: Allow public read access
CREATE POLICY "Allow public read on gallery_images"
  ON gallery_images FOR SELECT
  USING (true);

-- Testimonials: Allow public read access
CREATE POLICY "Allow public read on testimonials"
  ON testimonials FOR SELECT
  USING (true);

-- Product Reviews: Allow public to insert and read approved reviews
CREATE POLICY "Allow public insert on product_reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read approved reviews"
  ON product_reviews FOR SELECT
  USING (status = 'approved');

-- Order Items: Allow public to insert (via orders)
CREATE POLICY "Allow public insert on order_items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Cart Items: Allow public to manage their own cart
CREATE POLICY "Allow public manage cart items"
  ON cart_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- Shiprocket Orders: Allow public to insert
CREATE POLICY "Allow public insert on shiprocket_orders"
  ON shiprocket_orders FOR INSERT
  WITH CHECK (true);

-- Note: For admin access, you'll need to create authenticated user policies
-- or use the service role key in your API routes (which bypasses RLS)
