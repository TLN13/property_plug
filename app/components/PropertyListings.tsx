"use client";

import { useEffect, useMemo, useState } from "react";
import PropertyCard from "@/app/components/PropertyCard";
import { getProperties, type Property } from "@/app/firebase/properties";

type Filters = {
  search: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
};

const initialFilters: Filters = {
  search: "",
  location: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
};

export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (loadError) {
        console.error("Failed to load properties", loadError);
        setError("Unable to load listings right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  const locations = useMemo(() => {
    return [...new Set(properties.map((property) => property.location))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const bedroomOptions = useMemo(() => {
    return [...new Set(properties.map((property) => property.bedrooms))]
      .filter((value) => value > 0)
      .sort((a, b) => a - b);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();
    const minPrice = Number(filters.minPrice) || 0;
    const maxPrice = Number(filters.maxPrice) || Number.POSITIVE_INFINITY;
    const minBedrooms = Number(filters.bedrooms) || 0;

    return properties.filter((property) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm);

      const matchesLocation =
        filters.location.length === 0 || property.location === filters.location;

      const matchesPrice =
        property.price >= minPrice && property.price <= maxPrice;

      const matchesBedrooms =
        minBedrooms === 0 || property.bedrooms >= minBedrooms;

      return (
        matchesSearch && matchesLocation && matchesPrice && matchesBedrooms
      );
    });
  }, [filters, properties]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold text-[#4b2e2b]">
          Property Listings
        </h1>
        <p className="mb-8 text-[#7a5c58]">
          Browse available homes and properties.
        </p>

        <section className="mb-8 rounded-2xl bg-white p-5 shadow-md">
          <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <input
              type="text"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search by title or location"
              className="rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
            />

            <select
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
              className="rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => updateFilter("minPrice", event.target.value)}
              placeholder="Min price"
              className="rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
            />

            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
              placeholder="Max price"
              className="rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
            />

            <select
              value={filters.bedrooms}
              onChange={(event) => updateFilter("bedrooms", event.target.value)}
              className="rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
            >
              <option value="">Any bedrooms</option>
              {bedroomOptions.map((bedroomCount) => (
                <option key={bedroomCount} value={String(bedroomCount)}>
                  {bedroomCount}+ bedrooms
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 text-sm text-[#7a5c58] md:flex-row md:items-center md:justify-between">
            <p>
              Showing {filteredProperties.length} of {properties.length}{" "}
              properties
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-[#a46b45] px-4 py-2 text-[#a46b45] transition hover:bg-[#a46b45] hover:text-white"
            >
              Clear filters
            </button>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[#7a5c58] shadow-md">
            Loading listings...
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-8 text-center text-red-600 shadow-md">
            {error}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[#7a5c58] shadow-md">
            No properties match your current filters.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
