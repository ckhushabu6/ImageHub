import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
  documentId,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import ImageCard from "../components/ImageCard";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [favoriteImages, setFavoriteImages] = useState([]);
  const [activeTab, setActiveTab] = useState("myImages");

  /* =========================
     📸 Fetch User Images
  ========================== */
  useEffect(() => {
    const fetchImages = async () => {
      const q = query(
        collection(db, "images"),
        where("ownerId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      setImages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    fetchImages();
  }, []);

  /* =========================
     ❤️ Fetch Favorite Images
  ========================== */
  const fetchFavorites = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      setFavoriteImages([]);
      return;
    }

    const favIds = userSnap.data().favorites || [];

    if (favIds.length === 0) {
      setFavoriteImages([]);
      return;
    }

    // Firestore "in" query limit = 10
    const q = query(
      collection(db, "images"),
      where(documentId(), "in", favIds.slice(0, 10))
    );

    const snap = await getDocs(q);
    setFavoriteImages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  /* =========================
     🔐 Generate Secure Link
  ========================== */
  const generateSecureLink = async (imageId) => {
    const token = Math.random().toString(36).substring(2, 12);
    const expiryDate = Timestamp.fromDate(
      new Date(Date.now() + 24 * 60 * 60 * 1000) // +24 hours
    );

    await updateDoc(doc(db, "images", imageId), {
      shareToken: token,
      shareExpiry: expiryDate,
    });

    const link = `${window.location.origin}/share/${token}`;
    alert(`Secure link generated:\n${link}`);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Dashboard</h2>

      {/* =========================
          Tabs
      ========================== */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("myImages")}
          style={activeTab === "myImages" ? styles.activeTab : styles.tab}
        >
          My Images
        </button>

        <button
          onClick={() => {
            setActiveTab("favorites");
            fetchFavorites();
          }}
          style={activeTab === "favorites" ? styles.activeTab : styles.tab}
        >
          Favorites ❤️
        </button>
      </div>

      {/* =========================
          My Images
      ========================== */}
      {activeTab === "myImages" && (
        <div style={styles.grid}>
          {images.map((img) => (
            <div key={img.id} style={styles.card}>
              <img
                src={img.imageUrl}
                alt={img.title}
                style={styles.image}
              />
              <h4>{img.title}</h4>

              {!img.isPublic && (
                <button
                  onClick={() => generateSecureLink(img.id)}
                  style={styles.button}
                >
                  Generate Secure Link
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* =========================
          Favorites
      ========================== */}
      {activeTab === "favorites" && (
        favoriteImages.length === 0 ? (
          <p>No favorites yet ❤️</p>
        ) : (
          <div style={styles.grid}>
            {favoriteImages.map((img) => (
              <ImageCard key={img.id} image={img} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;

/* =========================
   Styles
========================= */
const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    padding: "12px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  button: {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  tab: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  activeTab: {
    padding: "8px 14px",
    borderRadius: "6px",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
  },
};
