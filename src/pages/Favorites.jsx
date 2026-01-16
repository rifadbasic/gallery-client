// src/pages/Favorites.jsx
import { useGallery } from "../context/GalleryContext";
import ImageCard from "../components/ImageCard";

const Favorites = () => {
  const { favorites } = useGallery();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 ">
      <h1 className="text-2xl font-bold mb-6 mt-12">My Favorites ❤️</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites yet... your heart is still quiet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((img) => (
            <ImageCard key={img._id} img={img} user={{ _id: "me", name: "You", avatar: "https://i.pravatar.cc/150?img=5" }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
