import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { GalleryImage } from "@/types";

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

export async function POST(request: NextRequest) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { image_url, title, description, category, display_order } = body;

    // Validate required fields
    if (!image_url) {
      return NextResponse.json(
        { error: "image_url is required" },
        { status: 400 }
      );
    }

    // Insert new gallery image
    const { data, error } = await supabase
      .from("gallery_images")
      .insert({
        image_url,
        title: title || null,
        description: description || null,
        category: category || null,
        display_order: display_order || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating gallery image:", error);
      return NextResponse.json(
        { error: "Failed to create gallery image", details: error.message },
        { status: 500 }
      );
    }

    const galleryImage: GalleryImage = {
      id: data.id,
      image_url: data.image_url,
      title: data.title,
      description: data.description,
      category: data.category,
      display_order: data.display_order,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return NextResponse.json(
      { image: galleryImage, message: "Gallery image created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
