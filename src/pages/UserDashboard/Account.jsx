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

const Account = () => {
  const accountData = {
    name: "Khan Rifad Hossain",
    email: "admin02@gmail.com",
    role: "User",
    status: "Active",
    memberSince: "January 2026",
    totalIncome: "৳ 45,000",
    totalSales: 126,
    balance: "৳ 12,500",
    pendingWithdrawal: "৳ 3,200",
  };

  const cards = [
    { title: "Total Income", value: accountData.totalIncome, icon: DollarSign },
    { title: "Total Sales", value: accountData.totalSales, icon: BarChart },
    { title: "Current Balance", value: accountData.balance, icon: Wallet },
    {
      title: "Pending Withdrawal",
      value: accountData.pendingWithdrawal,
      icon: Clock,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">
        Account Settings
      </h1>

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

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* ACCOUNT INFO */}
          <Section title="Account Information" icon={<User size={18} />}>
            <InfoRow label="Name" value={accountData.name} />
            <InfoRow label="Email" value={accountData.email} />
            <InfoRow label="Role" value={accountData.role} />
            <InfoRow label="Status" value={accountData.status} />
            <InfoRow label="Member Since" value={accountData.memberSince} />
          </Section>

          {/* PAYMENT SYSTEM */}
          <Section title="Payment & Billing" icon={<CreditCard size={18} />}>
            <ActionRow
              label="Payment Method"
              value="Visa •••• 4242"
              action="Manage"
            />
            <ActionRow
              label="Billing Address"
              value="Bagerhat, Khulna, Bangladesh"
              action="Edit"
            />
            <ActionRow
              label="Invoices"
              value="Last invoice: Jan 2026"
              action="View"
            />
          </Section>

          {/* WITHDRAWAL SYSTEM */}
          <Section title="Withdrawal System" icon={<Wallet size={18} />}>
            <ActionRow
              label="Default Withdrawal Method"
              value="bKash - 0183****325"
              action="Change"
            />
            <ActionRow
              label="Minimum Withdrawal"
              value="৳ 1,000"
              action="Info"
            />
            <ActionRow
              label="Withdrawal History"
              value="12 completed • 2 pending"
              action="View"
            />
          </Section>

          {/* SECURITY */}
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
            <ActionRow
              label="Login Activity"
              value="3 active sessions"
              action="Review"
            />
          </Section>

          {/* PRIVACY */}
          <Section title="Privacy" icon={<Globe size={18} />}>
            <ActionRow
              label="Profile Visibility"
              value="Public"
              action="Change"
            />
            <ActionRow
              label="Data Sharing"
              value="Minimal"
              action="Manage"
            />
            <ActionRow
              label="Privacy Policy"
              value="Last updated: Dec 2025"
              action="Read"
            />
          </Section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* USER STATUS CARD */}
          <div className="bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Settings size={18} /> Account Status
            </h3>

            <div className="space-y-3">
              <StatusBadge label="Active User" color="green" />
              <StatusBadge label="Verified Email" color="blue" />
              <StatusBadge label="Trusted Seller" color="purple" />
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-white dark:bg-[#0d1d33] p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Bell size={18} /> Notifications
            </h3>

            <ToggleRow label="Email Notifications" enabled={true} />
            <ToggleRow label="Payment Alerts" enabled={true} />
            <ToggleRow label="Withdrawal Updates" enabled={false} />
          </div>

          {/* DANGER ZONE */}
          <div className="bg-red-50 dark:bg-[#1a0f1f] p-5 rounded-xl border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-600 flex items-center gap-2">
              <Trash2 size={18} /> Danger Zone
            </h3>

            <button className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
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

const ToggleRow = ({ label, enabled }) => (
  <div className="flex justify-between items-center">
    <p className="text-sm">{label}</p>
    <div
      className={`w-10 h-5 rounded-full relative cursor-pointer ${
        enabled ? "bg-indigo-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition ${
          enabled ? "right-0.5" : "left-0.5"
        }`}
      />
    </div>
  </div>
);

export default Account;
