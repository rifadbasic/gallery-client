import { useState, useContext } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../context/AuthContext"; 

const initialState = {
  originalImage: "",
  name: "",
  description: "",
  category: "Photography",
  role: "Regular",
  status: "Pending",
  price: "",
  discountPercent: 0,
  finalPrice: "",
  likes: 0,
};

const AddImage = () => {
  const axiosInstance = useAxios();
  const { user: authUser } = useContext(AuthContext); 

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // Upload image to imgbb
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("image", image);

    try {
      const url = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_uplode_key
      }`;

      const res = await axios.post(url, fd);
      setFormData((prev) => ({ ...prev, originalImage: res.data.data.url }));
      toast.success("Image uploaded successfully 🌿");
    } catch {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
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

    if (!formData.originalImage) {
      toast.error("Please upload an image first!");
      return;
    }

    if (!authUser) {
      toast.error("User not logged in!");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        img: formData.originalImage,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        role: formData.role,
        status: formData.status,
        price: formData.price,
        discountPercent: formData.discountPercent,
        finalPrice: formData.finalPrice,
        likes: formData.likes,
        createdAt: new Date(),
        userEmail: authUser.email,
        userName: authUser.name || authUser.displayName,
        userPhoto: authUser.photo || authUser.photoURL,
      };

      const res = await axiosInstance.post("/images", payload);

      if (res.status === 201 || res.data?.data) {
        toast.success("Image added successfully 🌿", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

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
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow-lg"
      >
        {/* Image Upload */}
        <div className="md:col-span-2">
          {formData.originalImage && (
            <img
              src={formData.originalImage}
              alt="preview"
              className="mt-3 h-40 w-40 object-cover rounded-lg bg-[#0d1d33] text-white"
            />
          )}

          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-2 rounded-lg bg-[#0d1d33] text-white"
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
            className="w-full border p-2 rounded-lg bg-[#0d1d33] text-white"
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
            className="w-full border p-2 rounded-lg bg-[#0d1d33] text-white"
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
            className="w-full border p-2 rounded-lg bg-[#0d1d33] text-white"
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
            className="w-full border p-2 rounded-lg bg-[#0d1d33] text-white"
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
            className="w-full border p-2 rounded-lg bg-[#0d1d33] text-white"
            value={formData.discountPercent}
            onChange={handleDiscountChange}
          />
        </div>

        {/* Final Price */}
        <div className="block mb-2">
          <label className="block mb-2">Final Price (৳)</label>
          <input
            type="text"
            className="w-full border p-2 rounded-lg bg-[#0d1d33] text-white"
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
