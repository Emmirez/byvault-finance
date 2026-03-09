// src/pages/user/Transfers/CashAppTransfer.jsx
import React from "react";
import { DollarSign, User, Mail } from "lucide-react";
import InternationalTransferTemplate from "./InternationalTransferTemplate";

const CashAppTransfer = () => {
  const fields = [
    {
      name: "cashtag",
      label: "$Cashtag",
      type: "text",
      placeholder: "Enter $Cashtag (e.g., $username)",
      icon: DollarSign,
      required: true,
      helpText: "Include the $ symbol at the beginning",
    },
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter account holder name",
      icon: User,
      required: true,
    },
    {
      name: "email",
      label: "Email (Optional)",
      type: "email",
      placeholder: "Enter email address for receipt",
      icon: Mail,
      required: false,
    },
  ];

  const validationRules = {
    cashtag: (value) => /^\$[a-zA-Z0-9]{4,15}$/.test(value) || "Invalid $Cashtag format (e.g., $username)",
    email: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email",
  };

  return (
    <InternationalTransferTemplate
      type="cashapp"
      title="Cash App Transfer"
      icon={DollarSign}
      gradientFrom="from-green-500"
      gradientTo="to-emerald-500"
      accentColor="green"
      fields={fields}
      validationRules={validationRules}
    />
  );
};

export default CashAppTransfer;