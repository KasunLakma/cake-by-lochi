import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Query database using Prisma strictly matching Admin table entry
    const adminRecord = await prisma.admin.findUnique({
      where: { email },
    });

    if (!adminRecord) {
      return NextResponse.json(
        { error: "Access Denied. This terminal is strictly reserved for authorized administrators only." },
        { status: 403 }
      );
    }

    // Ensure User table also matches admin rights
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: adminRecord.name || email.split("@")[0],
          isAdmin: true,
        },
      });
    } else if (!user.isAdmin) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isAdmin: true },
      });
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      isAdmin: true,
    };
    const sessionString = encodeURIComponent(JSON.stringify(sessionPayload));

    const response = NextResponse.json({ success: true, user: sessionPayload });

    // Set secure admin session token cookie
    response.headers.set(
      "Set-Cookie",
      `cake_by_lochi_session=${sessionString}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
    );

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authorization failed" }, { status: 500 });
  }
}
