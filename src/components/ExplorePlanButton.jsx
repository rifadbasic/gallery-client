// src/components/ExplorePlanButton.jsx
import { Link } from "react-router";
import { Compass } from "lucide-react";

const ExplorePlanButton = () => {
  return (
    <Link
      to="/subscription"
      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
    >
      <Compass size={18} />
      Explore Plan
    </Link>
  );
};

export default ExplorePlanButton;

