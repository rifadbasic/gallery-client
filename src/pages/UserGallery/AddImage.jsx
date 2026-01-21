import { useState, useContext, useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../context/AuthContext";

const initialState = {
  originalImage: "",
  name: "",
  description: "",
  category: "Photography",
  role: "Global",
  status: "Pending",
  price: "",
  discountPercent: 0,
  finalPrice: "",
  likes: 0,
};

const AddImage = () => {


  const axiosInstance = useAxios();
  const { user: authUser } = useContext(AuthContext);

  // dynamic title
  useEffect(() => {
      document.title =  "Add Image" + " | " + authUser?.displayName || "Add Images | User Gallery";
    }, [authUser]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // Upload image to imgbb
  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setFormData((prev) => ({
      ...prev,
      imageFile: image, // 🔥 file রাখছি, URL না
    }));

    toast.success("Image selected 🌿");
  };

  // Price and discount logic
  const handlePriceChange = (e) => {
    const validPrice = parseFloat(e.target.value);
    if (isNaN(validPrice) || validPrice < 0) return;

    const discount = Number(formData.discountPercent);
    const finalPrice = validPrice - (validPrice * discount) / 100;

    setFormData((prev) => ({
      ...prev,
      price: validPrice,
      finalPrice: Math.floor(finalPrice),
    }));
  };

  const handleDiscountChange = (e) => {
    const discount = Number(e.target.value);
    const price = Number(formData.price);
    // istorage a round final price
    const finalPrice = price - (price * discount) / 100;

    setFormData((prev) => ({
      ...prev,
      discountPercent: discount,
      finalPrice: Math.floor(finalPrice),
    }));
  };

  // Submit new image
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.imageFile) {
      toast.error("Please select an image first!");
      return;
    }

    if (!authUser) {
      toast.error("User not logged in!");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();

      // 🔑 must match multer field name
      fd.append("image", formData.imageFile);

      // other fields
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("role", formData.role);
      fd.append("price", formData.price);
      fd.append("discountPercent", formData.discountPercent);
      fd.append("finalPrice", formData.finalPrice);
      fd.append("likes", formData.likes || 0);
      fd.append("createdAt", new Date().toISOString());
      fd.append("userEmail", authUser.email);
      fd.append("userName", authUser.name || authUser.displayName);
      fd.append("userPhoto", authUser.photo || authUser.photoURL);

      const res = await axiosInstance.post("/images", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("Image added successfully 🌿");
        setFormData(initialState);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add image");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl md:max-w-6xl mx-auto p-2 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Add New Image to Gallery
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 border-1 p-5 rounded-xl shadow-lg"
      >
        {/* Image Upload */}
        <div className="md:col-span-2">
          {formData.originalImage && (
            <img
              src={formData.originalImage}
              alt="preview"
              className="mt-3 h-40 w-40 object-cover rounded-lg "
            />
          )}

          <label className="block mb-2 ">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-2 rounded-lg "
          />
          {uploading && (
            <p className="text-sm mt-2 text-indigo-500">Uploading...</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block mb-2">
            Image Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Sunset in Cox's Bazar"
            className="w-full border p-2 rounded-lg "
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border p-2 rounded-lg "
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option>Photography</option>
            <option>Digital Art</option>
            <option>Illustration</option>
            <option>Cinematography</option>
            <option>Mixed media</option>
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2">
            Image Role <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border p-2 rounded-lg"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Regular">Global</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2">
            Price (৳) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            className="w-full border p-2 rounded-lg"
            value={formData.price}
            onChange={handlePriceChange}
            required
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-2">Discount (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            className="w-full border p-2 rounded-lg "
            value={formData.discountPercent}
            onChange={handleDiscountChange}
          />
        </div>

        {/* Final Price */}
        <div className="block mb-2">
          <label className="block mb-2">Final Price (৳)</label>
          <input
            type="text"
            className="w-full border p-2 rounded-lg "
            value={formData.finalPrice}
            readOnly
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-2">Description</label>
          <textarea
            rows="4"
            className="w-full border p-2 rounded-lg"
            placeholder="Write a beautiful description..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Add Image to Gallery"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddImage;
