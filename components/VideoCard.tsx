export default function VideoCard() {
  return (
    <div className="cursor-pointer group">

      {/* THUMBNAIL */}
      <div className="overflow-hidden rounded-lg">
        <img
          src="https://picsum.photos/400/250"
          className="w-full group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* DETAILS */}
      <div className="flex gap-2 mt-2">

        {/* CHANNEL ICON */}
        <div className="w-9 h-9 bg-gray-300 rounded-full" />

        {/* TEXT */}
        <div>
          <h3 className="font-semibold text-sm leading-tight">
            Amazing Next.js Tutorial
          </h3>

          <p className="text-xs text-gray-500">
            Code Channel
          </p>

          <p className="text-xs text-gray-500">
            1M views • 1 day ago
          </p>
        </div>

      </div>
    </div>
  );
}