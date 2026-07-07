import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const currentTracking = await prisma.deliveryTracking.findUnique({
      where: { orderId: id },
    });

    if (!currentTracking) {
      return NextResponse.json({ error: "Tracking not found" }, { status: 404 });
    }

    let nextStatus = "PENDING";
    let nextDescription = "Order placed.";

    switch (currentTracking.status) {
      case "PENDING":
        nextStatus = "PREPARING";
        nextDescription = "Chef Lochi is crafting and custom decorating your cake in the studio.";
        break;
      case "PREPARING":
        nextStatus = "SHIPPED";
        nextDescription = "Artisan bake carefully boxed and out with our white-glove courier service.";
        break;
      case "SHIPPED":
        nextStatus = "DELIVERED";
        nextDescription = "Hand-delivered and signed for. Enjoy your luxury treat!";
        break;
      default:
        nextStatus = "PENDING";
        nextDescription = "Order reset for simulation. Awaiting custom studio review.";
        break;
    }

    // Update both tracking and order status (simulate updating payment to PAID on delivery if COD)
    const updated = await prisma.deliveryTracking.update({
      where: { orderId: id },
      data: {
        status: nextStatus,
        description: nextDescription,
      },
    });

    if (nextStatus === "DELIVERED") {
      // Auto pay COD orders when delivered
      await prisma.paymentStatus.update({
        where: { orderId: id },
        data: {
          status: "PAID",
        },
      });
    }

    return NextResponse.json({ tracking: updated });
  } catch (error: any) {
    console.error("Simulation API error:", error);
    return NextResponse.json({ error: error.message || "Failed to simulate status" }, { status: 500 });
  }
}
