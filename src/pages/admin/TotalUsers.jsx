import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function TotalUsers() {
  const axiosSecure = useAxiosSecure();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/admin/users?page=${page}&limit=${limit}&search=${search}`,
      );
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (email, currentRole) => {
    const newRole = currentRole === "user" ? "admin" : "user";
    const newStatus = newRole === "admin" ? "creator" : "explorer";

    setUsers((prev) =>
      prev.map((u) =>
        u.email === email ? { ...u, role: newRole, user_status: newStatus } : u,
      ),
    );

    await axiosSecure.post("/admin/change-role", { email, role: newRole });
  };

  const toggleStatus = async (email, currentStatus) => {
    const newStatus = currentStatus === "disabled" ? "explorer" : "disabled";

    setUsers((prev) =>
      prev.map((u) =>
        u.email === email ? { ...u, user_status: newStatus } : u,
      ),
    );

    await axiosSecure.post("/admin/toggle-status", {
      email,
      user_status: newStatus,
    });
  };

  const deleteUser = async (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setUsers((prev) => prev.filter((u) => u.email !== email));
    await axiosSecure.post("/admin/delete-user", { email });
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-[#0b1424]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        User Management
      </h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="w-full p-3 border rounded-lg mb-4 dark:bg-[#0d1d33] dark:text-white"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          Loading users...
        </div>
      ) : (
        <>
          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden md:block overflow-x-auto shadow rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.email}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 font-semibold">{user.role}</td>
                    <td className="p-3">
                      <span
                        className={
                          user.user_status === "disabled"
                            ? "text-red-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {user.user_status === "disabled"
                          ? "Disabled"
                          : user.user_status || "Active"}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                        onClick={() => changeRole(user.email, user.role)}
                      >
                        Make {user.role === "user" ? "Admin" : "User"}
                      </button>

                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                        onClick={() =>
                          toggleStatus(user.email, user.user_status)
                        }
                      >
                        {user.user_status === "disabled" ? "Enable" : "Disable"}
                      </button>

                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded"
                        onClick={() => deleteUser(user.email)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="md:hidden flex flex-col gap-4">
            {users.map((user) => (
              <div
                key={user.email}
                className="bg-white dark:bg-[#0d1d33] shadow rounded-lg p-4 flex flex-col gap-2 border dark:border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{user.name}</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.user_status === "disabled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.user_status === "disabled"
                      ? "Disabled"
                      : user.user_status || "Active"}
                  </span>
                </div>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Role:</span> {user.role}
                </p>

                <div className="flex justify-end gap-2 mt-2 flex-wrap">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    onClick={() => changeRole(user.email, user.role)}
                  >
                    Make {user.role === "user" ? "Admin" : "User"}
                  </button>

                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                    onClick={() => toggleStatus(user.email, user.user_status)}
                  >
                    {user.user_status === "disabled" ? "Enable" : "Disable"}
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    onClick={() => deleteUser(user.email)}
                  >
                    Delete
                  </button>
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
            <span className="px-4 py-2 bg-gray-200 rounded">Page {page}</span>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
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
