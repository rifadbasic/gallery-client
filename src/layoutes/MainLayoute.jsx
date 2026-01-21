import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, Bounce } from "react-toastify";
import { useEffect } from "react";
import { useGallery } from "../context/GalleryContext";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxiosSecure";


export default function MainLayoute() {
  const { user } = useAuth();
  const axios = useAxios();
  const { setInitialFavorites } = useGallery();

  useEffect(() => {
    if (!user?.email) return;

    const loadFavorites = async () => {
      try {
        const res = await axios.get(`/users/${(user.email)}/favorites`);        setInitialFavorites(res.data); // 🔥 খুব গুরুত্বপূর্ণ লাইন
      } catch (err) {
        console.error("Load favorites failed:", err);
      }
    };

    loadFavorites();
  }, [user]);

  return (
    <>
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

      <Navbar />

      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
