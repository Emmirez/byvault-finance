// components/KYCBanner.jsx
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader } from "lucide-react";
import { usePermissions } from "../../../hooks/usePermissions";

const KYCBanner = () => {
  const navigate = useNavigate();
  const { showKYCBanner, loading } = usePermissions();

  if (loading) return null;

  const bannerState = showKYCBanner();
  if (!bannerState) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          {bannerState === "pending" ? (
            <>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Verification In Progress
              </h3>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                Your KYC documents have been submitted and are under review. You'll be notified once approved.
              </p>
              <button
                onClick={() => navigate("/kyc/status")}
                className="mt-2 px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600"
              >
                Check Status →
              </button>
            </>
          ) : (
            <>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Account Verification Required
              </h3>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                Please complete your KYC verification to unlock all features including transfers, cards, and loans.
              </p>
              <button
                onClick={() => navigate("/kyc")}
                className="mt-2 px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600"
              >
                Complete Verification
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCBanner;