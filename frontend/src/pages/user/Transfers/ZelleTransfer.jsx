// src/pages/user/Transfers/ZelleTransfer.jsx
import React, { useState } from "react";
import { Mail, Phone, User, DollarSign } from "lucide-react";
import InternationalTransferTemplate from "./InternationalTransferTemplate";

const ZelleTransfer = () => {
  const [contactMethod, setContactMethod] = useState("email");

  // Fields array with a custom toggle field at the top
  const fields = [
    {
      name: "contactMethodToggle",
      label: "Send To",
      type: "custom", // Custom type to trigger customRender
      required: false, // Not a form field, just a toggle
    },
    ...(contactMethod === "email"
      ? [
          {
            name: "email",
            label: "Email Address",
            type: "email",
            placeholder: "Enter recipient's email",
            icon: Mail,
            required: true,
          },
        ]
      : [
          {
            name: "phone",
            label: "Phone Number",
            type: "tel",
            placeholder: "Enter recipient's phone number",
            icon: Phone,
            required: true,
          },
        ]),
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
    email: (value) =>
      !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email",
    phone: (value) =>
      !value || /^[\d\s\+\-()]{10,}$/.test(value) || "Please enter a valid phone number",
  };

  // Custom render for the contact method toggle
  const customRender = (field, formData, handleInputChange) => {
    if (field.name === "contactMethodToggle") {
      return (
        <div key={field.name} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {field.label} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setContactMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                contactMethod === "email"
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-700"
              }`}
            >
              <Mail size={18} />
              <span className="font-medium">Email</span>
            </button>
            <button
              type="button"
              onClick={() => setContactMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                contactMethod === "phone"
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-700"
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
      type="zelle"
      title="Zelle Transfer"
      icon={DollarSign}
      gradientFrom="from-purple-600"
      gradientTo="to-indigo-600"
      accentColor="purple"
      fields={fields}
      validationRules={validationRules}
      customRender={customRender}
    />
  );
};

export default ZelleTransfer;