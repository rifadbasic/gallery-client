import { useNavigate } from "react-router";
import { ArrowLeft, SearchX } from "lucide-react";

const NotFound = () => {
  // dynamic title
  document.title = "404 | Gallery";

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-6">
      <div className="max-w-3xl w-full text-center">
        {/* Big 404 */}
        <h1 className="text-[120px] md:text-[160px] font-extrabold text-indigo-600 leading-none">
          404
        </h1>

        {/* Icon */}
        <div className="flex justify-center my-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <SearchX className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Looks like this corner of the gallery is empty. The frame is there,
          but the picture is missing. Let’s take you back where the light is.
        </p>

        {/* Back Button: Goes to previous page */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
