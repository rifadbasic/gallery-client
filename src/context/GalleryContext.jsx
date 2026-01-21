import { createContext, useContext, useState } from "react";

const GalleryContext = createContext();

// GalleryContext.jsx
const GalleryProvider = ({ children }) => {
  // Favorites
  const [favorites, setFavorites] = useState([]);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Filters: store the **selected value** (scalar)
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    role: "All",
  });

  // Options (for dropdowns)
  const filterOptions = {
    category: [
      "All",
      "Photography",
      "Digital Art",
      "Illustration",
      "Cinematography",
      "Mixed media",
    ],
    status: ["All", "Sold", "Unsold",],
    role: ["All", "Global", "Premium"],
  };

  // ===== FAVORITES =====
  const toggleFavorite = (image, isFav) => {
    setFavorites((prev) => {
      const updated = isFav
        ? [...prev, image]
        : prev.filter((img) => img._id !== image._id);
      setFavoriteCount(updated.length);
      return updated;
    });
  };

  const setInitialFavorites = (images) => {
    setFavorites(images || []);
    setFavoriteCount(images?.length || 0);
  };

  // ===== FILTERS =====
  const updateFilters = (newFilter) => {
    setFilters((prev) => ({ ...prev, ...newFilter }));
  };

  const resetFilters = () => {
    setFilters({
      category: "All",
      status: "All",
      role: "All",
    });
  };

  return (
    <GalleryContext.Provider
      value={{
        favorites,
        setFavorites,
        favoriteCount,
        toggleFavorite,
        setInitialFavorites,
        filters,
        updateFilters,
        resetFilters,
        filterOptions, 
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => useContext(GalleryContext);
export default GalleryContext;
export { GalleryProvider };
