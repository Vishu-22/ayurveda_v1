import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { Product } from "@/types";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerClient();
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

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
    
    // Transform snake_case to camelCase
    const transformedProduct: Product = {
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

    return NextResponse.json(transformedProduct, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT and DELETE methods removed - product updates/deletion are only allowed through /api/admin/products/[id]
