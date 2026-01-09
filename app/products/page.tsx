import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { createServerClient } from "@/lib/supabase";
import { Product } from "@/types";

export const metadata: Metadata = {
  title: "Our Products - Gursimran Ayurvedic Clinic",
  description: "Browse our collection of authentic Ayurvedic products for health and wellness.",
};

async function getProducts(): Promise<Product[]> {
  try {
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'products/page.tsx:11',message:'Fetching products from Supabase',data:{supabaseUrl:process.env.NEXT_PUBLIC_SUPABASE_URL?process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0,20)+'...':'missing'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    // #endregion
    const supabase = createServerClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("created_at", { ascending: false });

    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'products/page.tsx:22',message:'Products fetch result',data:{productCount:products?.length||0,hasError:!!error,errorMessage:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    // #endregion

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    // Transform snake_case to camelCase
    return (products || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      detailed_description: product.detailed_description,
      price: product.price / 100, // Convert from paise to rupees
      image_url: product.image_url,
      image: product.image_url, // For backward compatibility
      in_stock: product.in_stock,
      inStock: product.in_stock, // For backward compatibility
      stock_quantity: product.stock_quantity,
      category: product.category,
      dosage: product.dosage,
      ingredients: product.ingredients,
      benefits: product.benefits,
      usage_instructions: product.usage_instructions,
      weight: product.weight,
      sku: product.sku,
      created_by: product.created_by,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-ayurveda-green mb-4">
            Our Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Authentic Ayurvedic products made with natural ingredients for your health and wellness.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
