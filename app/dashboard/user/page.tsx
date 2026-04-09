export default function UserDashboard() {
  return (
    <main className="min-h-screen bg-[#f8f5f0] p-10">
      <h1 className="text-3xl font-bold text-[#4b2e2b] mb-6">
        User Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold mb-2">Saved Properties</h2>
          <p className="text-gray-600">
            You haven’t saved any properties yet.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold mb-2">Your Activity</h2>
          <p className="text-gray-600">
            Track your recent actions here.
          </p>
        </div>
      </div>
    </main>
  );
}