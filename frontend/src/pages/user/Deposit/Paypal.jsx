// src/pages/user/Deposit/PayPalPayment.jsx
import React, { useState, useEffect } from "react";
import { Banknote } from "lucide-react";
import PaymentTemplate from "./PaymentTemplate";
import { depositService } from "../../../services/depositService";

const PayPalPayment = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    depositService.getPaymentSettings()
      .then(res => setDetails(res.paypal))
      .catch(() => setDetails({
        accountName: "Jane Eric",
        email: "janeeric@gmail.com",
      }));
  }, []);

  if (!details) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  return (
    <PaymentTemplate
      method="paypal"
      methodName="PayPal"
      icon={Banknote}
      gradientFrom="from-blue-500"
      gradientTo="to-cyan-500"
      bgColor="bg-blue-100 dark:bg-blue-900/30"
      textColor="text-blue-600 dark:text-blue-400"
      details={details}
      fee="3%"
    />
  );
};

export default PayPalPayment;