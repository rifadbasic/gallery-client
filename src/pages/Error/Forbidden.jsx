import { useNavigate } from "react-router";
import { Lock } from "lucide-react";

const Forbidden = () => {
  // dynamic title
  document.title = "Forbidden | Gallery";

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-[#0b1220] px-4 text-center">
      <div className="bg-white dark:bg-[#112233] rounded-3xl shadow-xl p-10 max-w-md w-full">
        <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Forbidden Access
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You do not have permission to access this page or resource.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition active:scale-95"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Forbidden;
