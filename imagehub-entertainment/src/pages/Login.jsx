import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const options = ["Nature", "Tech", "Art", "Travel", "Food"];

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, interests);
      }
      navigate("/dashboard"); // redirect after login/signup
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {!isLogin && (
          <div>
            <p>Select your interests:</p>
            {options.map((opt) => (
              <label key={opt} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={interests.includes(opt)}
                  onChange={() => toggleInterest(opt)}
                />{" "}
                {opt}
              </label>
            ))}
          </div>
        )}

        <button type="submit" style={styles.submitBtn}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={styles.toggleBtn}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    padding: "30px",
    maxWidth: "400px",
    margin: "50px auto",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  submitBtn: {
    padding: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  toggleBtn: {
    color: "#4f46e5",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
};
