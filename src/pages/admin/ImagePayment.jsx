import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ImagePayments() {
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  // Fetch payments from API
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/admin/payments/images?page=${page}&limit=${limit}&search=${search}`,
      );

      setPayments(res.data.payments || []);
      setTotalPages(Math.ceil(res.data.total / limit) || 1);
      setSelected([]);
    } catch (err) {
      console.error("Failed to fetch payments", err);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch payments on page/search change
  useEffect(() => {
    fetchPayments();
  }, [page, search]);

  // Single delete
  const deleteSingle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?"))
      return;

    try {
      await axiosSecure.delete(`/admin/payments/images/${id}`);
      setPayments((prev) => prev.filter((p) => p._id !== id));
      setSelected((prev) => prev.filter((x) => x !== id));
      toast.success("Payment deleted successfully");
    } catch (err) {
      toast.error("Failed to delete payment");
    }
  };

  // Bulk delete
  const deleteSelected = async () => {
    if (selected.length === 0) return toast.error("No items selected");
    if (!window.confirm(`Delete ${selected.length} selected payments?`)) return;

    try {
      await axiosSecure.post("/admin/payments/images/bulk-delete", {
        ids: selected,
      });
      setPayments((prev) => prev.filter((p) => !selected.includes(p._id)));
      setSelected([]);
      toast.success("Selected payments deleted");
    } catch (err) {
      toast.error("Bulk delete failed");
    }
  };

  // Select logic
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => setSelected(payments.map((p) => p._id));
  const deselectAll = () => setSelected([]);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-[#0b1424]">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Image Payments
      </h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by buyer, seller, or image..."
        className="w-full md:w-1/2 p-3 mb-4 rounded border border-gray-300 dark:border-gray-600 dark:bg-[#0d1d33] dark:text-white focus:outline-none"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={selectAll}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Select All
        </button>
        <button
          onClick={deselectAll}
          className="px-3 py-1 bg-gray-400 rounded text-white"
        >
          Deselect All
        </button>
        <button
          onClick={deleteSelected}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Delete Selected
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-300 mt-4">
          Loading payments...
        </div>
      )}

      {/* Payments Table (Desktop) */}
      {!loading && payments.length > 0 && (
        <div className="hidden md:block overflow-x-auto shadow rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 text-center">✓</th>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Buyer</th>
                <th className="p-2 text-left">Seller</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(p._id)}
                      onChange={() => toggleSelect(p._id)}
                    />
                  </td>
                  <td className="p-2">{p.imageName}</td>
                  <td className="p-2">{p.buyerEmail}</td>
                  <td className="p-2">{p.sellerEmail}</td>
                  <td className="p-2 font-semibold">৳ {p.amount}</td>
                  <td className="p-2">
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => deleteSingle(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && payments.length > 0 && (
        <div className="md:hidden flex flex-col gap-4">
          {payments.map((p) => (
            <div
              key={p._id}
              className="bg-white dark:bg-[#0d1d33] shadow rounded-lg p-4 flex flex-col gap-2 border dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{p.imageName}</p>
                <input
                  type="checkbox"
                  checked={selected.includes(p._id)}
                  onChange={() => toggleSelect(p._id)}
                />
              </div>
              <p>
                <span className="font-semibold">Buyer:</span> {p.buyerEmail}
              </p>
              <p>
                <span className="font-semibold">Seller:</span> {p.sellerEmail}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> ৳ {p.amount}
              </p>
              <div className="flex justify-end mt-2 gap-2">
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => deleteSingle(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && payments.length > 0 && (
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
      )}

      {/* No Payments Message */}
      {!loading && payments.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-300 mt-4">
          No payments found.
        </div>
      )}
    </div>
  );
}
