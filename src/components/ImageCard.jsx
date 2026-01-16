// src/components/ImageCard.jsx
import { Link } from "react-router";
import FavoriteButton from "./FavoriteButton";

const ImageCard = ({ img, lastRef }) => {
  return (
    <div
      ref={lastRef}
      className=" rounded-xl shadow-xl border-1 border-blue-300 overflow-hidden relative"
    >
      {/* Top overlay */}
      <div className="absolute top-2 right-2 flex gap-2">
        <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
          {img.category}
        </div>
        <FavoriteButton image={img} />
      </div>

      <img
        src={img.img}
        alt={img.name}
        className="w-full h-56 object-cover"
      />

      {/* Bottom profile section */}
      <div className="flex items-center gap-3 p-3">
        <Link to={`/profile/${img.userEmail}`}>
          <img
            src={img.userPhoto}
            alt="user"
            className="w-10 h-10 rounded-full object-cover border"
          />
        </Link>

        <div>
          <p className="text-sm font-semibold">{img.name}</p>
          <p className="text-xs text-gray-500">{img.userName}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
