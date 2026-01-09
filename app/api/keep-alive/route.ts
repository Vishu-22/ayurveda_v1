import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * Keep-Alive API Endpoint
 * 
 * This endpoint is called by Vercel Cron Jobs to prevent Supabase
 * from pausing due to inactivity. It performs a simple database query
 * to keep the connection active.
 * 
 * Endpoint: GET /api/keep-alive
 * 
 * Returns:
 * - 200: Database is active
 * - 500: Database check failed
 */
export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Perform a simple query to keep database active
    // Using products table as it's always present
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .limit(1);
    
    if (error) {
      console.error("Keep-alive query error:", error);
      return NextResponse.json(
        { 
          status: "error", 
          message: "Database check failed",
          error: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: "active",
      message: "Database is active and responsive",
      timestamp: new Date().toISOString(),
      checked: true
    });
  } catch (error: any) {
    console.error("Keep-alive error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Failed to check database",
        error: error?.message || "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
