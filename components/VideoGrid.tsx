import VideoCard from "./VideoCard";
import Link from "next/link";

export default function VideoGrid() {
  const videos = Array.from({ length: 12 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.map((_, i) => (
        <Link key={i} href={`/watch/${i}`}>
          <VideoCard />
        </Link>
      ))}
    </div>
  );
}