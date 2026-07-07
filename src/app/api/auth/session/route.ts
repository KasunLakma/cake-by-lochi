import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Check session status
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("cake_by_lochi_session="));

    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const cookieVal = sessionCookie.split("=")[1];
    const sessionPayload = JSON.parse(decodeURIComponent(cookieVal));

    return NextResponse.json({ user: sessionPayload });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}

// POST: Login / Passwordless email login
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find or automatically create a user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create user if not exists
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0], // Fallback name
        },
      });
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
    const sessionString = encodeURIComponent(JSON.stringify(sessionPayload));

    const response = NextResponse.json({ success: true, user: sessionPayload });

    // Set cookie
    response.headers.set(
      "Set-Cookie",
      `cake_by_lochi_session=${sessionString}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
    );

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 });
  }
}

// DELETE: Sign out
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    "cake_by_lochi_session=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );
  return response;
}
