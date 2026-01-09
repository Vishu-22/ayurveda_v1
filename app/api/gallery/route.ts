import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { GalleryImage } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data: images, error } = await query;

    if (error) {
      console.error("Error fetching gallery images:", error);
      return NextResponse.json(
        { error: "Failed to fetch gallery images" },
        { status: 500 }
      );
    }

    // Transform to GalleryImage format
    const transformedImages: GalleryImage[] = (images || []).map((img: any) => ({
      id: img.id,
      image_url: img.image_url,
      title: img.title,
      description: img.description,
      category: img.category,
      display_order: img.display_order,
      created_at: img.created_at,
      updated_at: img.updated_at,
    }));

    return NextResponse.json({ images: transformedImages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}
