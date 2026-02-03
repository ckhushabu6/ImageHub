import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome to ImageHub</h1>
      <p>Discover, share, and manage your images.</p>
      <div style={styles.buttons}>
        <button onClick={() => navigate("/login")} style={styles.btn}>
          Login / Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    textAlign: "center",
    gap: "20px",
  },
  buttons: {
    display: "flex",
    gap: "16px",
  },
  btn: {
    padding: "12px 24px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
