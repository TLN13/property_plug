"use client";

import Image from "next/image";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthError,
} from "firebase/auth";
import { auth } from "@/app/firebase/firebase";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/app/firebase/auth";
import { createUserIfNotExists, getUserRole } from "@/app/firebase/firestore";

type Mode = "login" | "signup" | "reset";

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-api-key":
      "Firebase rejected this app's API key. Double-check your Vercel Firebase environment variables.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/popup-blocked":
      "Your browser blocked the Google sign-in popup. Allow popups for this site and try again.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/operation-not-allowed":
      "Google sign-in is not enabled in Firebase Authentication for this project.",
    "auth/unauthorized-domain":
      "This domain is not authorized for Firebase sign-in. Add your Vercel domain in Firebase Authentication > Settings > Authorized domains.",
    "auth/configuration-not-found":
      "Google sign-in is not fully configured in Firebase Authentication for this project.",
  };
  return map[code] ?? `Something went wrong (${code}). Please try again.`;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setError("");
    setInfo("");
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    clearMessages();
  };

  const redirectBasedOnRole = async (uid: string) => {
    const role = await getUserRole(uid);
    if (role === "admin") router.push("/dashboard/admin");
    else router.push("/dashboard/user");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      let userCredential;
      if (mode === "login") {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user in Firestore if it doesn't exist
        await createUserIfNotExists(userCredential.user);
      }

      // ✅ Redirect based on role
      await redirectBasedOnRole(userCredential.user.uid);
    } catch (err) {
      console.error("Auth error:", err);
      setError(friendlyError((err as AuthError).code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      await createUserIfNotExists(user);
      await redirectBasedOnRole(user.uid);
    } catch (err) {
      console.error("Firebase Google Sign-In Error:", err);
      setError(friendlyError((err as AuthError).code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email) {
      setError("Enter your email address above.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("Reset link sent — check your inbox.");
    } catch (err) {
      console.error("Password reset error:", err);
      setError(friendlyError((err as AuthError).code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left panel */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-16 text-center"
        style={{ backgroundColor: "#FFF8F0", color: "#5A3A36" }}
      >
        <div className="flex w-full max-w-3xl flex-col items-center">
          <Image
            src="/property-plug-logo.png"
            alt="Property Plug logo"
            width={900}
            height={900}
            priority
            className="mb-8 h-auto w-full max-w-[900px]"
          />
          <p className="mb-6 text-[#4B2E2B]">
            You can add description or info about your app here.
          </p>
          <div className="flex gap-6">
            <div>
              <div className="text-2xl font-bold">0+</div>
              <div className="mt-1 text-sm text-[#4B2E2B]">Active listings</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0%</div>
              <div className="mt-1 text-sm text-[#4B2E2B]">Verified properties</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0.0★</div>
              <div className="mt-1 text-sm text-[#4B2E2B]">Avg. agent rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div
        className="flex-1 flex items-center justify-center p-12"
        style={{ backgroundColor: "#C08552" }}
      >
        <div
          className="w-full rounded-2xl p-10 shadow-lg"
          style={{ backgroundColor: "#FFF8F0" }}
        >
          <div className="mb-6">
            <h2 className="mb-1 text-xl font-bold text-[#4B2E2B]">
              {mode === "login"
                ? "Welcome back"
                : mode === "signup"
                ? "Create account"
                : "Reset password"}
            </h2>
            <p className="text-sm text-[#4B2E2B]">
              {mode === "login"
                ? "Sign in to access your dashboard."
                : mode === "signup"
                ? "Join to start your property search."
                : "We'll send a reset link to your email."}
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
              {error}
            </div>
          )}
          {info && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded">
              {info}
            </div>
          )}

          {mode !== "reset" && (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded border border-[#8C5A3C] bg-[#8C5A3C] py-2 text-[#FFF8F0] transition hover:bg-[#4B2E2B] active:bg-[#4B2E2B] disabled:cursor-not-allowed disabled:bg-[#8C5A3C]/70"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 rounded-full bg-white p-0.5"
                >
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.6H12Z"
                  />
                  <path
                    fill="#34A853"
                    d="M2.8 7.4 6 9.8c.9-2 3-3.4 6-3.4 1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7c-3.7 0-6.8 2.1-8.3 4.7Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 21.3c2.4 0 4.5-.8 6-2.2l-2.8-2.2c-.8.5-1.8.9-3.2.9-3.8 0-5.5-2.6-5.7-3.9L3 16.4c1.5 2.9 4.5 4.9 9 4.9Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M2.8 7.4A9.2 9.2 0 0 0 1.9 12c0 1.6.4 3.1 1.1 4.4l3.3-2.5c-.2-.5-.4-1.2-.4-1.9 0-.7.1-1.3.4-1.9L2.8 7.4Z"
                  />
                </svg>
                Continue with Google
              </button>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px flex-1 bg-[#D6B79F]"></span>
                <span className="text-sm text-[#4B2E2B]">or</span>
                <span className="h-px flex-1 bg-[#D6B79F]"></span>
              </div>
            </>
          )}

          <form
            onSubmit={mode === "reset" ? handlePasswordReset : handleEmailAuth}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#4B2E2B]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded border border-[#D6B79F] bg-white px-3 py-2 text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#8C5A3C]"
              />
            </div>

            {mode !== "reset" && (
              <div className="relative flex flex-col gap-1">
                <label className="text-sm font-medium text-[#4B2E2B]">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="w-full rounded border border-[#D6B79F] bg-white px-3 py-2 text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#8C5A3C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute bottom-2 right-2 text-xs text-[#8C5A3C] hover:text-[#4B2E2B] active:text-[#4B2E2B]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            )}

            {mode === "signup" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#4B2E2B]">
                  Confirm password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded border border-[#D6B79F] bg-white px-3 py-2 text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#8C5A3C]"
                />
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode("reset")}
                  className="text-sm text-[#8C5A3C] underline hover:text-[#4B2E2B] active:text-[#4B2E2B]"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-1 w-full rounded py-2 font-semibold text-[#FFF8F0] ${
                loading
                  ? "cursor-not-allowed bg-[#8C5A3C]/70"
                  : "bg-[#8C5A3C] hover:bg-[#4B2E2B] active:bg-[#4B2E2B]"
              } transition`}
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                ? "Sign in"
                : mode === "signup"
                ? "Create account"
                : "Send reset link"}
            </button>
          </form>

          <div className="mt-4 text-center">
            {mode === "login" && (
              <p className="text-sm text-[#4B2E2B]">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="text-[#8C5A3C] underline hover:text-[#4B2E2B] active:text-[#4B2E2B]"
                >
                  Sign up
                </button>
              </p>
            )}
            {mode === "signup" && (
              <p className="text-sm text-[#4B2E2B]">
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-[#8C5A3C] underline hover:text-[#4B2E2B] active:text-[#4B2E2B]"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === "reset" && (
              <button
                onClick={() => switchMode("login")}
                className="text-sm text-[#8C5A3C] underline hover:text-[#4B2E2B] active:text-[#4B2E2B]"
              >
                ← Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
