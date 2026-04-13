import type { User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreError,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type ScheduledTour = {
  id: string;
  listingId: string;
  listingImage: string;
  listingLocation: string;
  listingPrice: number;
  listingTitle: string;
  notes: string;
  scheduledAt: string;
};

export type ScheduleTourInput = Omit<ScheduledTour, "id">;

function isFirestorePermissionError(error: unknown) {
  return (
    error instanceof FirestoreError &&
    error.code === "permission-denied"
  );
}

export function getFirestoreErrorMessage(
  error: unknown,
  fallbackMessage: string,
  context?: "scheduledTours"
) {
  if (isFirestorePermissionError(error)) {
    if (context === "scheduledTours") {
      return "Firestore blocked access to scheduled tours. Add rules for users/{uid}/scheduledTours so signed-in users can manage their own tours.";
    }

    return "Firestore denied this request. Check your Firebase security rules.";
  }

  return error instanceof Error ? error.message : fallbackMessage;
}

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

export const scheduleTourForUser = async (uid: string, input: ScheduleTourInput) => {
  const ref = collection(db, "users", uid, "scheduledTours");

  await addDoc(ref, {
    ...input,
    createdAt: new Date().toISOString(),
  });
};

export const getScheduledToursForUser = async (uid: string) => {
  const ref = collection(db, "users", uid, "scheduledTours");
  const snapshot = await getDocs(query(ref, orderBy("scheduledAt", "asc")));

  return snapshot.docs.map((tourDoc) => ({
    id: tourDoc.id,
    ...(tourDoc.data() as Omit<ScheduledTour, "id">),
  }));
};

export const cancelScheduledTourForUser = async (uid: string, tourId: string) => {
  const ref = doc(db, "users", uid, "scheduledTours", tourId);
  await deleteDoc(ref);
};
