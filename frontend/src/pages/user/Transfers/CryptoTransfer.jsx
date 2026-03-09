/* eslint-disable no-unused-vars */
// src/pages/user/Transfers/CryptoTransfer.jsx
import React, { useState, useEffect } from "react";
import {
  Wallet,
  DollarSign,
  Globe,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import InternationalTransferTemplate from "./InternationalTransferTemplate";

// Custom Searchable Select Component
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  label,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option) => {
    onChange({ target: { name: label.toLowerCase().replace(" ", ""), value: option.value } });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-0 text-gray-900 dark:text-white text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Icon className="absolute left-3 text-gray-400" size={18} />
          <span className={selectedOption ? "" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-orange-500 focus:ring-0 text-sm text-gray-900 dark:text-white"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                      value === option.value
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No results found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const CryptoTransfer = () => {
  const [formData, setFormData] = useState({
    cryptocurrency: "BTC",
    network: "",
    walletAddress: "",
    amount: "",
    currency: "btc",
    pin: "",
  });
  const [copiedField, setCopiedField] = useState(null);

  const cryptocurrencies = [
    { value: "BTC", label: "Bitcoin (BTC)" },
  ];

  const networks = {
    BTC: [
      { value: "Native", label: "Native SegWit" },
      { value: "SegWit", label: "SegWit" },
      { value: "Legacy", label: "Legacy" },
    ],
  };

  // Reset network when cryptocurrency changes
  useEffect(() => {
    if (formData.cryptocurrency) {
      setFormData((prev) => ({ ...prev, network: "" }));
    }
  }, [formData.cryptocurrency]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currentNetworks = formData.cryptocurrency
    ? networks[formData.cryptocurrency] || []
    : [];

  const fields = [
    {
      name: "cryptocurrency",
      label: "Cryptocurrency",
      type: "select",
      options: cryptocurrencies,
      icon: DollarSign,
      required: true,
      defaultValue: "BTC",
    },
    {
      name: "network",
      label: "Network",
      type: "select",
      options: currentNetworks,
      icon: Globe,
      required: true,
      dependsOn: "cryptocurrency",
      defaultValue: "Native"
    },
    {
      name: "walletAddress",
      label: "Wallet Address",
      type: "text",
      placeholder: "Enter wallet address",
      icon: Wallet,
      required: true,
      copyable: true,
    },
  ];

  const validationRules = {
    walletAddress: (value) =>
      value.length >= 26 ||
      "Invalid wallet address length (minimum 26 characters)",
  };

  // Custom render for all fields with the new searchable select
  const customRender = (
    field,
    formDataProp,
    handleInputChangeProp,
    copiedFieldProp,
    handleCopyProp
  ) => {
    // Render cryptocurrency dropdown with search
    if (field.name === "cryptocurrency") {
      return (
        <div key={field.name} className="mb-4">
          <SearchableSelect
            options={cryptocurrencies}
            value={formData.cryptocurrency}
            onChange={handleInputChange}
            placeholder="Select cryptocurrency"
            icon={DollarSign}
            label="Cryptocurrency"
            required={true}
          />
        </div>
      );
    }

    // Render network dropdown with search (only if crypto is selected)
    if (field.name === "network") {
      return (
        <div key={field.name} className="mb-4">
          <SearchableSelect
            options={currentNetworks}
            value={formData.network}
            onChange={handleInputChange}
            placeholder={
              formData.cryptocurrency
                ? "Select network"
                : "Select cryptocurrency first"
            }
            icon={Globe}
            label="Network"
            required={true}
          />
          {!formData.cryptocurrency && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Please select a cryptocurrency first
            </p>
          )}
        </div>
      );
    }

    // Render wallet address with copy button and warning
    if (field.name === "walletAddress") {
  return (
    <div key={field.name} className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {field.label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <field.icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          name={field.name}
          value={formDataProp[field.name] || ""}
          onChange={handleInputChangeProp}
          placeholder={field.placeholder}
          className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-0 text-gray-900 dark:text-white"
        />
        {formDataProp[field.name] && (
          <button
            type="button"
            onClick={() => handleCopyProp(formDataProp[field.name], field.name)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {copiedFieldProp === field.name ? (
              <CheckCircle2 size={16} className="text-green-600" />
            ) : (
              <Copy size={16} className="text-gray-400" />
            )}
          </button>
        )}
      </div>
      <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-3 flex gap-2 rounded">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Double-check your wallet address. Transactions to incorrect addresses cannot be reversed.
        </p>
      </div>
    </div>
  );
}
    return null;
  };

  return (
    <InternationalTransferTemplate
      type="crypto"
      title="Crypto Transfer"
      icon={Wallet}
      gradientFrom="from-orange-500"
      gradientTo="to-amber-500"
      accentColor="orange"
      fields={fields}
      validationRules={validationRules}
      customRender={customRender}
    />
  );
};

export default CryptoTransfer;