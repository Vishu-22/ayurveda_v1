import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { GalleryImage } from "@/types";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const supabase = createServerClient();
    const { id } = params;

    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching gallery image:", error);
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
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

    return NextResponse.json({ image: galleryImage }, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery image" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const supabase = createServerClient();
    const { id } = params;
    const body = await request.json();
    const { image_url, title, description, category, display_order } = body;

    // Build update object (only include provided fields)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (image_url !== undefined) updateData.image_url = image_url;
    if (title !== undefined) updateData.title = title || null;
    if (description !== undefined) updateData.description = description || null;
    if (category !== undefined) updateData.category = category || null;
    if (display_order !== undefined) updateData.display_order = display_order || 0;

    const { data, error } = await supabase
      .from("gallery_images")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating gallery image:", error);
      return NextResponse.json(
        { error: "Failed to update gallery image", details: error.message },
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
      { image: galleryImage, message: "Gallery image updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const supabase = createServerClient();
    const { id } = params;

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting gallery image:", error);
      return NextResponse.json(
        { error: "Failed to delete gallery image", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Gallery image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
