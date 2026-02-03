import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Upload from "./pages/Upload.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SharedImage from "./pages/SharedImage.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // wait for Firebase auth to load

  return (
    <BrowserRouter>
      {currentUser && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={!currentUser ? <Home /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/login"
          element={!currentUser ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route path="/share/:token" element={<SharedImage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/upload"
          element={currentUser ? <Upload /> : <Navigate to="/" />}
        />
        <Route
          path="/recommendations"
          element={currentUser ? <Recommendations /> : <Navigate to="/" />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
