import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication (enhance in production)
    const { status, admin_notes } = await request.json();

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'approved', 'rejected', or 'pending'" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    const { data: updatedReview, error } = await supabase
      .from("product_reviews")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating review:", error);
      return NextResponse.json(
        { error: "Failed to update review" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { review: updatedReview, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
