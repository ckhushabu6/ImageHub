import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // go to home after logout
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>
        ImageHub
      </Link>
      <div style={styles.links}>
        <Link to="/upload" style={styles.link}>Upload</Link>
        <Link to="/recommendations" style={styles.link}>Recommendations</Link>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#4f46e5",
    color: "#fff",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
  },
  logoutBtn: {
    background: "#fff",
    color: "#4f46e5",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
  },
};
