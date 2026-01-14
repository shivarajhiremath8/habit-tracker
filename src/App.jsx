import { useState } from "react";
import BottomNav from "./components/ui/BottomNav";
import { useAuth } from "./hooks/useAuth";
import AddWorkout from "./pages/AddWorkout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("dashboard");

  if (loading) {
    return null; // or loading spinner later
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="pb-16">
      {page === "dashboard" && <Dashboard />}
      {page === "add" && <AddWorkout />}

      <BottomNav current={page} onChange={setPage} />
    </div>
  );
}
