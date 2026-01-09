import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { ProductReview } from "@/types";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerClient();
    const { data: reviews, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", params.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

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

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const data: Omit<ProductReview, "id" | "created_at" | "updated_at"> = await request.json();

    if (!data.user_name || !data.user_email || !data.rating || !data.review_text) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data: insertedReview, error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: params.id,
        user_name: data.user_name,
        user_email: data.user_email,
        rating: data.rating,
        review_text: data.review_text,
        status: "pending", // All reviews start as pending
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      return NextResponse.json(
        { error: "Failed to submit review" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { review: insertedReview, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
