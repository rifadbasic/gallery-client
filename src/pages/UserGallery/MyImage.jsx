import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import { Eye, Edit, Trash2 } from "lucide-react";

const MyImage = () => {
  const axiosInstance = useAxios();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // Fetch images
  const fetchImages = async () => {
    try {
      const res = await axiosInstance.get(`/images?page=${page}`);

      setImages((prev) => {
        // 🔥 PREVENT DUPLICATES
        const existingIds = new Set(prev.map((img) => img._id));

        const newImages = res.data.images.filter(
          (img) => !existingIds.has(img._id)
        );

        return [...prev, ...newImages];
      });

      setHasMore(res.data.hasMore);
    } catch (error) {
      toast.error("Failed to load gallery");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  // Delete Image
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/images/${id}`);
      setImages(images.filter((img) => img._id !== id));
      toast.success("Image removed from gallery");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        My Gallery
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img._id}
            className="bg-white dark:bg-[#0d1d33] rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={img.img}
              alt={img.name}
              className="h-56 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold">{img.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {img.description}
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-indigo-600 font-bold">
                  ৳ {img.finalPrice}
                </span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {img.role}
                </span>
              </div>

              {/* ICON BUTTONS */}
              <div className="flex justify-between mt-4 border-t pt-3">
                <button className="text-blue-500 hover:text-blue-700">
                  <Eye size={20} />
                </button>

                <button className="text-green-500 hover:text-green-700">
                  <Edit size={20} />
                </button>

                <button
                  onClick={() => handleDelete(img._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loader for Infinite Scroll */}
      {hasMore && (
        <div ref={loaderRef} className="text-center py-6">
          <p className="text-gray-500">Loading more images…</p>
        </div>
      )}

      {!hasMore && images.length > 0 && (
        <p className="text-center text-gray-400 mt-6">
          You’ve reached the end of the gallery.
        </p>
      )}
    </div>
  );
};

export default MyImage;
