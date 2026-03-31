import ProtectedRoute from "@/app/components/ProtectedRoute";
import LogoutButton from "@/app/components/LogoutButton";

export default function UserPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold">User Dashboard</h1>
          <LogoutButton />
        </div>
      </div>
    </ProtectedRoute>
  );
}
