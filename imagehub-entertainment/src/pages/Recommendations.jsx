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

        /* =========================
           1️⃣ Fetch user interests
        ========================== */
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

        /* =========================
           2️⃣ Query public images
           matching interests
        ========================== */
        const imagesQuery = query(
          collection(db, "images"),
          where("isPublic", "==", true),
          where("category", "in", userInterests.slice(0, 10)) // Firestore limit
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
    return <p style={styles.loading}>Loading recommendations...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Recommended For You</h2>

      {images.length === 0 ? (
        <div style={styles.noResult}>
          <p>No matching images found 😔</p>
          <p>Try exploring popular categories:</p>
          <div style={styles.tags}>
            {["Nature", "Tech", "Art", "Travel", "People"].map((cat) => (
              <span key={cat} style={styles.tag}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {images.map((img) => (
            <div key={img.id} style={styles.card}>
              <img
                src={img.imageUrl}
                alt={img.title}
                style={styles.image}
              />
              <div style={styles.cardInfo}>
                <h4>{img.title}</h4>
                <p style={styles.category}>{img.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;

/* =========================
   Styles (Responsive Grid)
========================= */
const styles = {
  container: {
    padding: "30px",
  },
  heading: {
    marginBottom: "20px",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    background: "#fff",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  cardInfo: {
    padding: "10px",
  },
  category: {
    fontSize: "12px",
    color: "#6b7280",
  },
  noResult: {
    textAlign: "center",
    marginTop: "40px",
  },
  tags: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  tag: {
    padding: "6px 12px",
    borderRadius: "20px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "13px",
  },
};
