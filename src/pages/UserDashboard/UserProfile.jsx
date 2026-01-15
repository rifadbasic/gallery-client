import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";

const UserProfile = () => {
  // Later you can replace this with real data from your backend
  const user = {
    name: "Khan Rifad Hossain",
    email: "rifad@example.com",
    phone: "+880 17XXXXXXXX",
    location: "Bagerhat, Khulna, Bangladesh",
    role: "User",
    memberSince: "January 2025",
    bio: "A passionate learner in Computer Science Technology, building dreams in code and believing in discipline, faith, and progress.",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
    cover:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-white dark:bg-[#0d1d33] rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">

        {/* COVER PHOTO */}
        <div className="relative h-40 md:h-56">
          <img
            src={user.cover}
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* AVATAR + NAME SECTION */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#0d1d33] object-cover shadow-md"
            />

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>

            <button className="ml-auto mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition">
              <Edit size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* PROFILE DETAILS GRID */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="flex items-center gap-3">
            <Mail className="text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
              <p className="font-medium">{user.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="font-medium">{user.memberSince}</p>
            </div>
          </div>
        </div>

        {/* BIO SECTION */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {user.bio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
