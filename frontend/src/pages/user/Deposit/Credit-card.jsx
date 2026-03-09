// src/pages/user/Deposit/CreditCardPayment.jsx
import React, { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import PaymentTemplate from "./PaymentTemplate";
import { depositService } from "../../../services/depositService";

const CreditCardPayment = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    depositService.getPaymentSettings()
      .then(res => setDetails(res.creditCard))
      .catch(() => setDetails({
        cardholderName: "Jane Eric",
        cardNumber: "**** **** **** 4242",
        expiryDate: "08/27",
        cardType: "Visa",
      }));
  }, []);

  if (!details) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
    </div>
  );

  return (
    <PaymentTemplate
      method="credit-card"
      methodName="Credit Card"
      icon={CreditCard}
      gradientFrom="from-purple-500"
      gradientTo="to-pink-600"
      bgColor="bg-purple-100 dark:bg-purple-900/30"
      textColor="text-purple-600 dark:text-purple-400"
      details={details}
      fee="2.5%"
    />
  );
};

export default CreditCardPayment;