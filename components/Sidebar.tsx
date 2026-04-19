"use client"
import {
  FaHome,
  FaFilm,
  FaHistory,
  FaClock,
  FaThumbsUp,
  FaShoppingCart,
  FaMusic,
  FaFilm as FaMovies,
  FaYoutube,
  FaUser,
  FaVideo,
  FaSignOutAlt,
  FaFolder,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

type SidebarProps = {
  open: boolean;
};



export default function Sidebar({ open }: SidebarProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (u) => {
  //     setUser(u);
  //   });

  //   return () => unsubscribe();
  // }, []);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        setIsLoggedIn(!!data.user);
        setUser(data.user);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);
  // 🔥 LOGOUT
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    setUser(null);
    router.push("/login");
    router.refresh();
  };
  return (
    <div
      className={`border-r overflow-y-auto transition-all duration-300 ${open ? "w-60" : "w-16"
        }`}
    >
      <div className="p-2 space-y-4">

        {/* MAIN */}
        <Section>
          <Item icon={<FaHome />} label="Home" open={open} />
          <Item icon={<FaFilm />} label="Shorts" open={open} />
          <Item icon={<FaYoutube />} label="Subscriptions" open={open} />
        </Section>

        {/* YOU */}
        <Section title="You">
          <Item icon={<FaUser />} label="Your Channel" open={open} />
          <Item icon={<FaHistory />} label="History" open={open} />
          <Item icon={<FaClock />} label="Watch Later" open={open} />
          <Item icon={<FaThumbsUp />} label="Liked Videos" open={open} />
        </Section>

        {/* SIGN IN BOX */}
        {open && (
          <div className="px-3 py-3 border rounded-lg text-sm bg-gray-50">

            {!user ? (
              <>
                <p className="leading-tight text-gray-700">
                  Sign in to like videos, comment, and subscribe.
                </p>

                <button
                  onClick={() => router.push("/login")}
                  className="mt-2 px-4 py-1 border rounded-full text-blue-600 hover:bg-blue-50 transition"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                <p className="font-semibold text-gray-800">
                  {user.email.split("@")[0]}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  You can like, comment and subscribe 🎉
                </p>

                {/* <button
          onClick={async () => {
            await signOut(auth);
          }}
          className="mt-2 px-4 py-1 border rounded-full text-red-600 hover:bg-red-50 transition"
        >
          Logout
        </button> */}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:underline"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            )}

          </div>
        )}

        {/* EXPLORE */}
        <Section title="Explore">
          <Item icon={<FaShoppingCart />} label="Shopping" open={open} />
          <Item icon={<FaMusic />} label="Music" open={open} />
          <Item icon={<FaMovies />} label="Movies" open={open} />
        </Section>

        {/* MORE FROM YOUTUBE */}
        <Section title="More from YouTube">
          <Item icon={<FaYoutube />} label="MyTube Premium" open={open} />
          <Item icon={<FaMusic />} label="MyTube Music" open={open} />
          <Item icon={<FaFilm />} label="MyTube Kids" open={open} />
        </Section>

        {/* FOOTER */}
        {open && (
          <div className="text-[11px] text-gray-500 px-3 pt-4 space-y-2">
            <p>About Press Copyright</p>
            <p>Contact us Creators Advertise Developers</p>
            <p>Terms Privacy Policy & Safety</p>
            <p>How MYTube works</p>
            <p>© 2026 MYTube Ltd</p>
          </div>
        )}

      </div>
    </div>
  );
}

/* SECTION WRAPPER */
function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b pb-2">
      {title && (
        <p className="text-xs text-gray-500 px-3 py-1 uppercase">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/* ITEM */
function Item({
  icon,
  label,
  open,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
}) {
  return (
    <div className="relative group">
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <div className="text-lg">{icon}</div>

        {open && (
          <span className="text-sm">{label}</span>
        )}
      </div>

      {/* tooltip when collapsed */}
      {!open && (
        <div className="absolute left-14 top-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}