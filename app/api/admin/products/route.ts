import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Product } from "@/types";

export async function GET(request: NextRequest) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const supabase = createServerClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products for admin:", error);
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
    console.error("Error in GET /api/admin/products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const data: any = await request.json();

    if (!data.name || !data.price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    // Handle images array
    const imagesArray = data.images && Array.isArray(data.images) ? data.images : [];
    // Set image_url to first image from array if provided, otherwise use image_url/image
    const primaryImage = imagesArray.length > 0 
      ? imagesArray[0] 
      : (data.image_url || data.image || null);

    const supabase = createServerClient();
    const { data: insertedData, error } = await supabase
      .from("products")
      .insert({
        name: data.name,
        description: data.description || null,
        detailed_description: data.detailed_description || null,
        price: Math.round(data.price * 100), // Convert to paise
        image_url: primaryImage,
        images: imagesArray.length > 0 ? imagesArray : [],
        in_stock: data.inStock ?? data.in_stock ?? true,
        stock_quantity: data.stock_quantity || 0,
        category: data.category || null,
        dosage: data.dosage || null,
        ingredients: data.ingredients || null,
        benefits: data.benefits || null,
        usage_instructions: data.usage_instructions || null,
        weight: data.weight || null,
        sku: data.sku || null,
        // created_by: data.created_by || null, // Removed - column may not exist in database
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      // Return more detailed error for debugging
      return NextResponse.json(
        { 
          error: "Failed to create product",
          details: error.message,
          code: error.code 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { product: insertedData, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
