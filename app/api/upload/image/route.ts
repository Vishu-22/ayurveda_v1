import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const supabase = createServerClient();
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json(
        { error: "Failed to upload image", details: error.message },
        { status: 500 }
      );
    }

    // Get public URL - use the path from the upload response
    const filePath = data.path || fileName;
    
    // Get public URL from Supabase
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    // Construct public URL manually as fallback
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let publicUrl = urlData?.publicUrl;
    
    // If getPublicUrl doesn't return a valid URL, construct it manually
    if (!publicUrl || !publicUrl.includes('supabase.co')) {
      publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${filePath}`;
    }

    console.log("Uploaded file:", { fileName, filePath, publicUrl });

    return NextResponse.json(
      { 
        url: publicUrl,
        fileName: fileName,
        path: filePath,
        success: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in image upload:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
