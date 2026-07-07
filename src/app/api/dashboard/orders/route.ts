import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("cake_by_lochi_session="));

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieVal = sessionCookie.split("=")[1];
    const sessionPayload = JSON.parse(decodeURIComponent(cookieVal));
    const userId = sessionPayload.userId;

    // Fetch user's orders with full relation models
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        paymentStatus: true,
        deliveryTracking: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Fetch orders API error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}
