import { useEffect, useState } from "react";
import ProfileSettings from "./ProfileSettings";
import { useNavigate } from "react-router-dom"


import {
  deleteDoc, collection, query, where, getDocs,
  updateDoc, doc, getDoc, arrayUnion, arrayRemove, Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      const q = query(collection(db, "images"), where("ownerId", "==", currentUser.uid));
      const snap = await getDocs(q);
      setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setFavorites(userDoc.data().favorites || []);
      }
    };
    fetchData();
  }, [currentUser]);

  const deleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    await deleteDoc(doc(db, "images", id));
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const toggleFavorite = async (imageId) => {
    const userRef = doc(db, "users", currentUser.uid);
    if (favorites.includes(imageId)) {
      await updateDoc(userRef, { favorites: arrayRemove(imageId) });
      setFavorites(prev => prev.filter(id => id !== imageId));
    } else {
      await updateDoc(userRef, { favorites: arrayUnion(imageId) });
      setFavorites(prev => [...prev, imageId]);
    }
  };

  const generateSecureLink = async (imageId) => {
    const token = Math.random().toString(36).substring(2, 12);
    const expiry = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
    await updateDoc(doc(db, "images", imageId), { shareToken: token, shareExpiry: expiry });
    alert(`Secure link generated: ${window.location.origin}/share/${token}`);
  };

  const displayedImages = activeTab === "favorites"
    ? images.filter(img => favorites.includes(img.id))
    : images;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Section */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-6 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h2>
          <ProfileSettings />
        </div>
        
        <nav className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Library</p>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === "all" ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            🖼️ All Images
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === "favorites" ? "bg-rose-50 text-rose-600" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            ❤️ Favorites
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {activeTab === "all" ? "My Gallery" : "Your Favorites"}
            </h1>
            <p className="text-slate-500">Manage and share your visual assets</p>
          </div>


           
          <button onClick={() => navigate("/upload")} 
          className="hidden sm:block bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
           + Upload New
          </button>




        </header>

        {/* Responsive Grid */}
        {displayedImages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg italic">No images found in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedImages.map(img => (
              <div key={img.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button 
                    onClick={() => toggleFavorite(img.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-110 transition-all"
                  >
                    {favorites.includes(img.id) ? "❤️" : "🤍"}
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-bold text-slate-800 truncate mb-4">{img.title || "Untitled Image"}</h4>
                  
                  <div className="flex flex-col gap-2">
                    {!img.isPublic && (
                      <button
                        onClick={() => generateSecureLink(img.id)}
                        className="w-full text-xs font-bold py-2 px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        🔐 Secure Share
                      </button>
                    )}
                    <button 
                      onClick={() => deleteImage(img.id)}
                      className="w-full text-xs font-bold py-2 px-3 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      Delete Asset
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;