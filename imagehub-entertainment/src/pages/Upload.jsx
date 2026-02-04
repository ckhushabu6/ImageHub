import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom"

const Upload = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Nature");
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ["Nature", "Tech", "Art", "Travel", "Food"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select image!");
    setLoading(true);
    try {
      const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      const res = await axios.post(url, formData);
      await addDoc(collection(db, "images"), {
        title, category, isPublic,
        ownerId: currentUser.uid, imageUrl: res.data.secure_url, createdAt: Timestamp.now(),
      });
      alert("Success!");
      setTitle(""); setFile(null);
      navigate("/dashboard");
    } catch (err) { alert("Failed!"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-[450px] mx-auto my-10 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header Color Strip */}
      <div className="h-2 bg-indigo-600 w-full"></div>
      
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Upload New Image</h2>
        <p className="text-sm text-slate-500 mb-6">Add details to your visual asset</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Picker Group */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select File</label>
            <div className="relative">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer bg-slate-50 rounded-2xl border border-slate-200 pr-4"
              />
            </div>
          </div>

          {/* Title Group */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Modern Architecture"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category & Visibility Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none appearance-none cursor-pointer"
              >
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Privacy</label>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-full py-3 rounded-2xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isPublic 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                  : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                {isPublic ? "🟢 Public" : "🔒 Private"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-extrabold text-white bg-slate-900 hover:bg-black transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 mt-2"
          >
            {loading ? "Uploading Asset..." : "Confirm & Publish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;