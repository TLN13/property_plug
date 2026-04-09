"use client";

import { useState } from "react";

type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
};

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      title: "Modern Condo in Calgary",
      price: "$425,000",
      location: "Downtown Calgary",
      bedrooms: 2,
      bathrooms: 2,
    },
    {
      id: "2",
      title: "Family House in Edmonton",
      price: "$589,000",
      location: "South Edmonton",
      bedrooms: 4,
      bathrooms: 3,
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.price ||
      !formData.location ||
      !formData.bedrooms ||
      !formData.bathrooms
    ) {
      return;
    }

    if (editingId) {
      setProperties((prev) =>
        prev.map((property) =>
          property.id === editingId
            ? {
                ...property,
                title: formData.title,
                price: formData.price,
                location: formData.location,
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
              }
            : property
        )
      );
      setEditingId(null);
    } else {
      const newProperty: Property = {
        id: Date.now().toString(),
        title: formData.title,
        price: formData.price,
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
      };

      setProperties((prev) => [newProperty, ...prev]);
    }

    setFormData({
      title: "",
      price: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
    });
  };

  const handleEdit = (property: Property) => {
    setEditingId(property.id);
    setFormData({
      title: property.title,
      price: property.price,
      location: property.location,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
    });
  };

  const handleDelete = (id: string) => {
    setProperties((prev) => prev.filter((property) => property.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-[#4b2e2b]">
          Admin Dashboard
        </h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-[#4b2e2b]">
              {editingId ? "Edit Listing" : "Add New Listing"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Property Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />

              <input
                type="text"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />

              <input
                type="number"
                name="bedrooms"
                placeholder="Bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />

              <input
                type="number"
                name="bathrooms"
                placeholder="Bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-[#a46b45] px-4 py-3 text-white transition hover:opacity-90"
              >
                {editingId ? "Update Listing" : "Add Listing"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-[#4b2e2b]">
              Existing Listings
            </h2>

            <div className="space-y-4">
              {properties.length === 0 ? (
                <p className="text-gray-600">No listings available.</p>
              ) : (
                properties.map((property) => (
                  <div
                    key={property.id}
                    className="rounded-xl border p-4"
                  >
                    <h3 className="text-lg font-semibold text-[#4b2e2b]">
                      {property.title}
                    </h3>
                    <p className="text-[#a46b45] font-medium">
                      {property.price}
                    </p>
                    <p className="text-gray-600">{property.location}</p>
                    <p className="text-sm text-gray-700">
                      {property.bedrooms} Beds • {property.bathrooms} Baths
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(property)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(property.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}