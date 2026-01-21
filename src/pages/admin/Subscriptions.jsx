import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function Subscriptions() {
  // dynamic tytle
  document.title = "Subscriptions | Admin";

  const axiosSecure = useAxiosSecure();

  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchSubscriptions();
  }, [page, search]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/admin/subscriptions?page=${page}&limit=${limit}&search=${search}`,
      );

      setSubs(res.data.subscriptions);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load subscriptions", err);
    } finally {
      setLoading(false);
    }
  };

  const disableSubscription = async (paymentId) => {
    if (!window.confirm("Disable this subscription?")) return;

    // Optimistic UI update
    setSubs((prev) =>
      prev.map((s) => (s._id === paymentId ? { ...s, status: "disabled" } : s)),
    );

    try {
      await axiosSecure.post("/admin/disable-subscription", {
        paymentId,
      });
    } catch (err) {
      console.error("Failed to disable subscription", err);

      // rollback (optional but pro move)
      setSubs((prev) =>
        prev.map((s) => (s._id === paymentId ? { ...s, status: "active" } : s)),
      );
    }
  };

  const deleteSubscription = async (paymentId) => {
    if (
      !window.confirm(
        "This will permanently delete the subscription. Continue?",
      )
    )
      return;

    setSubs((prev) => prev.filter((s) => s._id !== paymentId));

    try {
      await axiosSecure.delete(`/admin/delete-subscription/${paymentId}`);
    } catch (err) {
      console.error("Failed to delete subscription", err);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen ">
      <h1 className="text-xl md:text-2xl font-bold mb-4">All Subscriptions</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by user email..."
        className="md:w-full p-3 border rounded-lg mb-4 "
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          Loading subscriptions...
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block shadow rounded-lg border overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Transaction ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {subs.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3 font-semibold">৳ {s.amount}</td>
                    <td className="p-3 text-sm">{s.transactionId}</td>
                    <td className="p-3">{new Date(s.date).toLocaleString()}</td>
                    <td className="p-3">
                      {s.status === "disabled" ? (
                        <button
                          className="px-3 py-1 bg-red-700 text-white rounded"
                          onClick={() => deleteSubscription(s._id)}
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 bg-yellow-500 text-white rounded"
                          onClick={() => disableSubscription(s._id, s.email)}
                        >
                          Disable
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden flex flex-col gap-4">
            {subs.map((s) => (
              <div
                key={s._id}
                className=" shadow rounded-lg p-4 flex flex-col gap-2 border dark:border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{s.name}</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      s.status === "disabled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {s.status || "ACTIVE"}
                  </span>
                </div>
                <p>
                  <span className="font-semibold">Email:</span> {s.email}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> ৳ {s.amount}
                </p>
                <p>
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {s.transactionId}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(s.date).toLocaleString()}
                </p>
                <div className="flex justify-end mt-2 gap-2">
                  {s.status === "disabled" ? (
                    <button
                      className="px-3 py-1 bg-red-700 text-white rounded text-sm"
                      onClick={() => deleteSubscription(s._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                      onClick={() => disableSubscription(s._id, s.email)}
                    >
                      Disable
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
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
                  page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
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
