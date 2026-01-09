import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // This would typically require admin authentication
    const supabase = createServerClient();
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price_at_purchase,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase for frontend compatibility
    const transformedOrders = (orders || []).map((order: any) => ({
      id: order.id,
      payment_id: order.payment_id,
      paymentId: order.payment_id,
      razorpay_order_id: order.razorpay_order_id,
      order_id: order.razorpay_order_id,
      orderId: order.razorpay_order_id,
      amount: order.amount,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      shipping_address: order.shipping_address,
      status: order.status,
      created_at: order.created_at,
      createdAt: order.created_at,
      updated_at: order.updated_at,
      items: (order.order_items || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        productId: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
        product: item.products ? {
          id: item.products.id,
          name: item.products.name,
          image_url: item.products.image_url,
        } : null,
      })),
    }));

    return NextResponse.json({ orders: transformedOrders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

