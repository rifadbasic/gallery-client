import { useEffect, useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxiosSecure";
import { Eye, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MyImage = () => {
  const axiosInstance = useAxios();
  const { user: authUser } = useContext(AuthContext);

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  console.log(images);

  const [selectedImage, setSelectedImage] = useState(null); // view modal
  const [editImage, setEditImage] = useState(null); // edit modal
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch images
  const fetchImages = async () => {
    if (!authUser?.email) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/user-images?email=${authUser.email}&page=${page}`,
      );

      setImages((prev) => {
        const existingIds = new Set(prev.map((img) => img._id));
        const newImages = res.data.images.filter(
          (img) => !existingIds.has(img._id),
        );
        return [...prev, ...newImages];
      });

      setHasMore(res.data.hasMore);
    } catch (err) {
      toast.error("Failed to load images");
      console.error(err);
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
      { threshold: 1.0 },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  // Delete
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
        toast.success("Image removed 🌿");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  // Edit button click
  const openEditModal = (img) => {
    setEditImage(img);
    setFormData({
      name: img.name,
      description: img.description,
      category: img.category,
      role: img.role,
      status: "Pending",
      price: img.price,
      discountPercent: img.discountPercent,
      finalPrice: img.finalPrice,
      originalImage: img.originalImage,
    });
  };

  // Image upload
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("image", image);

    try {
      const res = await axiosInstance.post("/images/upload", fd); // backend route
      setFormData((prev) => ({ ...prev, originalImage: res.data.url }));
      toast.success("Image uploaded successfully 🌿");
    } catch (err) {
      toast.error("Image upload failed. Try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Price / Discount
  const handlePriceChange = (e) => {
    const price = Number(e.target.value);
    if (isNaN(price) || price < 0) return;

    const finalPrice = price - (price * formData.discountPercent) / 100;
    setFormData({ ...formData, price, finalPrice: Math.floor(finalPrice) });
  };

  const handleDiscountChange = (e) => {
    const discount = Number(e.target.value);
    const finalPrice = formData.price - (formData.price * discount) / 100;
    setFormData({
      ...formData,
      discountPercent: discount,
      finalPrice: Math.floor(finalPrice),
    });
  };

  // Submit update
  // 1️⃣ handleImageUpload
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axiosInstance.put(`/images/${editImage._id}`, {
        ...formData,
        status: "Pending", // re-approval logic
      });

      toast.success("Image updated successfully 🌿");
      setEditImage(null);

      // UI update
      setImages((prev) =>
        prev.map((img) =>
          img._id === editImage._id ? { ...img, ...formData } : img,
        ),
      );
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img._id}
            className="relative group rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={img.originalImage}
              alt={img.name}
              className="h-56 w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 flex justify-between px-3 py-1 bg-black/40 rounded-md">
              <Eye
                size={20}
                className="text-white cursor-pointer"
                onClick={() => setSelectedImage(img)}
              />
              <Edit
                size={20}
                className="text-white cursor-pointer"
                onClick={() => openEditModal(img)}
              />
              <Trash2
                size={20}
                className="text-white cursor-pointer"
                onClick={() => handleDelete(img._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="text-center mt-6">
          Loading more...
        </div>
      )}
      {!hasMore && <div className="text-center mt-6">No more images</div>}

      {/* View Modal */}
      <Modal
        isOpen={!!selectedImage}
        onRequestClose={() => setSelectedImage(null)}
        contentLabel="Image Details"
        className="max-w-3xl mx-auto my-20 bg-white dark:bg-[#0b1424] rounded-xl p-6 outline-none shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center z-50"
      >
        {selectedImage && (
          <>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              ✕
            </button>
            <img
              src={selectedImage.originalImage}
              alt={selectedImage.name}
              className="w-full h-96 object-contain rounded-md"
            />
            <h2 className="text-xl font-bold mt-4">{selectedImage.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {selectedImage.description}
            </p>
            <div className="flex gap-4 mt-3 flex-wrap">
              <span className="text-sm bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded">
                Role: {selectedImage.role}
              </span>
              <span className="text-sm bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                Likes: {selectedImage.likes?.length || 0}
              </span>
              <span className="text-sm bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                Favorites: {selectedImage.favorites?.length || 0}
              </span>
              <span className="text-sm bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                Sold: {selectedImage.sold?.length || 0}
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                Price: ৳ {selectedImage.finalPrice}
              </span>
            </div>
          </>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editImage}
        onRequestClose={() => setEditImage(null)}
        contentLabel="Edit Image"
        className="max-w-3xl mx-auto my-20 bg-white dark:bg-[#0b1424] rounded-xl p-6 outline-none shadow-lg relative overflow-y-auto max-h-[90vh]"
        overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center z-50"
      >
        {editImage && (
          <>
            <button
              onClick={() => setEditImage(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Image</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Image</label>
                <input type="file" onChange={handleImageUpload} />
                {formData.originalImage && (
                  <img
                    src={formData.originalImage}
                    className="mt-2 h-40 object-contain rounded-md"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  <option>Premium</option>
                  <option>Global</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={handlePriceChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">Discount %</label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={handleDiscountChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">Final Price</label>
                  <input
                    type="number"
                    value={formData.finalPrice}
                    readOnly
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {submitting
                  ? "Updating..."
                  : uploading
                    ? "Uploading..."
                    : "Update Image"}
              </button>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MyImage;
