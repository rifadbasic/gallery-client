import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function SubscriptionPayments() {
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {
    fetchPayments();
  }, [page, search]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/admin/payments/subscriptions?page=${page}&limit=${limit}&search=${search}`,
      );

      const total = res.data.total || 0;

      
      const mappedPayments = (res.data.payments || []).map((p) => {
        let subscriptionType = "Unknown";

        if (p.amount === 1999) {
          subscriptionType = "Creator";
        } else if (p.amount === 999) {
          subscriptionType = "Artist";
        } else if (p.amount === 0) {
          subscriptionType = "Explorer";
        }

        return {
          ...p,
          subscriptionType,
        };
      });

      setPayments(mappedPayments);
      setTotalPages(Math.ceil(total / limit));
    } catch (err) {
      console.error("Failed to fetch subscription payments", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-[#0b1424]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Subscription Payments
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by buyer or subscription type..."
        className="w-full p-3 border rounded mb-4 dark:bg-[#0d1d33] dark:text-white"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          Loading payments...
        </div>
      ) : (
        <>
          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden md:block overflow-x-auto shadow rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Buyer</th>
                  <th className="p-3 text-left">Subscription Type</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Transaction ID</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-2">{p.email}</td>
                    <td className="p-2 font-semibold">{p.subscriptionType}</td>
                    <td className="p-2 font-semibold">৳ {p.amount}</td>
                    <td className="p-2 text-sm">{p.transactionId}</td>
                    <td className="p-2">{new Date(p.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="md:hidden flex flex-col gap-4">
            {payments.map((p) => (
              <div
                key={p._id}
                className="bg-white dark:bg-[#0d1d33] shadow rounded-lg p-4 flex flex-col gap-2 border dark:border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{p.subscriptionType}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {new Date(p.date).toLocaleDateString()}
                  </span>
                </div>
                <p>
                  <span className="font-semibold">Buyer:</span> {p.email}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> ৳ {p.amount}
                </p>
                <p>
                  <span className="font-semibold">Transaction:</span>{" "}
                  {p.transactionId}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <button
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
