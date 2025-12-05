// src/pages/Auth.tsx
import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<boolean>(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const showMessage = (msg: string, error = false) => {
    setStatusMessage(msg);
    setStatusError(error);
    setTimeout(() => {
      setStatusMessage(null);
      setStatusError(false);
    }, 6000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (isSigningUp) {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        setUser(cred.user);
        window.location.assign("/dashboard");
      } else {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        setUser(cred.user);
        window.location.assign("/dashboard");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const msg =
        err?.code === "auth/wrong-password"
          ? "Wrong password."
          : err?.code === "auth/user-not-found"
            ? "No account found with this email."
            : err?.message || "Authentication error";
      showMessage(msg, true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      window.location.assign("/");
    } catch (err) {
      console.error("Sign out error:", err);
      showMessage("Sign out failed.", true);
    }
  };

  if (user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Welcome, {user.email}</h2>
        <p>User ID: {user.uid}</p>

        <div style={{ marginTop: 12 }}>
          <button onClick={() => window.location.assign("/dashboard")} style={primaryBtn}>
            Go to Dashboard
          </button>

          <button
            onClick={handleSignOut}
            style={{ ...primaryBtn, marginLeft: 12, background: "#777" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "24px auto", padding: 20 }}>
      <div style={card}>
        <h2 style={{ marginBottom: 12 }}>
          {isSigningUp ? "Create Account" : "Login"}
        </h2>

        {statusMessage && (
          <div
            style={{
              marginBottom: 12,
              padding: 10,
              borderRadius: 6,
              background: statusError ? "#ffd6d6" : "#e6ffed",
              color: statusError ? "#900" : "#060",
            }}
          >
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            style={{ width: "100%", padding: 12 }}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            type="password"
            required
            style={{ width: "100%", padding: 12 }}
          />

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button type="submit" disabled={loading} style={primaryBtn}>
              {loading ? "Please wait..." : isSigningUp ? "Create Account" : "Login"}
            </button>

            <button
              type="button"
              onClick={() => setIsSigningUp(!isSigningUp)}
              style={{
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                color: "#0b5fff",
                cursor: "pointer",
              }}
            >
              {isSigningUp ? "Have an account? Login" : "No account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 8,
  padding: 18,
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  background: "#0b5fff",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
