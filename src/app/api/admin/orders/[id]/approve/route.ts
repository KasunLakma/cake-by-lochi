import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
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

    const { id } = await params;

    // 2. Set Delivery status to SHIPPED
    await prisma.deliveryTracking.upsert({
      where: { orderId: id },
      update: {
        status: "SHIPPED",
        description: "Your custom bake has been approved and dispatched by Chef Lochi.",
      },
      create: {
        orderId: id,
        status: "SHIPPED",
        description: "Your custom bake has been approved and dispatched by Chef Lochi.",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
