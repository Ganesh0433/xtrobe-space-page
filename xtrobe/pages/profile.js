import React, { useState, useEffect } from "react";
import { db, storage, auth } from "../lib/firebaseConfig";
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { FiCamera, FiSave } from "react-icons/fi";

const Profile = () => {
    const [details, setDetails] = useState({
        Name: "",
        Phoneno: "",
        Email: "",
        Username: "",
        Occupation: "",
        InterestInSpace: "",
        ExperienceLevel: "",
        Bio: "",
        ProfilePic: "/images/space-avatar.png",
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState(null);
    const [usernameStatus, setUsernameStatus] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setDetails((prev) => ({ ...prev, Email: user.email }));
                fetchUserProfile(user.uid);
            } else {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchUserProfile = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                setDetails((prev) => ({
                    ...prev,
                    ...userDoc.data(),
                    ProfilePic: userDoc.data().ProfilePic || "/images/space-avatar.png",
                }));
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const isUsernameFormatValid = (username) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    };

    const checkUsernameAvailability = async (username) => {
        try {
            const q = query(
                collection(db, "users"),
                where("Username", "==", username),
                where("Username", "!=", details.Username) // Exclude current user's username
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.empty;
        } catch (error) {
            console.error("Error checking username:", error);
            return false;
        }
    };

    const validateUsernameRealTime = async (username) => {
        if (!username) {
            setUsernameStatus("Username is required");
            return false;
        }

        if (!isUsernameFormatValid(username)) {
            setUsernameStatus("Username must be 3-20 characters (letters, numbers, underscore only)");
            return false;
        }

        const isAvailable = await checkUsernameAvailability(username);
        setUsernameStatus(isAvailable ? "Username available" : "Username already taken");
        return isAvailable;
    };

    const handleSave = async () => {
        const requiredFields = [
            "Name",
            "Phoneno",
            "Email",
            "Username",
            "Occupation",
            "InterestInSpace",
            "ExperienceLevel",
            "Bio",
        ];
        const missingFields = requiredFields.filter((field) => !details[field]);

        if (missingFields.length > 0) {
            alert(`Please fill all required fields: ${missingFields.join(", ")}`);
            return;
        }

        const isUsernameValid = await validateUsernameRealTime(details.Username);
        if (!isUsernameValid) {
            alert("Please choose a valid and available username");
            return;
        }

        setSaving(true);
        try {
            await updateDoc(doc(db, "users", userId), details);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
        setSaving(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            const storageRef = ref(storage, `profile_pics/${userId}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setDetails((prev) => ({ ...prev, ProfilePic: downloadURL }));
            await updateDoc(doc(db, "users", userId), { ProfilePic: downloadURL });
        }
    };

    if (loading) return <div className="text-center text-gray-300">Loading...</div>;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-gray-800 bg-opacity-80 shadow-xl rounded-lg w-full max-w-2xl p-8 border">
                <div className="flex justify-center mb-6">
                    <label className="relative group cursor-pointer">
                        <img
                            src={image || details.ProfilePic}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-indigo-400 object-cover shadow-lg"
                        />
                        <input type="file" className="hidden" onChange={handleImageUpload} />
                        <FiCamera className="absolute bottom-2 right-2 text-white bg-indigo-600 p-2 rounded-full text-xl opacity-75 group-hover:opacity-100 transition-opacity shadow-sm" />
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input
                            name="Name"
                            value={details.Name}
                            onChange={(e) => setDetails({ ...details, Name: e.target.value })}
                            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <input
                            name="Phoneno"
                            value={details.Phoneno}
                            onChange={(e) => setDetails({ ...details, Phoneno: e.target.value })}
                            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            name="Email"
                            value={details.Email}
                            disabled
                            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-gray-400 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            name="Username"
                            value={details.Username}
                            onChange={(e) => {
                                setDetails({ ...details, Username: e.target.value });
                                validateUsernameRealTime(e.target.value);
                            }}
                            className={`w-full p-3 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm ${
                                usernameStatus && !usernameStatus.includes("available")
                                    ? "border-red-500"
                                    : "border-gray-600"
                            }`}
                        />
                        {usernameStatus && (
                            <p
                                className={`text-sm mt-1 ${
                                    usernameStatus.includes("available")
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                {usernameStatus}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Occupation</label>
                        <select
                            name="Occupation"
                            value={details.Occupation}
                            onChange={(e) => setDetails({ ...details, Occupation: e.target.value })}
                            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        >
                            <option value="">Select Occupation</option>
                            <option value="Astronomer">Astronomer</option>
                            <option value="Engineer">Engineer</option>
                            <option value="Student">Student</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Interest in Space</label>
                        <select
                            name="InterestInSpace"
                            value={details.InterestInSpace}
                            onChange={(e) => setDetails({ ...details, InterestInSpace: e.target.value })}
                            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        >
                            <option value="">Select Interest</option>
                            <option value="Astronomy">Astronomy</option>
                            <option value="Space Travel">Space Travel</option>
                            <option value="Astrophysics">Astrophysics</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Experience Level</label>
                        <select
                            name="ExperienceLevel"
                            value={details.ExperienceLevel}
                            onChange={(e) => setDetails({ ...details, ExperienceLevel: e.target.value })}
                            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                        <textarea
                            name="Bio"
                            value={details.Bio}
                            onChange={(e) => setDetails({ ...details, Bio: e.target.value })}
                            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm h-24 resize-y"
                            placeholder="Tell us about yourself and your passion for space..."
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full mt-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 font-semibold flex items-center justify-center gap-2 shadow-md"
                    disabled={saving || (usernameStatus && !usernameStatus.includes("available"))}
                >
                    <FiSave className="text-lg" />
                    {saving ? "Saving..." : "Save Profile"}
                </button>
            </div>
        </div>
    );
};

export default Profile;