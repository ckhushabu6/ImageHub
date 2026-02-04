import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(""); // For the avatar preview
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.username || "");
        setInterests((data.interests || []).join(", "));
        setPreview(data.photoURL || "");
      }
    };
    loadProfile();
  }, [currentUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const uploadProfilePic = async () => {
    if (!photo) return preview; // Return existing URL if no new photo
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      data
    );
    return res.data.secure_url;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const photoURL = await uploadProfilePic();
      await setDoc(doc(db, "users", currentUser.uid), {
        email: currentUser.email,
        username,
        interests: interests.split(",").map((i) => i.trim()),
        photoURL,
        updatedAt: Date.now(),
      }, { merge: true });
      alert("Profile updated ✅");
       navigate("/dashboard");
    } catch (err) {
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[450px] mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>⚙️</span> Settings
        </h2>

        <div className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative h-20 w-20 flex-shrink-0">
              <img 
                src={preview || "https://via.placeholder.com/150"} 
                className="h-full w-full rounded-full object-cover border-4 border-white shadow-sm"
                alt="Profile"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <div>
              <p className="font-bold text-slate-600 text-sm">Profile Picture</p>
              {/* <p className="text-sm text-slate-700">{username}</p> */}
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Interests Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Interests</label>
            <input
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
              placeholder="Art, Tech, Travel..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-extrabold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;