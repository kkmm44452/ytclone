"use server";

import { prisma } from "@/lib/prisma";

export async function getVideos() {
  return prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getVideoById(id: string) {
  return prisma.video.findUnique({
    where: { id },
  });
}