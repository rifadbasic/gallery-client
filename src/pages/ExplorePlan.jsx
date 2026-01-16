import { Check } from "lucide-react";

const plans = [
  {
    id: 1,
    name: "Starter",
    price: "Free",
    subtitle: "For dreamers who just arrived",
    features: [
      "View all public images",
      "Save up to 5 favorites",
      "Basic gallery access",
      "Standard support",
    ],
    button: "Get Started",
    highlight: false,
  },
  {
    id: 2,
    name: "Creator",
    price: "$9 / month",
    subtitle: "For artists and visionaries",
    features: [
      "Unlimited favorites",
      "Upload images",
      "Early access to new features",
      "Priority support",
      "Profile customization",
    ],
    button: "Choose Creator",
    highlight: true,
  },
  {
    id: 3,
    name: "Pro Gallery",
    price: "$19 / month",
    subtitle: "For professionals and brands",
    features: [
      "Everything in Creator",
      "Featured in gallery",
      "Advanced analytics",
      "Custom branding",
      "Dedicated support",
    ],
    button: "Go Pro",
    highlight: false,
  },
];

const ExplorePlan = () => {
  return (
    <div className="min-h-screen  px-4 py-16">
      <div className="max-w-7xl mx-auto text-center mb-12 mt-12">
        <h1 className="text-3xl md:text-4xl font-bold ">
          Explore Your Plan 🌠
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
          Choose a path that matches your journey — whether you’re just
          wandering, creating, or ruling the gallery.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border-1 border-blue-300 p-6 shadow-lg transition-transform hover:scale-105 ${
              plan.highlight
                ? "bg-indigo-600 text-white scale-105"
                : "bg-white dark:bg-[#0d1d33] text-gray-900 dark:text-white"
            }`}
          >
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <p className="mt-1 text-sm opacity-80">{plan.subtitle}</p>

            <div className="text-3xl font-extrabold my-4">
              {plan.price}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 rounded-xl font-semibold transition ${
                plan.highlight
                  ? "bg-white text-indigo-600 hover:bg-gray-100"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePlan;
