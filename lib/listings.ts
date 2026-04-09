import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Listing } from "@/lib/listing-format";

export type ListingFilters = {
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
};

type ListingRow = {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  image_url: string;
  description: string;
};

function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    location: row.location,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    image: row.image_url,
    description: row.description,
  };
}

export function filterListings(listings: Listing[], filters: ListingFilters) {
  const normalizedQuery = filters.query?.trim().toLowerCase();
  const normalizedLocation = filters.location?.trim().toLowerCase();

  return listings.filter((listing) => {
    const matchesQuery =
      !normalizedQuery ||
      [listing.title, listing.location, listing.description].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );

    const matchesLocation =
      !normalizedLocation || listing.location.toLowerCase() === normalizedLocation;

    const matchesMinPrice =
      filters.minPrice === undefined || listing.price >= filters.minPrice;

    const matchesMaxPrice =
      filters.maxPrice === undefined || listing.price <= filters.maxPrice;

    const matchesBedrooms =
      filters.minBedrooms === undefined || listing.bedrooms >= filters.minBedrooms;

    const matchesBathrooms =
      filters.minBathrooms === undefined || listing.bathrooms >= filters.minBathrooms;

    return (
      matchesQuery &&
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesBedrooms &&
      matchesBathrooms
    );
  });
}

export async function getListings() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const { data, error } = await supabase
    .from("listings")
    .select("id, title, price, location, bedrooms, bathrooms, image_url, description")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load listings from Supabase: ${error.message}`);
  }

  return data.map((row) => toListing(row as ListingRow));
}

export async function getActiveListingCount() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const { count, error } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`Failed to load listings count from Supabase: ${error.message}`);
  }

  return count ?? 0;
}

export async function getListingById(id: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const { data, error } = await supabase
    .from("listings")
    .select("id, title, price, location, bedrooms, bathrooms, image_url, description")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load listing ${id} from Supabase: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return toListing(data as ListingRow);
}
