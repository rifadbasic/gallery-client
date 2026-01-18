import { useEffect, useState, useContext } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Crown,
  Star,
  User,
} from "lucide-react";
import useAxios from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthContext";

const UserProfile = () => {
  const userAxios = useAxios();
  const { user: authUser } = useContext(AuthContext);
  // console.log(user)

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(user)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAxios.get(`/users_profile/${authUser.email}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.email) {
      fetchUser();
    }
  }, [authUser, userAxios]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Failed to load profile</p>
      </div>
    );
  }

  // ====== USER STATUS LOGIC ======
  const userStatus = user.user_status ? user.user_status.toLowerCase() : null;

  const statusStyles = {
    normal: "bg-gray-700 text-white",
    explorer: "bg-gray-700 text-white",
    artist: "bg-yellow-500 text-black",
    curator: "bg-purple-600 text-white",
  };

  const statusLabel = {
    normal: "Normal User",
    explorer: "explorer",
    artist: "artist",
    curator: "curator",
  };

  // ====== PROFILE DATA ======
  const profileData = {
    name: user.name,
    email: user.email,
    phone: user.phone || "+880 17XXXXXXXX",
    location: user.location || "Bagerhat, Khulna, Bangladesh",
    role: user.role || "User",
    memberSince: new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    bio: "A passionate learner in Computer Science Technology, building dreams in code and believing in discipline, faith, and progress.",
    avatar: user.photo,
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-white dark:bg-[#0d1d33] rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* ====== COVER PHOTO WITH STATUS ====== */}
        <div className="relative h-40 md:h-56">
          <img
            src={profileData.cover}
            alt="cover"
            className="w-full h-full object-cover"
          />

          {/* USER STATUS BADGE (Only show if exists) */}
          {userStatus && (
            <div
              className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg ${statusStyles[userStatus]}`}
            >
              {userStatus === "curator" && <Crown size={16} />}
              {userStatus === "artist" && <Star size={16} />}
              {(userStatus === "explorer" || userStatus === "free") && (
                <User size={16} />
              )}
              {statusLabel[userStatus]}
            </div>
          )}
        </div>

        {/* ====== AVATAR + NAME SECTION ====== */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16">
            <img
              src={profileData.avatar}
              alt="avatar"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#0d1d33] object-cover shadow-md"
            />

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {profileData.role}
              </p>
            </div>

            <button className="ml-auto mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition">
              <Edit size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* ====== PROFILE DETAILS GRID ====== */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium">{profileData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="font-medium">{profileData.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Location
              </p>
              <p className="font-medium">{profileData.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member Since
              </p>
              <p className="font-medium">{profileData.memberSince}</p>
            </div>
          </div>
        </div>

        {/* ====== BIO SECTION ====== */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {profileData.bio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
