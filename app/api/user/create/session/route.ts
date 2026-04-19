// app/api/session/route.ts

import { adminAuth } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  // verify firebase token
  await adminAuth.verifyIdToken(token);

  // create secure session cookie
  const sessionCookie = await adminAuth.createSessionCookie(token, {
    expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
  });

  // ✅ FIX: await cookies()
  const cookieStore = await cookies();

  cookieStore.set("session", sessionCookie, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return new Response("OK");
}