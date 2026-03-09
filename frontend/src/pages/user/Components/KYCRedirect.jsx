import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kycService } from "../../../services/kycService";

const KYCRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkKYCStatus = async () => {
      try {
        const response = await kycService.getKYCStatus();
        if (response.success) {
          if (response.status === "verified" || response.status === "pending" || response.status === "under_review") {
            navigate("/kyc/status");
          } else {
            navigate("/kyc/submit");
          }
        } else {
          navigate("/kyc/submit");
        }
      } catch (error) {
        console.error("Error checking KYC status:", error);
        navigate("/kyc/submit");
      }
    };

    checkKYCStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
};

export default KYCRedirect;