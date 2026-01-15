import { createBrowserRouter } from "react-router";
import MainLayoute from "../layoutes/MainLayoute";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserLayoute from "../layoutes/UserLayoute";
import UserProfile from "../pages/UserDashboard/UserProfile";
import UserGalleryLayout from "../layoutes/UserGalleryLayout";
import MyGallery from "../pages/UserGallery/MyGallery";
import MyImage from "../pages/UserGallery/MyImage";
import AddImage from "../pages/UserGallery/AddImage";
import Account from "../pages/UserDashboard/Account";
import Dashboard from "../pages/UserDashboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    element: <MainLayoute />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    errorElement: <NotFound />,
    element: <UserLayoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      { path: "profile", element: <UserProfile /> },
      {
        path: "user-gallery",
        errorElement: <NotFound />,
        element: <UserGalleryLayout />,
        children: [
          { path: "my-gallery", element: <MyGallery /> },
          { path: "my-image", element: <MyImage /> },
          { path: "add-image", element: <AddImage /> },
        ]
      },{
        path: "settings",
        element: <Account />,
      },
    ],
  },
]);

export default router;
