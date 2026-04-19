"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

export async function setupUser() {
  // ✅ FIX 1: await cookies()
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    throw new Error("Unauthorized");
  }

  const decoded = await adminAuth.verifySessionCookie(sessionCookie);

  const firebaseUid = decoded.uid;

  // ✅ FIX 2: ensure email exists
  if (!decoded.email) {
    throw new Error("Email not found");
  }
  const email = decoded.email;

  // check if user exists
  let user = await prisma.user.findUnique({
    where: { firebaseUid },
    include: { channel: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid,
        email,
      },
      include: { channel: true }, // ✅ FIX 3
    });
  }

  // ✅ FIX 4: ensure user exists
  if (!user) {
    throw new Error("User creation failed");
  }

  // create channel if not exists
  if (!user.channel) {
    await prisma.channel.create({
      data: {
        name: email.split("@")[0],
        userId: user.id,
      },
    });

    // optional: refetch to return updated user
    user = await prisma.user.findUnique({
      where: { id: user.id },
      include: { channel: true },
    });
  }

  return user;
}