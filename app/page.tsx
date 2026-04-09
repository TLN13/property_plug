import Link from "next/link";

const featuredHighlights = [
  {
    label: "Live listings",
    value: "Real homes",
  },
  {
    label: "Smarter search",
    value: "Fast filters",
  },
  {
    label: "Admin tools",
    value: "Simple CRUD",
  },
];

const featuredCities = [
  "Calgary",
  "Edmonton",
  "Vancouver",
  "Banff",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f5f0] text-[#4b2e2b]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(164,107,69,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(75,46,43,0.14),_transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-8">
          <header className="mb-16 flex flex-col gap-4 rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold tracking-[0.12em]">Property Plug</p>
            </div>

            <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
              <Link
                href="/listings"
                className="rounded-full px-4 py-2 text-[#7a5c58] transition hover:bg-[#efe4d8]"
              >
                Listings
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-[#4b2e2b] px-5 py-2 text-white transition hover:opacity-90"
              >
                Login
              </Link>
            </nav>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#a46b45]">
                Real Estate Made Simple
              </p>
              <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">
                Discover homes that feel right before you even book a showing.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#7a5c58]">
                Browse listings, explore property details, save favorites, and
                manage inventory from one clean Next.js and Firebase app.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/listings"
                  className="rounded-2xl bg-[#a46b45] px-6 py-4 text-center font-semibold text-white transition hover:opacity-90"
                >
                  Browse Listings
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-[#d9c9bc] bg-white px-6 py-4 text-center font-semibold text-[#4b2e2b] transition hover:bg-[#efe4d8]"
                >
                  Sign In
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {featuredHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-[#eadfd6] bg-white/80 p-5 shadow-sm"
                  >
                    <div className="text-sm text-[#7a5c58]">{item.label}</div>
                    <div className="mt-2 text-2xl font-bold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#4b2e2b] p-5 text-white shadow-xl">
              <div className="overflow-hidden rounded-[1.5rem] bg-white/10">
                <img
                  src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80"
                  alt="Featured property"
                  className="h-72 w-full object-cover"
                />
              </div>

              <div className="mt-6">
                <p className="text-sm uppercase tracking-[0.22em] text-white/65">
                  Featured Experience
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  Search faster. Manage smarter.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/75">
                  Built for browsing on the frontend and managing listings on
                  the backend with Firebase-powered workflows.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                {featuredCities.map((city) => (
                  <div
                    key={city}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span className="font-medium">{city}</span>
                    <span className="text-sm text-white/65">Popular market</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-md">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#a46b45]">
              Explore
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Browse listings</h3>
            <p className="mt-3 text-sm leading-7 text-[#7a5c58]">
              View active properties with search, price, location, and bedroom
              filters.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-md">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#a46b45]">
              Save
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Keep favorites close</h3>
            <p className="mt-3 text-sm leading-7 text-[#7a5c58]">
              Let users shortlist the homes they want to come back to later.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-md">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#a46b45]">
              Manage
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Update inventory</h3>
            <p className="mt-3 text-sm leading-7 text-[#7a5c58]">
              Admins can add, edit, search, sort, and delete listings from one
              dashboard.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
