// src/pages/user/Transfers/WiseTransfer.jsx
import React from "react";
import { Mail, User, Globe, DollarSign } from "lucide-react";
import InternationalTransferTemplate from "./InternationalTransferTemplate";

const WiseTransfer = () => {
  const countries = [
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "EU", label: "European Union" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "JP", label: "Japan" },
    { value: "SG", label: "Singapore" },
    { value: "CH", label: "Switzerland" },
    { value: "NO", label: "Norway" },
    { value: "BR", label: "Brazil" },
  ];
  

  const fields = [
    {
      name: "email",
      label: "Wise Email",
      type: "email",
      placeholder: "Enter recipient's Wise email",
      icon: Mail,
      required: true,
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
      name: "country",
      label: "Recipient Country",
      type: "select",
      options: countries,
      icon: Globe,
      required: true,
      defaultValue: "US",
    },
  ];

  const validationRules = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address",
  };

  return (
    <InternationalTransferTemplate
      type="wise"
      title="Wise Transfer"
      icon={Globe}
      gradientFrom="from-emerald-500"
      gradientTo="to-green-600"
      accentColor="emerald"
      fields={fields}
      validationRules={validationRules}
    />
  );
};

export default WiseTransfer;