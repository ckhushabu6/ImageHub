import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Upload = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Nature");
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ["Nature", "Tech", "Art", "Travel", "Food"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image!");

    setLoading(true);

    try {
      // ----- Debug: check env variables -----
      console.log("Preset:", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      console.log("Cloud Name:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      // Cloudinary unsigned upload URL
      const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      // Upload to Cloudinary
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Cloudinary response:", res.data);

      const imageUrl = res.data.secure_url;

      // Save metadata to Firestore
      await addDoc(collection(db, "images"), {
        title,
        description,
        category,
        isPublic,
        ownerId: currentUser.uid,
        imageUrl,
        createdAt: Timestamp.now(),
      });

      alert("✅ Image uploaded successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("Nature");
      setIsPublic(true);
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err.response || err.message || err);
      alert(
        "❌ Upload failed!\n" +
          (err.response?.data?.error?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Image</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
          Public
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default Upload;

const styles = {
  container: {
    padding: "30px",
    maxWidth: "500px",
    margin: "30px auto",
    background: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  btn: {
    padding: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
