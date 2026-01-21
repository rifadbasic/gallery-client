import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Camera,
  Heart,
  ShoppingCart,
  Wallet,
  Image as ImageIcon,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
  const axios = useAxiosSecure();

  const { user: currentUser } = useAuth();
  // console.log(currentUser.email);

  // dynamic title
  useEffect(() => {
    document.title = currentUser?.displayName + " | " + "Dashboard" || "Dashboard | User Dashboard";
  }, [currentUser]);

  // ===== STATE =====
  const [uploadedImages, setUploadedImages] = useState([]);
  const [purchasedImages, setPurchasedImages] = useState([]);
  const [favoriteImages, setFavoriteImages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentsPage, setPaymentsPage] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [uploadedImagesCount, setUploadedImagesCount] = useState(0);
  const [favoriteImagesCount, setFavoriteImagesCount] = useState(0);

  // console.log(totalEarnings);

  const PAYMENTS_LIMIT = 10;

  // ===== FETCH DATA =====
  useEffect(() => {
    if (!currentUser?.email) return;

    const fetchData = async () => {
      try {
        // 1. Uploaded images
        const { data: imagesData } = await axios.get(
          `dashboard/images?userEmail=${currentUser.email}`,
        );

        setUploadedImages(imagesData);
        // console.log(imagesData);

        // 2. Purchased images
        const { data: purchasedData } = await axios.get(
          `dashboard/purchases?userEmail=${currentUser.email}`,
        );
        setPurchasedImages(purchasedData);

        // 3. Favorite images
        const { data: favoritesData } = await axios.get(
          `dashboard/favorites?userEmail=${currentUser.email}`,
        );
        setFavoriteImages(favoritesData);

        const { data: uploadCount } = await axios.get(
          `dashboard/images/count?userEmail=${currentUser.email}`,
        );

        const { data: favCount } = await axios.get(
          `dashboard/favorites/count?userEmail=${currentUser.email}`,
        );

        setUploadedImagesCount(uploadCount.count);
        setFavoriteImagesCount(favCount.count);

        // 4. Payments (paginated)
        const { data: paymentsData } = await axios.get(
          `dashboard/payments?userEmail=${currentUser.email}&limit=${PAYMENTS_LIMIT}&skip=0`,
        );
        setPayments(paymentsData);

        // 5. Calculate total earnings from uploaded images
        const { data: total } = await axios.get(
          `dashboard/earnings?userEmail=${currentUser.email}`,
        );
        setTotalEarnings(total.total);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, [currentUser, axios]);

  // ===== PAGINATION FOR PAYMENTS =====
  const loadMorePayments = async () => {
    const nextPage = paymentsPage + 1;
    try {
      const { data } = await axios.get(
        `/payments?userEmail=${currentUser.email}&limit=${PAYMENTS_LIMIT}&skip=${nextPage * PAYMENTS_LIMIT}`,
      );
      setPayments((prev) => [...prev, ...data]);
      setPaymentsPage(nextPage);
    } catch (err) {
      console.error("Load more payments failed:", err);
    }
  };

  // ===== STATS CARD DATA =====
  const stats = [
    {
      title: "Uploaded Images",
      value: uploadedImagesCount,
      icon: <Camera className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Purchased Images",
      value: purchasedImages.length,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Favorite Images",
      value: favoriteImagesCount,
      icon: <Heart className="w-6 h-6" />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Total Earnings",
      value: `৳ ${totalEarnings.toLocaleString()}`,
      icon: <Wallet className="w-6 h-6" />,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold ">
        Your Gallery Dashboard
      </h1>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className=" p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className={`inline-flex p-3 rounded-lg ${item.color}`}>
              {item.icon}
            </div>
            <h3 className="mt-3  text-sm">
              {item.title}
            </h3>
            <p className="text-xl font-bold te">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ===== RECENTLY UPLOADED IMAGES ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GallerySection
          title="Recently Uploaded"
          icon={<ImageIcon className="w-5 h-5" />}
          images={uploadedImages}
        />

        <GallerySection
          title="Favorite Images"
          icon={<Heart className="w-5 h-5 text-pink-500" />}
          images={favoriteImages}
        />
      </div>

      {/* ===== PAYMENT HISTORY ===== */}
      <div className=" p-5 rounded-xl shadow-sm border border-gray-700">
        <h2 className="text-lg font-semibold mb-4  flex items-center gap-2">
          <Wallet className="w-5 h-5 text-yellow-500" />
          Payment & Sales Report
        </h2>

        {/* ===== DESKTOP / TABLET TABLE ===== */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 ">
                  Payment ID
                </th>
                <th className="py-2 ">
                  Amount
                </th>
                <th className="py-2 ">Date</th>
                <th className="py-2 ">Type</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => (
                <tr
                  key={pay._id}
                  className="border-b border-gray-800"
                >
                  <td className="py-3 ">
                    {pay._id}
                  </td>
                  <td className="py-3 ">
                    ৳ {pay.amount}
                  </td>
                  <td className="py-3 ">
                    {pay.date}
                  </td>
                  <td className="py-3 ">
                    {pay.pay_for}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARD VIEW ===== */}
        <div className="sm:hidden grid grid-cols-2 gap-3">
          {payments.map((pay) => (
            <div
              key={pay._id}
              className=" p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <p className="text-xs  truncate">
                {pay._id}
              </p>

              <p className="mt-1 text-lg font-bold ">
                ৳ {pay.amount}
              </p>

              <p className="text-xs  mt-1">
                {pay.pay_for}
              </p>

              <p className="text-xs  mt-1">
                {pay.date}
              </p>
            </div>
          ))}
        </div>

        {payments.length >= PAYMENTS_LIMIT && (
          <div className="mt-4 text-center">
            <button
              onClick={loadMorePayments}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Gallery Section Component =====
const GallerySection = ({ title, icon, images }) => (
  <div className=" p-5 rounded-xl shadow-sm border border-gray-700">
    <h2 className="text-lg font-semibold mb-4  flex items-center gap-2">
      {icon} {title}
    </h2>

    {images.length === 0 ? (
      <p className="text-center  mt-8">
        There are no images
      </p>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img) => (
          <div
            key={img._id}
            className="h-28 rounded-lg bg-gray-800 overflow-hidden"
          >
            <img
              src={img.watermarkedImage}
              alt={img.name || "Image"}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Dashboard;
