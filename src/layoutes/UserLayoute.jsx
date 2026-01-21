import { useState, useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import {
  User,
  Settings,
  LayoutDashboard,
  Home,
  X,
  Image,
  LogOut,
  UserRoundPen,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import useUserStatus from "../hooks/useUserStatus";
import useUserRole from "../hooks/useUserRole";

const UserLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logOut } = useContext(AuthContext);
  const { userStatus: status } = useUserStatus();
  const { role, isLoading: roleLoading } = useUserRole();

  // console.log(user);

  const userStatus = status;
  // console.log(userStatus)

  let links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "User Profile",
      path: "/dashboard/profile",
      icon: <User size={20} />,
    },

    {
      name: "Account Settings",
      path: "/dashboard/settings",
      icon: <Settings size={20} />,
    },
  ];

  if (userStatus === "creator" || userStatus === "artist") {
    links.splice(2, 0, {
      name: "My Gallery",
      path: "/dashboard/user-gallery/my-gallery",
      icon: <Image size={20} />,
    });
  }

  if (role === "admin" && !roleLoading) {
    links.splice(2, 0, {
      name: "Admin Panel",
      path: "/dashboard/admin-dashboard/admin-plan",
      icon: <UserRoundPen size={20} />,
    });
  }

  //  Actual logout using AuthContext
  const handleLogout = async () => {
    try {
      await logOut(); 
      navigate("/"); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex h-screen ">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:flex w-64 border-r border-gray-200 dark:border-gray-700  p-5 flex-col gap-2 h-screen">
        <h2 className="text-xl font-bold mb-4">User Panel</h2>

        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
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

        <div className="flex flex-col mt-auto">
          {/* BACK TO HOME */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Home size={18} /> Back to Home
          </Link>
          {/* 🔹 LOG OUT BUTTON (desktop) */}
          <button
            onClick={handleLogout} 
            className="my-4 flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-red-500 hover:text-white  text-red-500"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col relative">
        {/* ===== MOBILE TOP NAV ===== */}
        <div className="sticky top-0 md:hidden flex items-center justify-between px-4 py-3 bg-[#0d1d33] shadow z-50">
          <Link to="/" className="flex items-center gap-1 text-sm">
            <Home size={18} /> Home
          </Link>

          <h1 className="font-semibold">Dashboard</h1>

          <button onClick={() => setOpen(!open)}>
            {open ? <X /> : <User />}
          </button>
        </div>

        {/* ===== MOBILE DROPDOWN MENU ===== */}
        {open && (
          <div
            className="absolute top-13 left-1/2 transform -translate-x-1/2 w-[90%] md:hidden bg-[#0d1d33] p-3 rounded-xl shadow-lg flex justify-around items-center
         transition-all duration-500 ease-out scale-95 opacity-100 animate-dropdown z-49"
          >
            {links.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `p-3 rounded-full flex justify-center items-center transition-colors duration-500
             ${
               isActive
                 ? "bg-indigo-600 text-white"
                 : "text-white hover:bg-indigo-500"
             }`
                }
              >
                {item.icon}
              </NavLink>
            ))}

            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="p-3 rounded-full flex justify-center items-center text-red-500 hover:text-white hover:bg-red-500 transition"
              title="Log Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}

        {/* ===== ROUTED PAGES ===== */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ maxHeight: "calc(100vh - 56px)" }}
        >
          
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
