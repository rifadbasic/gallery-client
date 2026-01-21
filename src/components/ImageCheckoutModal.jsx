import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const ImageCheckoutModal = ({ img, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  console.log(img.finalPrice)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { data } = await axiosSecure.post("/create-image-payment-intent", {
        amount: img.finalPrice,
        buyerEmail: user.email,
        buyerName: user.displayName || user.email.split("@")[0],
        sellerEmail: img.userEmail,
        imageId: img._id,
      });

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) throw new Error(result.error.message);

      if (result.paymentIntent.status === "succeeded") {
        const transactionId = result.paymentIntent.id;

        await axiosSecure.post("/purchase-image", {
          imageId: img._id,
          imageName: img.name,
          imageLink: img.originalImage,
          price: img.finalPrice,
          buyerEmail: user.email,
          buyerName: user.displayName,
          sellerEmail: img.userEmail,
          transactionId,
        });

        Swal.fire("Success", "Image purchased successfully!", "success");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 500);
      }
    } catch (err) {
      Swal.fire("Payment Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Complete Your Purchase
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1">
            Secure payment powered by Stripe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE - IMAGE INFO */}
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Image Details
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Image Name:</span>
                <span className="text-right">{img.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span className="text-indigo-600 font-semibold">
                  ৳{img.finalPrice}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Seller Email:</span>
                <span className="text-right break-all">{img.userEmail}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Buyer Email:</span>
                <span className="text-right break-all">{user.email}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PAYMENT FORM */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Payment Method
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border rounded-lg p-3 bg-white">
                <CardElement />
              </div>

              <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Processing..." : `Pay ৳${img.finalPrice}`}
              </button>
            </form>

            <button
              onClick={onClose}
              className="mt-4 w-full text-center text-red-500 hover:underline"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCheckoutModal;
