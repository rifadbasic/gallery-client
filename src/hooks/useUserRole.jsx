// src/hooks/useUserRole.js
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userInfo = {}, isLoading: roleLoading } = useQuery({
    enabled: !!user && !!user.email, 
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data; 
    },
  });

  return { role: userInfo?.role, roleLoading };
};

export default useUserRole;