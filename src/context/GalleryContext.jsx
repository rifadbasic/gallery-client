// src/context/GalleryContext.jsx
import { createContext, useContext, useState } from "react";

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    role: "All",
  });

  const toggleFavorite = (image) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item._id === image._id);
      if (exists) {
        return prev.filter((item) => item._id !== image._id);
      } else {
        return [...prev, image];
      }
    });
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <GalleryContext.Provider
      value={{ favorites, toggleFavorite, filters, updateFilters }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => useContext(GalleryContext);
