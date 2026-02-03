import { collection, doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Simple random token generator
const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const generateSecureShareLink = async (imageId, daysValid = 3) => {
  const tokenId = generateToken();

  // expiry date (now + X days)
  const expiryDate = Timestamp.fromDate(
    new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000)
  );

  await setDoc(doc(collection(db, "sharedLinks"), tokenId), {
    imageId,
    expiryDate,
    createdAt: serverTimestamp(),
  });

  // Frontend shareable URL
  return `${window.location.origin}/share/${tokenId}`;
};
