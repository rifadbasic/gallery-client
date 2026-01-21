import { motion } from "framer-motion";
import {
  FaCamera,
  FaPalette,
  FaGem,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const plans = [
  {
    name: "Explorer",
    icon: <FaCamera className="text-blue-500 text-5xl" />,
    price: 0,
    display: "Free",
    features: [
      "Access regular gallery items",
      "Basic filters & search",
      "Community support chat",
    ],
    accent: "from-blue-400 to-blue-600",
  },
  {
    name: "Artist",
    icon: <FaPalette className="text-yellow-500 text-5xl" />,
    price: 999,
    display: "$9.99 / month",
    features: [
      "Add your own images to gallery",
      "Advanced filters & search",
      "Save favorite collections",
      "Monthly featured artist content",
    ],
    accent: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Creator",
    icon: <FaGem className="text-purple-600 text-5xl" />,
    price: 1999,
    display: "$19.99 / month",
    features: [
      "All Artist features",
      "Premium image access",
      "Exclusive gallery previews",
      "1-on-1 creator support",
    ],
    accent: "from-purple-500 to-indigo-600",
  },
];

const ExplorePlan = () => {
  const { user, loading, logeOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const email = user?.email;
  // console.log(email)

  // dynamic title
  document.title = "Explore Plan | Gallery";

  const {
    data: userData = {},
    isLoading,
    error,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["user-payment", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/subscriptions/${email}`);
      return res.data;
    },
  });

  const userStatus = (userData.user_status || "free").toLowerCase();

  const handleSubscribe = (amount, id) => {
    if (loading || isLoading) return;

    if (userData?.email !== user?.email) {
      logeOut();
      navigate("/login");
      return;
    }

    // Prevent subscribing to the same plan
    if (
      (amount === 0 && userStatus === "explorer") ||
      (amount === 999 && userStatus === "artist") ||
      (amount === 1999 && userStatus === "creator")
    ) {
      return;
    }

    navigate(`/payment/${id}/${amount}`);
  };

  if (isLoading || loading)
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading gallery plans...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-20">
        Error: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen  py-16 px-4 md:px-8">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16 mt-12"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4">
          Unlock Your Gallery World
        </h2>
        <p className=" text-lg md:text-xl">
          Pick a plan to explore, create, and curate stunning collections. Your
          gallery journey starts here.
        </p>
      </motion.div>

      {/* GALLERY-STYLE CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {plans.map((plan, idx) => {
          const isCurrentPlan =
            (plan.price === 0 && userStatus === "explorer") ||
            (plan.price === 999 && userStatus === "artist") ||
            (plan.price === 1999 && userStatus === "creator");

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.15 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl  border border-gray-700 transform transition-all duration-300 hover:scale-[1.03]"
            >
              {/* Gradient Top Bar */}
              <div
                className={`h-2 w-full bg-gradient-to-r ${plan.accent}`}
              ></div>

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute top-4 right-4 bg-green-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
                  Active Plan
                </div>
              )}

              {/* Card Content */}
              <div className="p-8 text-center flex flex-col items-center gap-4">
                {plan.icon}

                <h3 className="text-2xl font-bold ">{plan.name}</h3>

                <p className="text-indigo-600 font-semibold">{plan.display}</p>

                <ul className=" text-sm mt-4 space-y-2 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* BUTTON: Disabled if user is already on this plan */}
                <button
                  disabled={isCurrentPlan}
                  onClick={() => handleSubscribe(plan.price, userData._id)}
                  className={`mt-6 w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition ${
                    isCurrentPlan
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isCurrentPlan ? "Already Have This Plan" : "Subscribe"}
                  {!isCurrentPlan && <FaArrowRight />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplorePlan;
