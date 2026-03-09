// services/transferService.js
import api from "./apiService";

const isHandledError = (error) =>
  [400, 401, 403, 404, 422, 429].includes(error.status);

export const transferService = {
  // Local transfer
  async localTransfer(transferData) {
    try {
      const response = await api.post("/transactions/transfer", {
        recipientAccountId: transferData.accountNumber, // This is the key field!
        amount: parseFloat(transferData.amount),
        description:
          transferData.description || `Transfer to ${transferData.accountName}`,
        currency: transferData.currency || "fiat",
        pin: transferData.pin,
        transferType: "local",
        metadata: {
          accountName: transferData.accountName,
          bankName: transferData.bankName,
          transferType: "local",
        },
      });

      return response;
    } catch (error) {
      if (!isHandledError(error))
        console.error("Error making local transfer:", error);
      throw error;
    }
  },

  getTransactionById: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response;
    } catch (error) {
      if (!isHandledError(error))
        console.error("Error fetching transaction:", error);
      throw error;
    }
  },

  //international transfer
  async internationalTransfer(transferData) {
    try {
      const response = await api.post("/transactions/transfer", {
        recipientAccountId:
          transferData.iban || transferData.accountNumber || "INTERNATIONAL",
        amount: parseFloat(transferData.amount),
        description:
          transferData.description ||
          `International transfer to ${transferData.beneficiaryName}`,
        currency: transferData.currency || "fiat",
        pin: transferData.pin,
        transferType: "international",
        metadata: {
          beneficiaryName: transferData.beneficiaryName,
          bankName: transferData.bankName,
          swiftCode: transferData.swiftCode,
          country: transferData.country,
          transferType: "international",
        },
      });

      return response;
    } catch (error) {
      if (!isHandledError(error))
        console.error("Error making international transfer:", error);
      throw error;
    }
  },

  //  Currency Swap function
  async swapCurrency(swapData) {
    try {
      const response = await api.post("/transactions/swap", {
        fromCurrency: swapData.fromCurrency,
        toCurrency: swapData.toCurrency,
        amount: swapData.amount,
        estimatedRate: swapData.estimatedRate,
      });

      return response;
    } catch (error) {
      if (!isHandledError(error))
        console.error(" Error swapping currency:", error);
      throw error;
    }
  },

  // Get transfer history
  async getTransferHistory() {
    try {
      const response = await api.get("/transactions");
      return response;
    } catch (error) {
      if (!isHandledError(error))
        console.error("Error fetching transfer history:", error);
      throw error;
    }
  },
};
