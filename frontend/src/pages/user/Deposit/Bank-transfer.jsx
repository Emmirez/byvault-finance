// src/pages/user/Deposit/BankTransferPayment.jsx
import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import PaymentTemplate from "./PaymentTemplate";
import { depositService } from "../../../services/depositService";

const BankTransferPayment = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    depositService.getPaymentSettings()
      .then(res => setDetails(res.bankTransfer))
      .catch(() => setDetails({
        bankName: "JPMorgan Chase Bank",
        accountName: "John A. Smith",
        accountNumber: "123456789",
        routingNumber: "021000021",
        swiftCode: "CHASUS33",
        bankAddress: "270 Park Avenue, New York, NY 10017, United States",
      }));
  }, []);

  if (!details) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <PaymentTemplate
      method="bank-transfer"
      methodName="Bank Transfer"
      icon={Building2}
      gradientFrom="from-blue-500"
      gradientTo="to-cyan-600"
      bgColor="bg-blue-100 dark:bg-blue-900/30"
      textColor="text-blue-600 dark:text-blue-400"
      details={details}
    />
  );
};

export default BankTransferPayment;