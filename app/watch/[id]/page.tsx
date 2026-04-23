
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import HLSPlayer from "@/components/HLSPlayer";
import { getVideos } from "@/app/actions/videofetch";

const videos = [
  { id: "dQw4w9WgXcQ", type: "youtube", title: "Never Gonna Give You Up" },
  { id: "3JZ_D3ELwOQ", type: "youtube", title: "Shape of You" },
  { id: "kJQP7kiw5Fk", type: "youtube", title: "Despacito" },
  { id: "9bZkp7q19f0", type: "youtube", title: "Gangnam Style" },
  { id: "fJ9rUzIMcZQ", type: "youtube", title: "Bohemian Rhapsody" },
  { id: "RgKAFK5djSk", type: "youtube", title: "Waka Waka (This Time for Africa)" },
  { id: "hT_nvWreIhg", type: "youtube", title: "Counting Stars" },
  { id: "OPf0YbXqDm0", type: "youtube", title: "Uptown Funk" },
  { id: "YQHsXMglC9A", type: "youtube", title: "Hello - Adele" },
  { id: "JGwWNGJdvx8", type: "youtube", title: "Sorry - Justin Bieber" },
  {
    id: "hlsju",
    type: "hls",
    title: "My AWS Stream Video",
    hlsurl: "https://d3ad2g8hyy43zt.cloudfront.net/hls/bandabomb-a97bf745/master.m3u8",
    thumbnail:"https://d3ad2g8hyy43zt.cloudfront.net/hls/bandabomb-a97bf745/thumbnail.jpg"
  },
];

const videosdb = await getVideos();

export default function WatchPage() {

  

  const { id } = useParams();
  const router = useRouter();

  const currentIndex = videos.findIndex((v) => v.id === id);
  const currentVideo = videos[currentIndex] || videos[0];
  const dbVideos = videos.filter((v) => v.id|| v.title);
  const nextVideo = videos[currentIndex + 1];

  const [likes, setLikes] = useState(120);
  const [dislikes, setDislikes] = useState(5);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  // AUTO PLAY NEXT
  const handleEnd = () => {
    if (nextVideo) {
      router.push(`/watch/${nextVideo.id}`);
    }
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments([comment, ...comments]);
    setComment("");
  };

  const removeComment = (i: number) => {
    setComments(comments.filter((_, index) => index !== i));
  };

  return (
    <div className="flex gap-6">

      {/* LEFT SIDE */}
      <div className="flex-1">

        {/* 🎥 YOUTUBE PLAYER */}
        {currentVideo.type === "youtube" ? (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded-lg"
          />
        ) : currentVideo.hlsurl ? (
          <HLSPlayer src={currentVideo.hlsurl} />
        ) : (
          <div className="text-red-500">No video source found</div>
        )}

        {/* TITLE */}
        <h1 className="text-xl font-bold mt-4">
          {currentVideo.title}
        </h1>

        {/* CHANNEL INFO */}
        <div className="flex items-center justify-between mt-3">

          {/* LEFT: CHANNEL */}
          <div className="flex items-center gap-3">

            {/* CHANNEL IMAGE */}
            <div className="w-10 h-10 bg-gray-300 rounded-full" />

            <div>
              <p className="font-semibold text-sm">Code Channel</p>
              <p className="text-xs text-gray-500">1M subscribers</p>
            </div>

          </div>

          {/* RIGHT: SUBSCRIBE BUTTON */}
          <SubscribeButton />

        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-3">
          <button
            onClick={() => setLikes(likes + 1)}
            className="px-3 py-1 bg-gray-100 rounded-full"
          >
            👍 {likes}
          </button>

          <button
            onClick={() => setDislikes(dislikes + 1)}
            className="px-3 py-1 bg-gray-100 rounded-full"
          >
            👎 {dislikes}
          </button>
        </div>

        {/* COMMENTS */}
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Comments</h2>

          <div className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
              placeholder="Add a comment..."
            />

            <button
              onClick={addComment}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Post
            </button>
          </div>

          {/* COMMENT LIST */}
          <div className="mt-4 space-y-3">
            {comments.map((c, i) => (
              <div
                key={i}
                className="flex justify-between bg-gray-100 p-2 rounded"
              >
                <span>{c}</span>
                <button
                  onClick={() => removeComment(i)}
                  className="text-red-500 text-xs"
                >
                  delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📺 RIGHT SIDE (RECOMMENDED) */}
      <div className="w-[350px] space-y-4">
        {videos.map((v) => (
          <div
            key={v.id}
            onClick={() => router.push(`/watch/${v.id}`)}
            className="flex gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            {/* <img
              src={`https://img.youtube.com/vi/${v.id}/0.jpg`}
              className="w-40 rounded"
            /> */}
            <img
  src={
    v.type === "youtube"
      ? `https://img.youtube.com/vi/${v.id}/0.jpg`
      : v.thumbnail
  }
  className="w-40 h-24 object-cover rounded"
/>
{/* https://d3ad2g8hyy43zt.cloudfront.net/hls/bandabomb-a97bf745/thumbnail.jpg */}
            <div>
              <p className="text-sm font-semibold">{v.title}</p>
              <p className="text-xs text-gray-500">Channel Name</p>
            </div>
          </div>
        ))}
           <div className="w-[250px] space-y-3">
        <h2 className="text-sm font-bold text-gray-600">
          📦 Database Videos
        </h2>

        {dbVideos.map((v) => (
          <div
            key={v.id}
            onClick={() => router.push(`/watch/${v.id}`)}
            className="flex gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <img
              src={
                v.type === "youtube"
                  ? `https://img.youtube.com/vi/${v.id}/0.jpg`
                  : v.thumbnail
              }
              className="w-16 h-12 object-cover rounded"
            />

            <p className="text-xs font-medium line-clamp-2">
              {v.title}
            </p>
          </div>
        ))}
      </div>
      </div>


    </div>
  );

  function SubscribeButton() {
    const [subscribed, setSubscribed] = useState(false);

    return (
      <button
        onClick={() => setSubscribed(!subscribed)}
        className={`
        px-4 py-1 rounded-full text-sm font-medium transition
        ${subscribed
            ? "bg-gray-200 text-black"
            : "bg-red-600 text-white"
          }
      `}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    );
  }
}