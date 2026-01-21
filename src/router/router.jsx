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
import Payment from "../pages/Payment";
import ArtistUserRoute from "../AuthRouters/AtristUserRoute";
import AdminLayoute from "../layoutes/AdminLayoute";
import AdminPlan from "../pages/admin/AdminPlan";
import AdminRoute from "../AuthRouters/AdminRoute";
import TotalUsers from "../pages/admin/TotalUsers";
import Subscriptions from "../pages/admin/Subscriptions";
import Payments from "../pages/admin/Payments";
import ImagePayments from "../pages/admin/ImagePayment";
import SubscriptionPayments from "../pages/admin/SubscriptionPayments";
import CategoryImage from "../pages/CategoryImage";
import TotalImage from "../pages/admin/TotalImage";
import UserProfilePage from "../pages/UserProfilePage";

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
            element: (
              <PrivetRoute>
                <Gallery />
              </PrivetRoute>
            ),
          },
        ],
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/category/:categoryName",

        element: (
          <PrivetRoute>
            <CategoryImage />
          </PrivetRoute>
        ),
      },
      {
        path: "/favorites",
        element: (
          <ArtistUserRoute>
            <Favorites />
          </ArtistUserRoute>
        ),
      },
      {
        path: "/subscription",
        element: (
          <PrivetRoute>
            <ExplorePlan />
          </PrivetRoute>
        ),
      },
      {
        path: "/payment/:id/:amount",
        element: (
          <PrivetRoute>
            <Payment />
          </PrivetRoute>
        ),
      },
      {
        path: "/profile/:email",
        element: (
          <PrivetRoute>
            <UserProfilePage />
          </PrivetRoute>
        ),
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
                <ArtistUserRoute>
                  <MyGallery />
                </ArtistUserRoute>
              </PrivetRoute>
            ),
          },
          {
            path: "my-image",
            element: (
              <PrivetRoute>
                <ArtistUserRoute>
                  <MyImage />
                </ArtistUserRoute>
              </PrivetRoute>
            ),
          },
          {
            path: "add-image",
            element: (
              <PrivetRoute>
                <ArtistUserRoute>
                  <AddImage />
                </ArtistUserRoute>
              </PrivetRoute>
            ),
          },
        ],
      },
      {
        path: "admin-dashboard",
        element: (
          <PrivetRoute>
            <AdminRoute>
              <AdminLayoute />
            </AdminRoute>
          </PrivetRoute>
        ),
        children: [
          {
            path: "admin-plan",
            element: (
              <PrivetRoute>
                <AdminRoute>
                  <AdminPlan />
                </AdminRoute>
              </PrivetRoute>
            ),
          },
          {
            path: "images",
            element: (
              <PrivetRoute>
                <AdminRoute>
                  <TotalImage />
                </AdminRoute>
              </PrivetRoute>
            ),
          },
          {
            path: "users",
            element: (
              <PrivetRoute>
                <AdminRoute>
                  <TotalUsers />
                </AdminRoute>
              </PrivetRoute>
            ),
          },
          {
            path: "subscriptions",
            element: (
              <PrivetRoute>
                <AdminRoute>
                  <Subscriptions />
                </AdminRoute>
              </PrivetRoute>
            ),
          },
          {
            path: "payments",
            element: (
              <PrivetRoute>
                <AdminRoute>
                  <Payments />
                </AdminRoute>
              </PrivetRoute>
            ),
          },
          {
            path: "image-payments",
            element: (
              <PrivetRoute>
                <AdminRoute>
                  <ImagePayments />
                </AdminRoute>
              </PrivetRoute>
            ),
          },
          {
            path: "subscriptions-all",
            element: (
              <PrivetRoute>
                <AdminRoute>
                  <SubscriptionPayments />
                </AdminRoute>
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
