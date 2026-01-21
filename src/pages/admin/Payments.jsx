import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function Payments() {
  // dynamic tytle
  document.title = "Payments | Admin";

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [subPayments, setSubPayments] = useState([]);
  const [imgPayments, setImgPayments] = useState([]);

  const [subSearch, setSubSearch] = useState("");
  const [imgSearch, setImgSearch] = useState("");

  const [subTotal, setSubTotal] = useState(0);
  const [imgTotal, setImgTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchSubscriptions();
  }, [subSearch]);

  useEffect(() => {
    fetchImages();
  }, [imgSearch]);

  const fetchSubscriptions = async () => {
    const res = await axiosSecure.get(
      `/admin/payments/subscriptions?limit=${limit}&search=${subSearch}`,
    );
    setSubPayments(res.data.payments);
    setSubTotal(res.data.total);
  };

  const fetchImages = async () => {
    const res = await axiosSecure.get(
      `/admin/payments/image?limit=${limit}&search=${imgSearch}`,
    );
    setImgPayments(res.data.payments);
    setImgTotal(res.data.total);
  };

  return (
    <div className="w-full min-h-screen ">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold ">
          Payments Dashboard
        </h1>

        {/* ================= SUBSCRIPTION PAYMENTS ================= */}
        <section className="w-full border border-gray-700 p-4 md:p-5 rounded-xl shadow ">
          <h2 className="text-lg md:text-xl font-semibold mb-3">
            Subscription Payments
          </h2>

          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full p-2.5 rounded mb-4  border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={subSearch}
            onChange={(e) => setSubSearch(e.target.value)}
          />

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Transaction</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {subPayments.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="p-3 break-all">{p.email}</td>
                    <td className="p-3 font-semibold">৳ {p.amount}</td>
                    <td className="p-3 text-sm break-all">{p.transactionId}</td>
                    <td className="p-3 text-sm">
                      {new Date(p.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS (Fixed & Clean) */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {subPayments.map((p) => (
              <div
                key={p._id}
                className=" rounded-lg p-4 border border-gray-700 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold ">{p.name}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(p.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm  break-all">
                  <span className="font-semibold">Email:</span> {p.email}
                </p>

                <p className="text-sm ">
                  <span className="font-semibold">Amount:</span> ৳ {p.amount}
                </p>

                <p className="text-sm tbreak-all">
                  <span className="font-semibold">Transaction:</span>{" "}
                  {p.transactionId}
                </p>
              </div>
            ))}
          </div>

          {subTotal > limit && (
            <button
              className="mt-4 w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() =>
                navigate("/dashboard/admin-dashboard/subscriptions-all")
              }
            >
              See More
            </button>
          )}
        </section>

        {/* ================= IMAGE PAYMENTS ================= */}
        <section className="w-full border border-gray-700 p-4 md:p-5 rounded-xl shadow ">
          <h2 className="text-lg md:text-xl font-semibold mb-3">
            Image Payments
          </h2>

          <input
            type="text"
            placeholder="Search by buyer, seller or image name..."
            className="w-full p-2.5 rounded mb-4  border border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500"
            value={imgSearch}
            onChange={(e) => setImgSearch(e.target.value)}
          />

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Buyer</th>
                  <th className="p-3 text-left">Seller</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Transaction</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {imgPayments.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="p-3">{p.imageName}</td>
                    <td className="p-3 break-all">{p.buyerEmail}</td>
                    <td className="p-3 break-all">{p.sellerEmail}</td>
                    <td className="p-3 font-semibold">৳ {p.amount}</td>
                    <td className="p-3 text-sm break-all">{p.transactionId}</td>
                    <td className="p-3 text-sm">
                      {new Date(p.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS (Fixed & Clean) */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {imgPayments.map((p) => (
              <div
                key={p._id}
                className=" rounded-lg p-4 border border-gray-700 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold ">{p.imageName}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(p.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm  break-all">
                  <span className="font-semibold">Buyer:</span> {p.buyerEmail}
                </p>

                <p className="text-sm  break-all">
                  <span className="font-semibold">Seller:</span> {p.sellerEmail}
                </p>

                <p className="text-sm ">
                  <span className="font-semibold">Amount:</span> ৳ {p.amount}
                </p>

                <p className="text-sm  break-all">
                  <span className="font-semibold">Transaction:</span>{" "}
                  {p.transactionId}
                </p>
              </div>
            ))}
          </div>

          {imgTotal > limit && (
            <button
              className="mt-4 w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={() =>
                navigate("/dashboard/admin-dashboard/image-payments")
              }
            >
              See More
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
