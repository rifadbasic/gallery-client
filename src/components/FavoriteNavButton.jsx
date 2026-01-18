import { Link } from "react-router";
import { Heart } from "lucide-react";
import { useGallery } from "../context/GalleryContext";

const FavoriteNavButton = () => {
  const { favoriteCount } = useGallery();

  return (
    <Link to="/favorites" className="relative">
      <Heart className="cursor-pointer hover:text-indigo-500" />
      {favoriteCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {favoriteCount}
        </span>
      )}
    </Link>
  );
};

export default FavoriteNavButton;
