// src/pages/user/Deposit/BitcoinPayment.jsx
import React, { useState, useEffect } from "react";
import { Bitcoin } from "lucide-react";
import PaymentTemplate from "./PaymentTemplate";
import { depositService } from "../../../services/depositService";

const BitcoinPayment = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    depositService.getPaymentSettings()
      .then(res => setDetails(res.crypto))
      .catch(() => setDetails({
        address: "bc1q8kdnq4a5jr8ply8w0qvm0359m255jkw4cqca3t",
        networkType: "Bitcoin",
      }));
  }, []);

  if (!details) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
    </div>
  );

  return (
    <PaymentTemplate
      method="bitcoin"
      methodName="Bitcoin"
      icon={Bitcoin}
      gradientFrom="from-orange-500"
      gradientTo="to-amber-600"
      bgColor="bg-orange-100 dark:bg-orange-900/30"
      textColor="text-orange-600 dark:text-orange-400"
      details={details}
    />
  );
};

export default BitcoinPayment;