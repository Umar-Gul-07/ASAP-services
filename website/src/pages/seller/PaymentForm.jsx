import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const PaymentForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) return;

    setLoading(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    try {
      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
      });

      if (pmError) {
        setError(pmError.message);
        setLoading(false);
        return;
      }

      // Call your backend to make the payment
      const response = await fetch("https://asap-nine-pi.vercel.app/makepayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          userId: localStorage.getItem("userId") || "demo-user-123",
          productId: "your_product_id", // Replace with actual product ID
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onPaymentSuccess({
          paymentIntentId: data.paymentIntent?.id,
          amount: data.paymentIntent?.amount,
        });
      } else {
        setError(data.error || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Try again.");
    }

    setLoading(false);
  };

  const inputClass =
    "border p-2 rounded-md mb-4 w-full focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-lg font-bold mb-4 text-center">Pay $10 for 1 Month</h2>

      <label className="block mb-1 font-medium">Card Number</label>
      <div className={inputClass}>
        <CardNumberElement options={{ showIcon: true }} />
      </div>

      <label className="block mb-1 font-medium">Expiry Date</label>
      <div className={inputClass}>
        <CardExpiryElement />
      </div>

      <label className="block mb-1 font-medium">CVC</label>
      <div className={inputClass}>
        <CardCvcElement />
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-2 rounded-lg text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Pay $10"}
      </button>
    </form>
  );
};

export default PaymentForm;
