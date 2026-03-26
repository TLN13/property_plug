"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  AuthError,
} from "firebase/auth";
import { auth } from "@/app/firebase/firebase";
import { useRouter } from "next/navigation";
import { getUserRole, createUserIfNotExists } from "@/app/firebase/firestore";

type Mode = "login" | "signup" | "reset";

const googleProvider = new GoogleAuthProvider();

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      let user;
      if (mode === "login") {
        const result = await signInWithEmailAndPassword(auth, email, password);
        user = result.user;
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        user = result.user;
        await createUserIfNotExists(user);
      }
      
      const role = await getUserRole(user.uid);
      router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
    } catch (err) {
      setError(friendlyError((err as AuthError).code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserIfNotExists(result.user);
      const role = await getUserRole(result.user.uid);
      router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
    } catch (err) {
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
      setError(friendlyError((err as AuthError).code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left panel */}
      <div className="flex-1 bg-blue-300 text-white flex flex-col justify-center p-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Property Plug</h1>
          <p className="text-gray-200 mb-6">
            You can add description or info about your app here.
          </p>
          <div className="flex gap-6">
            <div>
              <div className="text-2xl font-bold">0+</div>
              <div className="text-sm text-white/70 mt-1">Active listings</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-white/70 mt-1">Verified properties</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0.0★</div>
              <div className="text-sm text-white/70 mt-1">Avg. agent rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-12 bg-gray-50">
        <div className="w-full bg-white rounded-2xl p-10 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {mode === "login"
                ? "Welcome back"
                : mode === "signup"
                ? "Create account"
                : "Reset password"}
            </h2>
            <p className="text-sm text-gray-500">
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
                className="w-full flex items-center justify-center gap-2 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Continue with Google
              </button>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex-1 h-px bg-gray-300"></span>
                <span className="text-sm text-gray-400">or</span>
                <span className="flex-1 h-px bg-gray-300"></span>
              </div>
            </>
          )}

          <form
            onSubmit={mode === "reset" ? handlePasswordReset : handleEmailAuth}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {mode !== "reset" && (
              <div className="relative flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 bottom-2 text-xs text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            )}

            {mode === "signup" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode("reset")}
                  className="text-sm text-green-600 underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 mt-1 font-semibold text-white rounded ${
                loading ? "bg-green-800/70 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
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
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="text-green-600 underline"
                >
                  Sign up
                </button>
              </p>
            )}
            {mode === "signup" && (
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-green-600 underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === "reset" && (
              <button
                onClick={() => switchMode("login")}
                className="text-sm text-green-600 underline"
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