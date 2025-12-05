// src/pages/Auth.tsx
import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { auth } from "../firebase";

/**
 * Professional-looking Auth component (no external CSS frameworks required).
 * Paste this file into src/pages/Auth.tsx and restart your dev server.
 */

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<boolean>(false);

  // forgot password modal
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

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

  // LOGIN / SIGNUP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@") || password.length < 6) {
      showMessage("Enter a valid email and password (min 6 chars).", true);
      setLoading(false);
      return;
    }

    try {
      if (isSigningUp) {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        setUser(cred.user);
        showMessage("Account created. Redirecting...");
        setTimeout(() => window.location.assign("/dashboard"), 700);
      } else {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        setUser(cred.user);
        showMessage("Logged in. Redirecting...");
        setTimeout(() => window.location.assign("/dashboard"), 600);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const msg =
        err?.code === "auth/wrong-password"
          ? "Wrong password."
          : err?.code === "auth/user-not-found"
            ? "No account found with this email."
            : err?.code === "auth/invalid-email"
              ? "Invalid email."
              : err?.message || "Authentication error.";
      showMessage(msg, true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      showMessage("Signed out.");
      window.location.assign("/");
    } catch (err) {
      console.error("Sign out error:", err);
      showMessage("Sign out failed.", true);
    }
  };

  // FORGOT PASSWORD
  const openForgot = (prefill?: string) => {
    setForgotEmail(prefill ? prefill : "");
    setForgotOpen(true);
  };

  const handleSendReset = async () => {
    const raw = (forgotEmail || email || "").trim().toLowerCase();
    if (!raw || !raw.includes("@")) {
      showMessage("Please enter a valid email for reset.", true);
      return;
    }

    setLoading(true);
    try {
      const methods = await fetchSignInMethodsForEmail(auth, raw);
      if (!methods || methods.length === 0) {
        showMessage("No account found with this email.", true);
        setLoading(false);
        return;
      }
      if (methods.includes("google.com") && !methods.includes("password")) {
        showMessage("This account uses Google Sign-In. Use Google login.", true);
        setLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, raw);
      showMessage("Password reset email sent. Check inbox / spam.");
      setForgotOpen(false);
    } catch (err: any) {
      console.error("Reset error:", err);
      if (err?.code === "auth/invalid-email") showMessage("Invalid email.", true);
      else if (err?.code === "auth/too-many-requests")
        showMessage("Too many requests. Try again later.", true);
      else showMessage(err?.message || "Failed to send reset email.", true);
    } finally {
      setLoading(false);
    }
  };

  // UI when user logged in
  if (user) {
    return (
      <div style={styles.page}>
        <div style={styles.loggedCard}>
          <h2 style={styles.h2}>Welcome, {user.email}</h2>
          <p style={styles.muted}>User ID: {user.uid}</p>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <button style={styles.primaryBtn} onClick={() => window.location.assign("/dashboard")}>
              Go to Dashboard
            </button>
            <button style={{ ...styles.secondaryBtn }} onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // default auth UI
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* left hero */}
        <div style={styles.left}>
          <h1 style={styles.brand}>StockAdvisor</h1>
          <p style={styles.lead}>Live market insights and portfolio tracking — secure & fast.</p>
          <img src="/hero-stocks.svg" alt="stocks" style={styles.heroImg} />
        </div>

        {/* auth card */}
        <div style={styles.card}>
          <h2 style={{ ...styles.h2, marginBottom: 6 }}>{isSigningUp ? "Create account" : "Sign in"}</h2>
          <p style={styles.mutedSmall}>{isSigningUp ? "Start tracking your portfolio" : "Welcome back — please login"}</p>

          {statusMessage && (
            <div style={{ ...styles.alert, background: statusError ? "#fff2f0" : "#f1fdf4", color: statusError ? "#9b1c1c" : "#0b7a3a" }}>
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />

            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button type="submit" disabled={loading} style={{ ...styles.primaryBtn, flex: 1 }}>
                {loading ? "Please wait..." : isSigningUp ? "Create Account" : "Login"}
              </button>

              <button
                type="button"
                onClick={() => setIsSigningUp(!isSigningUp)}
                style={styles.ghostBtn}
              >
                {isSigningUp ? "Have an account? Sign in" : "Create new account"}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <button type="button" onClick={() => openForgot(email)} style={styles.linkBtn}>
                Forgot password?
              </button>
              <span style={styles.version}>v1.0</span>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot modal */}
      {forgotOpen && (
        <div style={styles.modalBackdrop} onMouseDown={() => setForgotOpen(false)}>
          <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0 }}>Reset password</h3>
            <p style={{ marginTop: 6, color: "#666", fontSize: 13 }}>Enter the email to receive a reset link.</p>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@company.com"
              style={{ ...styles.input, marginTop: 12 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button style={styles.ghostBtn} onClick={() => setForgotOpen(false)}>Cancel</button>
              <button style={styles.primaryBtn} onClick={handleSendReset} disabled={loading}>
                {loading ? "Sending..." : "Send reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- inline styles (simple & modern) ---------- */
const styles: { [k: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: 980,
    display: "grid",
    gridTemplateColumns: "1fr 420px",
    gap: 28,
    alignItems: "center",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 24,
  },
  brand: {
    fontSize: 28,
    margin: 0,
    color: "#0b2545",
    fontWeight: 700,
  },
  lead: {
    color: "#55607a",
    maxWidth: 420,
    marginTop: 6,
  },
  heroImg: {
    width: 240,
    marginTop: 12,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 10px 30px rgba(20,30,60,0.06)",
  },
  loggedCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 10px 30px rgba(20,30,60,0.06)",
    maxWidth: 720,
  },
  h2: {
    margin: 0,
    fontSize: 20,
    color: "#071238",
  },
  mutedSmall: {
    color: "#7b8794",
    fontSize: 13,
    marginTop: 6,
  },
  muted: {
    color: "#6b7280",
  },
  alert: {
    padding: "10px 12px",
    borderRadius: 8,
    marginTop: 12,
    fontSize: 13,
  },
  label: {
    fontSize: 12,
    color: "#49536a",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e6e9ef",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },
  primaryBtn: {
    padding: "10px 14px",
    background: "#0b5fff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    padding: "10px 14px",
    background: "#777",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  ghostBtn: {
    padding: "8px 12px",
    background: "transparent",
    color: "#0b5fff",
    border: "1px solid rgba(11,95,255,0.12)",
    borderRadius: 8,
    cursor: "pointer",
  },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#475569",
    textDecoration: "underline",
    cursor: "pointer",
    padding: 0,
    fontSize: 13,
  },
  version: {
    fontSize: 12,
    color: "#9aa4b2",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 60,
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 460,
    background: "#fff",
    padding: 18,
    borderRadius: 10,
    boxShadow: "0 12px 40px rgba(2,6,23,0.2)",
  },
};
