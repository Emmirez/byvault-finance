// pages/TermsConditions.jsx
import React, { useState, useEffect } from "react";
import { useLanguageContext } from "../contexts/LanguageContext.jsx";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import { FileText, Shield, AlertCircle, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const TermsConditions = () => {
  const { t } = useLanguageContext();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Custom header configuration
  const handleMenuToggle = (isOpen) => {
    console.log("Menu is now:", isOpen ? "open" : "closed");
  };

  const handleSignInClick = () => {
    console.log("Sign In clicked");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation/header */}
      <Header
        showSignIn={true}
        showDarkModeToggle={true}
        showLanguageSwitcher={true}
        customClassName="shadow-sm"
        onMenuToggle={handleMenuToggle}
        onSignInClick={handleSignInClick}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("pages.terms.title") || "Terms & Conditions"}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"
            alt={t("pages.terms.imageAlt") || "Terms and Conditions"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-900/80"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
            {t("pages.terms.title") || "Terms & Conditions"}
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md max-w-2xl mx-auto">
            {t("pages.terms.subtitle") ||
              "Please read these terms carefully before using our services"}
          </p>
        </div>
      </section>

      {/* Last Updated Notice */}
      <section className="py-8 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-900 dark:text-blue-300">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">
              {t("pages.terms.lastUpdated") || "Last Updated:"} January 30, 2026
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section1.title") ||
                  "1. Introduction and Acceptance"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {t("pages.terms.section1.content1") ||
                    "Welcome to ByVault Finance. These Terms and Conditions ('Terms') constitute a legally binding agreement between you ('Customer,' 'you,' or 'your') and ByVault Finance ('Bank,' 'we,' 'us,' or 'our') governing your access to and use of our banking services, digital platforms, and financial products."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("pages.terms.section1.content2") ||
                    "By opening an account, accessing our online banking platform, mobile application, or utilizing any of our financial services, you acknowledge that you have read, understood, and agree to be bound by these Terms, along with our Privacy Policy and any additional agreements applicable to specific products or services."}
                </p>
              </div>
            </div>

            {/* Account Opening */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section2.title") ||
                  "2. Account Opening and Eligibility"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section2.subsection1.title") ||
                      "2.1 Eligibility Requirements:"}
                  </strong>{" "}
                  {t("pages.terms.section2.subsection1.content") ||
                    "To open an account with ByVault Finance, you must:"}
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>
                    {t("pages.terms.section2.subsection1.list1") ||
                      "Be at least 18 years of age or the age of majority in your jurisdiction"}
                  </li>
                  <li>
                    {t("pages.terms.section2.subsection1.list2") ||
                      "Possess legal capacity to enter into binding contracts"}
                  </li>
                  <li>
                    {t("pages.terms.section2.subsection1.list3") ||
                      "Provide valid government-issued identification"}
                  </li>
                  <li>
                    {t("pages.terms.section2.subsection1.list4") ||
                      "Provide a verifiable residential address"}
                  </li>
                  <li>
                    {t("pages.terms.section2.subsection1.list5") ||
                      "Have a valid Social Security Number or Tax Identification Number"}
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section2.subsection2.title") ||
                      "2.2 Account Verification:"}
                  </strong>{" "}
                  {t("pages.terms.section2.subsection2.content") ||
                    "We reserve the right to verify your identity and may request additional documentation at any time. This may include proof of address, employment verification, source of funds documentation, and other information required under applicable laws including the USA PATRIOT Act and Bank Secrecy Act."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section2.subsection3.title") ||
                      "2.3 Account Approval:"}
                  </strong>{" "}
                  {t("pages.terms.section2.subsection3.content") ||
                    "ByVault Finance reserves the right to refuse account opening for any reason permitted by law, including but not limited to inability to verify identity, concerns about fraudulent activity, or failure to meet our account opening criteria."}
                </p>
              </div>
            </div>

            {/* Account Usage */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section3.title") ||
                  "3. Account Usage and Responsibilities"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section3.subsection1.title") ||
                      "3.1 Account Security:"}
                  </strong>{" "}
                  {t("pages.terms.section3.subsection1.content") ||
                    "You are responsible for maintaining the confidentiality of your account credentials, including usernames, passwords, PINs, security questions, and any other authentication methods. You must immediately notify us of any unauthorized access or suspected security breach."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section3.subsection2.title") ||
                      "3.2 Authorized Transactions:"}
                  </strong>{" "}
                  {t("pages.terms.section3.subsection2.content") ||
                    "You authorize us to honor all transactions initiated using your account credentials, whether by you or by third parties with your permission. You remain liable for all authorized and unauthorized transactions until you notify us of a security compromise."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section3.subsection3.title") ||
                      "3.3 Prohibited Activities:"}
                  </strong>{" "}
                  {t("pages.terms.section3.subsection3.content") ||
                    "You agree not to use your account for:"}
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>
                    {t("pages.terms.section3.subsection3.list1") ||
                      "Any illegal activities or transactions"}
                  </li>
                  <li>
                    {t("pages.terms.section3.subsection3.list2") ||
                      "Money laundering or terrorist financing"}
                  </li>
                  <li>
                    {t("pages.terms.section3.subsection3.list3") ||
                      "Fraudulent activities or identity theft"}
                  </li>
                  <li>
                    {t("pages.terms.section3.subsection3.list4") ||
                      "Gambling transactions where prohibited by law"}
                  </li>
                  <li>
                    {t("pages.terms.section3.subsection3.list5") ||
                      "Purchasing illegal goods or services"}
                  </li>
                  <li>
                    {t("pages.terms.section3.subsection3.list6") ||
                      "Business purposes if opened as a personal account"}
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section3.subsection4.title") ||
                      "3.4 Account Monitoring:"}
                  </strong>{" "}
                  {t("pages.terms.section3.subsection4.content") ||
                    "We actively monitor accounts for suspicious activity and reserve the right to freeze, suspend, or close accounts that violate these Terms or applicable laws."}
                </p>
              </div>
            </div>

            {/* Fees and Charges */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section4.title") ||
                  "4. Fees, Charges, and Interest"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section4.subsection1.title") ||
                      "4.1 Fee Schedule:"}
                  </strong>{" "}
                  {t("pages.terms.section4.subsection1.content") ||
                    "All applicable fees are disclosed in our Fee Schedule, which is provided at account opening and is available on our website. Fees may include monthly maintenance fees, overdraft fees, ATM fees, wire transfer fees, and other service charges."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section4.subsection2.title") ||
                      "4.2 Fee Changes:"}
                  </strong>{" "}
                  {t("pages.terms.section4.subsection2.content") ||
                    "We reserve the right to modify our fees with at least 30 days' prior written notice to you. Continued use of your account after the effective date constitutes acceptance of the new fee structure."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section4.subsection3.title") ||
                      "4.3 Interest Rates:"}
                  </strong>{" "}
                  {t("pages.terms.section4.subsection3.content") ||
                    "Interest rates on deposit accounts are variable and may change at our discretion. Current rates are available on our website and in branch locations. Interest is calculated using the daily balance method and credited monthly."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section4.subsection4.title") ||
                      "4.4 Overdraft Protection:"}
                  </strong>{" "}
                  {t("pages.terms.section4.subsection4.content") ||
                    "If you enroll in overdraft protection, transactions that exceed your available balance may be honored subject to our overdraft limit and applicable fees. You acknowledge that overdraft fees may result in additional charges."}
                </p>
              </div>
            </div>

            {/* Electronic Banking */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section5.title") ||
                  "5. Electronic Banking Services"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section5.subsection1.title") ||
                      "5.1 Online and Mobile Banking:"}
                  </strong>{" "}
                  {t("pages.terms.section5.subsection1.content") ||
                    "Our electronic banking services allow you to check balances, transfer funds, pay bills, deposit checks remotely, and perform other transactions. These services are subject to system availability and may be interrupted for maintenance."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section5.subsection2.title") ||
                      "5.2 Electronic Communications:"}
                  </strong>{" "}
                  {t("pages.terms.section5.subsection2.content") ||
                    "By using our services, you consent to receive communications electronically, including account statements, notices, disclosures, and other information that we are legally required to provide."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section5.subsection3.title") ||
                      "5.3 Mobile Deposit:"}
                  </strong>{" "}
                  {t("pages.terms.section5.subsection3.content") ||
                    "Our mobile deposit service allows you to deposit checks by capturing images. You agree to properly endorse checks, retain the original for 14 days, and securely destroy it thereafter. You are responsible for ensuring deposits are accurate and legitimate."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section5.subsection4.title") ||
                      "5.4 Bill Pay Services:"}
                  </strong>{" "}
                  {t("pages.terms.section5.subsection4.content") ||
                    "Our bill pay service allows you to make payments to third parties. You authorize us to debit your account for payment amounts and any applicable fees. We are not responsible for late payments caused by payee processing delays."}
                </p>
              </div>
            </div>

            {/* Deposits and Withdrawals */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section6.title") ||
                  "6. Deposits, Withdrawals, and Transfers"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section6.subsection1.title") ||
                      "6.1 Deposit Availability:"}
                  </strong>{" "}
                  {t("pages.terms.section6.subsection1.content") ||
                    "Deposits are subject to verification and availability schedules as disclosed in our Funds Availability Policy. Electronic deposits are generally available within 1-2 business days, while check deposits may be held longer based on amount and account history."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section6.subsection2.title") ||
                      "6.2 Deposit Endorsements:"}
                  </strong>{" "}
                  {t("pages.terms.section6.subsection2.content") ||
                    "All checks must be endorsed as specified by us. We reserve the right to reject improperly endorsed items or deposits that appear suspicious or fraudulent."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section6.subsection3.title") ||
                      "6.3 Withdrawal Limits:"}
                  </strong>{" "}
                  {t("pages.terms.section6.subsection3.content") ||
                    "We may impose daily withdrawal and transfer limits for security purposes. ATM withdrawals and certain electronic transfers may be limited to protect your account."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section6.subsection4.title") ||
                      "6.4 Regulation D:"}
                  </strong>{" "}
                  {t("pages.terms.section6.subsection4.content") ||
                    "For savings and money market accounts, federal regulations may limit certain types of withdrawals and transfers to six per monthly statement cycle."}
                </p>
              </div>
            </div>

            {/* Liability and Disputes */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section7.title") ||
                  "7. Liability and Dispute Resolution"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section7.subsection1.title") ||
                      "7.1 Unauthorized Transactions:"}
                  </strong>{" "}
                  {t("pages.terms.section7.subsection1.content") ||
                    "You must notify us immediately of any unauthorized transactions. Your liability for unauthorized electronic transfers is governed by federal law (Regulation E), which limits your losses if you report them promptly:"}
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>
                    {t("pages.terms.section7.subsection1.list1") ||
                      "$0 if reported before any unauthorized use"}
                  </li>
                  <li>
                    {t("pages.terms.section7.subsection1.list2") ||
                      "Up to $50 if reported within 2 business days"}
                  </li>
                  <li>
                    {t("pages.terms.section7.subsection1.list3") ||
                      "Up to $500 if reported within 60 days of statement"}
                  </li>
                  <li>
                    {t("pages.terms.section7.subsection1.list4") ||
                      "Unlimited if not reported within 60 days"}
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section7.subsection2.title") ||
                      "7.2 Error Resolution:"}
                  </strong>{" "}
                  {t("pages.terms.section7.subsection2.content") ||
                    "If you believe an error has occurred, you must notify us within 60 days of the statement date. We will investigate and respond within 10 business days (or 45 days for certain transactions)."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section7.subsection3.title") ||
                      "7.3 Limitation of Liability:"}
                  </strong>{" "}
                  {t("pages.terms.section7.subsection3.content") ||
                    "To the maximum extent permitted by law, ByVault Finance is not liable for indirect, incidental, special, or consequential damages arising from your use of our services, including lost profits or business interruption."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section7.subsection4.title") ||
                      "7.4 Arbitration Agreement:"}
                  </strong>{" "}
                  {t("pages.terms.section7.subsection4.content") ||
                    "Any disputes arising from these Terms or your accounts shall be resolved through binding arbitration rather than court proceedings, except where prohibited by law. You waive your right to participate in class action lawsuits."}
                </p>
              </div>
            </div>

            {/* Account Closure */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section8.title") ||
                  "8. Account Closure and Termination"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section8.subsection1.title") ||
                      "8.1 Closure by Customer:"}
                  </strong>{" "}
                  {t("pages.terms.section8.subsection1.content") ||
                    "You may close your account at any time by providing written notice and returning all checks, debit cards, and other access devices. You remain responsible for all outstanding transactions and fees."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section8.subsection2.title") ||
                      "8.2 Closure by Bank:"}
                  </strong>{" "}
                  {t("pages.terms.section8.subsection2.content") ||
                    "We reserve the right to close your account at any time for any reason, including but not limited to:"}
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>
                    {t("pages.terms.section8.subsection2.list1") ||
                      "Violation of these Terms"}
                  </li>
                  <li>
                    {t("pages.terms.section8.subsection2.list2") ||
                      "Suspicious or fraudulent activity"}
                  </li>
                  <li>
                    {t("pages.terms.section8.subsection2.list3") ||
                      "Excessive overdrafts or returned items"}
                  </li>
                  <li>
                    {t("pages.terms.section8.subsection2.list4") ||
                      "Account inactivity"}
                  </li>
                  <li>
                    {t("pages.terms.section8.subsection2.list5") ||
                      "Provision of false information"}
                  </li>
                  <li>
                    {t("pages.terms.section8.subsection2.list6") ||
                      "Legal or regulatory requirements"}
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section8.subsection3.title") ||
                      "8.3 Final Distribution:"}
                  </strong>{" "}
                  {t("pages.terms.section8.subsection3.content") ||
                    "Upon closure, any remaining balance will be mailed to your address of record after deducting applicable fees and charges. Unclaimed funds are subject to state escheatment laws."}
                </p>
              </div>
            </div>

            {/* Privacy and Data */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section9.title") ||
                  "9. Privacy and Data Security"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section9.subsection1.title") ||
                      "9.1 Privacy Policy:"}
                  </strong>{" "}
                  {t("pages.terms.section9.subsection1.content") ||
                    "Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. We comply with all applicable privacy laws including the Gramm-Leach-Bliley Act."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section9.subsection2.title") ||
                      "9.2 Information Sharing:"}
                  </strong>{" "}
                  {t("pages.terms.section9.subsection2.content") ||
                    "We may share your information with affiliates, service providers, and third parties as necessary to provide services, comply with legal requirements, or prevent fraud."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section9.subsection3.title") ||
                      "9.3 Data Security:"}
                  </strong>{" "}
                  {t("pages.terms.section9.subsection3.content") ||
                    "We employ industry-standard security measures including encryption, firewalls, and multi-factor authentication. However, no system is completely secure, and you acknowledge that electronic transmission carries inherent risks."}
                </p>
              </div>
            </div>

            {/* Legal and Regulatory */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section10.title") ||
                  "10. Legal and Regulatory Compliance"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section10.subsection1.title") ||
                      "10.1 Governing Law:"}
                  </strong>{" "}
                  {t("pages.terms.section10.subsection1.content") ||
                    "These Terms are governed by federal law and the laws of the state where your account was opened, without regard to conflict of law principles."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section10.subsection2.title") ||
                      "10.2 Regulatory Compliance:"}
                  </strong>{" "}
                  {t("pages.terms.section10.subsection2.content") ||
                    "We comply with all applicable banking regulations including those issued by the Federal Reserve, FDIC, OCC, CFPB, and state banking authorities. Your accounts are FDIC insured up to the maximum amount permitted by law."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section10.subsection3.title") ||
                      "10.3 Anti-Money Laundering:"}
                  </strong>{" "}
                  {t("pages.terms.section10.subsection3.content") ||
                    "We maintain compliance programs for the Bank Secrecy Act and USA PATRIOT Act. We may file Suspicious Activity Reports (SARs) and Currency Transaction Reports (CTRs) as required by law without notice to you."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section10.subsection4.title") ||
                      "10.4 Tax Reporting:"}
                  </strong>{" "}
                  {t("pages.terms.section10.subsection4.content") ||
                    "We report account interest and other taxable events to the IRS as required. You are responsible for reporting and paying all applicable taxes on your accounts."}
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section11.title") ||
                  "11. Changes to Terms and Conditions"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section11.subsection1.title") ||
                      "11.1 Right to Modify:"}
                  </strong>{" "}
                  {t("pages.terms.section11.subsection1.content") ||
                    "We reserve the right to modify these Terms at any time. Changes will be communicated through written notice, email, posting on our website, or statement inserts at least 30 days before the effective date."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section11.subsection2.title") ||
                      "11.2 Acceptance of Changes:"}
                  </strong>{" "}
                  {t("pages.terms.section11.subsection2.content") ||
                    "Continued use of your account after the effective date of changes constitutes acceptance of the modified Terms. If you do not agree to the changes, you must close your account before the effective date."}
                </p>
              </div>
            </div>

            {/* General Provisions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("pages.terms.section12.title") || "12. General Provisions"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section12.subsection1.title") ||
                      "12.1 Severability:"}
                  </strong>{" "}
                  {t("pages.terms.section12.subsection1.content") ||
                    "If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section12.subsection2.title") ||
                      "12.2 Waiver:"}
                  </strong>{" "}
                  {t("pages.terms.section12.subsection2.content") ||
                    "Our failure to enforce any provision does not constitute a waiver of our right to enforce that provision in the future."}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>
                    {t("pages.terms.section12.subsection3.title") ||
                      "12.3 Assignment:"}
                  </strong>{" "}
                  {t("pages.terms.section12.subsection3.content") ||
                    "You may not assign these Terms or your account without our written consent. We may assign our rights and obligations without notice to you."}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {t("pages.terms.section12.subsection4.title") ||
                      "12.4 Entire Agreement:"}
                  </strong>{" "}
                  {t("pages.terms.section12.subsection4.content") ||
                    "These Terms, together with our Privacy Policy, Fee Schedule, and product-specific disclosures, constitute the entire agreement between you and ByVault Finance regarding your accounts and supersede all prior agreements."}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("pages.terms.contact.title") ||
                      "Questions About These Terms?"}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {t("pages.terms.contact.subtitle") ||
                      "If you have any questions regarding these Terms and Conditions, please contact us:"}
                  </p>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>
                        {t("pages.terms.contact.email") || "Email:"}
                      </strong>{" "}
                      support@byvaultfinance.com
                    </p>
                    <p>
                      <strong>
                        {t("pages.terms.contact.phone") || "Phone:"}
                      </strong>{" "}
                      +1-469-696-1911
                    </p>
                    <p>
                      <strong>
                        {t("pages.terms.contact.address") || "Address:"}
                      </strong>{" "}
                      123 Financial Plaza, New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-9 h-9 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsConditions;
