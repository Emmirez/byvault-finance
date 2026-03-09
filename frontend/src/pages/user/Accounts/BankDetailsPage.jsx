// src/pages/user/Accounts/BankDetailsPage.jsx
import React, { useState } from "react";
import BankAccountDetailsModal from "./BankDetails"; // rename modal as component

const BankDetailsPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <BankAccountDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default BankDetailsPage;
