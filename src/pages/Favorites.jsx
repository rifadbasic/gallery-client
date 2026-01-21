import { useEffect } from "react";
import useAxios from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import ImageCard from "../components/ImageCard";
import { useGallery } from "../context/GalleryContext";

const Favorites = () => {
  // dynamic title
  useEffect(() => {
    document.title = "My Favorites | Gallery";
  }, []);

  const { user } = useAuth();
  const axios = useAxios();
  const { favorites, setInitialFavorites } = useGallery();

  // fetch favorites from DB on mount
  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        const res = await axios.get("/favorites");
        setInitialFavorites(res.data.images || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavorites();
  }, [user]);

  if (!user)
    return (
      <p className="text-center mt-20">Please log in to view your favorites.</p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 mt-12">My Favorites ❤️</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites yet...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((img) => (
            <ImageCard key={img._id} img={img} lastRef={null} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
