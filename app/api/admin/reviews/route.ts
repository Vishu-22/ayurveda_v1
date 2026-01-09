import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication (enhance in production)
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const supabase = createServerClient();
    let query = supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase
    const transformedReviews = (reviews || []).map((review: any) => ({
      id: review.id,
      product_id: review.product_id,
      productId: review.product_id,
      user_name: review.user_name,
      user_email: review.user_email,
      rating: review.rating,
      review_text: review.review_text,
      status: review.status,
      admin_notes: review.admin_notes,
      created_at: review.created_at,
      updated_at: review.updated_at,
    }));

    return NextResponse.json({ reviews: transformedReviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
