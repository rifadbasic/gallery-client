import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import { getAuth } from "firebase/auth"; // 👈 ADD THIS

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_Base_URL,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth(); // 👈 Get Firebase auth instance

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const currentUser = auth.currentUser; // 🔹 REAL Firebase user

        if (currentUser) {
          const token = await currentUser.getIdToken(); // ✅ SAFE NOW
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error?.response?.status;

        if (status === 403) {
          navigate("/forbidden");
        } else if (status === 401) {
          await logOut();
          navigate("/login");
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
