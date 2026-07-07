import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper admin verifier
async function checkAdmin(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("cake_by_lochi_session="));

  if (!sessionCookie) return null;

  const cookieVal = sessionCookie.split("=")[1];
  const sessionPayload = JSON.parse(decodeURIComponent(cookieVal));
  
  const user = await prisma.user.findUnique({
    where: { id: sessionPayload.userId },
  });

  return user && user.isAdmin ? user : null;
}

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Access Denied" }, { status: 403 });

    const body = await request.json();
    const { name, category, price, priceNumber, description, image, flavors, badge } = body;

    if (!name || !category || !price || !priceNumber || !description || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price,
        priceNumber: parseFloat(priceNumber),
        description,
        image,
        flavors: flavors || "",
        badge: badge || null,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Access Denied" }, { status: 403 });

    const body = await request.json();
    const { id, name, category, price, priceNumber, description, image, flavors, badge } = body;

    if (!id || !name || !category || !price || !priceNumber || !description || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        price,
        priceNumber: parseFloat(priceNumber),
        description,
        image,
        flavors: flavors || "",
        badge: badge || null,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Access Denied" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
