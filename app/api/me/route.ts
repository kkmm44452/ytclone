// app/api/me/route.ts

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessionCookie = (await cookies()).get("session")?.value;

  if (!sessionCookie) {
    return Response.json({ user: null });
  }

  try {
    // 🔥 verify session
    const decoded = await adminAuth.verifySessionCookie(sessionCookie);

    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: decoded.uid,
      },
      include: {
        channel: true,
      },
    });

    return Response.json({ user });
  } catch (err) {
    return Response.json({ user: null });
  }
}