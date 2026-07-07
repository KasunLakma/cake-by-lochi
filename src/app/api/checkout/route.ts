import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, address, phone, paymentMethod, cartItems, total } = body;

    if (!email || !name || !address || !phone || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing required fields or empty cart" }, { status: 400 });
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

    // 2. Create the Order with nested Items, PaymentStatus and DeliveryTracking
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            flavor: item.flavor || null,
          })),
        },
        paymentStatus: {
          create: {
            status: paymentMethod === "CARD" ? "PAID" : "PENDING",
            method: paymentMethod,
            amount: total,
          },
        },
        deliveryTracking: {
          create: {
            status: "PENDING",
            description: "Order placed. Awaiting review by Chef Lochi's custom studio.",
          },
        },
      },
      include: {
        items: true,
        paymentStatus: true,
        deliveryTracking: true,
      },
    });

    // 3. Create Session cookie payload
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
    const sessionString = encodeURIComponent(JSON.stringify(sessionPayload));

    const response = NextResponse.json({
      success: true,
      orderId: order.id,
      user: sessionPayload,
    });

    // Set HttpOnly session cookie
    response.headers.set(
      "Set-Cookie",
      `cake_by_lochi_session=${sessionString}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
    );

    return response;
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ error: error.message || "Failed to process checkout" }, { status: 500 });
  }
}
