import { createBrowserRouter } from "react-router";
import MainLayoute from "../layoutes/MainLayoute";
import NotFound from "../pages/Error/NotFound";
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
import GalleryLayoute from "../layoutes/GalleryLayoute";
import Gallery from "../pages/gallery/Gallery";
import Favorites from "../pages/Favorites";
import ExplorePlan from "../pages/ExplorePlan";
import About from "../pages/About";
import Forbidden from "../pages/Error/Forbidden";
import PrivetRoute from "../AuthRouters/PrivetRoute";

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
        path: "/gallery",
        element: <GalleryLayoute />,
        children: [
          {
            path: "/gallery",
            element: <Gallery />,
          },
        ],
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      { path: "/subscription", element: <PrivetRoute><ExplorePlan /></PrivetRoute> },
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
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "/dashboard",
    errorElement: <NotFound />,
    element: <UserLayoute />,
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivetRoute>
            <Dashboard />
          </PrivetRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivetRoute>
            <UserProfile />
          </PrivetRoute>
        ),
      },
      {
        path: "user-gallery",
        errorElement: <NotFound />,
        element: <UserGalleryLayout />,
        children: [
          {
            path: "my-gallery",
            element: (
              <PrivetRoute>
                <MyGallery />
              </PrivetRoute>
            ),
          },
          {
            path: "my-image",
            element: (
              <PrivetRoute>
                <MyImage />
              </PrivetRoute>
            ),
          },
          {
            path: "add-image",
            element: (
              <PrivetRoute>
                <AddImage />
              </PrivetRoute>
            ),
          },
        ],
      },
      {
        path: "settings",
        element: (
          <PrivetRoute>
            <Account />
          </PrivetRoute>
        ),
      },
    ],
  },
]);

export default router;
