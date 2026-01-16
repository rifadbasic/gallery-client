import { Outlet } from "react-router";
import { useGallery } from "../context/GalleryContext";
import { Filter } from "lucide-react";
import { useState } from "react";

const GalleryLayout = () => {
  const { filters, updateFilters } = useGallery();

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="h-screen flex flex-col ">
      {/* ===== STICKY HEADER ===== */}
      <header className="sticky top-0 w-full bg-gradient-to-r from-blue-500 to-indigo-600 z-49">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
          {/* TOP ROW: TITLE + MOBILE FILTER ICON */}
          <div className="flex items-center justify-between mt-12">
            <h1 className="text-4xl font-bold text-white">Gallery</h1>

            {/* Mobile Filter Button */}
            <button
              className="md:hidden bg-white/20 backdrop-blur-md text-white p-3 rounded-full shadow-lg"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Filter size={24} />
            </button>
          </div>

          {/* ===== FILTERS ROW (DESKTOP) ===== */}
          <div className="hidden md:flex items-center gap-4 mt-6 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg">
            <select
              className="border p-2 rounded bg-[#0d1d33]"
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
            >
              <option>All</option>
              <option>Photography</option>
              <option>Digital Art</option>
              <option>Illustration</option>
              <option>Cinematography</option>
              <option>Mixed media</option>
            </select>

            <select
              className="border p-2 rounded bg-[#0d1d33]"
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value })}
            >
              <option>All</option>
              <option>Sold</option>
              <option>Unsold</option>
              <option>Global</option>
            </select>

            <select
              className="border p-2 rounded bg-[#0d1d33]"
              value={filters.role}
              onChange={(e) => updateFilters({ role: e.target.value })}
            >
              <option>All</option>
              <option>Regular</option>
              <option>Premium</option>
            </select>
          </div>
        </div>
      </header>

      {/* ===== MOBILE FILTER DROPDOWN (ANIMATED) ===== */}
      {showFilters && (
        <div
          className="absolute left-0 right-0 top-40 z-60 
               transform transition-all duration-300 ease-out 
               animate-slideDown"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="mx-4 md:mx-8 lg:mx-auto max-w-7xl 
                 bg-[#0d1d33] rounded-xl shadow-xl 
                 px-6 py-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-white mb-2">Filters</h2>

            <select
              className="w-full border p-2 rounded bg-[#06101f] text-white"
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
            >
              <option>All</option>
              <option>Photography</option>
              <option>Digital Art</option>
              <option>Illustration</option>
              <option>Cinematography</option>
              <option>Mixed media</option>
            </select>

            <select
              className="w-full border p-2 rounded bg-[#06101f] text-white"
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value })}
            >
              <option>All</option>
              <option>Sold</option>
              <option>Unsold</option>
              <option>Global</option>
            </select>

            <select
              className="w-full border p-2 rounded bg-[#06101f] text-white"
              value={filters.role}
              onChange={(e) => updateFilters({ role: e.target.value })}
            >
              <option>All</option>
              <option>Regular</option>
              <option>Premium</option>
            </select>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT (ONLY THIS SCROLLS) ===== */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default GalleryLayout;
