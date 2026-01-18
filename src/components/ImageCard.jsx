import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaThumbsUp } from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";
import ImageDetailsModal from "./ImageDetailsModal";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxiosSecure";

const ImageCard = ({ img, lastRef }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  const navigate = useNavigate();
  const axios = useAxios();
  const [likesCount, setLikesCount] = useState(img.likes?.length || 0);

  useEffect(() => {
    setLikesCount(Array.isArray(img.likes) ? img.likes.length : 0);
  }, [img.likes]);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setIsLiked(false);
      return;
    }
    if (Array.isArray(img.likes)) {
      const liked = img.likes.some(
        (l) =>
          (typeof l === "string" && l === user.email) ||
          (l.email && l.email === user.email),
      );

      setIsLiked(liked);
    }
  }, [user, img.likes]);
  const handleOpenModal = () => {
    if (!user) return navigate("/login");
    setModalOpen(true);
  };

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

  return (
    <>
      <div
        ref={lastRef}
        className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200"
      >
        {/* Category Tag */}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {img.category}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2">
          <FavoriteButton image={img} />
        </div>

        {/* Image */}
        <img
          src={img.watermarkedImage}
          alt={img.name}
          className="w-full h-56 object-cover cursor-pointer"
          onClick={handleOpenModal}
        />

        {/* Floating Like Button (Bottom Right) */}
        <button
          onClick={handleLike}
          className={`absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition bg-white/80 backdrop-blur shadow ${
            isLiked ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
          }`}
        >
          <FaThumbsUp size={16} />
          {likesCount}
        </button>
      </div>

      {/* Image Details Modal */}
      {modalOpen && (
        <ImageDetailsModal img={img} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};

export default ImageCard;
