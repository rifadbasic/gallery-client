import {
  FaTimes,
  FaDownload,
  FaShoppingCart,
  FaTag,
  FaUser,
  FaLayerGroup,
  FaInfoCircle,
  FaFileImage,
} from "react-icons/fa";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { RxDimensions } from "react-icons/rx";
import { Link } from "react-router";
import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import ImageCheckoutModal from "./ImageCheckoutModal";
import { loadStripe } from "@stripe/stripe-js";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import "./component.css";

const stripePromise = loadStripe(import.meta.env.VITE_Publishable_Key);

const ImageDetailsModal = ({ img, onClose }) => {
  const [showPayment, setShowPayment] = useState(false);

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const hasDownloaded = img.sold?.some((s) => s.buyerEmail === user?.email);

  const isWoner = img.userEmail === user?.email;

  // DOWNLOAD / PAY
  const handleDownload = async () => {
    if (hasDownloaded) return;
    if (isWoner) return;

    if (img.finalPrice === 0) {
      await axiosSecure.post("/download-free-image", {
        imageId: img._id,
        imageName: img.name,
        imageLink: img.originalImage,
        buyerEmail: user.email,
        buyerName: user.displayName,
        sellerEmail: img.userEmail,
      });
      try {
        const response = await fetch(img.originalImage);
        const blob = await response.blob();

        // Your branded filename
        const projectName = "gallery"; 
        const fileExtension = img.originalImage.split(".").pop();
        const fileName = `${projectName}_${img.name}.${fileExtension}`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean memory
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    } else {
      setShowPayment(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3">
      <div className="bg-white dark:bg-[#0d1d33] rounded-2xl w-full max-w-full sm:max-w-lg md:max-w-2xl p-6 relative shadow-2xl max-h-[90vh]">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3
      bg-white/90 dark:bg-[#0a1628]
      text-gray-700 dark:text-gray-300
      hover:text-red-500 hover:scale-105
      w-9 h-9 sm:w-10 sm:h-10
      rounded-full shadow-lg flex items-center justify-center
      transition-all border border-gray-200 dark:border-gray-700 z-50"
        >
          <FaTimes size={18} />
        </button>
        <div className="overflow-y-auto max-h-[80vh] pr-2 scrollbar-hide">
          {/* ===== IMAGE ===== */}
          <div className="w-full overflow-hidden rounded-xl mb-4">
            <img
              src={img.watermarkedImage}
              alt={img.name}
              className="w-full h-60 sm:h-72 md:h-80 object-cover"
            />
          </div>

          {/* ===== USER INFO (NOW BELOW IMAGE) ===== */}
          <div className="flex items-center gap-3 mb-4">
            <Link to={`/profile/${img.userEmail}`}>
              <img
                src={img.userPhoto || "/default-avatar.png"}
                alt={img.userName}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
            </Link>

            <Link
              to={`/profile/${img.userEmail}`}
              className="font-medium text-gray-800 dark:text-gray-200 hover:underline"
            >
              {img.userName}
            </Link>
          </div>

          {/* ===== TITLE ===== */}
          <h2 className="text-xl sm:text-2xl font-bold mb-3">{img.name}</h2>

          {/* ===== IMAGE DETAILS (ONLY IF EXISTS) ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {img.category && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0a1628] p-2 rounded-lg">
                <FaLayerGroup className="text-blue-500" />
                <p className="text-sm font-medium">{img.category}</p>
              </div>
            )}

            {img.status && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0a1628] p-2 rounded-lg">
                <FaInfoCircle className="text-purple-500" />
                <p className="text-sm font-medium">
                  <span
                    className={`${
                      img.status === "Unsold"
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {img.status}
                  </span>
                </p>
              </div>
            )}

            {img.role && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0a1628] p-2 rounded-lg">
                <FaUser className="text-teal-500" />
                <p className="text-sm font-medium">{img.role}</p>
              </div>
            )}
          </div>

          {/* ===== IMAGE METADATA ===== */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {/* Dimensions */}
            {img.width && img.height && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0a1628] p-2 rounded-lg">
                <RxDimensions className="text-blue-500" />
                <p className="text-sm font-medium">
                  {img.width} × {img.height} px
                </p>
              </div>
            )}

            {/* File Size */}
            {img.size && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0a1628] p-2 rounded-lg">
                <MdOutlinePhotoSizeSelectActual className="text-pink-500" />
                <p className="text-sm font-medium">
                  {img.size >= 1024 * 1024
                    ? `${(img.size / (1024 * 1024)).toFixed(2)} MB`
                    : `${(img.size / 1024).toFixed(2)} KB`}
                </p>
              </div>
            )}

            {/* File Type */}
            {img.format && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0a1628] p-2 rounded-lg">
                <FaFileImage className="text-pink-500" />
                <p className="text-sm font-medium">
                  {img.format.toUpperCase()}
                </p>
              </div>
            )}

            {/* Optional: You could add diamond/rarity icon if you have that info */}
            {img.diamond && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0a1628] p-2 rounded-lg">
                <FaGem className="text-teal-500" />
                <p className="text-sm font-medium">Diamond</p>
              </div>
            )}
          </div>

          {/* ===== SMALL FLEX PRICING AREA + BUTTON (YOUR EXACT REQUIREMENT) ===== */}
          <div className="bg-gray-100 dark:bg-[#0a1628] p-3 rounded-lg mb-3">
            <div className="flex items-center gap-2 mb-2">
              <FaTag className="text-green-500" />
              <p className="font-semibold">Pricing</p>
            </div>

            {hasDownloaded && (
              <p className="text-sm text-orange-600 font-medium mb-2">
                Already purchased this image.
              </p>
            )}

            {isWoner && (
              <p className="text-sm text-orange-600 font-medium mb-2">
                You are the owner of this image.
              </p>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                {img.finalPrice === 0 ? (
                  <p className="text-lg font-bold text-green-600">Free</p>
                ) : (
                  <>
                    <p className="text-xl font-bold">৳{img.finalPrice}</p>
                    {img.discountPercent > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        ৳{img.price} • {img.discountPercent}% off
                      </p>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={handleDownload}
                disabled={hasDownloaded || isWoner}
                className={`self-start md:self-center px-6 py-2.5 flex items-center justify-center gap-2 rounded-lg transition-all ${
                  hasDownloaded || isWoner
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {img.finalPrice === 0 ? (
                  <>
                    <FaDownload /> Download
                  </>
                ) : (
                  <>
                    <FaShoppingCart /> Buy & Download
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ===== DESCRIPTION (WITH HEADING, ONLY IF EXISTS) ===== */}
          {img.description && (
            <div>
              <p className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                Description:
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {img.description}
              </p>
            </div>
          )}
          {showPayment && (
            <Elements stripe={stripePromise}>
              <ImageCheckoutModal
                img={img}
                onClose={() => setShowPayment(false)}
                onSuccess={async () => {
                  try {
                    const response = await fetch(img.originalImage);
                    const blob = await response.blob();

                    const projectName = "gallery";
                    const fileExtension = img.originalImage.split(".").pop();
                    const fileName = `${projectName}_${img.name}.${fileExtension}`;

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = fileName;

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Download failed:", error);
                  }
                }}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDetailsModal;
