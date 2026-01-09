import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Product } from "@/types";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const data: any = await request.json();

    const supabase = createServerClient();
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.detailed_description !== undefined) updateData.detailed_description = data.detailed_description;
    if (data.price !== undefined) updateData.price = Math.round(data.price * 100);
    
    // Handle images array
    if (data.images !== undefined && Array.isArray(data.images)) {
      updateData.images = data.images;
      // Set image_url to first image from array if array is not empty
      updateData.image_url = data.images.length > 0 ? data.images[0] : null;
    } else if (data.image_url !== undefined || data.image !== undefined) {
      updateData.image_url = data.image_url || data.image;
    }
    
    if (data.inStock !== undefined || data.in_stock !== undefined) {
      updateData.in_stock = data.inStock ?? data.in_stock;
    }
    if (data.stock_quantity !== undefined) updateData.stock_quantity = data.stock_quantity;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.dosage !== undefined) updateData.dosage = data.dosage;
    if (data.ingredients !== undefined) updateData.ingredients = data.ingredients;
    if (data.benefits !== undefined) updateData.benefits = data.benefits;
    if (data.usage_instructions !== undefined) updateData.usage_instructions = data.usage_instructions;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.sku !== undefined) updateData.sku = data.sku;

    updateData.updated_at = new Date().toISOString();

    const { data: updatedProduct, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { product: updatedProduct, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("products").delete().eq("id", params.id);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
