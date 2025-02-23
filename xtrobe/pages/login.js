import React, { useState } from "react";
import { useRouter } from "next/router";
import { auth, googleProvider, githubProvider, signInWithPopup } from "../lib/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize Firestore
  const db = getFirestore();

  const handleSocialSignIn = async (provider) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Sign in with Google or GitHub
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the user's UID
      const uid = user.uid;

      // Fetch the username from Firestore
      const userDocRef = doc(db, "users", uid); // Reference to the user's document
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // If the user document exists, get the username
        const username = userDocSnap.data().Username;
      
        // Store the username in localStorage (optional)
        localStorage.setItem("username", username);

        // Show success message
        setSuccessMessage(`Successfully logged in with ${provider.providerId.includes("google") ? "Google" : "GitHub"}!`);

        // Redirect to the user's profile or dashboard
        setTimeout(() => {
          router.push(`/${username}/latestnews`);
        }, 2000);
      } else {
        // If the user document doesn't exist, show an error
        setErrorMessage("User data not found. Please sign up first.");
      }
    } catch (error) {
      console.error("Social Sign-In Error:", error);
      setErrorMessage(`${provider.providerId.includes("google") ? "Google" : "GitHub"} Sign-In failed. Try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black" style={{ backgroundImage: "url('/space-background.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute top-4 right-6">
        <button onClick={() => router.push("/signup")} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
          Sign Up
        </button>
      </div>

      <div className="w-full max-w-md p-6 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white">Login</h2>

        {/* OAuth Buttons */}
        <button
          type="button"
          onClick={() => handleSocialSignIn(googleProvider)}
          className="w-full p-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          disabled={loading}
        >
          { "Sign in with Google"}
        </button>
        <button
          type="button"
          onClick={() => handleSocialSignIn(githubProvider)}
          className="w-full p-2 mt-4 bg-gray-700 text-white rounded hover:bg-gray-800 transition duration-300"
          disabled={loading}
        >
          {"Sign in with GitHub"}
        </button>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 flex justify-center">
            <p className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md animate-fade">{errorMessage}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white p-6 rounded-lg shadow-lg text-center w-1/4 md:w-1/2">
              <h2 className="text-3xl font-semibold">Success</h2>
              <p className="mt-4 text-lg">{successMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;