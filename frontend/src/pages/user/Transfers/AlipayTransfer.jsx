// src/pages/user/Transfers/AlipayTransfer.jsx
import React, { useState } from "react";
import { Mail, Phone, User, DollarSign } from "lucide-react";
import InternationalTransferTemplate from "./InternationalTransferTemplate";

const AlipayTransfer = () => {
  const [accountType, setAccountType] = useState("email");

  // Fields array with a custom toggle field at the top
  const fields = [
    {
      name: "accountTypeToggle",
      label: "Alipay Account",
      type: "custom", // Custom type to trigger customRender
      required: false, // Not a form field, just a toggle
    },
    ...(accountType === "email"
      ? [
          {
            name: "email",
            label: "Email Address",
            type: "email",
            placeholder: "Enter Alipay email address",
            icon: Mail,
            required: true,
          },
        ]
      : [
          {
            name: "phone",
            label: "Phone Number",
            type: "tel",
            placeholder: "Enter Alipay phone number",
            icon: Phone,
            required: true,
          },
        ]),
    {
      name: "fullName",
      label: "Recipient Full Name",
      type: "text",
      placeholder: "Enter recipient's full name",
      icon: User,
      required: true,
      helpText: "Name must match the Alipay account holder",
    },
  ];

  const validationRules = {
    email: (value) =>
      !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email",
    phone: (value) =>
      !value || /^[\d\s\+\-()]{10,}$/.test(value) || "Please enter a valid phone number",
  };

  // Custom render for the account type toggle
  const customRender = (field, formData, handleInputChange) => {
    if (field.name === "accountTypeToggle") {
      return (
        <div key={field.name} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {field.label} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAccountType("email")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                accountType === "email"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            >
              <Mail size={18} />
              <span className="font-medium">Email</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType("phone")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                accountType === "phone"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            >
              <Phone size={18} />
              <span className="font-medium">Phone</span>
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <InternationalTransferTemplate
      type="alipay"
      title="Alipay Transfer"
      icon={DollarSign}
      gradientFrom="from-blue-500"
      gradientTo="to-cyan-500"
      accentColor="blue"
      fields={fields}
      validationRules={validationRules}
      customRender={customRender}
    />
  );
};

export default AlipayTransfer;