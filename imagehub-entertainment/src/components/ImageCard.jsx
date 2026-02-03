import { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const ImageCard = ({ image }) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const favs = snap.data().favorites || [];
        setIsFav(favs.includes(image.id));
      }
    };

    checkFavorite();
  }, [image.id]);

  /* =========================
     ❤️ Toggle Favorite
  ========================== */
  const toggleFavorite = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);

    await updateDoc(userRef, {
      favorites: isFav
        ? arrayRemove(image.id)
        : arrayUnion(image.id),
    });

    setIsFav(!isFav);
  };

  return (
    <div style={styles.card}>
      <img src={image.imageUrl} alt={image.title} style={styles.image} />

      <div style={styles.info}>
        <h4>{image.title}</h4>

        <span
          onClick={toggleFavorite}
          style={{
            ...styles.heart,
            color: isFav ? "red" : "#aaa",
          }}
        >
          ♥
        </span>
      </div>
    </div>
  );
};

export default ImageCard;

/* =========================
   Styles
========================= */
const styles = {
  card: {
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  info: {
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heart: {
    cursor: "pointer",
    fontSize: "20px",
    userSelect: "none",
  },
};
