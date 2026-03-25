import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function UserPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <h1>User Dashboard</h1>
    </ProtectedRoute>
  );
}