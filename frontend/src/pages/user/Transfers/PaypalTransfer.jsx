// src/pages/user/Transfers/PayPalTransfer.jsx
import React from "react";
import { Mail, User, DollarSign } from "lucide-react";
import InternationalTransferTemplate from "./InternationalTransferTemplate";


const PayPalTransfer = () => {
  const fields = [
    {
      name: "email",
      label: "PayPal Email",
      type: "email",
      placeholder: "Enter recipient's PayPal email",
      icon: Mail,
      required: true,
      helpText: "Please ensure this is the email address associated with their PayPal account",
    },
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter recipient's full name",
      icon: User,
      required: true,
    },
  ];

  const validationRules = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address",
  };

  return (
    <InternationalTransferTemplate
      type="paypal"
      title="PayPal Transfer"
      icon={DollarSign}
      gradientFrom="from-blue-500"
      gradientTo="to-cyan-500"
      accentColor="blue"
      fields={fields}
      validationRules={validationRules}
    />
  );
};

export default PayPalTransfer;