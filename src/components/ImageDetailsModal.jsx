import {
  FaTimes,
  FaDownload,
  FaShoppingCart,
  FaTag,
  FaUser,
  FaLayerGroup,
  FaInfoCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router";

const ImageDetailsModal = ({ img, onClose }) => {
  const navigate = useNavigate();

  // DOWNLOAD / PAY
  const handleDownload = async () => {
    if (img.finalPrice === 0) {
      try {
        const response = await fetch(img.img);
        const blob = await response.blob();

        // Your branded filename
        const projectName = "gallery"; // <-- CHANGE THIS TO YOUR PROJECT NAME
        const fileExtension = img.img.split(".").pop();
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
      navigate(`/checkout/${img._id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3">
      <div className="bg-white dark:bg-[#0d1d33] rounded-2xl w-full max-w-2xl p-4 sm:p-6 relative shadow-2xl">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 sm:top-3 sm:right-3 
                     bg-white/90 dark:bg-[#0a1628] 
                     text-gray-700 dark:text-gray-300
                     hover:text-red-500 hover:scale-105
                     w-9 h-9 sm:w-10 sm:h-10
                     rounded-full shadow-lg flex items-center justify-center
                     transition-all border border-gray-200 dark:border-gray-700"
        >
          <FaTimes size={18} />
        </button>

        {/* ===== IMAGE ===== */}
        <div className="w-full overflow-hidden rounded-xl mb-4">
          <img
            src={img.img}
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

        {/* ===== SMALL FLEX PRICING AREA + BUTTON (YOUR EXACT REQUIREMENT) ===== */}
        <div className="bg-gray-100 dark:bg-[#0a1628] p-3 rounded-lg mb-3">
          <div className="flex items-center gap-2 mb-2">
            <FaTag className="text-green-500" />
            <p className="font-semibold">Pricing</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* PRICE (LEFT ON LARGE, TOP ON SMALL) */}
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

            {/* BUTTON (RIGHT ON LARGE, BELOW ON SMALL — NOT FULL WIDTH) */}
            <button
              onClick={handleDownload}
              className="self-start md:self-center px-6 py-2.5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
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
      </div>
    </div>
  );
};

export default ImageDetailsModal;
