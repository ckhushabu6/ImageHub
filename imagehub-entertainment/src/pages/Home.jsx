import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [randomImages, setRandomImages] = useState([]);

  useEffect(() => {
    // Picsum API
    const fetchImages = () => {
      const images = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        url: `https://picsum.photos/seed/${Math.random() + i}/600/800`
      }));
      setRandomImages(images);
    };
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
          Your Personal <span className="text-indigo-600 dark:text-indigo-400">ImageHub</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10 font-medium">
          Upload your favorite clicks, organize them by categories, and discover 
          new inspirations based on your interests.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <button 
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1"
          >
            Live Exploration
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            Sign In
          </button>
        </div>

        {/* --- RANDOM EXPLORATION SECTION --- */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Explore Gallery
            </h2>
            <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 animate-pulse">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              LIVE DISCOVERY
            </span>
          </div>

          {/* Updated Image Grid: 1 column on small screen, 2 on xs, 3 on md, 6 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {randomImages.map((img) => (
              <div 
                key={img.id} 
                className="group relative h-80 sm:h-64 overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <img 
                  src={img.url} 
                  alt="Discovery Asset" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-[10px] text-white font-bold tracking-widest uppercase">
                    Preview Mode
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 pt-4">
            Sign up to upload your own images and save favorites to your profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;