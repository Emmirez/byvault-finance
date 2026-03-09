// src/pages/user/Transfers/WireTransfer.jsx
import React from "react";
import { Building2, User, Hash, MapPin, DollarSign } from "lucide-react";
import InternationalTransferTemplate from "./InternationalTransferTemplate";

const WireTransfer = () => {
  const fields = [
    {
      name: "bankName",
      label: "Bank Name",
      type: "text",
      placeholder: "Enter bank name",
      icon: Building2,
      required: true,
    },
    {
      name: "accountName",
      label: "Account Holder Name",
      type: "text",
      placeholder: "Enter account holder name",
      icon: User,
      required: true,
    },
    {
      name: "accountNumber",
      label: "Account Number",
      type: "text",
      placeholder: "Enter account number",
      icon: Hash,
      required: true,
    },
    {
      name: "routingNumber",
      label: "Routing Number (ABA)",
      type: "text",
      placeholder: "Enter routing number",
      icon: Hash,
      required: true,
    },
    {
      name: "swiftCode",
      label: "SWIFT/BIC Code",
      type: "text",
      placeholder: "Enter SWIFT code",
      icon: Building2,
      required: true,
    },
    {
      name: "bankAddress",
      label: "Bank Address",
      type: "textarea",
      placeholder: "Enter bank address",
      icon: MapPin,
      required: true,
      rows: 2,
    },
  ];

  const validationRules = {
    accountNumber: (value) => value.length >= 8 || "Account number must be at least 8 digits",
    routingNumber: (value) => /^\d{9}$/.test(value) || "Routing number must be 9 digits",
    swiftCode: (value) => /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value) || "Invalid SWIFT code format",
  };

  return (
    <InternationalTransferTemplate
      type="wire"
      title="Wire Transfer"
      icon={Building2}
      gradientFrom="from-blue-600"
      gradientTo="to-indigo-600"
      accentColor="blue"
      fields={fields}
      validationRules={validationRules}
    />
  );
};

export default WireTransfer;