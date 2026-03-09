// src/pages/user/Transfers/VenmoTransfer.jsx
import React from "react";
import { User, Phone, Mail, DollarSign } from "lucide-react";
import InternationalTransferTemplate from "./InternationalTransferTemplate";

const VenmoTransfer = () => {
  const fields = [
    {
      name: "username",
      label: "Venmo Username",
      type: "text",
      placeholder: "Enter @username",
      icon: User,
      required: true,
      helpText: "Include the @ symbol",
    },
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter recipient's full name",
      icon: User,
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number (Optional)",
      type: "tel",
      placeholder: "Enter phone number",
      icon: Phone,
      required: false,
    },
    {
      name: "email",
      label: "Email (Optional)",
      type: "email",
      placeholder: "Enter email address",
      icon: Mail,
      required: false,
    },
  ];

  const validationRules = {
    username: (value) => /^@[a-zA-Z0-9]{3,}$/.test(value) || "Invalid username format (e.g., @username)",
    phone: (value) => !value || /^[\d\s\+\-]{10,}$/.test(value) || "Please enter a valid phone number",
    email: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email",
  };

  return (
    <InternationalTransferTemplate
      type="venmo"
      title="Venmo Transfer"
      icon={DollarSign}
      gradientFrom="from-blue-400"
      gradientTo="to-cyan-400"
      accentColor="blue"
      fields={fields}
      validationRules={validationRules}
    />
  );
};

export default VenmoTransfer;