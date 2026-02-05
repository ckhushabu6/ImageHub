import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation add kiya
import axios from "axios";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const location = useLocation(); // URL check karne ke liye
  const { currentUser } = useAuth();
  
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(""); 
  const [loading, setLoading] = useState(false);

  // Yeh line check karegi ki kya URL mein '?from=nav' hai
  const isFromNavbar = new URLSearchParams(location.search).get("from") === "nav";

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

  // Image validation logic (Jo humne pehle fix kiya tha)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Sirf images upload karein! ❌");
        return;
      }
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadProfilePic = async () => {
    if (!photo) return preview; 
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      data,
    );
    return res.data.secure_url;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const photoURL = await uploadProfilePic();
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          email: currentUser.email,
          username,
          interests: interests.split(",").map((i) => i.trim()),
          photoURL,
          updatedAt: Date.now(),
        },
        { merge: true },
      );
      alert("Profile updated ✅");
      navigate("/dashboard");
    } catch (err) {
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[450px] mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative mt-10">
      
      {/* Agar Navbar se aaye hain (URL mein ?from=nav hai) tabhi 'X' dikhega */}
      {isFromNavbar && (
        <button 
          onClick={() => navigate("/dashboard")}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all z-10 border border-slate-100 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>⚙️</span> Settings
        </h2>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative h-20 w-20 flex-shrink-0">
              <img
                src={preview || "https://via.placeholder.com/150"}
                className="h-full w-full rounded-full object-cover border-4 border-white shadow-sm"
                alt="Profile"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <p className="font-bold text-slate-600 text-sm">Profile Picture</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input
              className="w-full px-4 py-3 text-slate-700 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Interests</label>
            <input
              className="w-full px-4 py-3 text-slate-700 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-extrabold shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;