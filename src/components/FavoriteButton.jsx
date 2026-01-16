// src/components/FavoriteButton.jsx
import { Heart } from "lucide-react";
import { useGallery } from "../context/GalleryContext";

const FavoriteButton = ({ image }) => {
  const { favorites, toggleFavorite } = useGallery();

  const isFav = favorites.some((item) => item._id === image._id);

  return (
    <button
      onClick={() => toggleFavorite(image)}
      className={`p-2 rounded-full shadow transition ${
        isFav ? "bg-red-500 text-white" : "bg-white text-black"
      }`}
    >
      <Heart size={18} fill={isFav ? "white" : "none"} />
    </button>
  );
};

export default FavoriteButton;
