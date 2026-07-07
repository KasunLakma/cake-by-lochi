import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Verify admin session
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("cake_by_lochi_session="));

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieVal = sessionCookie.split("=")[1];
    const sessionPayload = JSON.parse(decodeURIComponent(cookieVal));
    
    const currentUser = await prisma.user.findUnique({
      where: { id: sessionPayload.userId },
    });

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const { email, isAdmin } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Toggle or create administrative credentials
    let targetUser = await prisma.user.findUnique({ where: { email } });
    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          isAdmin: Boolean(isAdmin),
        },
      });
    } else {
      targetUser = await prisma.user.update({
        where: { id: targetUser.id },
        data: { isAdmin: Boolean(isAdmin) },
      });
    }

    // Keep dedicated Admin table in sync
    if (isAdmin) {
      await prisma.admin.upsert({
        where: { email },
        update: { name: targetUser.name },
        create: { email, name: targetUser.name },
      });
    } else {
      await prisma.admin.deleteMany({
        where: { email },
      });
    }

    return NextResponse.json({ success: true, user: targetUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
