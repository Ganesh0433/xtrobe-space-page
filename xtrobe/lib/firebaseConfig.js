import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyAiq0ywoA-XDjQd8LMM4-aUqZP68xfYqQ8", // 🔴 Restrict this in Firebase Console
    authDomain: "xtrobe-92650.firebaseapp.com",
    databaseURL: "https://xtrobe-92650-default-rtdb.firebaseio.com",
    projectId: "xtrobe-92650",
    storageBucket: "xtrobe-92650.appspot.com",
    messagingSenderId: "1081801328248",
    appId: "1:1081801328248:web:5e12acad0177180b190f8d"
};

// Check if Firebase is already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, db, googleProvider, githubProvider, signInWithPopup };
