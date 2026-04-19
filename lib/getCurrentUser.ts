// lib/getCurrentUser.ts

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  try {
    // ✅ FIX: await cookies()
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) return null;

    // 🔥 verify firebase session
    const decoded = await adminAuth.verifySessionCookie(session);

    const firebaseUid = decoded.uid;

    // 🔥 get user + channel
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        channel: true,
      },
    });

    return user;
  } catch (error) {
    // invalid/expired cookie
    return null;
  }
}