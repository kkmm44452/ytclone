import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firebaseUid, email, name, image } = body;

    const user = await prisma.user.upsert({
      where: {
        firebaseUid, // ✅ correct field
      },
      update: {
        email,
        name,
        image,
      },
      create: {
        firebaseUid,
        email,
        name,
        image,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}