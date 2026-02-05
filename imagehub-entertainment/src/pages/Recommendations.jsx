import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const Recommendations = () => {
  const [images, setImages] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setLoading(false);
          return;
        }

        const userInterests = userSnap.data().interests || [];
        setInterests(userInterests);

        if (userInterests.length === 0) {
          setLoading(false);
          return;
        }

        const imagesQuery = query(
          collection(db, "images"),
          where("isPublic", "==", true),
          where("category", "in", userInterests.slice(0, 10))
        );

        const querySnapshot = await getDocs(imagesQuery);
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setImages(results);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-8 mx-auto md:mx-0"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="h-48 bg-slate-200 animate-pulse w-full"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 animate-pulse w-3/4 rounded"></div>
                <div className="h-3 bg-slate-200 animate-pulse w-1/2 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Recommended For You</h2>
          <p className="text-slate-500 mt-1 italic text-sm">Matches your interests: {interests.join(", ")}</p>
        </div>
        <div className="h-1 flex-1 bg-slate-100 mx-8 mb-4 hidden lg:block rounded-full"></div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm">
          <div className="text-5xl mb-4">😔</div>
          <h3 className="text-xl font-bold text-slate-700">No matching images found</h3>
          <p className="text-slate-500 mb-8 px-4 text-sm">Try adding more interests or explore these:</p>
          
          <div className="flex flex-wrap justify-center gap-3 px-4">
            {["Nature", "Tech", "Art", "Travel", "People"].map((cat) => (
              <span 
                key={cat} 
                className="px-6 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs shadow-sm border border-indigo-100"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {images.map((img) => (
            <div 
              key={img.id} 
              className="group bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category Tag Overlay */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-white rounded-lg border border-white/20">
                    {img.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h4 className="font-bold text-slate-800 text-base truncate">
                  {img.title || "Untitled Artwork"}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;