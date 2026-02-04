import { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const ImageCard = ({ image }) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const favs = snap.data().favorites || [];
        setIsFav(favs.includes(image.id));
      }
    };
    checkFavorite();
  }, [image.id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation(); 
    if (!auth.currentUser) return alert("Please login first!");

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      favorites: isFav ? arrayRemove(image.id) : arrayUnion(image.id),
    });

    setIsFav(!isFav);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out w-full">
      
      {/* Image Section */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
        <img 
          src={image.imageUrl} 
          alt={image.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
          loading="lazy"
        />
        
        {/* Gradient Overlay for better legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite Button (Premium Glassmorphism) */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 active:scale-90 ${
            isFav 
            ? "bg-rose-500 border-rose-400 text-white shadow-rose-200 shadow-lg" 
            : "bg-white/70 border-white/50 text-slate-600 hover:bg-white hover:text-rose-500 shadow-md"
          }`}
          aria-label="Toggle Favorite"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill={isFav ? "currentColor" : "none"} 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={isFav ? "0" : "2"} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-base font-bold text-slate-800 truncate tracking-tight">
            {image.title || "Untitled Masterpiece"}
          </h4>
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
             {image.category || "General"}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 mt-1">
            {/* Small status indicator or secondary info */}
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            <p className="text-xs font-medium text-slate-400 italic">
              Ready to view
            </p>
        </div>
      </div>

    </div>
  );
};

export default ImageCard;