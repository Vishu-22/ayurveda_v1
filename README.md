# Gursimran Ayurvedic Clinic Website

A professional, custom-coded Ayurvedic clinic website built with Next.js, featuring:

- 🏠 Informational pages (Home, About)
- 🛍️ Product showcase with e-commerce cart and Razorpay payments
- ⭐ Testimonials & gallery
- 📧 Contact forms
- 🔍 SEO optimized
- 📱 Mobile responsive
- 🔐 Admin dashboard (Products, Gallery, Reviews, Orders, Messages)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Payments**: Razorpay
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (for database)
- Razorpay account (for payments)

### Installation

1. **Clone or navigate to the project directory:**
```bash
cd ayurveda_v1
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up Supabase:**
   - Go to [Supabase](https://supabase.com/) and create a free account
   - Create a new project
   - Go to Project Settings → API
   - Copy your Project URL and anon/public key
   - Go to Project Settings → API → Service Role (for server-side operations)
   - Copy your service_role key (keep this secret!)
   - Go to SQL Editor and run the schema from `supabase-schema.sql`

4. **Set up Razorpay:**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Get your Key ID and Key Secret from Settings → API Keys

5. **Create environment variables:**
   Create a `.env.local` file in the root directory:
```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay Configuration (REQUIRED for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Shiprocket Configuration (Optional - for shipping)
SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_API_URL=https://apiv2.shiprocket.in/v1/external

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@ayurvedawellness.com
```

**Important:** Make sure to:
- Replace all placeholder values with your actual credentials
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- The `SUPABASE_SERVICE_ROLE_KEY` is required for server-side operations (API routes)

6. **Set up Supabase Storage:**
   - Go to your Supabase Dashboard → Storage
   - Create a new bucket named `product-images`
   - Set the bucket to **Public** (or configure RLS policies)
   - Add the following policy in SQL Editor for public read access:
   ```sql
   CREATE POLICY "Allow public read"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'product-images');
   ```
   - Add policy for authenticated uploads (if using auth):
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'product-images');
   ```

7. **Run the development server:**
```bash
npm run dev
```

8. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

9. **Set up Keep-Alive for Supabase (Important for Free Tier):**
   - See [VERCEL_CRON_SETUP.md](./VERCEL_CRON_SETUP.md) for detailed instructions
   - The keep-alive endpoint prevents Supabase from pausing after 7 days of inactivity
   - If deploying to Vercel, cron jobs are automatically configured via `vercel.json`

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (products, orders, payments, gallery, etc.)
│   ├── admin/             # Admin dashboard (products, gallery, reviews)
│   ├── about/             # About page
│   ├── products/          # Products page (with cart)
│   ├── gallery/           # Gallery page
│   ├── testimonials/      # Testimonials page
│   ├── contact/           # Contact page
│   └── cart/              # Shopping cart page
├── components/            # Reusable React components
├── lib/                   # Utilities and configurations
│   ├── supabase.ts       # Supabase client initialization
│   └── admin-auth.ts     # Admin authentication utilities
├── types/                 # TypeScript type definitions
├── public/                # Static assets (logo, images)
├── supabase-schema.sql   # Database schema for Supabase
├── vercel.json           # Vercel cron jobs configuration
└── VERCEL_CRON_SETUP.md  # Keep-alive setup documentation
```

## Features

- ✅ Modern, responsive design with Tailwind CSS
- ✅ SEO optimized with Next.js metadata
- ✅ Product catalog with shopping cart and Razorpay payment integration
- ✅ Product reviews system with admin moderation
- ✅ Gallery management with image upload
- ✅ Contact forms with validation
- ✅ Admin dashboard for managing products, gallery, reviews, orders, and messages
- ✅ Testimonials & gallery sections
- ✅ Mobile-first responsive design
- ✅ Keep-alive system for Supabase (prevents database pausing)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com/)
3. Add all environment variables in Vercel dashboard (including Supabase and Razorpay keys)
4. Deploy!

### Supabase Setup for Production

1. Review and adjust Row Level Security (RLS) policies in Supabase dashboard
2. Set up proper authentication if needed (currently using simple email check for admin)
3. Consider using Supabase Auth for better security
4. Monitor your database usage in Supabase dashboard

## Admin Dashboard

Access the admin dashboard at `/admin` with the email configured in `NEXT_PUBLIC_ADMIN_EMAIL`.

**Note**: For production, implement proper authentication (e.g., Supabase Auth or NextAuth.js) instead of simple email check.

## Customization

- **Colors**: Edit `tailwind.config.ts` to customize the color scheme
- **Content**: Update pages in `app/` directory
- **Products**: Manage products through the admin dashboard at `/admin/products`
- **Gallery**: Manage gallery images through the admin dashboard at `/admin/gallery`
- **Logo**: Replace `/public/logo.svg` with your own logo file

## Support

For issues or questions, please check the documentation or create an issue in the repository.

