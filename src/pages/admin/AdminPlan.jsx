import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPlan() {
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    totalImages: 0,
    totalSubscribers: 0,
    totalUsers: 0,
    receivedPayments: 0,
    pendingPayments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
        toast.error("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Images",
      value: stats.totalImages,
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      title: "Total Subscribers",
      value: stats.totalSubscribers,
      color: "bg-green-50 border-green-200 text-green-700",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
    {
      title: "Received Payments",
      value: `৳ ${stats.receivedPayments.toLocaleString()}`,
      color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    {
      title: "Payment Requests",
      value: stats.totalPayments,
      color: "bg-red-50 border-red-200 text-red-700",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-[#0b1424]">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
        Admin Overview
      </h1>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300 animate-pulse">
          Loading galaxy of data...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl shadow-sm border ${card.color} transition-transform hover:scale-[1.02]`}
            >
              <h3 className="text-sm font-semibold opacity-80">{card.title}</h3>
              <p className="text-2xl md:text-3xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
