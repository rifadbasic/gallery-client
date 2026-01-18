import { useEffect, useState } from "react";
import {
  User,
  Shield,
  CreditCard,
  Wallet,
  BarChart,
  DollarSign,
  Key,
  Bell,
  Settings,
  Globe,
  Clock,
  Lock,
  Trash2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const Account = () => {
  const { user, deleteAccount, logOut } = useAuth();
  const axios = useAxiosSecure();
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // FETCH USER DATA
  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`/users_profile/${user.email}`)
      .then((res) => {
        setAccountData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const cards = [
    { title: "Total Income", value: "৳ 45,000", icon: DollarSign },
    { title: "Total Sales", value: 126, icon: BarChart },
    { title: "Current Balance", value: "৳ 12,500", icon: Wallet },
    {
      title: "Pending Withdrawal",
      value: "৳ 3,200",
      icon: Clock,
    },
  ];

  const randomText = (text) => (text && text !== "" ? text : "Not provided");

  const maskPassword = (pass) => {
    if (!pass) return "Not set";
    if (pass === "google_auth") return "Google Auth User";
    return "••••••••";
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/users_profile/${user.email}`);
      await deleteAccount();
      await logOut();
      navigate("/login");
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading account...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Account Settings</h1>

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
                <Icon size={18} />
              </div>
              <p className="text-xl font-semibold mt-2">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Account Information" icon={<User size={18} />}>
            <InfoRow label="Name" value={randomText(accountData?.name)} />
            <InfoRow label="Email" value={randomText(accountData?.email)} />
            <InfoRow label="Phone" value={randomText(accountData?.phone)} />
            <InfoRow label="Role" value={accountData?.role || "User"} />
            <InfoRow
              label="Password"
              value={maskPassword(accountData?.password)}
            />
            <InfoRow
              label="Member Since"
              value={accountData?.createdAt ? new Date(accountData.createdAt).toLocaleDateString() : "Unknown"}
            />          </Section>

          <Section title="Security" icon={<Shield size={18} />}>
            <ActionRow
              label="Change Password"
              value="Last changed 2 months ago"
              action="Update"
              icon={<Key size={16} />}
            />
            <ActionRow
              label="Two-Factor Authentication"
              value="Disabled"
              action="Enable"
              icon={<Lock size={16} />}
            />
          </Section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Settings size={18} /> Account Status
            </h3>

            <div className="space-y-3">
              <StatusBadge label={accountData?.role || "User"} color="green" />
              <StatusBadge
                label={accountData?.user_status || "Active"}
                color="blue"
              />
              <StatusBadge label="Verified Email" color="purple" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-[#1a0f1f] p-5 rounded-xl border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-600 flex items-center gap-2">
              <Trash2 size={18} /> Danger Zone
            </h3>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white dark:bg-[#0d1d33] p-6 rounded-xl w-96">
            <h3 className="text-lg font-bold mb-3">Confirm Deletion</h3>
            <p className="mb-4">
              This action is permanent. Your account and all data will be
              erased.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-300 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========== SMALL REUSABLE UI COMPONENTS ========== */

const Section = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
    <h3 className="font-semibold mb-3 flex items-center gap-2">
      {icon} {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const ActionRow = ({ label, value, action, icon }) => (
  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
    <button className="flex items-center gap-1 text-indigo-600 text-sm hover:underline">
      {icon} {action}
    </button>
  </div>
);

const StatusBadge = ({ label, color }) => {
  const colors = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm ${colors[color]}`}
    >
      {label}
    </span>
  );
};

export default Account;
