import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaCamera, FaPalette, FaGem } from "react-icons/fa";
import useUserStatus from "../hooks/useUserStatus";

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
    duration: "Unlimited",
  },
  {
    name: "Artist",
    icon: <FaPalette className="text-yellow-500 text-5xl" />,
    price: 999,
    display: "$9.99 / month",
    features: [
      "Add your own images",
      "Advanced filters & search",
      "Save favorites",
      "Monthly featured content",
    ],
    duration: "1 Month",
  },
  {
    name: "Creator",
    icon: <FaGem className="text-purple-600 text-5xl" />,
    price: 1999,
    display: "$19.99 / month",
    features: [
      "All Artist features",
      "Premium access",
      "Exclusive previews",
      "1-on-1 creator support",
    ],
    duration: "1 Month",
  },
];

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { id, amount: amountParam } = useParams();
  const amount = Number(amountParam);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { updateStatus } = useUserStatus(); 

  const [loading, setLoading] = useState(false);

  // fetch user subscription
  const { data: userData = {} } = useQuery({
    enabled: !!user?.email,
    queryKey: ["user-payment", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/subscriptions/${id}`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (paymentInfo) => {
      const res = await axiosSecure.patch("/users/premium", paymentInfo);
      return res.data;
    },
  });

  const handleFreeSubscription = async () => {
    try {
      setLoading(true);
      await mutation.mutateAsync({
        email: userData.email,
        amount: 0,
        transactionId: "free_plan_no_payment",
      });

      updateStatus("explorer"); 
     
      await Swal.fire({
        icon: "success",
        title: "Subscription Activated!",
        text: "You are now on Free Plan",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });

      navigate(location.state?.from || "/");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      // create payment intent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount,
        email: userData.email,
        name: userData.name,
      });

      const clientSecret = data.clientSecret;

      // confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: userData.name, email: userData.email },
        },
      });

      if (result.error) throw new Error(result.error.message);

      if (result.paymentIntent.status === "succeeded") {
        const transactionId = result.paymentIntent.id;

        // save payment history
        await axiosSecure.post("/payments", {
          pay_for: "subscription",
          email: userData.email,
          name: userData.name,
          amount,
          transactionId,
          date: new Date(),
        });

        // update backend status
        await mutation.mutateAsync({
          email: userData.email,
          amount,
          transactionId,
        });

        // frontend instant update
        let newStatus =
          amount === 999 ? "artist" : amount === 1999 ? "creator" : "explorer";
        updateStatus(newStatus);

        // ✅ toast + redirect
        await Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: `You are now on ${newStatus} plan.`,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        navigate(location.state?.from || "/");
      }
    } catch (err) {
      Swal.fire("Payment Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find((p) => p.price === amount) || plans[0];

  return (
    <div className="min-h-[80vh] flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-4 md:p-10 border border-indigo-200 mt-18">
        <h2 className="text-xl md:text-2xl font-bold text-center text-indigo-700 mb-6">
          {amount === 0 ? "Activate Free Plan" : "Your Subscription Payment"}
        </h2>

        {/* User & Plan Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Name:</span> {userData.name}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Subscription:</span>{" "}
              {selectedPlan.name}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Duration:</span>{" "}
              {selectedPlan.duration}
            </p>
          </div>

          <div className="bg-gradient-to-r p-4 rounded-xl from-indigo-100 to-indigo-200">
            <div className="flex items-center gap-3 mb-2">
              {selectedPlan.icon}
              <h3 className="text-xl font-semibold">{selectedPlan.name}</h3>
            </div>
            <p className="text-indigo-700 font-bold text-lg">
              {selectedPlan.display}
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              {selectedPlan.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Form */}
        {amount === 0 ? (
          <button
            onClick={handleFreeSubscription}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-lg transition duration-300"
          >
            {loading ? "Processing..." : "Activate Free Plan"}
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border-2 border-indigo-300 rounded-xl transition-all focus-within:border-indigo-500 bg-white">
              <CardElement
                className="text-base"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1e293b",
                      "::placeholder": { color: "#94a3b8" },
                    },
                    invalid: { color: "#ef4444" },
                  },
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!stripe || loading}
              className={`w-full py-3 rounded-xl font-medium text-white text-lg transition duration-300 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {loading ? "Processing..." : `Pay ৳${amount}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
