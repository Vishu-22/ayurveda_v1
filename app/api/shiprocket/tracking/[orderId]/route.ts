import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface RouteParams {
  params: {
    orderId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerClient();
    const { data: shiprocketOrder, error } = await supabase
      .from("shiprocket_orders")
      .select("*")
      .eq("order_id", params.orderId)
      .single();

    if (error || !shiprocketOrder) {
      return NextResponse.json(
        { error: "Tracking information not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        tracking_url: shiprocketOrder.tracking_url,
        awb_code: shiprocketOrder.awb_code,
        status: shiprocketOrder.status,
        shiprocket_order_id: shiprocketOrder.shiprocket_order_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracking information" },
      { status: 500 }
    );
  }
}
