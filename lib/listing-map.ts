import type { Listing } from "@/lib/listing-format";

const ALBERTA_CITY_COORDINATES: Record<string, [number, number]> = {
  airdrie: [51.2917, -114.0144],
  banff: [51.1784, -115.5708],
  beaumont: [53.3501, -113.4187],
  calgary: [51.0447, -114.0719],
  canmore: [51.089, -115.359],
  chestermere: [51.0382, -113.8234],
  cochrane: [51.1894, -114.466],
  edmonton: [53.5461, -113.4938],
  "fort mcmurray": [56.7264, -111.3803],
  "fort saskatchewan": [53.7128, -113.2159],
  "grande prairie": [55.1707, -118.7947],
  lethbridge: [49.6935, -112.8418],
  lloydminster: [53.278, -110.0061],
  "medicine hat": [50.0405, -110.6761],
  okotoks: [50.7289, -113.9756],
  "red deer": [52.2681, -113.8112],
  "sherwood park": [53.5168, -113.3216],
  "spruce grove": [53.5444, -113.919],
  "st. albert": [53.6305, -113.6256],
  "st albert": [53.6305, -113.6256],
};

export type ListingCityGroup = {
  city: string;
  coordinates: [number, number];
  listings: Listing[];
};

function normalizeLocation(value: string) {
  return value.trim().toLowerCase();
}

function toCityLabel(cityKey: string) {
  return cityKey
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getListingCityKey(location: string) {
  const normalizedLocation = normalizeLocation(location);

  return (
    Object.keys(ALBERTA_CITY_COORDINATES).find((cityKey) =>
      normalizedLocation.includes(cityKey)
    ) ?? null
  );
}

export function groupListingsByCity(listings: Listing[]) {
  const groups = new Map<string, ListingCityGroup>();

  for (const listing of listings) {
    const cityKey = getListingCityKey(listing.location);

    if (!cityKey) {
      continue;
    }

    const existing = groups.get(cityKey);

    if (existing) {
      existing.listings.push(listing);
      continue;
    }

    groups.set(cityKey, {
      city: toCityLabel(cityKey),
      coordinates: ALBERTA_CITY_COORDINATES[cityKey],
      listings: [listing],
    });
  }

  return [...groups.values()].sort((left, right) => left.city.localeCompare(right.city));
}
