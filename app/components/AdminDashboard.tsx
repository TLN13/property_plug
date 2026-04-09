"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addProperty,
  deleteProperty,
  getProperties,
  type Property,
  type PropertyInput,
  updateProperty,
} from "@/app/firebase/properties";
import { formatPrice } from "@/app/lib/propertyFormat";
import { exportToCSV, exportToJSON, fileToBase64 } from "@/app/lib/exportUtils";
import AdminHeader from "./AdminHeader";

type PropertyFormState = {
  title: string;
  price: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  image: string;
  description: string;
};

type SortOption =
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "title-a-z";

const emptyForm: PropertyFormState = {
  title: "",
  price: "",
  location: "",
  bedrooms: "",
  bathrooms: "",
  image: "",
  description: "",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

const mapFormToPropertyInput = (form: PropertyFormState): PropertyInput => ({
  title: form.title.trim(),
  price: Number(form.price),
  location: form.location.trim(),
  bedrooms: Number(form.bedrooms),
  bathrooms: Number(form.bathrooms),
  image: form.image.trim() || DEFAULT_IMAGE,
  description: form.description.trim(),
});

const mapPropertyToForm = (property: Property): PropertyFormState => ({
  title: property.title,
  price: String(property.price),
  location: property.location,
  bedrooms: String(property.bedrooms),
  bathrooms: String(property.bathrooms),
  image: property.image,
  description: property.description,
});

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState<PropertyFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(
    new Set()
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (loadError) {
        console.error("Failed to load admin properties", loadError);
        setError("Unable to load properties right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  const updateFormField = (key: keyof PropertyFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const startEditing = (property: Property) => {
    setForm(mapPropertyToForm(property));
    setEditingId(property.id);
    setMessage("");
    setError("");
  };

  const totalInventoryValue = useMemo(() => {
    return properties.reduce((sum, property) => sum + property.price, 0);
  }, [properties]);

  const averagePrice = useMemo(() => {
    if (properties.length === 0) return 0;
    return Math.round(totalInventoryValue / properties.length);
  }, [properties, totalInventoryValue]);

  const previewImage = form.image.trim() || DEFAULT_IMAGE;

  const filteredInventory = useMemo(() => {
    const searchTerm = inventorySearch.trim().toLowerCase();
    const filtered = !searchTerm
      ? properties
      : properties.filter((property) => {
          return (
            property.title.toLowerCase().includes(searchTerm) ||
            property.location.toLowerCase().includes(searchTerm)
          );
        });

    const sorted = [...filtered];

    if (sortOption === "price-low-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high-low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === "title-a-z") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [inventorySearch, properties, sortOption]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const propertyInput = mapFormToPropertyInput(form);

      if (
        !propertyInput.title ||
        !propertyInput.location ||
        !propertyInput.description ||
        propertyInput.price <= 0 ||
        propertyInput.bedrooms <= 0 ||
        propertyInput.bathrooms <= 0
      ) {
        setError("Please fill in all fields with valid values.");
        setIsSaving(false);
        return;
      }

      if (editingId) {
        const updatedProperty = await updateProperty(editingId, propertyInput);
        setProperties((current) =>
          current.map((property) =>
            property.id === editingId ? updatedProperty : property,
          ),
        );
        setMessage("Property updated.");
      } else {
        const newProperty = await addProperty(propertyInput);
        setProperties((current) => [newProperty, ...current]);
        setMessage("Property added.");
      }

      resetForm();
    } catch (saveError) {
      console.error("Failed to save property", saveError);
      setError("Unable to save property right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = window.confirm(
      "Delete this property from Firestore?",
    );

    if (!shouldDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await deleteProperty(id);
      setProperties((current) =>
        current.filter((property) => property.id !== id),
      );

      if (editingId === id) {
        resetForm();
      }

      setMessage("Property deleted.");
    } catch (deleteError) {
      console.error("Failed to delete property", deleteError);
      setError("Unable to delete property right now.");
    }
  };

  const togglePropertySelection = (id: string) => {
    setSelectedProperties((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedProperties.size === filteredInventory.length) {
      setSelectedProperties(new Set());
    } else {
      setSelectedProperties(new Set(filteredInventory.map((p) => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProperties.size === 0) {
      setError("No properties selected.");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete ${selectedProperties.size} properties? This cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      await Promise.all(
        Array.from(selectedProperties).map((id) => deleteProperty(id))
      );

      setProperties((current) =>
        current.filter((property) => !selectedProperties.has(property.id))
      );

      setSelectedProperties(new Set());
      setMessage(`${selectedProperties.size} properties deleted.`);
    } catch (err) {
      console.error("Failed to bulk delete properties", err);
      setError("Failed to delete some properties.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      updateFormField("image", base64);
      setMessage("Image uploaded successfully.");
    } catch (err) {
      console.error("Failed to upload image", err);
      setError("Failed to upload image.");
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-[#f8f5f0] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-[2rem] bg-[#4b2e2b] text-white shadow-xl">
          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/65">
                Admin Workspace
              </p>
              <h1 className="mb-3 text-4xl font-bold">
                Manage your property inventory
              </h1>
              <p className="max-w-2xl text-white/75">
                Add new listings, update existing ones, and keep your Firestore
                collection clean from one place.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-sm text-white/70">Total listings</div>
                <div className="mt-2 text-3xl font-bold">{properties.length}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-sm text-white/70">Inventory value</div>
                <div className="mt-2 text-2xl font-bold">
                  {formatPrice(totalInventoryValue)}
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-sm text-white/70">Average price</div>
                <div className="mt-2 text-2xl font-bold">
                  {formatPrice(averagePrice)}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => exportToCSV(properties)}
                className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => exportToJSON(properties)}
                className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
              >
                Export JSON
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_1.3fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-md">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#a46b45]">
                  Listing Form
                </p>
                <h2 className="text-2xl font-semibold text-[#4b2e2b]">
                  {editingId ? "Edit property" : "Add new property"}
                </h2>
                <p className="mt-1 text-sm text-[#7a5c58]">
                  Keep each listing complete so it shows well on the public
                  pages.
                </p>
              </div>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-[#a46b45] px-4 py-2 text-sm text-[#a46b45] transition hover:bg-[#a46b45] hover:text-white"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>

            <div className="mb-6 overflow-hidden rounded-3xl border border-[#eadfd6] bg-[#f8f5f0]">
              <img
                src={previewImage}
                alt="Property preview"
                className="h-52 w-full object-cover"
              />
              <div className="grid gap-3 p-4 sm:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#a46b45]">
                    Title
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#4b2e2b]">
                    {form.title || "Property title preview"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#a46b45]">
                    Price
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#4b2e2b]">
                    {form.price ? formatPrice(Number(form.price)) : "Set a price"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#a46b45]">
                    Location
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#4b2e2b]">
                    {form.location || "Add a location"}
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4b2e2b]">
                    Property title
                  </label>
                  <input
                    type="text"
                    placeholder="Modern Condo in Calgary"
                    value={form.title}
                    onChange={(event) =>
                      updateFormField("title", event.target.value)
                    }
                    className="w-full rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4b2e2b]">
                      Price
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="425000"
                      value={form.price}
                      onChange={(event) =>
                        updateFormField("price", event.target.value)
                      }
                      className="w-full rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4b2e2b]">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Downtown Calgary"
                      value={form.location}
                      onChange={(event) =>
                        updateFormField("location", event.target.value)
                      }
                      className="w-full rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4b2e2b]">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="3"
                      value={form.bedrooms}
                      onChange={(event) =>
                        updateFormField("bedrooms", event.target.value)
                      }
                      className="w-full rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4b2e2b]">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="2"
                      value={form.bathrooms}
                      onChange={(event) =>
                        updateFormField("bathrooms", event.target.value)
                      }
                      className="w-full rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4b2e2b]">
                    Image (Upload or URL)
                  </label>
                  <div className="mb-3 flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
                    />
                  </div>
                  <p className="mb-3 text-xs text-[#7a5c58]">
                    Or paste an image URL below:
                  </p>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.image.startsWith("data:") ? "" : form.image}
                    onChange={(event) =>
                      updateFormField("image", event.target.value)
                    }
                    className="w-full rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4b2e2b]">
                    Description
                  </label>
                  <textarea
                    placeholder="Write a short summary for this property."
                    value={form.description}
                    onChange={(event) =>
                      updateFormField("description", event.target.value)
                    }
                    rows={5}
                    className="w-full rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
                    required
                  />
                </div>
              </div>

              {message ? (
                <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#a46b45] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? "Saving..."
                    : editingId
                      ? "Update property"
                      : "Add property"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[#d9c9bc] px-5 py-3 font-semibold text-[#7a5c58] transition hover:bg-[#f8f5f0]"
                >
                  Reset form
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-md">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#a46b45]">
                  Inventory
                </p>
                <h2 className="text-2xl font-semibold text-[#4b2e2b]">
                  Current listings
                </h2>
                <p className="mt-1 text-sm text-[#7a5c58]">
                  Select a listing to edit it, or remove it from Firestore.
                </p>
              </div>

              <div className="rounded-full bg-[#f8f5f0] px-4 py-2 text-sm font-medium text-[#7a5c58]">
                {properties.length} total listings
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-3 lg:flex-row">
              <input
                type="text"
                value={inventorySearch}
                onChange={(event) => setInventorySearch(event.target.value)}
                placeholder="Search listings by title or location"
                className="w-full rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
              />
              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as SortOption)
                }
                className="rounded-xl border border-[#d9c9bc] px-4 py-3 text-sm text-[#4b2e2b] outline-none focus:border-[#a46b45]"
              >
                <option value="newest">Newest first</option>
                <option value="price-low-high">Price: low to high</option>
                <option value="price-high-low">Price: high to low</option>
                <option value="title-a-z">Title: A to Z</option>
              </select>
              <button
                type="button"
                onClick={() => setInventorySearch("")}
                className="rounded-xl border border-[#d9c9bc] px-5 py-3 text-sm font-semibold text-[#7a5c58] transition hover:bg-[#f8f5f0]"
              >
                Clear
              </button>
            </div>

            {selectedProperties.size > 0 && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedProperties.size} selected
                </span>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  disabled={isSaving}
                  className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProperties(new Set())}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Deselect All
                </button>
              </div>
            )}

            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="select-all"
                checked={
                  properties.length > 0 &&
                  selectedProperties.size === filteredInventory.length
                }
                onChange={toggleSelectAll}
                className="rounded border-[#d9c9bc]"
              />
              <label htmlFor="select-all" className="text-sm text-[#7a5c58]">
                Select all visible
              </label>
            </div>

            {isLoading ? (
              <div className="rounded-3xl bg-[#f8f5f0] p-8 text-center text-[#7a5c58]">
                Loading properties...
              </div>
            ) : properties.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#d9c9bc] bg-[#fcfaf7] p-10 text-center">
                <h3 className="text-xl font-semibold text-[#4b2e2b]">
                  No properties yet
                </h3>
                <p className="mt-2 text-sm text-[#7a5c58]">
                  Add your first listing using the form on the left.
                </p>
              </div>
            ) : filteredInventory.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#d9c9bc] bg-[#fcfaf7] p-10 text-center">
                <h3 className="text-xl font-semibold text-[#4b2e2b]">
                  No matching listings
                </h3>
                <p className="mt-2 text-sm text-[#7a5c58]">
                  Try a different title or location search.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInventory.map((property) => (
                  <article
                    key={property.id}
                    className="overflow-hidden rounded-3xl border border-[#eadfd6] bg-[#fcfaf7]"
                  >
                    <div className="grid gap-0 md:grid-cols-[50px_220px_1fr]">
                      <div className="flex items-start justify-center bg-[#fcfaf7] p-4 md:bg-white">
                        <input
                          type="checkbox"
                          checked={selectedProperties.has(property.id)}
                          onChange={() => togglePropertySelection(property.id)}
                          className="mt-1 rounded border-[#d9c9bc]"
                        />
                      </div>

                      <img
                        src={property.image.startsWith("data:")
                          ? property.image
                          : property.image}
                        alt={property.title}
                        className="h-48 w-full object-cover md:h-full"
                      />

                      <div className="p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="mb-2 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#efe4d8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#a46b45]">
                                {property.location}
                              </span>
                              {editingId === property.id ? (
                                <span className="rounded-full bg-[#4b2e2b] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                                  Editing
                                </span>
                              ) : null}
                            </div>

                            <h3 className="text-2xl font-semibold text-[#4b2e2b]">
                              {property.title}
                            </h3>

                            <p className="mt-2 text-lg font-bold text-[#a46b45]">
                              {formatPrice(property.price)}
                            </p>

                            <p className="mt-2 text-sm text-gray-700">
                              {property.bedrooms} beds | {property.bathrooms} baths
                            </p>

                            <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#7a5c58]">
                              {property.description || "No description provided."}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => startEditing(property)}
                              className="rounded-xl border border-[#a46b45] px-4 py-2 text-sm font-semibold text-[#a46b45] transition hover:bg-[#a46b45] hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(property.id)}
                              className="rounded-xl border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
