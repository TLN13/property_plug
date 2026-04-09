import ProtectedRoute from "@/app/components/ProtectedRoute";
import AdminDashboard from "@/app/components/AdminDashboard";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
