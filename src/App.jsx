import { useState } from "react";
import BottomNav from "./components/ui/BottomNav";
import AddWorkout from "./pages/AddWorkout";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="pb-16">
      {page === "dashboard" && <Dashboard />}
      {page === "add" && <AddWorkout />}

      <BottomNav current={page} onChange={setPage} />
    </div>
  );
}
