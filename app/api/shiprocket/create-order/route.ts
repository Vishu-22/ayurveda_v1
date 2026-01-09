import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { orderId, items, customer_name, customer_email, customer_phone, shipping_address } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Basic Shiprocket integration
    // In production, you would:
    // 1. Authenticate with Shiprocket API
    // 2. Create order in Shiprocket
    // 3. Get tracking information
    // 4. Store Shiprocket order ID and tracking URL

    const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
    const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
    const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL || "https://apiv2.shiprocket.in/v1/external";

    if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
      console.warn("Shiprocket credentials not configured. Skipping order creation.");
      // Store placeholder data
      const supabase = createServerClient();
      await supabase.from("shiprocket_orders").insert({
        order_id: orderId,
        shiprocket_order_id: `SR_${Date.now()}`,
        status: "pending",
      });
      return NextResponse.json(
        { success: true, message: "Shiprocket not configured, order stored locally" },
        { status: 200 }
      );
    }

    // Authenticate with Shiprocket
    const authResponse = await fetch(`${SHIPROCKET_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      throw new Error("Shiprocket authentication failed");
    }

    const authData = await authResponse.json();
    const token = authData.token;

    // Create order in Shiprocket
    // Note: This is a simplified example. You'll need to format the order data
    // according to Shiprocket's API requirements
    const shiprocketOrder = {
      order_id: orderId,
      order_date: new Date().toISOString(),
      pickup_location: "Primary", // Configure in Shiprocket dashboard
      billing_customer_name: customer_name || "Customer",
      billing_last_name: "",
      billing_address: shipping_address || "",
      billing_address_2: "",
      billing_city: "City",
      billing_pincode: "000000",
      billing_state: "State",
      billing_country: "India",
      billing_email: customer_email || "",
      billing_phone: customer_phone || "",
      shipping_is_billing: true,
      order_items: items.map((item: any) => ({
        name: `Product ${item.productId}`,
        sku: item.productId,
        units: item.quantity || 1,
        selling_price: item.price || 0,
      })),
      payment_method: "Prepaid",
      sub_total: items.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const orderResponse = await fetch(`${SHIPROCKET_API_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shiprocketOrder),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error("Shiprocket order creation failed:", errorData);
      throw new Error("Failed to create Shiprocket order");
    }

    const shiprocketData = await orderResponse.json();

    // Store Shiprocket order information
    const supabase = createServerClient();
    await supabase.from("shiprocket_orders").insert({
      order_id: orderId,
      shiprocket_order_id: shiprocketData.order_id?.toString() || shiprocketData.id?.toString(),
      shiprocket_shipment_id: shiprocketData.shipment_id?.toString(),
      tracking_url: shiprocketData.tracking_url || shiprocketData.courier_tracking_url,
      awb_code: shiprocketData.awb_code,
      status: shiprocketData.status || "pending",
    });

    return NextResponse.json(
      { success: true, shiprocketOrder: shiprocketData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating Shiprocket order:", error);
    // Don't fail the main order if Shiprocket fails
    return NextResponse.json(
      { success: false, error: "Shiprocket order creation failed, but main order is saved" },
      { status: 200 }
    );
  }
}
