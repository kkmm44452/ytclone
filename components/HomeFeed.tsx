"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VideoGrid from "./VideoGrid";

const categories = [
  "All",
  "Music",
  "Mixes",
  "Indian pop music",
  "Dubbing",
  "Movie musicals",
  "Patlu",
  "T-Series",
  "Arijit Singh",
  "News",
  "Dramedy",
  "Playlists",
  "Live",
  "Electropop",
  "Gaming",
  "Comedy",
  "Cricket",
  "Bollywood",
];

const sections = [
  "Music Mixes",
  "Trending",
  "Gaming",
  "News",
  "Live",
  "Recently Uploaded",
];

export default function HomeFeed() {
  const [active, setActive] = useState("All");

  const ref = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // FILTER LOGIC (unchanged)
  const filteredSections = useMemo(() => {
    if (active === "All") return sections;

    return sections.filter((s) =>
      s.toLowerCase().includes(active.toLowerCase())
    );
  }, [active]);

  // CHECK SCROLL
  const checkScroll = () => {
    if (!ref.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = ref.current;

    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;

    ref.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-8">

      {/* 🔥 YOUTUBE-STYLE CATEGORY BAR */}
      <div className="relative">

        {/* LEFT ARROW */}
        {showLeft && (
          <div className="absolute left-0 top-0 h-full flex items-center bg-gradient-to-r from-white to-transparent z-10">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaChevronLeft />
            </button>
          </div>
        )}

        {/* RIGHT ARROW */}
        {showRight && (
          <div className="absolute right-0 top-0 h-full flex items-center bg-gradient-to-l from-white to-transparent z-10">
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* SCROLLABLE CHIPS */}
        <div
          ref={ref}
          onScroll={checkScroll}
          className="flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide px-8 pb-2"
        >
          {categories.map((c) => {
            const isActive = active === c;

            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`
                  whitespace-nowrap px-3 py-1 text-sm rounded-full border transition
                  ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🎥 SECTIONS */}
      {filteredSections.map((title) => (
        <div key={title}>
          <h2 className="text-lg font-bold mb-2">{title}</h2>
          <VideoGrid />
        </div>
      ))}
    </div>
  );
}