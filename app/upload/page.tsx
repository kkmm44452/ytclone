"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVideo } from "@/app/actions/video";

export default function UploadPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"youtube" | "hls">("youtube");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [youtubeId, setYoutubeId] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(false);

  const uploadVideo = async () => {
    if (!title) return alert("Title required");

    try {
      setLoading(true);

      let payload: any = {
        title,
        description,
        type: mode,
      };

      /* ---------------- YOUTUBE FLOW ---------------- */
      if (mode === "youtube") {
        if (!youtubeId) return alert("YouTube ID required");

        payload.youtubeId = youtubeId;
        payload.thumbnail = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
      }

      /* ---------------- HLS FLOW ---------------- */
      if (mode === "hls") {
        if (!file) return alert("File required");

        // 1️⃣ Get presigned URL from Lambda
        const res = await fetch("YOUR_LAMBDA_URL", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        });

        const { uploadUrl, fileUrl } = await res.json();

        // 2️⃣ Upload to S3 with progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              setProgress(percent);
            }
          };

          xhr.onload = () => resolve();
          xhr.onerror = () => reject();

          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        payload.hlsUrl = fileUrl;
        payload.thumbnail =
          "https://via.placeholder.com/480x360.png?text=HLS+Video";
      }

      /* ---------------- SAVE TO DB (NO API ROUTE) ---------------- */
      await createVideo({
        title: payload.title,
        description: payload.description,
        type: payload.type,
        youtubeId: payload.youtubeId,
        hlsUrl: payload.hlsUrl,
        thumbnail: payload.thumbnail,
      });

      alert("Video uploaded successfully 🎉");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Upload Video</h1>

      {/* MODE SWITCH */}
      <div className="flex gap-3">
        <button
          onClick={() => setMode("youtube")}
          className={`px-3 py-1 rounded ${
            mode === "youtube"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
        >
          YouTube
        </button>

        <button
          onClick={() => setMode("hls")}
          className={`px-3 py-1 rounded ${
            mode === "hls"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
        >
          HLS Upload
        </button>
      </div>

      {/* TITLE */}
      <input
        className="border w-full p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* DESCRIPTION */}
      <textarea
        className="border w-full p-2 h-24"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* YOUTUBE INPUT */}
      {mode === "youtube" && (
        <input
          className="border w-full p-2"
          placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)"
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
        />
      )}

      {/* HLS INPUT */}
      {mode === "hls" && (
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      )}

      {/* PROGRESS BAR */}
      {mode === "hls" && progress > 0 && (
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-red-600 h-2 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* UPLOAD BUTTON */}
      <button
        onClick={uploadVideo}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 w-full rounded"
      >
        {loading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
}