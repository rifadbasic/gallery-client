// checkoutform.jsx (updated)
import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { id, amount } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");

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
    onSuccess: (data) => {
      if (data.modifiedCount > 0) {
        setPaymentSuccess("✅ Payment Successful!");
        Swal.fire("Success", "Your subscription has been updated!", "success");
        navigate("/");
      } else {
        Swal.fire("Oops", "Subscription update failed.", "warning");
      }
    },
    onError: (err) => {
      Swal.fire("Error", err.message, "error");
    },
  });

  const handleFreeSubscription = async () => {
    mutation.mutate({
      email: userData.email,
      amount: 0,
      transactionId: "free_plan_no_payment",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount,
        email: userData.email,
        name: userData.name,
      });

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: userData.name,
            email: userData.email,
          },
        },
      });

      if (result.error) throw new Error(result.error.message);

      if (result.paymentIntent.status === "succeeded") {
        const transactionId = result.paymentIntent.id;

        await axiosSecure.post("/payments", {
          pay_for: "subscription",
          email: userData.email,
          name: userData.name,
          amount,
          transactionId,
          date: new Date(),
        });

        mutation.mutate({
          email: userData.email,
          amount,
          transactionId,
        });
      }
    } catch (err) {
      Swal.fire("Payment Error", err.message, "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-xl border-1 border-indigo-200 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-center text-indigo-700 mb-4">
          {amount == 0 ? "Activate Free Plan" : "Complete Your Payment"}
        </h2>

        {amount == 0 ? (
          <button
            onClick={handleFreeSubscription}
            disabled={loading}
            className="w-full py-2 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition duration-300"
          >
            {loading ? "Processing..." : "Activate Free Plan"}
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 border-2 border-indigo-300 rounded-xl transition-all focus-within:border-indigo-500 bg-white">
              <CardElement
                className="text-sm"
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
              className={`w-full py-2 px-4 rounded-xl font-medium text-white transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Processing..." : `Pay ৳${amount}`}
            </button>
          </form>
        )}

        {paymentSuccess && (
          <p className="text-green-600 text-center mt-2">{paymentSuccess}</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;