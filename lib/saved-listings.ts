import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Listing } from "@/lib/listing-format";

type SavedListingRow = {
  listings:
    | {
        id: string;
        title: string;
        price: number;
        location: string;
        bedrooms: number;
        bathrooms: number;
        image_url: string;
        description: string;
      }
    | {
        id: string;
        title: string;
        price: number;
        location: string;
        bedrooms: number;
        bathrooms: number;
        image_url: string;
        description: string;
      }[]
    | null;
};

type SavedListing = {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  image_url: string;
  description: string;
};

function normalizeSavedListing(listing: SavedListingRow["listings"]): SavedListing | null {
  if (!listing) {
    return null;
  }

  if (Array.isArray(listing)) {
    return listing[0] ?? null;
  }

  return listing;
}

function mapListing(listing: SavedListing): Listing {
  return {
    id: listing.id,
    title: listing.title,
    price: listing.price,
    location: listing.location,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    image: listing.image_url,
    description: listing.description,
  };
}

function getConfiguredClient() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return supabase;
}

export async function ensureProfile({
  uid,
  email,
}: {
  uid: string;
  email: string;
}) {
  const supabase = getConfiguredClient();

  const { error } = await supabase.from("profiles").upsert(
    {
      firebase_uid: uid,
      email,
    },
    {
      onConflict: "firebase_uid",
    }
  );

  if (error) {
    throw new Error(`Failed to sync profile: ${error.message}`);
  }
}

export async function saveListingForUser({
  uid,
  email,
  listingId,
}: {
  uid: string;
  email: string;
  listingId: string;
}) {
  const supabase = getConfiguredClient();

  await ensureProfile({ uid, email });

  const { error } = await supabase.from("saved_listings").upsert(
    {
      firebase_uid: uid,
      listing_id: listingId,
    },
    {
      onConflict: "firebase_uid,listing_id",
    }
  );

  if (error) {
    throw new Error(`Failed to save listing: ${error.message}`);
  }
}

export async function removeSavedListingForUser({
  uid,
  listingId,
}: {
  uid: string;
  listingId: string;
}) {
  const supabase = getConfiguredClient();

  const { error } = await supabase
    .from("saved_listings")
    .delete()
    .eq("firebase_uid", uid)
    .eq("listing_id", listingId);

  if (error) {
    throw new Error(`Failed to remove saved listing: ${error.message}`);
  }
}

export async function isListingSavedByUser({
  uid,
  listingId,
}: {
  uid: string;
  listingId: string;
}) {
  const supabase = getConfiguredClient();

  const { data, error } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("firebase_uid", uid)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check saved listing: ${error.message}`);
  }

  return Boolean(data);
}

export async function getSavedListingsForUser(uid: string) {
  const supabase = getConfiguredClient();

  const { data, error } = await supabase
    .from("saved_listings")
    .select(
      "listings:listings!inner(id, title, price, location, bedrooms, bathrooms, image_url, description)"
    )
    .eq("firebase_uid", uid)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load saved listings: ${error.message}`);
  }

  return data
    .map((row) => normalizeSavedListing(row.listings))
    .filter((listing): listing is NonNullable<typeof listing> => Boolean(listing))
    .map(mapListing);
}
