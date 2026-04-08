import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// ✅ Create user if not exists
export const createUserIfNotExists = async (user: User) => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      role: "user",
    });
  }
};

// ✅ Get user role
export const getUserRole = async (uid: string) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  return snap.data()?.role;
};
