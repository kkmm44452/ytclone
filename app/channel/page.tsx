"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { getUserVideos } from "@/app/actions/channel";

export default function ChannelPage() {
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setLoading(false);
        return;
      }

      setUser(u);

      const data = await getUserVideos(u.email!);
      setVideos(data);

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="p-5">Loading...</div>;

  if (!user) return <div className="p-5">Please login</div>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-300 rounded-full" />

        <div>
          <h1 className="text-xl font-bold">
            {user.displayName || "My Channel"}
          </h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="flex gap-6 mb-6 text-sm">
        <div>
          <p className="font-bold">{videos.length}</p>
          <p>Videos</p>
        </div>

        <div>
          <p className="font-bold">1.2K</p>
          <p>Subscribers</p>
        </div>
      </div>

      {/* VIDEOS */}
      <div className="grid grid-cols-4 gap-4">
        {videos.map((v) => (
          <div key={v.id} className="cursor-pointer">
            <img
              src={v.thumbnail || "/placeholder.png"}
              className="rounded-lg w-full h-[180px] object-cover"
            />

            <h3 className="text-sm font-semibold mt-2">
              {v.title}
            </h3>

            <p className="text-xs text-gray-500">
              {v.type}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}