"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import {
  cancelScheduledTourForUser,
  getFirestoreErrorMessage,
  getScheduledToursForUser,
  type ScheduledTour,
} from "@/app/firebase/firestore";
import { formatListingPrice } from "@/lib/listing-format";

const weekdayFormatter = new Intl.DateTimeFormat("en-CA", { weekday: "short" });
const dayFormatter = new Intl.DateTimeFormat("en-CA", { day: "numeric" });
const monthFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  year: "numeric",
});
const fullDateFormatter = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "full",
});
const dateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "medium",
  timeStyle: "short",
});

function getLocalDayKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function groupToursByDay(tours: ScheduledTour[]) {
  return tours.reduce<Record<string, ScheduledTour[]>>((groups, tour) => {
    const dayKey = getLocalDayKey(new Date(tour.scheduledAt));
    groups[dayKey] ??= [];
    groups[dayKey].push(tour);
    return groups;
  }, {});
}

export default function ScheduledToursView() {
  const { user, isLoading } = useAuth();
  const [tours, setTours] = useState<ScheduledTour[]>([]);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [activeMonth, setActiveMonth] = useState(startOfMonth(new Date()));

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    let ignore = false;

    const loadTours = async () => {
      setIsFetching(true);
      setError("");

      try {
        const loadedTours = await getScheduledToursForUser(user.uid);

        if (!ignore) {
          setTours(loadedTours);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            getFirestoreErrorMessage(
              loadError,
              "Could not load tours.",
              "scheduledTours"
            )
          );
        }
      } finally {
        if (!ignore) {
          setIsFetching(false);
        }
      }
    };

    void loadTours();

    return () => {
      ignore = true;
    };
  }, [isLoading, user]);

  const toursByDay = useMemo(() => groupToursByDay(tours), [tours]);

  const calendarDays = useMemo(() => {
    const firstDay = startOfMonth(activeMonth);
    const startOffset = firstDay.getDay();
    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const current = new Date(gridStart);
      current.setDate(gridStart.getDate() + index);
      const currentKey = getLocalDayKey(current);

      return {
        date: current,
        dayKey: currentKey,
        tours: toursByDay[currentKey] ?? [],
      };
    });
  }, [activeMonth, toursByDay]);

  const groupedTourEntries = useMemo(
    () =>
      Object.entries(toursByDay)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([dayKey, dayTours]) => ({
          dayKey,
          date: new Date(`${dayKey}T12:00:00`),
          tours: [...dayTours].sort((left, right) =>
            left.scheduledAt.localeCompare(right.scheduledAt)
          ),
        })),
    [toursByDay]
  );

  const handleCancel = async (tourId: string) => {
    if (!user) {
      return;
    }

    setError("");

    try {
      await cancelScheduledTourForUser(user.uid, tourId);
      setTours((current) => current.filter((tour) => tour.id !== tourId));
    } catch (cancelError) {
      setError(
        getFirestoreErrorMessage(
          cancelError,
          "Could not cancel the tour.",
          "scheduledTours"
        )
      );
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="mt-4 rounded-3xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4B2E2B]">Loading your tour calendar...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-3xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4B2E2B]">
          We could not load your scheduled tours
        </h2>
        <p className="mt-3 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4B2E2B]">
          No tours scheduled yet
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-[#4B2E2B]">
          Schedule a viewing from any property page and it will appear here in your
          calendar with the listing details attached.
        </p>
        <Link
          href="/listings"
          className="mt-6 inline-flex rounded-full bg-[#8C5A3C] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4B2E2B]"
        >
          Explore listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setActiveMonth(
                (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1)
              )
            }
            className="rounded-full border border-[#D6B79F] px-3 py-2 text-sm text-[#8C5A3C] transition hover:border-[#8C5A3C] hover:text-[#4B2E2B]"
          >
            Previous
          </button>
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">Calendar</p>
            <h2 className="mt-1 text-2xl font-semibold text-[#4B2E2B]">
              {monthFormatter.format(activeMonth)}
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              setActiveMonth(
                (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1)
              )
            }
            className="rounded-full border border-[#D6B79F] px-3 py-2 text-sm text-[#8C5A3C] transition hover:border-[#8C5A3C] hover:text-[#4B2E2B]"
          >
            Next
          </button>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#8C5A3C]">
          {calendarDays.slice(0, 7).map((day) => (
            <div key={weekdayFormatter.format(day.date)}>{weekdayFormatter.format(day.date)}</div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2">
          {calendarDays.map(({ date, dayKey, tours: dayTours }) => {
            const isCurrentMonth = date.getMonth() === activeMonth.getMonth();
            const isToday = isSameDay(date, new Date());

            return (
              <div
                key={dayKey}
                className={`min-h-20 rounded-2xl border p-2 text-left ${
                  isCurrentMonth
                    ? "border-[#E5D1BE] bg-[#FFF8F0]"
                    : "border-[#F1E4D7] bg-[#FCF8F4] text-[#B89579]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-semibold ${
                      isToday ? "rounded-full bg-[#8C5A3C] px-2 py-0.5 text-white" : ""
                    }`}
                  >
                    {dayFormatter.format(date)}
                  </span>
                  {dayTours.length > 0 ? (
                    <span className="rounded-full bg-[#C08552] px-2 py-0.5 text-xs font-semibold text-white">
                      {dayTours.length}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 flex flex-col gap-1">
                  {dayTours.slice(0, 2).map((tour) => (
                    <div
                      key={tour.id}
                      className="rounded-xl bg-white px-2 py-1 text-xs font-medium text-[#4B2E2B]"
                    >
                      {new Date(tour.scheduledAt).toLocaleTimeString("en-CA", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  ))}
                  {dayTours.length > 2 ? (
                    <div className="text-xs text-[#8C5A3C]">
                      +{dayTours.length - 2} more
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">Upcoming Tours</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#4B2E2B]">
          {tours.length} scheduled visit{tours.length === 1 ? "" : "s"}
        </h2>

        <div className="mt-6 flex flex-col gap-6">
          {groupedTourEntries.map(({ dayKey, date, tours: dayTours }) => (
            <div key={dayKey}>
              <h3 className="text-lg font-semibold text-[#4B2E2B]">
                {fullDateFormatter.format(date)}
              </h3>
              <div className="mt-3 flex flex-col gap-4">
                {dayTours.map((tour) => (
                  <article
                    key={tour.id}
                    className="overflow-hidden rounded-3xl border border-[#E5D1BE] bg-[#FFF8F0] shadow-sm"
                  >
                    <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="relative min-h-52">
                        <Image
                          src={tour.listingImage}
                          alt={tour.listingTitle}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 220px, 100vw"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h4 className="text-xl font-semibold text-[#4B2E2B]">
                              {tour.listingTitle}
                            </h4>
                            <p className="mt-1 text-sm text-[#4B2E2B]">
                              {tour.listingLocation}
                            </p>
                            <p className="mt-2 text-lg font-bold text-[#8C5A3C]">
                              {formatListingPrice(tour.listingPrice)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#4B2E2B]">
                            {dateTimeFormatter.format(new Date(tour.scheduledAt))}
                          </div>
                        </div>

                        {tour.notes ? (
                          <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#4B2E2B]">
                            {tour.notes}
                          </p>
                        ) : null}

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                          <Link
                            href={`/listings/${tour.listingId}`}
                            className="inline-flex items-center justify-center rounded-full bg-[#8C5A3C] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4B2E2B]"
                          >
                            View listing
                          </Link>
                          <button
                            type="button"
                            onClick={() => void handleCancel(tour.id)}
                            className="inline-flex items-center justify-center rounded-full border border-[#D6B79F] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition hover:border-[#8C5A3C] hover:text-[#4B2E2B]"
                          >
                            Cancel tour
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
