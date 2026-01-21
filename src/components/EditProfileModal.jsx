import Modal from "react-modal";
import { useState, useEffect } from "react";
import { Camera, Edit2 } from "lucide-react";
import useAxios from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
const FALLBACK_AVATAR = "https://i.ibb.co/ZYW3VTp/brown-brim.png";

const EditProfileModal = ({ isOpen, onClose, user, onUpdated }) => {
  const axios = useAxios();
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const uploadImage = async (file, field) => {
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("image", file);

      toast.info("Uploading image...");
      const res = await axios.post("/users/upload-image", fd);

      setFormData((prev) => ({
        ...prev,
        [field]: res.data.url,
      }));

      toast.success("Image uploaded successfully 📸");
    } catch (err) {
      toast.error("Image upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/users_profile/${user.email}`, formData);
      toast.success("Profile updated 🌿");
      onUpdated(formData);
      onClose();
    } catch {
      toast.error("Profile update failed ❌");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-full max-w-xl sm:max-w-lg md:max-w-2xl mx-2 md:mx-auto mt-12 p-4 sm:p-6 md:p-8 bg-white dark:bg-[#0d1d33] rounded-2xl outline-none max-h-[90vh] sm:max-h-[85vh] overflow-y-auto scrollbar-hide"
      overlayClassName="fixed inset-0 bg-black/60 z-50 flex justify-center items-start sm:items-center overflow-y-auto"
    >
      {/* ===== COVER AREA ===== */}
      <div className="relative h-40 sm:h-48 md:h-56">
        <img
          src={formData.coverPhoto || FALLBACK_COVER}
          className="w-full h-full object-cover rounded-t-2xl"
        />

        {/* Cover Edit */}
        <label className="absolute bottom-3 right-3 bg-black/60 p-2 rounded-full cursor-pointer hover:scale-105 transition">
          <Camera size={18} className="text-white" />
          <input
            type="file"
            hidden
            onChange={(e) => uploadImage(e.target.files[0], "coverPhoto")}
          />
        </label>

        {/* Avatar */}
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          <div className="relative">
            <img
              src={formData.photo || FALLBACK_AVATAR}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-[#0d1d33] object-cover shadow-lg"
            />

            {/* Avatar Edit */}
            <label className="absolute bottom-1 right-1 bg-indigo-600 p-1.5 rounded-full cursor-pointer hover:scale-105">
              <Edit2 size={14} className="text-white" />
              <input
                type="file"
                hidden
                onChange={(e) => uploadImage(e.target.files[0], "photo")}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ===== FORM BODY ===== */}
      <form
        onSubmit={handleSubmit}
        className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-8 pb-6 space-y-4"
      >
        <Input
          label="Full Name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Short Name"
          value={formData.shortName || ""}
          onChange={(e) =>
            setFormData({ ...formData, shortName: e.target.value })
          }
        />

        <Input
          label="Phone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Input
          label="Location"
          value={formData.location || ""}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />

        <div>
          <label className="text-sm font-medium">Short Bio</label>
          <textarea
            rows="4"
            value={formData.bio || ""}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full mt-1 border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          disabled={uploading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
        >
          {uploading ? "Uploading..." : "Save Changes"}
        </button>
      </form>
    </Modal>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="w-full mt-1 border rounded-lg px-3 py-2" />
  </div>
);

export default EditProfileModal;
