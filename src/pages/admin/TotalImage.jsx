import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TotalImage() {
  const axiosSecure = useAxiosSecure();

  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  console.log(images);

  useEffect(() => {
    fetchImages();
  }, [page, search]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/admin/images?page=${page}&limit=${limit}&search=${search}`,
      );
      setImages(res.data.images);
      setTotalPages(Math.ceil(res.data.total / limit));
      setSelected([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (image) => {
    const newStatus = image.status === "Pending" ? "Unsold" : "Pending";
    try {
      await axiosSecure.post("/admin/images/toggle-status", {
        imageId: image._id,
        status: newStatus,
      });
      setImages((prev) =>
        prev.map((i) =>
          i._id === image._id ? { ...i, status: newStatus } : i,
        ),
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteSingle = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await axiosSecure.delete(`/admin/images/${id}`);
      setImages((prev) => prev.filter((i) => i._id !== id));
      toast.success("Image deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return toast.error("No images selected");
    if (!window.confirm(`Delete ${selected.length} selected images?`)) return;
    try {
      await axiosSecure.post("/admin/images/bulk-delete", { ids: selected });
      setImages((prev) => prev.filter((i) => !selected.includes(i._id)));
      setSelected([]);
      toast.success("Selected images deleted");
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const selectAll = () => setSelected(images.map((i) => i._id));
  const deselectAll = () => setSelected([]);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-[#0b1424]">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Total Images
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, or status..."
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
          className="px-3 py-1 bg-gray-400 text-white rounded"
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
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300 mt-4">
          Loading images...
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto shadow rounded-lg">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="p-2 text-center">✓</th>
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {images.map((img) => (
                  <tr
                    key={img._id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(img._id)}
                        onChange={() => toggleSelect(img._id)}
                      />
                    </td>
                    <td className="p-2">
                      <img
                        src={img.originalImage}
                        alt={img.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">{img.name}</td>
                    <td className="p-2">{img.userEmail}</td>
                    <td className="p-2">{img.role || "User"}</td>
                    <td className="p-2">
                      <button
                        className={`px-2 py-1 rounded ${
                          img.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                        onClick={() => toggleStatus(img)}
                      >
                        {img.status}
                      </button>
                    </td>
                    <td className="p-2">
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded"
                        onClick={() => deleteSingle(img._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {images.map((img) => (
              <div
                key={img._id}
                className="bg-white dark:bg-[#0d1d33] shadow rounded-lg p-4 flex flex-col gap-2 border dark:border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{img.imageName}</p>
                  <input
                    type="checkbox"
                    checked={selected.includes(img._id)}
                    onChange={() => toggleSelect(img._id)}
                  />
                </div>
                <img
                  src={img.url}
                  alt={img.imageName}
                  className="w-full h-40 object-cover rounded"
                />
                <p>
                  <span className="font-semibold">Email:</span> {img.userEmail}
                </p>
                <p>
                  <span className="font-semibold">Role:</span>{" "}
                  {img.role || "User"}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>
                  <button
                    className={`px-2 py-1 rounded ml-2 ${
                      img.status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    onClick={() => toggleStatus(img)}
                  >
                    {img.status}
                  </button>
                </p>
                <div className="flex justify-end mt-2 gap-2">
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => deleteSingle(img._id)}
                  >
                    Delete
                  </button>
                </div>
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
                className={`px-4 py-2 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
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
