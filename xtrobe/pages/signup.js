import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  auth,
  db,
  googleProvider,
  githubProvider,
  signInWithPopup,
} from "../lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const router = useRouter();
  const [messages, setMessages] = useState({ success: "", error: "" });

  // Handle OAuth Sign-In
  const handleOAuthSignIn = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user data in Firestore (if not already present)
      await setDoc(
        doc(db, "users", user.uid),
        {
          userId: user.uid,
          Name: user.displayName || "N/A",
          Email: user.email,
          Phone: user.phoneNumber || "N/A",
        },
        { merge: true }
      );

      router.push("/profile");
    } catch (error) {
      console.error("OAuth Sign In Error:", error);
      setMessages({ error: "Sign-In failed. Please try again." });
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-black bg-cover bg-center"
      style={{ backgroundImage: "url('/space-background.jpg')" }}
    >
      {/* Login Button */}
      <button
        onClick={() => router.push("/profile")}
        className="absolute top-4 right-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-gray-800 focus:outline-none transition duration-300"
      >
        Login
      </button>

      {/* Success Message */}
      {messages.success && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center w-3/4 md:w-1/2">
            <h2 className="text-3xl font-semibold">Success</h2>
            <p className="mt-4 text-lg">{messages.success}</p>
          </div>
        </div>
      )}

      {/* Sign Up Form */}
      <div className="w-full max-w-md p-6 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white">Sign Up</h2>

        {/* OAuth Buttons */}
        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={() => handleOAuthSignIn(googleProvider)}
            className="w-full flex items-center justify-center p-2 text-white bg-red-500 rounded hover:bg-red-600 transition duration-300"
          >
            Sign Up with Google
          </button>
          <button
            onClick={() => handleOAuthSignIn(githubProvider)}
            className="w-full flex items-center justify-center p-2 text-white bg-gray-700 rounded hover:bg-gray-800 transition duration-300"
          >
            Sign Up with GitHub
          </button>
        </div>

        {/* Error Message */}
        {messages.error && (
          <div className="mt-4 flex justify-center">
            <p className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md animate-fade">
              {messages.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;