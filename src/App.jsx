import { lazy, Suspense, useState } from "react";
import BottomNav from "./components/ui/BottomNav";
import { useAuth } from "./hooks/useAuth";
import Auth from "./pages/Auth";

// Lazy-loaded pages (code splitting)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddWorkout = lazy(() => import("./pages/AddWorkout"));
const Calendar = lazy(() => import("./pages/Calendar"));

export default function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("dashboard");

  // Auth loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Auth />;
  }

  return (
    <div className="pb-16">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
            Loading page...
          </div>
        }
      >
        {page === "dashboard" && <Dashboard />}
        {page === "add" && <AddWorkout />}
        {page === "calendar" && <Calendar />}
      </Suspense>

      <BottomNav current={page} onChange={setPage} />
    </div>
  );
}
