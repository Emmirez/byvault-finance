// src/pages/user/Transfers/RevolutTransfer.jsx
import React from "react";
import { Mail, User, Smartphone, DollarSign } from "lucide-react";
import InternationalTransferTemplate from "./InternationalTransferTemplate";

const RevolutTransfer = () => {
  const fields = [
    {
      name: "email",
      label: "Recipient Email",
      type: "email",
      placeholder: "Enter recipient's email",
      icon: Mail,
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter phone number (optional)",
      icon: Smartphone,
      required: false,
    },
    {
      name: "fullName",
      label: "Recipient Full Name",
      type: "text",
      placeholder: "Enter recipient's full name",
      icon: User,
      required: true,
    },
  ];

  const validationRules = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email",
    phone: (value) => !value || /^[\d\s\+\-]{10,}$/.test(value) || "Please enter a valid phone number",
  };

  return (
    <InternationalTransferTemplate
      type="revolut"
      title="Revolut Transfer"
      icon={Smartphone}
      gradientFrom="from-indigo-600"
      gradientTo="to-purple-700"
      accentColor="indigo"
      fields={fields}
      validationRules={validationRules}
    />
  );
};

export default RevolutTransfer;