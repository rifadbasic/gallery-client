import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  Image,
} from "lucide-react";

const AdminLayout = () => {
  const adminNavItems = [
    {
      name: "Admin Plan",
      path: "/dashboard/admin-dashboard/admin-plan",
      icon: LayoutDashboard,
    },
    { name: "Users", path: "/dashboard/admin-dashboard/users", icon: Users },
    {
      name: "Images",
      path: "/dashboard/admin-dashboard/images",
      icon: Image,
    },
    {
      name: "Subscriptions",
      path: "/dashboard/admin-dashboard/subscriptions",
      icon: CreditCard,
    },
    {
      name: "Payments",
      path: "/dashboard/admin-dashboard/payments",
      icon: Wallet,
    },
    
  ];

  return (
    <div className="flex flex-col min-h-screen ">
      {/* ===== DESKTOP TOP NAV (STICKY, INSIDE LAYOUT) ===== */}
      <nav className="hidden md:flex sticky top-0 z-40 w-full border-2 rounded-lg border-gray-700 bg-[#12305ae8]  p-4 gap-6">
        {adminNavItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 text-md py-2 rounded-lg font-medium transition
               ${
                 isActive
                   ? "bg-indigo-100 text-indigo-600"
                   : "hover:bg-gray-800"
               }`
            }
          >
            <Icon size={20} />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* ===== MAIN CONTENT (SCROLLABLE) ===== */}
      <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
        <Outlet />
      </main>

      {/* ===== MOBILE BOTTOM NAV (ICONS ONLY) ===== */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden bg-[#0d1d33] border-t border-gray-700 flex justify-around items-center p-2 shadow-lg z-50">
        {adminNavItems.map(({ path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
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
            <Icon size={22} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;
