import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { Product } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const inStock = searchParams.get("in_stock");

    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    if (inStock === "true") {
      query = query.eq("in_stock", true);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase for frontend
    const transformedProducts = (products || []).map((product: any) => {
      // Parse images JSONB array
      let imagesArray: string[] = [];
      if (product.images) {
        try {
          imagesArray = Array.isArray(product.images) ? product.images : JSON.parse(product.images);
        } catch {
          imagesArray = [];
        }
      }
      
      // Use first image from array as image_url if image_url is not set
      const primaryImage = product.image_url || (imagesArray.length > 0 ? imagesArray[0] : null);
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        detailed_description: product.detailed_description,
        price: product.price / 100, // Convert from paise to rupees
        image_url: primaryImage,
        image: primaryImage, // For backward compatibility
        images: imagesArray,
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
      };
    });

    return NextResponse.json({ products: transformedProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST method removed - product creation is only allowed through /api/admin/products
