// src/components/BankAccountDetailsModal.jsx
import React, { useState, useEffect } from "react";
import { X, Building2, Copy, Check, AlertTriangle } from "lucide-react";
import { paymentService } from "../../../services/paymentService";
import { useNavigate } from "react-router-dom";

const BankAccountDetailsModal = ({ isOpen, onClose }) => {
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const navigate = useNavigate();

  // Fetch bank account details from backend
  useEffect(() => {
    if (isOpen) {
      fetchBankDetails();
    }
  }, [isOpen]);

  const fetchBankDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await paymentService.getBankDetails();
      
      if (res) {
        setAccountDetails(res);
      } else {
        setError("Failed to load bank details");
        setAccountDetails(null); // ensure safe render
      }
    } catch (err) {
      console.error("Error fetching bank details:", err);
      setError(err.message || "Something went wrong");
      setAccountDetails(null); // ensure safe render
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClose = () => {
    onClose(); // still close the modal
    navigate("/dashboard"); // go back to dashboard
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-800 w-full lg:max-w-lg lg:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Bank Account Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Byvault Finance
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Loading account details...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Please wait a moment
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-center font-medium mb-2">
                Unable to load details
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6 max-w-xs">
                {error}
              </p>
              <button
                onClick={fetchBankDetails}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          ) : accountDetails ? (
            <>
              {/* Account Information Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Account Information
                  </h3>
                </div>

                {/* Account Name */}
                <div className="mb-3">
                  <div className="group flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                          Account Name
                        </p>
                        <p className="text-base font-bold text-gray-900 dark:text-white break-words">
                          {accountDetails.accountName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          accountDetails.accountName,
                          "accountName",
                        )
                      }
                      className="ml-3 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all group-hover:scale-110"
                      title="Copy to clipboard"
                    >
                      {copiedField === "accountName" ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Number */}
                <div className="mb-3">
                  <div className="group flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                          Account Number
                        </p>
                        <p className="text-base font-bold text-gray-900 dark:text-white break-words">
                          {accountDetails.accountNumber}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          accountDetails.accountNumber,
                          "accountNumber",
                        )
                      }
                      className="ml-3 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all group-hover:scale-110"
                      title="Copy to clipboard"
                    >
                      {copiedField === "accountNumber" ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bank Name */}
                {accountDetails.bankName && (
                  <div className="mb-3">
                    <div className="group flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                            Bank Name
                          </p>
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            {accountDetails.bankName}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(accountDetails.bankName, "bankName")
                        }
                        className="ml-3 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all group-hover:scale-110"
                        title="Copy to clipboard"
                      >
                        {copiedField === "bankName" ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Routing Number */}
                {accountDetails.routingNumber && (
                  <div className="mb-3">
                    <div className="group flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                            Routing Number
                          </p>
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            {accountDetails.routingNumber}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            accountDetails.routingNumber,
                            "routingNumber",
                          )
                        }
                        className="ml-3 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all group-hover:scale-110"
                        title="Copy to clipboard"
                      >
                        {copiedField === "routingNumber" ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* SWIFT Code */}
                {accountDetails.swiftCode && (
                  <div className="mb-3">
                    <div className="group flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                            SWIFT Code
                          </p>
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            {accountDetails.swiftCode}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(accountDetails.swiftCode, "swiftCode")
                        }
                        className="ml-3 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all group-hover:scale-110"
                        title="Copy to clipboard"
                      >
                        {copiedField === "swiftCode" ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Bank Address */}
                {accountDetails.bankAddress && (
                  <div className="mb-3">
                    <div className="group flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                            Bank Address
                          </p>
                          <p className="text-base font-bold text-gray-900 dark:text-white break-words">
                            {accountDetails.bankAddress}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            accountDetails.bankAddress,
                            "bankAddress",
                          )
                        }
                        className="ml-3 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all group-hover:scale-110"
                        title="Copy to clipboard"
                      >
                        {copiedField === "bankAddress" ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Bitcoin Wallet */}
                {accountDetails.bitcoinWallet && (
                  <div className="mt-6">
                    <div className="group flex items-start justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1 uppercase tracking-wide font-semibold">
                            Bitcoin Wallet
                          </p>
                          <p className="text-sm font-mono font-bold text-gray-900 dark:text-white break-all">
                            {accountDetails.bitcoinWallet}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            accountDetails.bitcoinWallet,
                            "bitcoinWallet",
                          )
                        }
                        className="ml-3 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all group-hover:scale-110"
                        title="Copy to clipboard"
                      >
                        {copiedField === "bitcoinWallet" ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl p-5 border-l-4 border-gray-600 dark:border-gray-500">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      ⚠️ Security Notice
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Always verify these details before making any transfer.
                      Byvault Finance will never ask you to send money to a
                      different account. Contact support if you're unsure.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">
                        Secure
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Last updated: {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-10 h-10 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-2">
                No Account Details Available
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                Please contact support to set up your bank account details.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <button
            onClick={handleClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @media (min-width: 1024px) {
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
};

export default BankAccountDetailsModal;
