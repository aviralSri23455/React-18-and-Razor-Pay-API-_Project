import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [amount, setAmount] = useState(""); // State to track user-entered amount
  const [paymentDetails, setPaymentDetails] = useState(null); // State to track payment response

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const backendURL = process.env.REACT_APP_BACKEND_URL;

    try {
      // Step 1: Create an order on the backend
      const { data } = await axios.post(`${backendURL}/create-order`, { amount });

      // Step 2: Define Razorpay checkout options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY, // Razorpay API Key
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Test Company",
        description: "Test Transaction",
        order_id: data.orderId, // Order ID from backend
        handler: (response) => {
          // Step 3: Handle successful payment
          alert("Payment Successful");
          console.log("Payment Response:", response);
          setPaymentDetails(response); // Update state with payment details
        },
        prefill: {
          name: "Test User",
          email: "testuser@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Step 4: Open Razorpay checkout
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Failed:", error);
      alert("Payment Failed. Please try again.");
    }
  };

  return (
    <div>
      
      <div>
        <label>Enter Amount (₹): </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount to pay"
        />
        <button onClick={handlePayment}>Pay ₹{amount || 0}</button>
      </div>

      {/* Display Payment Details */}
      {paymentDetails && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>Payment Details</h3>
          <p><strong>Payment ID:</strong> {paymentDetails.razorpay_payment_id}</p>
          <p><strong>Order ID:</strong> {paymentDetails.razorpay_order_id}</p>
          <p><strong>Signature:</strong> {paymentDetails.razorpay_signature}</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
