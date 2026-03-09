// src/pages/user/Deposit/USDTPayment.jsx
import React, { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import PaymentTemplate from "./PaymentTemplate";
import { depositService } from "../../../services/depositService";

const USDTPayment = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    depositService.getPaymentSettings()
      .then(res => setDetails(res.usdt))
      .catch(() => setDetails({
        address: "TRX7xPdK3jLUf8pMkVj3z9BwNhYzXqC2aE",
        networkType: "TRC20",
      }));
  }, []);

  if (!details) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
    </div>
  );

  return (
    <PaymentTemplate
      method="usdt"
      methodName="USDT"
      icon={DollarSign}
      gradientFrom="from-green-500"
      gradientTo="to-emerald-600"
      bgColor="bg-green-100 dark:bg-green-900/30"
      textColor="text-green-600 dark:text-green-400"
      details={details}
    />
  );
};

export default USDTPayment;