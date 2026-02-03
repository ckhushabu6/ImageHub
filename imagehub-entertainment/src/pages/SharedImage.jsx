import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const SharedImage = () => {
  const { token } = useParams();
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedImage = async () => {
      try {
        const q = query(
          collection(db, "images"),
          where("shareToken", "==", token)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("Invalid or expired link");
          return;
        }

        const imgData = snapshot.docs[0].data();
        const expiry = imgData.shareExpiry?.toDate();

        if (!expiry || new Date() > expiry) {
          setError("This link is no longer active");
          return;
        }

        setImage(imgData);
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedImage();
  }, [token]);

  if (loading) return <p style={styles.center}>Loading...</p>;

  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <img src={image.imageUrl} alt={image.title} style={styles.image} />
      <h2>{image.title}</h2>
      <p>{image.description}</p>
    </div>
  );
};

export default SharedImage;

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center",
  },
  image: {
    width: "100%",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  center: {
    textAlign: "center",
    marginTop: "40px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "40px",
    fontWeight: "bold",
  },
};
