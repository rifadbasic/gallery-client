import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";
import {
  Menu,
  X,
  Image,
  ShoppingCart,
  Heart,
  Search,
  User,
} from "lucide-react";
import ThemeToggle from "../Utils/ThemeTroggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ FIX: refs added
  const mobileMenuRef = useRef(null);
  const desktopProfileRef = useRef(null);
  const mobileProfileRef = useRef(null);

  /* Sticky navbar */
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ✅ Click outside to close menu & profile */
  useEffect(() => {
    const handleClickOutside = (e) => {
      // close mobile menu
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }

      // close profile dropdown (desktop + mobile safe)
      if (
        profileOpen &&
        !desktopProfileRef.current?.contains(e.target) &&
        !mobileProfileRef.current?.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, profileOpen]);

  const navLinks = (
    <>
      {["/", "/gallery", "/subscription", "/about"].map((path, i) => {
        const labels = ["Home", "Gallery", "Subscription", "About"];
        return (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `px-4 py-2 transition ${
                isActive
                  ? "text-indigo-400 font-semibold border-b border-indigo-400"
                  : "text-gray-900 dark:text-gray-100 hover:text-indigo-500"
              }`
            }
          >
            {labels[i]}
          </NavLink>
        );
      })}
    </>
  );

  /* Profile Dropdown */
  const ProfileDropdown = ({ align = "right" }) => (
    <div
      className={`absolute ${
        align === "right" ? "-right-10" : "-left-14"
      } top-12 w-36 rounded-xl bg-white dark:bg-[#0d1d33] shadow-lg border dark:border-gray-700 z-50`}
    >
      <Link
        className="block px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-800"
        to="/dashboard/profile"
      >
        My Profile
      </Link>
      <Link
        className="block px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-800"
        to="/login"
      >
        Login
      </Link>
      <Link
        className="block px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-800"
        to="/register"
      >
        Register
      </Link>
      <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800">
        Logout
      </button>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div
        className={`relative rounded-2xl top-2 mx-4 lg:mx-auto px-4 transition-all duration-300 ${
          isSticky
            ? "bg-[#12305ae8] max-w-5xl shadow-md "
            : "max-w-7xl bg-[#12305a] shadow-lg"
        }`}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
          >
            <Image className="w-6 h-6 text-indigo-600" />
            Gallery
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex">{navLinks}</div>

          {/* Desktop icons */}
          <div className="hidden md:flex items-center gap-4 relative text-white">
            <ShoppingCart className="cursor-pointer hover:text-indigo-500" />
            <Heart className="cursor-pointer hover:text-indigo-500" />

            {/* Search */}
            <div className="relative">
              <Search
                onClick={() => setSearchOpen(!searchOpen)}
                className="cursor-pointer hover:text-indigo-500"
              />
              {searchOpen && (
                <input
                  className="absolute right-0 top-10 w-60 rounded-lg px-3 py-2 border dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Search..."
                />
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={desktopProfileRef}>
              <User
                onClick={() => setProfileOpen(!profileOpen)}
                className="cursor-pointer hover:text-indigo-500"
              />
              {profileOpen && <ProfileDropdown />}
            </div>

            <ThemeToggle />
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden text-white gap-4">
            <div className="relative">
              <Search
                onClick={() => setSearchOpen(!searchOpen)}
                className="cursor-pointer hover:text-indigo-500"
              />
              {searchOpen && (
                <input
                  className="absolute right-0 top-10 w-60 rounded-lg px-3 py-2 border dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Search..."
                />
              )}
            </div>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden mx-8 mt-4 text-white  rounded-2xl bg-[#0d1d33ec] transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-[1000px]  border-2 border-blue-900" : "max-h-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-4">
          <div className="flex gap-4">
            <ShoppingCart />
            <Heart />
          </div>

          <div className="flex gap-4 relative" ref={mobileProfileRef}>
            <User onClick={() => setProfileOpen(!profileOpen)} />
            {profileOpen && <ProfileDropdown align="left" />}
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col items-center py-4 space-y-3">
          {navLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
