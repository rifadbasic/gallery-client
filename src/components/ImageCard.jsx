import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import FavoriteButton from "./FavoriteButton";
import ImageDetailsModal from "./ImageDetailsModal";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxiosSecure";
import useUserStatus from "../hooks/useUserStatus";
import { ThumbsUp, Crown } from "lucide-react";

const ImageCard = ({ img, lastRef }) => {
  const { user } = useAuth();
  const { userStatus, isLoading } = useUserStatus();
  const navigate = useNavigate();
  const axios = useAxios();

  const [modalOpen, setModalOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(img.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);

  const status = userStatus?.toLowerCase() || "explorer";
  const isCreator = status === "creator";
  const isExplorer = ["explorer", "artist", "creator"].includes(status);
  const isArtistOrAbove = ["artist", "creator"].includes(status);

  useEffect(() => {
    setLikesCount(Array.isArray(img.likes) ? img.likes.length : 0);

    if (!user?.email) {
      setIsLiked(false);
      return;
    }

    const liked = Array.isArray(img.likes)
      ? img.likes.some((l) => {
          if (!l) return false;
          if (typeof l === "string") return l === user.email;
          if (l.email) return l.email === user.email;
          return false;
        })
      : false;

    setIsLiked(liked);
  }, [img.likes, user?.email]);

  const handleLike = async () => {
    if (!user) return navigate("/login");

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      await axios.patch(`/images/${img._id}/like`);
    } catch (err) {
      console.error("Like Error:", err);
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
    }
  };

  if (isLoading) {
    return (
      <div
        ref={lastRef}
        className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 h-56 w-full bg-gray-100 animate-pulse"
      />
    );
  }

  const handleOpenModal = () => {
    if (!user) return navigate("/login");

    // Premium image restriction
    if (img.role === "Premium" && !isCreator) {
      navigate("/subscription");
      return;
    }

    // Explorer restriction
    if (!isExplorer) {
      navigate("/subscription");
      return;
    }

    setModalOpen(true);
  };

  return (
    <>
      <div
        ref={lastRef}
        className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {/* Category Tag */}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {img.category}
        </div>

        {/* Premium Icon */}
        {img.role === "Premium" && (
          <div className="absolute bottom-2 left-2 text-yellow-400">
            <Crown
              size={30}
              className=" p-1 rounded-full shadow-md text-yellow-400"
            />
          </div>
        )}

        {/* Favorite Button */}
        {isArtistOrAbove && (
          <div className="absolute top-2 right-2">
            <FavoriteButton image={img} />
          </div>
        )}

        {/* Image */}
        <img
          src={img.watermarkedImage}
          alt={img.name}
          className="w-full h-56 object-cover cursor-pointer"
          onClick={handleOpenModal}
        />

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 bg-white/80 backdrop-blur shadow hover:scale-105"
        >
          <ThumbsUp
            size={20}
            className="transition-colors duration-300"
            style={{
              stroke: isLiked ? "#2563eb" : "#6b7280",
              fill: isLiked ? "#2563eb" : "none",
              strokeWidth: 1.5,
            }}
          />
          <span
            className={`ml-1 font-semibold transition-colors duration-300 ${
              isLiked ? "text-blue-600" : "text-gray-700"
            }`}
          >
            {likesCount}
          </span>
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ImageDetailsModal img={img} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};

export default ImageCard;
