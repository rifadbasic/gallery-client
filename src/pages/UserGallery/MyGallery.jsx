import { useEffect, useState } from "react";
import { FaDownload, FaTrash, FaThumbsUp } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import FavoriteButton from "../../components/FavoriteButton";
import { useNavigate } from "react-router";

const MyGallery = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  // dynamic title
  useEffect(() => {
    document.title =
      "Gallery" + " | " + user?.displayName || "My Gallery";
  }, [user]);
  const [favoriteImages, setFavoriteImages] = useState([]);
  const [purchasedImages, setPurchasedImages] = useState([]);

  // NEW: Track selected images for bulk delete
  const [selectedPurchased, setSelectedPurchased] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    // Fetch Favorites
    axiosSecure.get(`/images/favorites/${user.email}`).then((res) => {
      setFavoriteImages(res.data);
    });

    // Fetch Purchased
    axiosSecure.get(`/images/purchased/${user.email}`).then((res) => {
      setPurchasedImages(res.data);
    });
  }, [user?.email]);

  const handleDownload = async (img) => {
    try {
      const response = await fetch(img.originalImage);
      const blob = await response.blob();
      const fileExtension = img.originalImage.split(".").pop();
      const fileName = `${img.name}.${fileExtension}`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // NEW: Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedPurchased.length === 0) return;
    if (!window.confirm("Are you sure you want to delete selected images?"))
      return;

    try {
      await Promise.all(
        selectedPurchased.map((imgId) =>
          axiosSecure.delete(`/images/purchased/${imgId}/${user.email}`),
        ),
      );

      setPurchasedImages((prev) =>
        prev.filter((img) => !selectedPurchased.includes(img._id)),
      );
      setFavoriteImages((prev) =>
        prev.filter((img) => !selectedPurchased.includes(img._id)),
      );

      setSelectedPurchased([]);
      alert("Selected images deleted successfully!");
    } catch (err) {
      console.error("Bulk delete failed:", err);
      alert("Failed to delete selected images.");
    }
  };

  const toggleSelectPurchased = (imgId) => {
    setSelectedPurchased((prev) =>
      prev.includes(imgId)
        ? prev.filter((id) => id !== imgId)
        : [...prev, imgId],
    );
  };

  const toggleSelectAllPurchased = () => {
    if (selectedPurchased.length === purchasedImages.length) {
      setSelectedPurchased([]);
    } else {
      setSelectedPurchased(purchasedImages.map((img) => img._id));
    }
  };

  const renderImageCard = (img, showFavorite = false, showCheckbox = false) => (
    <div key={img._id} className="relative group">
      {/* IMAGE */}
      <img
        src={img.watermarkedImage}
        alt={img.name}
        className="w-full h-40 object-cover rounded-md"
      />

      {/* LEFT SIDE ICONS (like/comment) */}
      <div className="absolute bg-black/50 text-white p-1 px-2 rounded-2xl top-2 left-2 flex flex-row items-center gap-1 ">
        <div className="  rounded-full">
          <FaThumbsUp size={16} />
        </div>
        <div className="  rounded-full">
          <span className="text-xs">{img.likes?.length || 0}</span>
        </div>
      </div>

      {/* RIGHT SIDE ICONS (favorite/download/delete) */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 ">
        {showFavorite ? (
          <FavoriteButton image={img} />
        ) : (
          <>
            <button
              onClick={() => handleDownload(img)}
              className="bg-black/50 text-white p-1 rounded-full"
            >
              <FaDownload size={16} />
            </button>
          </>
        )}
      </div>

      <div className="absolute bottom-2 right-2">
        <div className=" text-white ">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={selectedPurchased.includes(img._id)}
              onChange={() => toggleSelectPurchased(img._id)}
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* FAVORITES */}
      {favoriteImages.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Favorite Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoriteImages
              .slice(0, 10)
              .map((img) => renderImageCard(img, true))}
          </div>

          {favoriteImages.length > 10 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/favorites")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                See More Favorites
              </button>
            </div>
          )}
        </section>
      )}

      {/* PURCHASED */}
      {purchasedImages.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Purchased Images</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAllPurchased}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md"
              >
                {selectedPurchased.length === purchasedImages.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedPurchased.length === 0}
                className="px-3 py-1 bg-red-600 text-white rounded-md disabled:opacity-50"
              >
                Delete Selected
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {purchasedImages
              .slice(0, 10)
              .map((img) => renderImageCard(img, false, true))}
          </div>

          {purchasedImages.length > 10 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/purchased")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                See More Purchased Images
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default MyGallery;
