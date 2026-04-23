// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebaseClient";

// export default function RegisterPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async () => {
//     try {
//       const userCred = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       const token = await userCred.user.getIdToken();

//       // send to backend (Neon DB save)
//       await fetch("/api/user/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           firebaseUid: userCred.user.uid,
//           email,
//           name: email.split("@")[0],
//           image: null,
//         }),
//       });

//        // store in cookie
//        document.cookie = `token=${token}; path=/;`;
//       router.push("/");
//     } catch (err) {
//       console.error(err);
//       alert("Registration failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4">
//         <h2 className="text-xl font-bold text-center">Register</h2>

//         <input
//           className="w-full border px-3 py-2 rounded"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           className="w-full border px-3 py-2 rounded"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           onClick={handleRegister}
//           className="w-full bg-green-600 text-white py-2 rounded"
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { setupUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      return alert("Email and password required");
    }

    try {
      setLoading(true);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await userCred.user.getIdToken();

      // 🔥 Create session immediately after register
      await fetch("api/user/create/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    // 🔥 create user + channel in DB
    await setupUser();

     // router.push("/");

     window.location.href = "/";

    } catch (err) {
      console.error(err);
      alert("Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Register</h2>

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}