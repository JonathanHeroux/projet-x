import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "../layouts/ProtectedRoute";

const RootLayout = lazy(() => import("../layouts/RootLayout"));
const Home = lazy(() => import("../pages/Home"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(() => import("../pages/Login"));
const Profile = lazy(() => import("../pages/Profile"));
const PostDetail = lazy(() => import("../pages/PostDetail"));
const Follow = lazy(() => import("../pages/Follow"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/post/:id",
        element: <PostDetail />,
      },
      {
        path: "/follow",
        element: <Follow />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
export default router;
