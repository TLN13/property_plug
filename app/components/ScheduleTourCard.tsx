"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import {
  getFirestoreErrorMessage,
  scheduleTourForUser,
} from "@/app/firebase/firestore";

type ScheduleTourCardProps = {
  listingId: string;
  listingImage: string;
  listingLocation: string;
  listingPrice: number;
  listingTitle: string;
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "medium",
  timeStyle: "short",
});

function getDefaultDateTimeValue() {
  const nextHour = new Date();
  nextHour.setMinutes(0, 0, 0);
  nextHour.setHours(nextHour.getHours() + 1);

  const offset = nextHour.getTimezoneOffset();
  const localDate = new Date(nextHour.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

export default function ScheduleTourCard({
  listingId,
  listingImage,
  listingLocation,
  listingPrice,
  listingTitle,
}: ScheduleTourCardProps) {
  const { user, isLoading } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(getDefaultDateTimeValue);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const scheduledDate = new Date(scheduledAt);

    if (Number.isNaN(scheduledDate.getTime())) {
      setError("Choose a valid date and time.");
      return;
    }

    if (scheduledDate.getTime() < Date.now()) {
      setError("Choose a future time for the tour.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      await scheduleTourForUser(user.uid, {
        listingId,
        listingImage,
        listingLocation,
        listingPrice,
        listingTitle,
        notes: notes.trim(),
        scheduledAt: scheduledDate.toISOString(),
      });

      setMessage(`Tour scheduled for ${dateTimeFormatter.format(scheduledDate)}.`);
      setNotes("");
      setScheduledAt(getDefaultDateTimeValue());
      setIsExpanded(false);
    } catch (scheduleError) {
      setError(
        getFirestoreErrorMessage(
          scheduleError,
          "Could not schedule this tour.",
          "scheduledTours"
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-6 rounded-2xl border border-[#E5D1BE] bg-[#FFF8F0] p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">Tours</p>
          <h2 className="mt-1 text-xl font-semibold text-[#2B1816]">
            Schedule a viewing
          </h2>
          <p className="mt-2 text-sm text-[#2B1816]">
            Choose when you want to visit this property and save it to your tours
            calendar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError("");
            setMessage("");
            setIsExpanded((current) => !current);
          }}
          className="inline-flex items-center justify-center rounded-full bg-[#8C5A3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4B2E2B]"
        >
          {isExpanded ? "Close Scheduler" : "Schedule Tour"}
        </button>
      </div>

      {isExpanded ? (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[#4B2E2B]">Tour date and time</span>
            <input
              type="datetime-local"
              value={scheduledAt}
              min={getDefaultDateTimeValue()}
              onChange={(event) => setScheduledAt(event.target.value)}
              className="rounded-2xl border border-[#D6B79F] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
              required
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium text-[#4B2E2B]">
              Notes for the visit
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Add access notes, who is joining, or anything you want to remember."
              className="rounded-2xl border border-[#D6B79F] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
            />
          </label>

          <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-[#4B2E2B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#8C5A3C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving tour..." : "Save to Tours Scheduled"}
            </button>
            <Link
              href="/dashboard/user/tours-scheduled"
              className="inline-flex items-center justify-center rounded-full border border-[#D6B79F] px-5 py-3 text-sm font-medium text-[#8C5A3C] transition hover:border-[#8C5A3C] hover:text-[#4B2E2B]"
            >
              Open tours calendar
            </Link>
          </div>
        </form>
      ) : null}

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-[#8C5A3C]">{message}</p> : null}
    </section>
  );
}
