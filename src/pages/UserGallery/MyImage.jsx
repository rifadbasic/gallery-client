import { useEffect, useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxiosSecure";
import { Eye, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext"; // logged-in user

const MyImage = () => {
  const axiosInstance = useAxios();
  const { user: authUser } = useContext(AuthContext); // logged-in user

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  // Fetch images for logged-in user
  const fetchImages = async () => {
    if (!authUser?.email) return; // wait until user is loaded

    setLoading(true);
    try {
      // Backend endpoint supports user email filtering
      const res = await axiosInstance.get(
        `/user-images?email=${authUser.email}&page=${page}`
      );

      setImages((prev) => {
        const existingIds = new Set(prev.map((img) => img._id));
        const newImages = res.data.images.filter(
          (img) => !existingIds.has(img._id)
        );
        return [...prev, ...newImages];
      });

      setHasMore(res.data.hasMore);
    } catch (error) {
      toast.error("Failed to load your gallery");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page, authUser?.email]);

  // Infinite scroll
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

  // Delete image
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/images/${id}`);
        setImages((prev) => prev.filter((img) => img._id !== id));
        toast.success("Image removed from gallery 🌿");
      } catch (error) {
        toast.error("Delete failed. Try again.");
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {!loading && images.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
          You have no images in your gallery
        </div>
      ) : (
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
      )}

      {/* Loader */}
      {hasMore && (
        <div ref={loaderRef} className="text-center my-6">
          <p className="text-gray-500 dark:text-gray-400">
            Loading more images...
          </p>
        </div>
      )}

      {!hasMore && images.length > 0 && (
        <div className="text-center my-6">
          <p className="text-gray-500 dark:text-gray-400">
            No more images to load
          </p>
        </div>
      )}
    </div>
  );
};

export default MyImage;
