// src/components/BillHold.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  AlertCircle,
  Home,
  ArrowLeft,
  Calendar,
  FileText,
  Mail,
  Phone,
  MessageCircle,
  HelpCircle,
  Shield,
  Zap,
  Droplets,
  Wifi,
  Flame,
  Smartphone,
  Tv,
} from "lucide-react";

const BillHold = ({ billDetails, onClose }) => {
  const navigate = useNavigate();

  // Get icon based on bill type
  const getBillIcon = () => {
    switch (billDetails.type) {
      case "electricity":
        return <Zap className="text-yellow-500" size={32} />;
      case "water":
        return <Droplets className="text-blue-500" size={32} />;
      case "internet":
        return <Wifi className="text-purple-500" size={32} />;
      case "gas":
        return <Flame className="text-orange-500" size={32} />;
      case "mobile":
        return <Smartphone className="text-green-500" size={32} />;
      case "tv":
        return <Tv className="text-indigo-500" size={32} />;
      default:
        return <FileText className="text-gray-500" size={32} />;
    }
  };

  // Get gradient based on bill type
  const getGradient = () => {
    switch (billDetails.type) {
      case "electricity":
        return "from-yellow-500 to-orange-500";
      case "water":
        return "from-blue-500 to-cyan-500";
      case "internet":
        return "from-purple-500 to-pink-500";
      case "gas":
        return "from-orange-500 to-red-500";
      case "mobile":
        return "from-green-500 to-emerald-500";
      case "tv":
        return "from-indigo-500 to-blue-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const transactionRef = "BILL-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 dark:bg-amber-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 p-6">
          {/* Hold Icon */}
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative">
            <Clock size={48} className="text-amber-600 dark:text-amber-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Bill Payment On Hold
          </h2>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6 border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-300 text-sm text-center">
              Your payment is currently{" "}
              <span className="font-bold">pending verification</span> and has
              been temporarily placed on hold for your security.
            </p>
          </div>

          {/* Bill Details Card */}
          <div className={`bg-gradient-to-br ${getGradient()} rounded-xl p-5 mb-6 text-white shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                {getBillIcon()}
              </div>
              <div>
                <p className="text-white/80 text-xs">Provider</p>
                <p className="font-bold">{billDetails.provider}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-white/80 text-sm">Amount</span>
                <span className="text-xl font-bold">
                  ${parseFloat(billDetails.amount).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">{billDetails.meterLabel || "Meter/Account Number"}</span>
                <span className="font-mono font-semibold">{billDetails.accountNumber}</span>
              </div>

              {billDetails.accountName && (
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Account Name</span>
                  <span className="font-semibold">{billDetails.accountName}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Status</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 backdrop-blur rounded-full text-xs font-semibold">
                  <Clock size={12} />
                  Pending Verification
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Date & Time</span>
                <span className="text-xs flex items-center gap-1">
                  <Calendar size={12} />
                  {currentDate}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Reference ID</span>
                <span className="text-xs font-mono bg-white/20 backdrop-blur px-2 py-1 rounded">
                  {transactionRef}
                </span>
              </div>
            </div>
          </div>

          {/* Security Message */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                  Why is my payment on hold?
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  For your security, we review certain transactions to prevent fraud. 
                  This is a standard procedure and your funds are safe. You'll receive 
                  a confirmation email once verified.
                </p>
              </div>
            </div>
          </div>

          {/* Receipt Info */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  A confirmation will be sent to <span className="font-semibold">{billDetails.email}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  You'll receive an email once your payment is verified
                </p>
              </div>
            </div>
          </div>

          {/* Need Help Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 justify-center text-sm">
              <HelpCircle size={16} className="text-blue-600" />
              Need Assistance? Contact Support
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+1234567890"
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all group text-center"
              >
                <Phone size={20} className="mx-auto mb-1 text-green-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Call Support</span>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">24/7 Available</p>
              </a>

              <button
                onClick={() => navigate("/support")}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all group text-center"
              >
                <MessageCircle size={20} className="mx-auto mb-1 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Live Chat</span>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Instant Response</p>
              </button>

              <a
                href="mailto:support@byvaultfinance.com"
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all group text-center col-span-2"
              >
                <div className="flex items-center justify-center gap-2">
                  <Mail size={18} className="text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Support</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">support@byvaultfinance.com</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">24-48h response time</p>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Go to Dashboard
            </button>

            <button
              onClick={() => {
                if (onClose) onClose();
                navigate("/pay-bills");
              }}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Pay Another Bill
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 flex items-center justify-center gap-1 pb-24">
            <AlertCircle size={12} />
            This is a security hold. Your funds have not been debited yet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillHold;