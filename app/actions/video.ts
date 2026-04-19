"use server";

import { prisma } from "@/lib/prisma";

export async function createVideo(data: {
  title: string;
  description?: string;
  type: "youtube" | "hls";
  youtubeId?: string;
  hlsUrl?: string;
  thumbnail?: string;
}) {
  const video = await prisma.video.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      youtubeId: data.youtubeId,
      hlsUrl: data.hlsUrl,
      thumbnail: data.thumbnail,
    },
  });

  return video;
}