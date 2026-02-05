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

  // File change handler with image validation only
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Logic to block non-image files
      if (!selectedFile.type.startsWith("image/")) {
        alert("Sirf images (JPG, PNG, WEBP) upload karein! ❌");
        e.target.value = ""; 
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image first!");
    
    setLoading(true);
    try {
      const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      
      const res = await axios.post(url, formData);
      
      await addDoc(collection(db, "images"), {
        title, 
        category, 
        isPublic,
        ownerId: currentUser.uid, 
        imageUrl: res.data.secure_url, 
        createdAt: Timestamp.now(),
      });

      alert("Image Published Successfully! ✅");
      setTitle(""); 
      setFile(null);
      navigate("/dashboard");
    } catch (err) { 
      console.error(err);
      alert("Upload failed! Please try again."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-[450px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Color Strip */}
        <div className="h-2 bg-indigo-600 w-full"></div>
        
        <div className="p-8">
          <h2 className="text-2xl font-black text-slate-800 mb-1">Upload New Image</h2>
          <p className="text-sm text-slate-500 mb-8">Add details to your visual asset</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Picker Group */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Image File</label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer bg-slate-50 rounded-2xl border border-slate-200 pr-4"
                  required
                />
              </div>
            </div>

            {/* Title Group */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Title</label>
              <input
                type="text"
                placeholder="e.g. Modern Architecture"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category & Visibility Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <div className="relative">
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs text-slate-600">▼</div>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Privacy</label>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`w-full py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
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
              className="group relative w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white bg-slate-900 hover:bg-black transition-all active:scale-[0.98] shadow-xl disabled:opacity-50 mt-4 overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? "Publishing Asset..." : "Confirm & Publish"}
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;