import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventTitle, eventType, eventDate, name, email, phone, seats, intakeNotes, ticketCode } = body;

    if (!eventTitle || !eventType || !eventDate || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    // 2. Create the EventBooking
    const booking = await prisma.eventBooking.create({
      data: {
        userId: user.id,
        eventTitle,
        eventType,
        eventDate,
        name,
        email,
        phone: phone || null,
        seats: seats ? parseInt(seats) : 1,
        intakeNotes: intakeNotes || null,
        ticketCode: ticketCode || null,
      },
    });

    // 3. Auto-login: Create Session cookie payload
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
    const sessionString = encodeURIComponent(JSON.stringify(sessionPayload));

    const response = NextResponse.json({
      success: true,
      bookingId: booking.id,
      user: sessionPayload,
    });

    // Set cookie (if not already set, or refresh it)
    response.headers.set(
      "Set-Cookie",
      `cake_by_lochi_session=${sessionString}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
    );

    return response;
  } catch (error: any) {
    console.error("Booking API error:", error);
    return NextResponse.json({ error: error.message || "Failed to process booking" }, { status: 500 });
  }
}
