import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { Image, Mail, User, PlusCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { Bounce } from "react-toastify";

const UserGalleryLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      name: "My Gallery",
      path: "/dashboard/user-gallery/my-gallery",
      icon: <Image size={20} />,
    },
    {
      name: "My Image",
      path: "/dashboard/user-gallery/my-image",
      icon: <User size={20} />,
    },
    {
      name: "Add Image",
      path: "/dashboard/user-gallery/add-image",
      icon: <PlusCircle size={20} />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen ">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      {/* ===== TOP NAVIGATION (DESKTOP) ===== */}
      <nav className="hidden md:flex sticky top-0 w-full border-2 rounded-lg border-gray-700 bg-[#12305ae8] px-6 py-4 gap-6 z-50">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
               ${
                 isActive
                   ? "bg-indigo-100 text-indigo-600"
                   : "hover:bg-gray-100 dark:hover:bg-gray-800"
               }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
        <Outlet />
      </main>
      {/* ===== MOBILE NAVIGATION ===== */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden bg-white dark:bg-[#0d1d33] border-t border-gray-200 dark:border-gray-700 flex justify-around items-center p-2 shadow-lg z-50">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-2 rounded-lg transition
               ${
                 isActive
                   ? "bg-indigo-600 text-white"
                   : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
               }`
            }
          >
            {item.icon}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default UserGalleryLayout;
