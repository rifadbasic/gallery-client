// src/hooks/useUserStatus.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserStatus = () => {
  const { user, loading } = useAuth(); // your Firebase auth user
  const axiosSecure = useAxiosSecure(); // axios instance with token interceptor

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data; // entire user object
    },
    retry: false, // optional: avoid retrying on 403
  });

  // Extract user_status or default to "free"
  const userStatus = userData?.user_status || "free";

  return { userStatus, isLoading, error };
};

export default useUserStatus;