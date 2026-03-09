// components/TransactionButton.jsx
import { usePermissions } from "../../hooks/usePermissions";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
const TransactionButton = ({ onClick, children }) => {
  const { canTransact, requiresKYC } = usePermissions();
  const navigate = useNavigate();

  if (!canTransact()) {
    return (
      <button
        onClick={() => navigate(requiresKYC() ? "/kyc" : "/login")}
        className="w-full py-3 bg-gray-400 cursor-not-allowed text-white rounded-lg"
      >
        {requiresKYC() ? "Complete KYC to Transact" : "Login Required"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
    >
      {children}
    </button>
  );
};