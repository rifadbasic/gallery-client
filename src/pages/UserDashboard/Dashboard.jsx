import { Camera, Heart, ShoppingCart, Wallet, Image as ImageIcon } from "lucide-react";

const Dashboard = () => {
  // Dummy but meaningful data (you can replace with real API later)
  const stats = [
    {
      title: "Uploaded Images",
      value: 128,
      icon: <Camera className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Purchased Images",
      value: 34,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Favorite Images",
      value: 56,
      icon: <Heart className="w-6 h-6" />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Total Earnings",
      value: "৳ 18,450",
      icon: <Wallet className="w-6 h-6" />,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const recentPayments = [
    { id: "#PAY-1012", amount: "৳ 1,200", date: "12 Jan 2026", status: "Completed" },
    { id: "#PAY-1011", amount: "৳ 850", date: "10 Jan 2026", status: "Completed" },
    { id: "#PAY-1010", amount: "৳ 2,300", date: "08 Jan 2026", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        Your Gallery Dashboard
      </h1>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className={`inline-flex p-3 rounded-lg ${item.color}`}>
              {item.icon}
            </div>
            <h3 className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
              {item.title}
            </h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ===== IMAGE OVERVIEW SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uploaded Images Preview */}
        <div className="bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Recently Uploaded
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-28 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden"
              >
                <img
                  src={`https://picsum.photos/400/300?random=${item}`}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />              </div>
            ))}
          </div>
        </div>

        {/* Favorite Images Preview */}
        <div className="bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Favorite Images
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-28 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden"
              >
                <img
                  src={`https://picsum.photos/400/300?love=${item}`}
                  alt="Favorite"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PAYMENT & SALES REPORT ===== */}
      <div className="bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-yellow-500" />
          Payment & Sales Report
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 text-gray-600 dark:text-gray-300">Payment ID</th>
                <th className="py-2 text-gray-600 dark:text-gray-300">Amount</th>
                <th className="py-2 text-gray-600 dark:text-gray-300">Date</th>
                <th className="py-2 text-gray-600 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((pay) => (
                <tr key={pay.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-gray-900 dark:text-white">{pay.id}</td>
                  <td className="py-3 text-gray-900 dark:text-white">{pay.amount}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{pay.date}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        pay.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
