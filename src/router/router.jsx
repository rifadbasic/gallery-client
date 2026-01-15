import { createBrowserRouter } from "react-router";
import MainLayoute from "../layoutes/MainLayoute";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserLayoute from "../layoutes/UserLayoute";
import UserProfile from "../pages/UserDashboard/UserProfile";

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
        element: <Home />,
      },
      { path: "profile", element: <UserProfile /> },
    ],
  },
]);

export default router;
