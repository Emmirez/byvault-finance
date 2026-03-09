import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import AccountLimit from "../models/AccountLimit.js";
import Beneficiary from "../models/Beneficiary.js";
import { createNotification } from "./notificationsController.js";
import { logActivity } from "./activityController.js";
import { createSystemAlert } from "./adminAlertController.js";

export const deposit = async (req, res) => {
  try {
    const { amount, description, currency } = req.body;
    const user = await User.findById(req.user.id);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let balanceBefore;
    let balanceAfter;

    if (currency === "fiat") {
      balanceBefore = user.balanceFiat;
      balanceAfter = balanceBefore + amount;
      user.balanceFiat = balanceAfter;
    } else if (currency === "btc") {
      balanceBefore = user.balanceBTC;
      balanceAfter = balanceBefore + amount;
      user.balanceBTC = balanceAfter;
    } else {
      return res.status(400).json({ message: "Invalid currency" });
    }

    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      type: "deposit",
      currency,
      amount,
      description,
      balanceBefore,
      balanceAfter,
      status: "completed",
    });

    //  ADD ADMIN ALERTS FOR DEPOSITS

    // 1. Alert for large deposits (> $5,000)
    if (amount > 5000) {
      await createSystemAlert("large_deposit", {
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        amount,
        transactionId: transaction._id,
        currency,
      });
    }

    // 2. Check for rapid deposits (multiple in short time)
    const recentDeposits = await Transaction.countDocuments({
      user: user._id,
      type: "deposit",
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
    });

    if (recentDeposits >= 3) {
      await createSystemAlert("rapid_deposits", {
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        count: recentDeposits,
        timeframe: "1 hour",
        totalAmount: amount,
        lastTransactionId: transaction._id,
      });
    }

    // 3. Check for first-time depositor
    const totalDeposits = await Transaction.countDocuments({
      user: user._id,
      type: "deposit",
    });

    if (totalDeposits === 1) {
      await createSystemAlert("first_deposit", {
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        amount,
        transactionId: transaction._id,
      });
    }

    // 4. Check if deposit amount is unusually high compared to average
    if (totalDeposits > 5) {
      const averageDeposit = await Transaction.aggregate([
        { $match: { user: user._id, type: "deposit" } },
        { $group: { _id: null, avgAmount: { $avg: "$amount" } } },
      ]);

      if (
        averageDeposit.length > 0 &&
        amount > averageDeposit[0].avgAmount * 3
      ) {
        await createSystemAlert("unusual_deposit_pattern", {
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          amount,
          averageAmount: averageDeposit[0].avgAmount,
          transactionId: transaction._id,
        });
      }
    }

    //  LOG ACTIVITY
    await logActivity({
      userId: user._id,
      type: "deposit",
      title: "Deposit Successful",
      description:
        description || `${currency.toUpperCase()} deposit of ${amount}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      amount: amount,
      currency: currency,
      metadata: {
        transactionId: transaction._id,
        balanceBefore,
        balanceAfter,
        description: description || "No description provided",
      },
    });

    res.json({
      success: true,
      transaction,
      balance: currency === "fiat" ? user.balanceFiat : user.balanceBTC,
    });
  } catch (err) {
    console.error("Deposit error:", err);

    // Log failed deposit attempt
    await logActivity({
      userId: req.user?.id,
      type: "deposit",
      title: "Deposit Failed",
      description: `Failed ${req.body.currency} deposit of ${req.body.amount}`,
      status: "failed",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      amount: req.body.amount,
      currency: req.body.currency,
      metadata: {
        error: err.message,
        description: req.body.description,
      },
    }).catch((e) => console.error("Failed to log activity:", e));

    //  ADD ADMIN ALERT FOR DEPOSIT FAILURE
    await createSystemAlert("deposit_failed", {
      userId: req.user?.id,
      userName: req.user
        ? `${req.user.firstName} ${req.user.lastName}`
        : "Unknown",
      userEmail: req.user?.email || "Unknown",
      amount: req.body.amount,
      currency: req.body.currency,
      error: err.message,
    });

    res.status(500).json({ message: "Server error" });
  }
};

// Withdraw money
export const withdraw = async (req, res) => {
  try {
    const { amount, description, currency } = req.body;
    const user = await User.findById(req.user.id);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    let balanceBefore;
    let balanceAfter;

    if (currency === "fiat") {
      balanceBefore = user.balanceFiat;
      if (amount > user.balanceFiat) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      balanceAfter = balanceBefore - amount;
      user.balanceFiat = balanceAfter;
    } else if (currency === "btc") {
      balanceBefore = user.balanceBTC;
      if (amount > user.balanceBTC) {
        return res.status(400).json({ message: "Insufficient BTC balance" });
      }
      balanceAfter = balanceBefore - amount;
      user.balanceBTC = balanceAfter;
    } else {
      return res.status(400).json({ message: "Invalid currency" });
    }

    // Check account limits
    const accountLimits = await AccountLimit.findOne({ user: user._id });
    if (accountLimits) {
      if (amount > accountLimits.remainingDaily) {
        return res.status(400).json({ message: "Daily limit exceeded" });
      }
      if (amount > accountLimits.remainingWeekly) {
        return res.status(400).json({ message: "Weekly limit exceeded" });
      }
      if (amount > accountLimits.remainingMonthly) {
        return res.status(400).json({ message: "Monthly limit exceeded" });
      }
      if (amount > accountLimits.singleTransactionLimit) {
        return res
          .status(400)
          .json({ message: "Single transaction limit exceeded" });
      }

      // Update remaining limits
      accountLimits.remainingDaily -= amount;
      accountLimits.remainingWeekly -= amount;
      accountLimits.remainingMonthly -= amount;
      await accountLimits.save();
    }

    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      type: "withdraw",
      currency,
      amount,
      status: "completed",
      description,
      balanceBefore,
      balanceAfter,
    });

    res.status(200).json({
      success: true,
      transaction,
      balance: currency === "fiat" ? user.balanceFiat : user.balanceBTC,
    });
  } catch (error) {
    console.error("Withdraw error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const transfer = async (req, res) => {
  try {
    const {
      amount,
      description,
      currency = "fiat",
      pin,
      recipientAccountId,
      transferType = "local", 
    } = req.body;
    const sender = await User.findById(req.user.id);

    console.log("Transfer request:", {
      amount,
      recipientAccountId,
      pin,
      transferType,
      userId: req.user.id,
    });

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid transfer amount" });
    }

    if (!pin || pin.length < 4) {
      return res.status(400).json({ message: "Transaction PIN is required" });
    }

    // Compare the provided PIN with the stored PIN
    if (sender.transactionPin !== pin) {
      //  LOG ACTIVITY  (Invalid PIN)
      await logActivity({
        userId: sender._id,
        type: "transfer",
        title: "Transfer Failed - Invalid PIN",
        description: `Transfer of $${amount} failed: Invalid PIN`,
        status: "failed",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        amount: amount,
        currency: currency,
        metadata: {
          recipientAccountId,
          description,
          reason: "Invalid PIN",
        },
      }).catch((e) => console.error("Failed to log activity:", e));

      // ADD ADMIN ALERT: Failed transfer attempt
      await createSystemAlert("failed_transfer", {
        userId: sender._id,
        userName: `${sender.firstName} ${sender.lastName}`,
        userEmail: sender.email,
        amount,
        recipientAccountId,
        reason: "Invalid PIN",
      });

      return res.status(400).json({ message: "Invalid transaction PIN" });
    }

    // Check sender balance
    if (currency === "fiat") {
      if (amount > sender.balanceFiat) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
    } else if (currency === "btc") {
      if (amount > sender.balanceBTC) {
        return res.status(400).json({ message: "Insufficient BTC balance" });
      }
    } else {
      return res.status(400).json({ message: "Invalid currency" });
    }

    // Check account limits
    const accountLimits = await AccountLimit.findOne({ user: sender._id });
    if (accountLimits) {
      if (amount > accountLimits.remainingDaily) {
        //  LOG ACTIVITY  (Daily limit exceeded)
        await logActivity({
          userId: sender._id,
          type: "transfer",
          title: "Transfer Failed - Daily Limit Exceeded",
          description: `Transfer of $${amount} failed: Daily limit exceeded`,
          status: "failed",
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          amount: amount,
          currency: currency,
          metadata: {
            recipientAccountId,
            dailyLimit: accountLimits.dailyLimit,
            remainingDaily: accountLimits.remainingDaily,
          },
        }).catch((e) => console.error("Failed to log activity:", e));

        //  ADD ADMIN ALERT: Limit exceeded
        await createSystemAlert("limit_exceeded", {
          userId: sender._id,
          userName: `${sender.firstName} ${sender.lastName}`,
          userEmail: sender.email,
          amount,
          limitType: "daily",
          limitValue: accountLimits.dailyLimit,
          remaining: accountLimits.remainingDaily,
        });

        return res.status(400).json({ message: "Daily limit exceeded" });
      }
      if (amount > accountLimits.remainingWeekly) {
        //  LOG ACTIVITY  (Weekly limit exceeded)
        await logActivity({
          userId: sender._id,
          type: "transfer",
          title: "Transfer Failed - Weekly Limit Exceeded",
          description: `Transfer of $${amount} failed: Weekly limit exceeded`,
          status: "failed",
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          amount: amount,
          currency: currency,
          metadata: {
            recipientAccountId,
            weeklyLimit: accountLimits.weeklyLimit,
            remainingWeekly: accountLimits.remainingWeekly,
          },
        }).catch((e) => console.error("Failed to log activity:", e));

        //  ADD ADMIN ALERT: Limit exceeded
        await createSystemAlert("limit_exceeded", {
          userId: sender._id,
          userName: `${sender.firstName} ${sender.lastName}`,
          userEmail: sender.email,
          amount,
          limitType: "weekly",
          limitValue: accountLimits.weeklyLimit,
          remaining: accountLimits.remainingWeekly,
        });

        return res.status(400).json({ message: "Weekly limit exceeded" });
      }
      if (amount > accountLimits.remainingMonthly) {
        //  LOG ACTIVITY  (Monthly limit exceeded)
        await logActivity({
          userId: sender._id,
          type: "transfer",
          title: "Transfer Failed - Monthly Limit Exceeded",
          description: `Transfer of $${amount} failed: Monthly limit exceeded`,
          status: "failed",
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          amount: amount,
          currency: currency,
          metadata: {
            recipientAccountId,
            monthlyLimit: accountLimits.monthlyLimit,
            remainingMonthly: accountLimits.remainingMonthly,
          },
        }).catch((e) => console.error("Failed to log activity:", e));

        //  ADD ADMIN ALERT: Limit exceeded
        await createSystemAlert("limit_exceeded", {
          userId: sender._id,
          userName: `${sender.firstName} ${sender.lastName}`,
          userEmail: sender.email,
          amount,
          limitType: "monthly",
          limitValue: accountLimits.monthlyLimit,
          remaining: accountLimits.remainingMonthly,
        });

        return res.status(400).json({ message: "Monthly limit exceeded" });
      }
      if (amount > accountLimits.singleTransactionLimit) {
        //  LOG ACTIVITY(Single transaction limit exceeded)
        await logActivity({
          userId: sender._id,
          type: "transfer",
          title: "Transfer Failed - Single Transaction Limit Exceeded",
          description: `Transfer of $${amount} failed: Single transaction limit exceeded`,
          status: "failed",
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          amount: amount,
          currency: currency,
          metadata: {
            recipientAccountId,
            singleTransactionLimit: accountLimits.singleTransactionLimit,
          },
        }).catch((e) => console.error("Failed to log activity:", e));

        //  ADD ADMIN ALERT: Single limit exceeded
        await createSystemAlert("single_limit_exceeded", {
          userId: sender._id,
          userName: `${sender.firstName} ${sender.lastName}`,
          userEmail: sender.email,
          amount,
          limitValue: accountLimits.singleTransactionLimit,
        });

        return res
          .status(400)
          .json({ message: "Single transaction limit exceeded" });
      }

      // Update remaining limits
      accountLimits.remainingDaily -= amount;
      accountLimits.remainingWeekly -= amount;
      accountLimits.remainingMonthly -= amount;
      await accountLimits.save();
    }

    // Deduct from sender
    const senderBalanceBefore =
      currency === "fiat" ? sender.balanceFiat : sender.balanceBTC;
    const senderBalanceAfter = senderBalanceBefore - amount;

    if (currency === "fiat") {
      sender.balanceFiat = senderBalanceAfter;
    } else {
      sender.balanceBTC = senderBalanceAfter;
    }
    await sender.save();

    // Create sender transaction record with status "pending"
    const senderTransaction = await Transaction.create({
      user: sender._id,
      type: "transfer",
      currency,
      amount,
      status: "pending",
      description:
        description ||
        `Transfer to ${recipientAccountId || "external account"}`,
      balanceBefore: senderBalanceBefore,
      balanceAfter: senderBalanceAfter,
      metadata: {
        recipientAccount: recipientAccountId || "external",
        transferType,
      },
    });

    await senderTransaction.save();

    // LOG ACTIVITY  (Successful transfer initiated)
    await logActivity({
      userId: sender._id,
      type: "transfer",
      title: "Transfer Initiated",
      description:
        description ||
        `Transfer of $${amount} to ${recipientAccountId || "external account"} initiated`,
      status: "pending",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      amount: amount,
      currency: currency,
      metadata: {
        transactionId: senderTransaction._id,
        recipientAccountId,
        balanceBefore: senderBalanceBefore,
        balanceAfter: senderBalanceAfter,
        description: description || "No description provided",
      },
    });

    // 1. Alert for large transfers (> $5,000)
    if (amount > 5000) {
      await createSystemAlert("large_transfer", {
        userId: sender._id,
        userName: `${sender.firstName} ${sender.lastName}`,
        userEmail: sender.email,
        amount,
        transactionId: senderTransaction._id,
        recipientAccountId,
      });
    }

    const previousTransfersToThisRecipient = await Transaction.countDocuments({
      user: sender._id,
      type: "transfer",
      "metadata.recipientAccount": recipientAccountId,
    });

    if (previousTransfersToThisRecipient === 0 && recipientAccountId) {
      await createSystemAlert("new_recipient_transfer", {
        userId: sender._id,
        userName: `${sender.firstName} ${sender.lastName}`,
        userEmail: sender.email,
        amount,
        transactionId: senderTransaction._id,
        recipientAccountId,
      });
    }

    // 3. Alert for rapid transfers (multiple in short time)
    const recentTransfers = await Transaction.countDocuments({
      user: sender._id,
      type: "transfer",
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
    });

    if (recentTransfers >= 5) {
      await createSystemAlert("rapid_transfers", {
        userId: sender._id,
        userName: `${sender.firstName} ${sender.lastName}`,
        userEmail: sender.email,
        count: recentTransfers,
        timeframe: "1 hour",
        lastAmount: amount,
      });
    }

    // 1. Notification for sender - transfer initiated
    await createNotification({
      userId: sender._id,
      type: "transfer_sent",
      title: `${transferType === 'international' ? 'International' : 'Local'} Transfer Initiated`,
      message: `Your transfer of $${amount} has been initiated and is pending verification.`,
      priority: "medium",
      data: {
        transactionId: senderTransaction._id,
        amount,
        recipientAccountId,
        transferType,
        isInternational: transferType === 'international',
      },
      actionUrl: `/transaction/${senderTransaction._id}`,
      actionText: "View Transaction",
    });

    // 2. Check if recipient is an internal user (you would need to lookup by accountId)
    // This is optional - if you want to notify recipient
    if (recipientAccountId) {
      const recipient = await User.findOne({ accountId: recipientAccountId });
      if (recipient) {
        //  LOG ACTIVITY  (Recipient notified)
        await logActivity({
          userId: recipient._id,
          type: "transfer_received",
          title: "Incoming Transfer Pending",
          description: `Pending transfer of $${amount} from ${sender.firstName} ${sender.lastName}`,
          status: "pending",
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          amount: amount,
          currency: currency,
          metadata: {
            senderId: sender._id,
            senderName: `${sender.firstName} ${sender.lastName}`,
            transactionId: senderTransaction._id,
          },
        }).catch((e) => console.error("Failed to log recipient activity:", e));

        // Notification for recipient - money pending
        await createNotification({
          userId: recipient._id,
          type: "transfer_received",
          title: `${transferType === 'international' ? 'International' : 'Local'}  Incoming Transfer`,
          message: `You have a pending transfer of $${amount} from ${sender.firstName} ${sender.lastName}.`,
          priority: "medium",
          data: {
            amount,
            senderId: sender._id,
            senderName: `${sender.firstName} ${sender.lastName}`,
            transferType,
            isInternational: transferType === 'international',
          },
          actionUrl: "/transaction",
          actionText: "View Details",
        });
      }
    }

    // 3. Check if amount is large (over $10,000) - send security alert
    if (amount > 10000) {
      await createNotification({
        userId: sender._id,
        type: "large_transaction",
        title: "Large Transfer Alert",
        message: `A large transfer of $${amount} was initiated from your account. If this wasn't you, contact support immediately.`,
        priority: "high",
        data: {
          transactionId: senderTransaction._id,
          amount,
        },
        actionUrl: "/support/submit-ticket",
        actionText: "Contact Support",
      });
    }

    // 4. Check if user is approaching daily limit
    if (accountLimits && accountLimits.remainingDaily < 1000) {
      await createNotification({
        userId: sender._id,
        type: "limit_approaching",
        title: "Daily Limit Approaching",
        message: `You're approaching your daily transfer limit. Remaining: $${accountLimits.remainingDaily}`,
        priority: "low",
        data: {
          remainingDaily: accountLimits.remainingDaily,
          dailyLimit: accountLimits.dailyLimit,
        },
        actionUrl: "/settings/limits",
        actionText: "View Limits",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transfer initiated and pending verification",
      transactionId: senderTransaction._id,
      senderBalance:
        currency === "fiat" ? sender.balanceFiat : sender.balanceBTC,
      status: "pending",
    });
  } catch (error) {
    console.error("Transfer error:", error);
    console.error("Error details:", error.message);

    // LOG ACTIVITY  (System error)
    await logActivity({
      userId: req.user?.id,
      type: "transfer",
      title: "Transfer Failed - System Error",
      description: `Transfer failed: ${error.message}`,
      status: "failed",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      amount: req.body.amount,
      currency: req.body.currency,
      metadata: {
        recipientAccountId: req.body.recipientAccountId,
        error: error.message,
      },
    }).catch((e) => console.error("Failed to log activity:", e));

    //  ADD ADMIN ALERT: System error
    await createSystemAlert("transfer_error", {
      error: error.message,
      userId: req.user?.id,
      amount: req.body.amount,
      recipientAccountId: req.body.recipientAccountId,
    });

    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all transactions for a user
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const swapCurrency = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount, estimatedRate } = req.body;
    const userId = req.user.id;

    console.log("💰 Processing swap:", {
      userId,
      fromCurrency,
      toCurrency,
      amount,
    });

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check balance
    if (fromCurrency === "USD" && user.balanceFiat < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient USD balance",
      });
    }
    if (fromCurrency === "BTC" && user.balanceBTC < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient BTC balance",
      });
    }

    // Store balances BEFORE swap
    const balanceBefore = {
      USD: user.balanceFiat,
      BTC: user.balanceBTC,
    };

    // Calculate conversion
    let convertedAmount;
    let rate;

    if (fromCurrency === "USD" && toCurrency === "BTC") {
      rate = 1 / estimatedRate;
      convertedAmount = amount * rate;
    } else if (fromCurrency === "BTC" && toCurrency === "USD") {
      rate = estimatedRate;
      convertedAmount = amount * rate;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid currency pair",
      });
    }

    // Update balances
    if (fromCurrency === "USD") {
      user.balanceFiat -= amount;
      user.balanceBTC = (user.balanceBTC || 0) + convertedAmount;
    } else {
      user.balanceBTC -= amount;
      user.balanceFiat = (user.balanceFiat || 0) + convertedAmount;
    }

    await user.save();

    // Store balances AFTER swap
    const balanceAfter = {
      USD: user.balanceFiat,
      BTC: user.balanceBTC,
    };

    const transactionCurrency = fromCurrency === "USD" ? "fiat" : "btc";

    const transaction = new Transaction({
      user: userId,
      type: "transfer",
      amount: amount,
      currency: transactionCurrency,
      balanceBefore:
        fromCurrency === "USD" ? balanceBefore.USD : balanceBefore.BTC,
      balanceAfter:
        fromCurrency === "USD" ? balanceAfter.USD : balanceAfter.BTC,
      description: `Swapped ${amount} ${fromCurrency} to ${convertedAmount.toFixed(8)} ${toCurrency}`,
      status: "completed",
      metadata: {
        fromCurrency,
        toCurrency,
        convertedAmount,
        rate: estimatedRate,
        swapType: `${fromCurrency} to ${toCurrency}`,
      },
    });

    await transaction.save();
    console.log("✅ Transaction saved:", transaction._id);

    const debitTransaction = new Transaction({
      user: userId,
      type: "transfer",
      amount: amount,
      currency: fromCurrency === "USD" ? "fiat" : "btc",
      balanceBefore:
        fromCurrency === "USD" ? balanceBefore.USD : balanceBefore.BTC,
      balanceAfter:
        fromCurrency === "USD" ? balanceAfter.USD : balanceAfter.BTC,
      description: `Swapped ${amount} ${fromCurrency} to ${toCurrency}`,
      status: "completed",
      metadata: {
        action: "debit",
        fromCurrency,
        toCurrency,
        convertedAmount,
        rate: estimatedRate,
      },
    });

    const creditTransaction = new Transaction({
      user: userId,
      type: "transfer",
      amount: convertedAmount,
      currency: toCurrency === "USD" ? "fiat" : "btc",
      balanceBefore:
        toCurrency === "USD" ? balanceBefore.USD : balanceBefore.BTC,
      balanceAfter: toCurrency === "USD" ? balanceAfter.USD : balanceAfter.BTC,
      description: `Received ${convertedAmount.toFixed(8)} ${toCurrency} from swap`,
      status: "completed",
      metadata: {
        action: "credit",
        fromCurrency,
        toCurrency,
        originalAmount: amount,
        rate: estimatedRate,
      },
    });

    await Promise.all([debitTransaction.save(), creditTransaction.save()]);
    console.log("✅ Both transactions saved");

    res.json({
      success: true,
      message: "Swap completed successfully",
      data: {
        fromCurrency,
        toCurrency,
        amount,
        convertedAmount,
        rate: estimatedRate,
        newBalances: {
          USD: user.balanceFiat,
          BTC: user.balanceBTC,
        },
        transactionIds: [debitTransaction._id, creditTransaction._id],
      },
    });
  } catch (error) {
    console.error("❌ Swap error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during swap: " + error.message,
    });
  }
};
