import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxios from "../hooks/useAxiosSecure";
import ImageCard from "../components/ImageCard";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import EditProfileModal from "../components/EditProfileModal";
import { FiEdit } from "react-icons/fi";

const UserProfilePage = () => {
  const { email } = useParams();
  const axios = useAxios();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get(`/user_profile/${email}`);
        setUser(userRes.data);

        const imagesRes = await axios.get(`/images/user_profile/${email}`);
        setUserImages(imagesRes.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [email, axios]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-red-600 text-xl font-semibold mb-6 text-center">
          User account has been deleted or does not exist.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.email === email;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* ===== COVER PHOTO ===== */}
      <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 rounded-3xl  shadow-md bg-gray-100">
        <img
          src={user.coverPhoto || "https://source.unsplash.com/random/1200x400"}
          alt="cover"
          className="w-full h-full object-cover rounded-3xl"
        />

        {/* PROFILE PHOTO */}
        <div className="absolute -bottom-14 md:-bottom-12 left-6 sm:left-12 md:left-16 lg:left-20 flex items-center gap-4">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40">
            <img
              src={user.photo || "/default-avatar.png"}
              alt={user.name}
              className="w-24 h-24 md:w-full md:h-full rounded-full border-2 md:border-4 border-white object-cover shadow-lg"
            />
          </div>

          {/* Name & Status */}
          <div className="flex flex-col justify-center mb-2 md:mb-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100">
              {user.name}{" "}
              {user.user_status === "creator" && (
                <span className="text-purple-600 text-sm md:text-xl font-medium">
                  (Creator)
                </span>
              )}
              {user.user_status === "artist" && (
                <span className="text-green-600 text-xl font-medium">
                  (Artist)
                </span>
              )}
              {user.user_status === "explorer" && (
                <span className="text-blue-600 text-xl font-medium">
                  (Explorer)
                </span>
              )}
            </h1>
            {user.shortName && (
              <p className="md:text-gray-100">@{user.shortName}</p>
            )}
          </div>
        </div>

        {/* ===== EDIT BUTTON ===== */}
        {isOwnProfile && (
          <div className="absolute top-20 md:top-80 right-4 sm:right-10 md:right-14">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center justify-center bg-indigo-400 hover:bg-indigo-500 text-white px-3 md:px-4 py-2 rounded-md font-medium shadow-sm transition"
            >
              <FiEdit className="text-lg" />

              <span className="hidden md:inline ml-2">Edit</span>
            </button>
          </div>
        )}
      </div>

      {/* ===== BIO ===== */}
      <div className="mt-20 md:mt-24 px-4 md:px-6 max-w-4xl">
        <p className="italic text-base sm:text-lg">
          {user.bio || "This user has not added a bio yet."}
        </p>
      </div>

      {/* ===== CONTACT INFO ===== */}
      <div className="mt-6 px-4 md:px-6 flex flex-wrap gap-6">
        {user.location && (
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <FaMapMarkerAlt /> {user.location}
          </div>
        )}
        {user.email && (
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <FaEnvelope /> {user.email}
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <FaPhone /> {user.phone}
          </div>
        )}
      </div>

      {/* ===== USER'S IMAGE COLLECTION ===== */}
      <div className="mt-12 px-4 md:px-6">
        <h2 className="text-2xl font-semibold mb-6">Uploaded Images</h2>

        {userImages.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            This user has not uploaded any images yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userImages.map((img) => (
              <ImageCard key={img._id} img={img} />
            ))}
          </div>
        )}
      </div>

      {/* ===== EDIT PROFILE MODAL ===== */}
      {isEditOpen && (
        <EditProfileModal
          user={user}
          isOpen
          onClose={() => setIsEditOpen(false)}
          onUpdate={(updated) => setUser(updated)}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
