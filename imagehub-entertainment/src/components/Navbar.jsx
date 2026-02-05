import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const Navbar = () => {
 
  const { currentUser, logout } = useAuth();
  const [photoURL, setPhotoURL] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap.exists()) {
            setPhotoURL(snap.data().photoURL || "");
          }
        } catch (error) {
          console.error("Error loading nav profile:", error);
        }
      }
    };
    loadProfile();
  }, [currentUser]);

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* LEFT: Logo Section */}
          <div 
            className="flex items-center gap-2 cursor-pointer group shrink-0" 
            onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-sm">IH</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              Image<span className="font-thin text-indigo-500">Hub</span>
            </h1>
          </div>

          {/* RIGHT: Desktop Nav & Mobile Controls */}
          <div className="flex items-center gap-3">
            
            {/* Desktop Only Navigation Group */}
            <div className="hidden md:flex items-center gap-6 mr-4">
              <Link to="/dashboard" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-indigo-600 dark:hover:text-white transition-colors relative group">
                Library
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/recommendations" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-indigo-600 dark:hover:text-white transition-colors relative group">
                Explore
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </Link>
              
              <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10 mx-2" />

              {/* Theme Toggle (Desktop) */}
             

              {/* Sign Out (Desktop) */}
              <button 
                onClick={async () => { await logout(); navigate("/login"); }}
                className="px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest text-white bg-rose-500 hover:bg-rose-600 transition-all active:scale-95 shadow-md shadow-rose-200 dark:shadow-none"
              >
                Sign Out
              </button>
            </div>

            {/* Profile Avatar (Visible on all screens) */}
            <button 
              onClick={() => { navigate("/profile?from=nav"); setIsMenuOpen(false); }}
              className="w-9 h-9 md:w-11 md:h-11 rounded-full p-0.5 border-2 border-transparent hover:border-indigo-500 transition-all shrink-0"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                {photoURL ? (
                  <img src={photoURL} className="w-full h-full object-cover" alt="user" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 uppercase font-bold text-xs">
                    {currentUser?.email?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </button>

            {/* Hamburger Button (Mobile Only) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE FLOATING CARD MENU */}
        {isMenuOpen && (
          <div className="md:hidden fixed top-[72px] right-4 left-4 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-2xl border border-slate-200/50 dark:border-white/10 backdrop-blur-xl animate-in fade-in zoom-in duration-200 origin-top-right">
            <div className="flex flex-col gap-1">
              
              {/* Upload New Row (Added for Mobile Users) */}
              <Link 
                to="/upload" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between p-4 rounded-xl bg-indigo-600 text-white text-sm font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none mb-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📤</span>
                  <span>Upload New</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </Link>

              {/* Library Row */}
              <Link 
                to="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg opacity-70">📚</span>
                  <span>Library</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-30"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </Link>

              {/* Explore Row */}
              <Link 
                to="/recommendations" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg opacity-70">🌍</span>
                  <span>Explore</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-30"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </Link>

              <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-2 mx-2" />

              {/* Theme Mode Toggle Row */}
             
              {/* Sign Out Row */}
              <button 
                onClick={async () => { await logout(); navigate("/login"); setIsMenuOpen(false); }}
                className="flex items-center justify-between p-4 mt-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest transition-all active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                  <span>Sign Out</span>
                </div>
              </button>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;