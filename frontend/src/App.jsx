// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/route/ProtectedRoute";
import PublicRoute from "./components/route/PublicRoute";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import Checking from "./pages/Checking";
import Savings from "./pages/Savings";
import CreditCards from "./pages/CreditCards";
import Loans from "./pages/Loans";
import Business from "./pages/Business";
import Education from "./pages/Education";
import WealthManagement from "./pages/WealthManagement";
import PrivacySecurity from "./pages/PrivacySecurity";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Help from "./pages/Help.jsx";
import ScrollToTop from "./hooks/useScrollToTop.js";
import ContactSupport from "./pages/contactSupport.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword.jsx";
import NotFound from "./pages/ErrorPage.jsx";
import Dashboard from "./pages/user/Dashboard/Dashboard.jsx";
import AdminDashboard from "./pages/admin/Dashboard/Dashboard.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Deposit from "./pages/user/Deposit/Deposit";
import Transfer from "./pages/user/Transfers/Transfers";
import LocalTransfer from "./pages/user/Transfers/LocalTransfer";
import InternationalTransfer from "./pages/user/Transfers/InternationalTransfer";
import ReceiveBitcoin from "./pages/user/Receive/ReceiveBitcoin";
import MoreMenu from "./pages/user/More/MoreMenu";
import PayPalTransfer from "./pages/user/Transfers/PayPalTransfer";
import CryptoTransfer from "./pages/user/Transfers/CryptoTransfer";
import CashAppTransfer from "./pages/user/Transfers/CashAppTransfer";
import WiseTransfer from "./pages/user/Transfers/WiseTransfer";
import ZelleTransfer from "./pages/user/Transfers/ZelleTransfer";
import VenmoTransfer from "./pages/user/Transfers/VenmoTransfer";
import AlipayTransfer from "./pages/user/Transfers/AlipayTransfer";
import RevolutTransfer from "./pages/user/Transfers/RevolutTransfer";
import WireTransfer from "./pages/user/Transfers/WireTransfer";
import Transactions from "./pages/user/Transactions/Transactions.jsx";
import VirtualCards from "./pages/user/Cards/Cards.jsx";
import ApplyVirtualCard from "./pages/user/Cards/ApplyVirtualCard.jsx";
import CurrencySwap from "./pages/user/Transfers/CurrencySwap.jsx";
import LoanServices from "./pages/user/Loans/Loanservices.jsx";
import ApplyLoan from "./pages/user/Loans/ApplyLoan.jsx";
import IrsTaxRefund from "./pages/user/Loans/IrsTaxRefund.jsx";
import GrantApplications from "./pages/user/Loans/GrantsApplications.jsx";
import IndividualGrantApplication from "./pages/user/Loans/Individual.jsx";
import CompanyGrantApplication from "./pages/user/Loans/CompanyGrant.jsx";
import PayBills from "./pages/user/Transactions/PayBills.jsx";
import ElectricityBill from "./pages/user/Transactions/ElectricityBill.jsx";
import InternetBill from "./pages/user/Transactions/InternetBill.jsx";
import WaterBill from "./pages/user/Transactions/WaterBill.jsx";
import PhoneBill from "./pages/user/Transactions/PhoneBill.jsx";
import TvBill from "./pages/user/Transactions/TvBill.jsx";
import AccountSettings from "./pages/user/Settings/Settings.jsx";
import TransactionPin from "./pages/user/Settings/TransactionPin.jsx";
import PasswordSettings from "./pages/user/Settings/PasswordSettings.jsx";
import TwoFactorAuth from "./pages/user/Settings/TwoFactorAuth.jsx";
import ProfileInformation from "./pages/user/Settings/ProfileInformation.jsx";
import SupportCenter from "./pages/support/SupportCenter.jsx";
import SubmitTicket from "./pages/support/SubmitTicket.jsx";
import FinancialInsights from "./pages/user/Accounts/FinancialInsights.jsx";
import FinancialServices from "./pages/user/Accounts/FinancialServices.jsx";
import BankTransferPayment from "./pages/user/Deposit/Bank-transfer.jsx";
import CreditCardPayment from "./pages/user/Deposit/Credit-card.jsx";
import BitcoinPayment from "./pages/user/Deposit/Bitcoin.jsx";
import USDTPayment from "./pages/user/Deposit/Usdt.jsx";
import PayPalPayment from "./pages/user/Deposit/Paypal.jsx";
import DepositSuccess from "./pages/user/Deposit/Success.jsx";
import TransferHold from "./pages/user/Transfers/TransferHold.jsx";
import BankDetailsPage from "./pages/user/Accounts/BankDetailsPage.jsx";
import CardDetails from "./pages/user/Cards/CardDetails.jsx";
import TaxRefundStatus from "./pages/user/Loans/TaxRefundStatus.jsx";
import GrantStatus from "./pages/user/Loans/GrantStatus.jsx";
import SupportTickets from "./pages/support/SupportTickets.jsx";
import TicketDetails from "./pages/support/TicketDetails.jsx";
import Notifications from "./pages/user/Components/Notifcations.jsx";
import TransactionDetails from "./pages/user/Transfers/TransactionDetails.jsx";
import KYCRedirect from "./pages/user/Components/KYCRedirect.jsx";
import KYCSubmission from "./pages/user/Components/KYCSubmission.jsx";
import KYCStatus from "./pages/user/Components/KYCStatus.jsx";
import ChatDashboard from "./components/chatbot/ChatDashboard.jsx";
import Users from "./pages/admin/Users/Users.jsx";
import UserDetails from "./pages/admin/Users/UserDetails.jsx";
import UserTransactions from "./pages/admin/Transactions/UserTransactions.jsx";
import KYCManagement from "./pages/admin/KYC/KYCManagement.jsx";
import KYCReview from "./pages/admin/KYC/KYCReview.jsx";
import Analytics from "./pages/admin/analytics/Analytics.jsx";
import Transaction from "./pages/admin/Transactions/Transactions.jsx";
import Cards from "./pages/admin/Card/Cards.jsx";
import LoanUsers from "./pages/admin/Loans/Loans.jsx";
import Documents from "./pages/admin/Document/Document.jsx";
import Support from "./pages/admin/support/Support.jsx";
import Announcements from "./pages/admin/Announcements/announcements.jsx";
import Settings from "./pages/admin/settings/Settings.jsx";
import Security from "./pages/admin/Security/Security.jsx";
import TaxRefund from "./pages/admin/TaxRefund/TaxRefund.jsx";
import Grants from "./pages/admin/Grants/Grants.jsx";
import Promote from "./pages/admin/Components/Promote.jsx";
import Profile from "./pages/admin/Profile/Profile.jsx";
import AdminAlertsPage from "./pages/admin/Notification/AdminAlertsPage.jsx";
import ResetPassword from "./pages/auth/ResetPassword/ResetPassword.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import AdminTicketDetails from "./pages/admin/Notification/AdminTicketDetails.jsx";
import SystemLogs from "./pages/admin/System/SystemLogs.jsx";
import PaymentSettingsPage from "./pages/admin/settings/PaymentSettings.jsx";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <LanguageProvider>
              <ScrollToTop behavior="smooth" />
              <Routes>
                {/* Public Routes - No authentication needed */}
                <Route path="/" element={<Landing />} />
                <Route path="/checking" element={<Checking />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/credit-cards" element={<CreditCards />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="/business" element={<Business />} />
                <Route path="/education" element={<Education />} />
                <Route
                  path="/wealth-management"
                  element={<WealthManagement />}
                />
                <Route path="/privacy-security" element={<PrivacySecurity />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/help" element={<Help />} />
                <Route path="/contact-support" element={<ContactSupport />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route path="/unauthorized" element={<Unauthorized />} />
                {/* Auth Routes - Redirect if already logged in */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                {/* Protected User Routes - Require authentication */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes - Require admin role */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                {/* Add more admin-protected routes here */}
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Users />
                    </ProtectedRoute>
                  }
                />
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />

                {/*Transfer*/}
                <Route
                  path="/deposit"
                  element={
                    <ProtectedRoute>
                      <Deposit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer"
                  element={
                    <ProtectedRoute>
                      <Transfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/local"
                  element={
                    <ProtectedRoute>
                      <LocalTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/international"
                  element={
                    <ProtectedRoute>
                      <InternationalTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/receive"
                  element={
                    <ProtectedRoute>
                      <ReceiveBitcoin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/more"
                  element={
                    <ProtectedRoute>
                      <MoreMenu />
                    </ProtectedRoute>
                  }
                />

                {/*more transfer*/}
                <Route
                  path="/transfer/international/paypal"
                  element={
                    <ProtectedRoute>
                      <PayPalTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/international/crypto"
                  element={
                    <ProtectedRoute>
                      <CryptoTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/international/cashapp"
                  element={
                    <ProtectedRoute>
                      <CashAppTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/international/wise"
                  element={
                    <ProtectedRoute>
                      <WiseTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/international/zelle"
                  element={
                    <ProtectedRoute>
                      <ZelleTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/international/venmo"
                  element={
                    <ProtectedRoute>
                      <VenmoTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/international/alipay"
                  element={
                    <ProtectedRoute>
                      <AlipayTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/international/revolut"
                  element={
                    <ProtectedRoute>
                      <RevolutTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/international/wire"
                  element={
                    <ProtectedRoute>
                      <WireTransfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cards"
                  element={
                    <ProtectedRoute>
                      <VirtualCards />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apply-virtual-card"
                  element={
                    <ProtectedRoute>
                      <ApplyVirtualCard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/currency-swap"
                  element={
                    <ProtectedRoute>
                      <CurrencySwap />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/loan-services"
                  element={
                    <ProtectedRoute>
                      <LoanServices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apply-loan"
                  element={
                    <ProtectedRoute>
                      <ApplyLoan />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tax-refund"
                  element={
                    <ProtectedRoute>
                      <IrsTaxRefund />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/grants"
                  element={
                    <ProtectedRoute>
                      <GrantApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/grant-application-individual"
                  element={
                    <ProtectedRoute>
                      <IndividualGrantApplication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/grant-application-company"
                  element={
                    <ProtectedRoute>
                      <CompanyGrantApplication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bank-details"
                  element={
                    <ProtectedRoute>
                      <BankDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pay-bills"
                  element={
                    <ProtectedRoute>
                      <PayBills />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/paybills/electricity"
                  element={
                    <ProtectedRoute>
                      <ElectricityBill />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/paybills/internet"
                  element={
                    <ProtectedRoute>
                      <InternetBill />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/paybills/water"
                  element={
                    <ProtectedRoute>
                      <WaterBill />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/paybills/phone"
                  element={
                    <ProtectedRoute>
                      <PhoneBill />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/paybills/tv"
                  element={
                    <ProtectedRoute>
                      <TvBill />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <AccountSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/transaction-pin"
                  element={
                    <ProtectedRoute>
                      <TransactionPin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/password"
                  element={
                    <ProtectedRoute>
                      <PasswordSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/two-factor"
                  element={
                    <ProtectedRoute>
                      <TwoFactorAuth />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileInformation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support"
                  element={
                    <ProtectedRoute>
                      <SupportCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support/submit-ticket"
                  element={
                    <ProtectedRoute>
                      <SubmitTicket />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/insights"
                  element={
                    <ProtectedRoute>
                      <FinancialInsights />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/deposit/bank-transfer"
                  element={
                    <ProtectedRoute>
                      <BankTransferPayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/deposit/credit-card"
                  element={
                    <ProtectedRoute>
                      <CreditCardPayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/deposit/bitcoin"
                  element={
                    <ProtectedRoute>
                      <BitcoinPayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/promote"
                  element={
                    <ProtectedRoute>
                      <Promote />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/deposit/usdt"
                  element={
                    <ProtectedRoute>
                      <USDTPayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/deposit/paypal"
                  element={
                    <ProtectedRoute>
                      <PayPalPayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/deposit/success"
                  element={
                    <ProtectedRoute>
                      <DepositSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transfer/hold"
                  element={
                    <ProtectedRoute>
                      <TransferHold />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cards/:id"
                  element={
                    <ProtectedRoute>
                      <CardDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/services"
                  element={
                    <ProtectedRoute>
                      <FinancialServices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tax-refund-status"
                  element={
                    <ProtectedRoute>
                      <TaxRefundStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/grant-status"
                  element={
                    <ProtectedRoute>
                      <GrantStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support/tickets"
                  element={
                    <ProtectedRoute>
                      <SupportTickets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support/tickets/:id"
                  element={
                    <ProtectedRoute>
                      <TicketDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transaction/:id"
                  element={
                    <ProtectedRoute>
                      <TransactionDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/kyc"
                  element={
                    <ProtectedRoute>
                      <KYCRedirect />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/kyc/submit"
                  element={
                    <ProtectedRoute>
                      <KYCSubmission />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/kyc/status"
                  element={
                    <ProtectedRoute>
                      <KYCStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/chat"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ChatDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/:id"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <UserDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/:id/transactions"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <UserTransactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/kyc/:id/"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <KYCReview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/kyc"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <KYCManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/transactions"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Transaction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/cards"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Cards />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/loans"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <LoanUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/documents"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Documents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/support"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Support />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/messages"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Announcements />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/security"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Security />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tax-refund"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <TaxRefund />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/grants"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Grants />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/alerts"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminAlertsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reset-password/:token"
                  element={
                    <ProtectedRoute>
                      <ResetPassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/support/:id"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminTicketDetails />
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/admin/system/logs"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <SystemLogs />
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/admin/payment-settings"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <PaymentSettingsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </LanguageProvider>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
