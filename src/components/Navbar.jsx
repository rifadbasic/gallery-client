import { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Menu, X, Search, User, Camera } from "lucide-react";
import ThemeToggle from "../Utils/ThemeTroggle";
import FavoriteNavButton from "../components/FavoriteNavButton";
import ExplorePlanButton from "../components/ExplorePlanButton";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const mobileMenuRef = useRef(null);
  const desktopProfileRef = useRef(null);
  const mobileProfileRef = useRef(null);

  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  /* Sticky navbar */
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Click outside to close menu & profile */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
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
      {["/", "/gallery", "/about"].map((path, i) => {
        const labels = ["Home", "Gallery", "About"];
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
      {user ? (
        <>
          <Link
            className="block px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            to="/dashboard/profile"
          >
            My Profile
          </Link>
          <button
            className="w-full text-left px-4 py-2 text-red-500 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={async () => {
              try {
                await logOut();
                toast.success("Logged out successfully 🚀");
                navigate("/");
              } catch (err) {
                toast.error("Logout failed ⚠️");
              }
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            className="block px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="block px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            to="/register"
          >
            Register
          </Link>
        </>
      )}
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
          <div className="hidden md:flex">
            <Link
              to="/"
              className="flex items-center mr-6 gap-2 text-xl font-bold text-gray-900 dark:text-white"
            >
              <Camera className="w-6 h-6 text-indigo-600" />
              Gallery
            </Link>

            {/* Desktop links */}
            {navLinks}
          </div>

          {/* Desktop icons */}
          <div className="hidden md:flex items-center gap-4 relative text-white">
            <ExplorePlanButton />
            <FavoriteNavButton />

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
          <div className="flex justify-between md:hidden text-white w-full">
            <div>
              <Link
                to="/"
                className="flex items-center mr-6 gap-2 text-xl font-bold text-gray-900 dark:text-white"
              >
                <Camera className="w-6 h-6 text-indigo-600" />
                Gallery
              </Link>
            </div>
            <div className="flex justify-between items-center gap-4">
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
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden mx-8 mt-4 text-white rounded-2xl bg-[#0d1d33ec] transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-[1000px]  border-2 border-blue-900" : "max-h-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-4">
          <div className="flex gap-4">
            <ExplorePlanButton />
          </div>

          <div className="flex gap-4 relative" ref={mobileProfileRef}>
            <FavoriteNavButton />
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
