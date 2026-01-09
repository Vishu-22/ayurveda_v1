import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { Appointment } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const data: Appointment = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.service || !data.date || !data.time) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check for existing appointments at the same time
    const { data: existingAppointments, error: checkError } = await supabase
      .from("appointments")
      .select("*")
      .eq("date", data.date)
      .eq("time", data.time)
      .neq("status", "cancelled");

    if (checkError) {
      console.error("Error checking appointments:", checkError);
      return NextResponse.json(
        { error: "Failed to check appointment availability" },
        { status: 500 }
      );
    }

    if (existingAppointments && existingAppointments.length > 0) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose another time." },
        { status: 409 }
      );
    }

    // Save to Supabase
    const { data: insertedData, error } = await supabase
      .from("appointments")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        date: data.date,
        time: data.time,
        message: data.message || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving appointment:", error);
      return NextResponse.json(
        { error: "Failed to save appointment" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, id: insertedData.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving appointment:", error);
    return NextResponse.json(
      { error: "Failed to save appointment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This would typically require admin authentication
    const supabase = createServerClient();
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching appointments:", error);
      return NextResponse.json(
        { error: "Failed to fetch appointments" },
        { status: 500 }
      );
    }

    return NextResponse.json({ appointments: appointments || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

