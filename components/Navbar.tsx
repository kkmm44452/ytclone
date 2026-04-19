"use client";


import { FaBars, FaVideo, FaBell, FaEllipsisV, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function Navbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [openMenu, setOpenMenu] = useState(false);
//const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setIsLoggedIn(!!user);
  //   });

  //   return () => unsubscribe();
  // }, []);
  
 useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      setIsLoggedIn(!!data.user);
    } catch {
      setIsLoggedIn(false);
    }
  };

  checkAuth();
}, [router]);

 const handleLogout = async () => {
  try {
    await fetch("/api/logout", {
      method: "POST",
    });
setIsLoggedIn(false);
    router.push("/login");
    router.refresh(); // 🔥 refresh server state
  } catch (err) {
    console.error("Logout failed", err);
  }
};
  return (
    <div className="flex items-center justify-between px-4 py-3 shadow-md relative">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-xl p-2 hover:bg-gray-100 rounded"
        >
          <FaBars />
        </button>

        <h1 className="text-red-600 font-bold text-xl">MyTube</h1>
      </div>

      {/* SEARCH */}
      <input
        className="border rounded-full px-4 py-1 w-1/2"
        placeholder="Search"
      />

      {/* RIGHT */}
      <div className="flex items-center gap-3 relative">

        {isLoggedIn && (
          <button  onClick={() => router.push("/upload")} className="p-2 hover:bg-gray-100 rounded-full">
            <FaVideo />
          </button>
        )}

        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <FaBell />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 rounded-full">
            3
          </span>
        </button>

        {/* 3 DOT MENU */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaEllipsisV />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border shadow-md rounded-md text-sm z-50">
              <div className="p-2 hover:bg-gray-100 cursor-pointer">
                Settings
              </div>
              <div className="p-2 hover:bg-gray-100 cursor-pointer">
                Report history
              </div>
              <div className="p-2 hover:bg-gray-100 cursor-pointer">
                Help
              </div>
              <div className="p-2 hover:bg-gray-100 cursor-pointer">
                Send feedback
              </div>
            </div>
          )}
        </div>

        {/* SIGN IN / PROFILE */}
        {!isLoggedIn ? (
          <button
            onClick={() => router.push("/login")}
            className="border px-3 py-1 rounded-full text-blue-600 text-sm"
          >
            Sign in
          </button>
        ) : (
          <div className="flex items-center gap-2">

            {/* Profile */}
            <div onClick={() => router.push("/channel")} className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <FaUser />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>

          </div>
        )}

      </div>
    </div>
  );
}