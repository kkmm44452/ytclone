"use server";

import { prisma } from "@/lib/prisma";

export async function getUserVideos(email: string) {
  const videos = await prisma.video.findMany({
    where: {
      user: {
        email: email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return videos;
}