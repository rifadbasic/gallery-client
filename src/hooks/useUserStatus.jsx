import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserStatus = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-status", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    staleTime: 0, 
    cacheTime: Infinity,
    retry: false,
  });

  //  Update status in cache instantly
  const updateStatus = (newStatus) => {
    queryClient.setQueryData(["user-status", user?.email], (old) => ({
      ...old,
      user_status: newStatus,
    }));
  };

  return { userStatus: data?.user_status || "explorer", isLoading: isLoading || authLoading, error, updateStatus };
};

export default useUserStatus;
