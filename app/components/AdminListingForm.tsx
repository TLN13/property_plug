"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import type { Listing } from "@/lib/listing-format";

type FormState = {
  bathrooms: string;
  bedrooms: string;
  description: string;
  image: string;
  location: string;
  price: string;
  title: string;
};

const emptyFormState: FormState = {
  bathrooms: "",
  bedrooms: "",
  description: "",
  image: "",
  location: "",
  price: "",
  title: "",
};

type AdminListingFormProps = {
  listingId?: string;
};

export default function AdminListingForm({ listingId }: AdminListingFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const [isLoading, setIsLoading] = useState(Boolean(listingId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(listingId);

  useEffect(() => {
    if (!listingId) {
      return;
    }

    let ignore = false;

    const loadListing = async () => {
      try {
        const response = await fetch(`/api/admin/listings?id=${encodeURIComponent(listingId)}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          error?: string;
          listing?: Listing;
        };

        if (!response.ok || !data.listing) {
          throw new Error(data.error ?? "Could not load listing.");
        }

        if (!ignore) {
          setFormState({
            title: data.listing.title,
            price: String(data.listing.price),
            location: data.listing.location,
            bedrooms: String(data.listing.bedrooms),
            bathrooms: String(data.listing.bathrooms),
            image: data.listing.image,
            description: data.listing.description,
          });
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : "Could not load listing.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadListing();

    return () => {
      ignore = true;
    };
  }, [listingId]);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setIsUploadingImage(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/admin/listing-images", {
        method: "POST",
        body: uploadFormData,
      });
      const data = (await response.json()) as {
        error?: string;
        imageUrl?: string;
      };

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error ?? "Could not upload image.");
      }

      setFormState((current) => ({
        ...current,
        image: data.imageUrl!,
      }));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Could not upload image."
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/listings", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: listingId,
          title: formState.title,
          price: Number(formState.price),
          location: formState.location,
          bedrooms: Number(formState.bedrooms),
          bathrooms: Number(formState.bathrooms),
          image: formState.image,
          description: formState.description,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        listing?: Listing;
      };

      if (!response.ok || !data.listing) {
        throw new Error(data.error ?? "Could not save listing.");
      }

      router.push(`/listings/${data.listing.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!listingId) {
      return;
    }

    const confirmed = window.confirm("Delete this listing? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/listings", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: listingId }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete listing.");
      }

      router.push("/listings");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete listing.");
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-[#FFF8F0] px-4 py-8 text-[#4B2E2B] md:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col">
          <div className="rounded-[2rem] bg-[#C08552] px-8 py-10 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="text-center md:text-left">
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFF8F0] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition hover:bg-white hover:text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#FFF8F0]"
                >
                  <span aria-hidden="true">&larr;</span>
                  <span>Back to Listings</span>
                </Link>
                <p className="mt-6 text-sm uppercase tracking-[0.24em] text-[#FFF8F0]">
                  Property Plug
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-[#FFF8F0]">
                  {isEditing ? "Edit Listing" : "Add Listing"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-[#FFF8F0]">
                  {isEditing
                    ? "Update the listing details, then save your changes."
                    : "Create a new property listing for the listings page."}
                </p>
              </div>
            </div>
          </div>

          <section className="mt-4 rounded-3xl bg-white p-8 shadow-sm">
            {isLoading ? (
              <p className="text-sm text-[#4B2E2B]">Loading listing...</p>
            ) : (
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Title</span>
                  <input
                    value={formState.title}
                    onChange={(event) => handleChange("title", event.target.value)}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Location</span>
                  <input
                    value={formState.location}
                    onChange={(event) => handleChange("location", event.target.value)}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Price</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.price}
                    onChange={(event) => handleChange("price", event.target.value)}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Image URL</span>
                  <input
                    type="url"
                    value={formState.image}
                    onChange={(event) => handleChange("image", event.target.value)}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#8C5A3C] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
                  />
                  <span className="text-xs text-[#8C5A3C]">
                    {isUploadingImage
                      ? "Uploading image..."
                      : "Upload a file to Supabase Storage to fill the image URL automatically."}
                  </span>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Bedrooms</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.bedrooms}
                    onChange={(event) => handleChange("bedrooms", event.target.value)}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Bathrooms</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.bathrooms}
                    onChange={(event) => handleChange("bathrooms", event.target.value)}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Description</span>
                  <textarea
                    value={formState.description}
                    onChange={(event) => handleChange("description", event.target.value)}
                    rows={5}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                    required
                  />
                </label>

                {formState.image ? (
                  <div className="md:col-span-2">
                    <p className="mb-2 text-sm font-medium text-[#4B2E2B]">Image preview</p>
                    <div className="overflow-hidden rounded-3xl border border-[#D6B79F] bg-[#FFF8F0]">
                      <Image
                        src={formState.image}
                        alt={formState.title || "Listing preview"}
                        width={1200}
                        height={800}
                        className="h-64 w-full object-cover"
                        sizes="(min-width: 768px) 896px, 100vw"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingImage}
                    className="rounded-full bg-[#8C5A3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4B2E2B] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : isUploadingImage
                        ? "Waiting for image..."
                        : isEditing
                          ? "Save Changes"
                          : "Create Listing"}
                  </button>
                  <Link
                    href="/listings"
                    className="rounded-full border border-[#D6B79F] px-5 py-3 text-sm font-medium text-[#8C5A3C] transition hover:border-[#8C5A3C] hover:text-[#4B2E2B]"
                  >
                    Cancel
                  </Link>
                  {isEditing ? (
                    <button
                      type="button"
                      disabled={isSubmitting || isUploadingImage}
                      onClick={handleDelete}
                      className="rounded-full bg-[#4B2E2B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2F1B19] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Delete Listing
                    </button>
                  ) : null}
                </div>

                {error ? (
                  <p className="text-sm text-red-700 md:col-span-2">{error}</p>
                ) : null}
              </form>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
