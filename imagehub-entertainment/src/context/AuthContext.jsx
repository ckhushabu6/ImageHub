import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

// 🔹 Named export for context
export const AuthContext = createContext();

// 🔹 Custom hook for convenience
export const useAuth = () => useContext(AuthContext);

// 🔹 Provider
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔐 Signup
  const signup = async (email, password, interests) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // Save user profile + interests
    await setDoc(doc(db, "users", res.user.uid), {
      email,
      interests,
      createdAt: new Date(),
    });
  };

  // 🔓 Login
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // 🚪 Logout
  const logout = () => signOut(auth);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
