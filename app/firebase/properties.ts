import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  description: string;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

const DEFAULT_COLLECTION = "properties";

const parseNumber = (value: unknown) => {
  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const cleaned = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(cleaned) ? cleaned : 0;
  }

  return 0;
};

const normalizeProperty = (
  id: string,
  data: Record<string, unknown>,
): Property => ({
  id,
  title: String(data.title ?? data.name ?? "Untitled Property"),
  price: parseNumber(data.price),
  location: String(data.location ?? data.city ?? "Unknown Location"),
  bedrooms: parseNumber(data.bedrooms ?? data.beds),
  bathrooms: parseNumber(data.bathrooms ?? data.baths),
  image: String(data.image ?? data.imageUrl ?? DEFAULT_IMAGE),
  description: String(data.description ?? ""),
});

const getCollectionProperties = async (collectionName: string) => {
  const snapshot = await getDocs(collection(db, collectionName));

  return snapshot.docs.map((docSnapshot) =>
    normalizeProperty(
      docSnapshot.id,
      docSnapshot.data() as Record<string, unknown>,
    ),
  );
};

const resolvePropertyCollection = async () => {
  const propertiesSnapshot = await getDocs(collection(db, DEFAULT_COLLECTION));

  if (!propertiesSnapshot.empty) {
    return DEFAULT_COLLECTION;
  }

  const listingsSnapshot = await getDocs(collection(db, "listings"));

  if (!listingsSnapshot.empty) {
    return "listings";
  }

  return DEFAULT_COLLECTION;
};

export const getProperties = async () => {
  const properties = await getCollectionProperties(DEFAULT_COLLECTION);

  if (properties.length > 0) {
    return properties;
  }

  return getCollectionProperties("listings");
};

export const getPropertyById = async (id: string) => {
  const collectionName = await resolvePropertyCollection();
  const snapshot = await getDoc(doc(db, collectionName, id));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeProperty(
    snapshot.id,
    snapshot.data() as Record<string, unknown>,
  );
};

export type PropertyInput = Omit<Property, "id">;

export const addProperty = async (property: PropertyInput) => {
  const collectionName = await resolvePropertyCollection();
  const docRef = await addDoc(collection(db, collectionName), property);

  return {
    id: docRef.id,
    ...property,
  };
};

export const updateProperty = async (id: string, property: PropertyInput) => {
  const collectionName = await resolvePropertyCollection();
  await updateDoc(doc(db, collectionName, id), property);

  return {
    id,
    ...property,
  };
};

export const deleteProperty = async (id: string) => {
  const collectionName = await resolvePropertyCollection();
  await deleteDoc(doc(db, collectionName, id));
};
