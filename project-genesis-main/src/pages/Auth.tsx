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

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState("");

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

  // ----------------------- LOGIN / SIGNUP -----------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSigningUp) {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        setUser(cred.user);
        window.location.assign("/dashboard");
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
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

  // ----------------------- SIGN OUT -----------------------
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

  // ----------------------- FIXED FORGOT PASSWORD -----------------------
  const handleForgotPassword = async () => {
    // auto fallback to login email if resetEmail is empty
    const rawEmail = resetEmail?.trim() || email?.trim();
    const cleaned = rawEmail.toLowerCase();

    if (!cleaned || !cleaned.includes("@")) {
      showMessage("Please enter a valid email to reset password.", true);
      return;
    }

    setLoading(true);
    try {
      // Check providers
      const methods = await fetchSignInMethodsForEmail(auth, cleaned);

      if (methods.length === 0) {
        showMessage("No account found with this email.", true);
        return;
      }

      if (methods.includes("google.com") && !methods.includes("password")) {
        showMessage("This account uses Google Sign-In only.", true);
        return;
      }

      // Send reset mail
      await sendPasswordResetEmail(auth, cleaned);
      showMessage("Password reset email sent. Check inbox/spam.");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      showMessage(err?.message || "Could not send reset email.", true);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------- UI -----------------------
  if (user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Welcome, {user.email}</h2>
        <p>User ID: {user.uid}</p>
        <button onClick={() => window.location.assign("/dashboard")}>
          Go to Dashboard
        </button>
        <button onClick={handleSignOut} style={{ marginLeft: 12 }}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "24px auto", padding: 20 }}>
      <div style={{
        background: "#fff",
        borderRadius: 8,
        padding: 18,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}>
        <h2 style={{ marginBottom: 12 }}>
          {isSigningUp ? "Create account" : "Login"}
        </h2>

        {statusMessage && (
          <div style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 6,
            background: statusError ? "#ffd6d6" : "#e6ffed",
            color: statusError ? "#900" : "#060"
          }}>
            {statusMessage}
          </div>
        )}

        {/* LOGIN FORM */}
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
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 16px",
                background: "#0b5fff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              {loading ? "Please wait..." : (isSigningUp ? "Create account" : "Login")}
            </button>

            <button
              type="button"
              onClick={() => setIsSigningUp(!isSigningUp)}
              style={{ padding: "8px 12px", background: "transparent", border: "none", color: "#0b5fff" }}
            >
              {isSigningUp ? "Have an account? Login" : "No account? Sign up"}
            </button>
          </div>
        </form>

        {/* SEPARATOR */}
        <div style={{ height: 1, background: "#eee", margin: "18px 0" }} />

        {/* FORGOT PASSWORD */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Email for reset"
            style={{ padding: 10, flex: 1 }}
            type="email"
            onFocus={() => {
              // auto-fill email into reset field if empty
              if (!resetEmail && email) setResetEmail(email);
            }}
          />

          <button
            onClick={handleForgotPassword}
            style={{
              padding: "10px 14px",
              background: "#f0ad4e",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
            disabled={loading}
          >
            Forgot Password
          </button>
        </div>

        <p style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
          If you don't see the reset email, check Spam/Junk folder.
        </p>
      </div>
    </div>
  );
}
