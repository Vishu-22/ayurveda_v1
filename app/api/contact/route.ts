import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { ContactMessage } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const data: ContactMessage = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.subject || !data.message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to Supabase
    const supabase = createServerClient();
    const { data: insertedData, error } = await supabase
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving contact message:", error);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, id: insertedData.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This would typically require admin authentication
    const supabase = createServerClient();
    const { data: messages, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: messages || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
