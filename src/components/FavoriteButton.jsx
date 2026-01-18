import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import useAxios from "../hooks/useAxiosSecure";
import { useGallery } from "../context/GalleryContext";

const FavoriteButton = ({ image }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();
  const { toggleFavorite } = useGallery();

  const isWoner = image.userEmail === user?.email;

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setIsFav(false);
      return;
    }

    if (Array.isArray(image.favorites)) {
      const liked = image.favorites.some(
        (f) =>
          (typeof f === "string" && f === user.email) ||
          (f?.email && f.email === user.email),
      );

      setIsFav(liked);
    }
  }, [user?.email, image.favorites]);

  // console.log(isFav);

  const handleClick = async () => {
    if (!user) return navigate("/login");

    try {
      const res = await axios.patch(`/images/${image._id}/favorite`);
      const favEmails = Array.isArray(res.data.emails) ? res.data.emails : [];

      const nowFav = favEmails.some(
        (f) =>
          (typeof f === "string" && f === user.email) ||
          (f.email && f.email === user.email),
      );

      setIsFav(nowFav);
      toggleFavorite(image, nowFav);
    } catch (err) {
      console.error("Favorite Error:", err);
    }
  };

  return (
    <div className={isWoner ? "opacity-0 pointer-events-none" : " opacity-100"}>
      <button
        onClick={handleClick}
        className={`p-2 rounded-full shadow transition ${
          isFav ? "bg-red-500 text-white" : "bg-white text-black"
        }`}
      >
        <Heart size={18} fill={isFav ? "white" : "none"} />
      </button>
    </div>
  );
};

export default FavoriteButton;
