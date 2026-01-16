import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import router from "./router/router";
import Gallery from "./pages/gallery/Gallery";
import { GalleryProvider } from "./context/GalleryContext";
import AuthProvider from "./context/AuthProvider";

// 🔹 Apply dark/light mode on app start
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GalleryProvider>
        <RouterProvider router={router} />
      </GalleryProvider>
    </AuthProvider>
  </StrictMode>
);
