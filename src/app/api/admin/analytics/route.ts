import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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

    // 2. Fetch analytical summary
    const totalProducts = await prisma.product.count();
    
    const orderItems = await prisma.orderItem.findMany();
    const totalItemsSold = orderItems.reduce((acc, item) => acc + item.quantity, 0);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: true,
        paymentStatus: true,
        deliveryTracking: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute monthly/daily revenue datasets
    const revenueMap: Record<string, number> = {};
    orders.forEach((o) => {
      const dateStr = new Date(o.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      revenueMap[dateStr] = (revenueMap[dateStr] || 0) + o.total;
    });

    const revenueData = Object.entries(revenueMap).map(([date, amount]) => ({
      date,
      amount,
    })).reverse().slice(-7); // Last 7 transaction days

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

    return NextResponse.json({
      success: true,
      metrics: {
        totalStock: totalProducts,
        totalItemsSold,
        totalRevenue,
        recentBuyersCount: users.length,
      },
      revenueData,
      orders,
      users,
    });
  } catch (error: any) {
    console.error("Admin Analytics API error:", error);
    return NextResponse.json({ error: error.message || "Failed to load admin analytics" }, { status: 500 });
  }
}
