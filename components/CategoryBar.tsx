"use client";

import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

export default function CategoryBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("All");
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

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
    <div className="relative mb-4">

      {/* LEFT FADE + BUTTON */}
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

      {/* RIGHT FADE + BUTTON */}
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

      {/* SCROLL AREA */}
      <div
        ref={ref}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide px-8"
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
  );
}