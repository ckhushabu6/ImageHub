import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function ShareView() {
  const { tokenId } = useParams();
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedImage = async () => {
      try {
        // 1️⃣ Get shared link document
        const shareRef = doc(db, "sharedLinks", tokenId);
        const shareSnap = await getDoc(shareRef);

        if (!shareSnap.exists()) {
          setError("Invalid or expired link");
          return;
        }

        const { imageId, expiryDate } = shareSnap.data();

        // 2️⃣ Check expiry
        const now = new Date();
        if (expiryDate.toDate() < now) {
          setError("This sharing link has expired");
          return;
        }

        // 3️⃣ Fetch image
        const imageRef = doc(db, "images", imageId);
        const imageSnap = await getDoc(imageRef);

        if (!imageSnap.exists()) {
          setError("Image not found");
          return;
        }

        setImage(imageSnap.data());
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedImage();
  }, [tokenId]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  if (error) {
    return <p className="text-center text-red-500 mt-6">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <img
        src={image.imageUrl}
        alt={image.title}
        className="w-full rounded"
      />
      <h2 className="mt-2 font-semibold">{image.title}</h2>
    </div>
  );
}

export default ShareView;
