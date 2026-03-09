// pages/PrivacyPolicy.jsx
import React from "react";
import { useLanguageContext } from "../contexts/LanguageContext";
import Header from "../components/header/header.jsx";
import Footer from "../components/layout/Footer/Footer.jsx";
import { Shield, Lock, Eye, AlertCircle, CheckCircle } from "lucide-react";

const PrivacyPolicy = () => {
  const { t } = useLanguageContext();

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

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=80"
            alt="Privacy Policy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-900/80"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md max-w-2xl mx-auto">
            Your privacy and security are our top priorities
          </p>
        </div>
      </section>

      {/* Last Updated Notice */}
      <section className="py-8 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-900 dark:text-blue-300">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Last Updated: January 30, 2026</span>
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
                Introduction
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  ByVault Finance ("we," "us," "our," or "Bank") is committed to protecting your privacy and safeguarding your personal information. This Privacy Policy explains how we collect, use, share, and protect your information when you use our banking services, website, mobile applications, and other digital platforms.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  This policy complies with the Gramm-Leach-Bliley Act (GLBA), the California Consumer Privacy Act (CCPA), the General Data Protection Regulation (GDPR) where applicable, and other relevant privacy laws and regulations. By using our services, you consent to the practices described in this policy.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We collect several types of information to provide and improve our services:
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>1.1 Personal Identification Information:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Full name, date of birth, and Social Security Number or Tax ID</li>
                  <li>Government-issued identification documents (driver's license, passport)</li>
                  <li>Residential and mailing addresses</li>
                  <li>Email addresses and telephone numbers</li>
                  <li>Employment information and income details</li>
                  <li>Citizenship and immigration status</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>1.2 Financial Information:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Account numbers, balances, and transaction history</li>
                  <li>Payment card information and banking credentials</li>
                  <li>Credit history and credit scores</li>
                  <li>Investment account information and portfolio data</li>
                  <li>Loan applications and mortgage information</li>
                  <li>Source of funds and wealth information</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>1.3 Technical and Usage Information:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>IP address, device identifiers, and browser type</li>
                  <li>Operating system and device settings</li>
                  <li>Cookies, web beacons, and similar tracking technologies</li>
                  <li>Website and mobile app usage patterns</li>
                  <li>Geolocation data (with your consent)</li>
                  <li>Login times and account access patterns</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>1.4 Communications and Interactions:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Customer service inquiries and support tickets</li>
                  <li>Phone call recordings for quality and training purposes</li>
                  <li>Email correspondence and chat transcripts</li>
                  <li>Survey responses and feedback</li>
                  <li>Social media interactions</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300">
                  <strong>1.5 Information from Third Parties:</strong> We may receive information about you from credit bureaus, identity verification services, fraud prevention services, marketing partners, and other financial institutions.
                </p>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We use your information for the following purposes:
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>2.1 Account Services and Operations:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Opening and maintaining your accounts</li>
                  <li>Processing transactions, deposits, and withdrawals</li>
                  <li>Providing customer service and technical support</li>
                  <li>Sending account statements and notifications</li>
                  <li>Managing loan applications and credit decisions</li>
                  <li>Administering rewards programs and promotions</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>2.2 Legal and Regulatory Compliance:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Verifying your identity and preventing identity theft</li>
                  <li>Complying with anti-money laundering (AML) requirements</li>
                  <li>Fulfilling Know Your Customer (KYC) obligations</li>
                  <li>Reporting to regulatory authorities and law enforcement</li>
                  <li>Responding to legal process, subpoenas, and court orders</li>
                  <li>Filing Suspicious Activity Reports (SARs) and Currency Transaction Reports (CTRs)</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>2.3 Security and Fraud Prevention:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Monitoring for fraudulent and suspicious activity</li>
                  <li>Protecting against unauthorized access and cyber threats</li>
                  <li>Implementing multi-factor authentication</li>
                  <li>Investigating and resolving disputes</li>
                  <li>Securing our systems and networks</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>2.4 Marketing and Communications:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Sending promotional offers and product information</li>
                  <li>Providing personalized recommendations</li>
                  <li>Conducting market research and surveys</li>
                  <li>Improving our products and services</li>
                  <li>Analyzing customer preferences and behavior</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300">
                  <strong>2.5 Business Operations:</strong> We use aggregated and anonymized data to analyze trends, improve our services, develop new products, and enhance user experience.
                </p>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. How We Share Your Information
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may share your information in the following circumstances:
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>3.1 Affiliates and Subsidiaries:</strong> We may share information with our corporate affiliates and subsidiaries for business operations, marketing, and service provision. Our affiliates are bound by similar privacy protections.
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>3.2 Service Providers and Vendors:</strong> We share information with third-party service providers who assist us with:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Payment processing and transaction verification</li>
                  <li>Data storage and cloud computing services</li>
                  <li>Customer service and call center operations</li>
                  <li>Marketing and advertising services</li>
                  <li>Fraud detection and prevention</li>
                  <li>Identity verification and credit reporting</li>
                  <li>IT support and cybersecurity</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>3.3 Financial Partners:</strong> We may share information with:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Other financial institutions for transaction processing</li>
                  <li>Credit bureaus for creditworthiness assessment</li>
                  <li>Payment networks (Visa, Mastercard, ACH)</li>
                  <li>Insurance providers for account protection products</li>
                  <li>Investment firms for brokerage services</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>3.4 Legal and Regulatory Requirements:</strong> We disclose information when required by law, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Responding to subpoenas, court orders, and legal processes</li>
                  <li>Cooperating with law enforcement investigations</li>
                  <li>Complying with regulatory examinations and audits</li>
                  <li>Reporting to tax authorities (IRS reporting)</li>
                  <li>Fulfilling anti-money laundering obligations</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>3.5 Business Transfers:</strong> In the event of a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred to the acquiring entity.
                </p>

                <p className="text-gray-700 dark:text-gray-300">
                  <strong>3.6 With Your Consent:</strong> We may share information with third parties when you explicitly authorize us to do so, such as when linking external accounts or using third-party financial management tools.
                </p>
              </div>
            </div>

            {/* Your Privacy Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Your Privacy Rights and Choices
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>4.1 Access and Correction:</strong> You have the right to access your personal information and request corrections to inaccurate data. You can update most information through your online account or by contacting customer service.
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>4.2 Marketing Opt-Out:</strong> You can opt out of marketing communications by:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Clicking "unsubscribe" in marketing emails</li>
                  <li>Adjusting preferences in your account settings</li>
                  <li>Calling our customer service line</li>
                  <li>Sending a written request to our mailing address</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>4.3 Do Not Share:</strong> You can limit our sharing of information with affiliates for marketing purposes by opting out through your account settings or contacting us directly.
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>4.4 California Privacy Rights (CCPA):</strong> California residents have additional rights including:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to know if information is sold or shared</li>
                  <li>Right to opt out of the sale of personal information</li>
                  <li>Right to request deletion of personal information</li>
                  <li>Right to non-discrimination for exercising privacy rights</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>4.5 European Privacy Rights (GDPR):</strong> If you are in the European Economic Area, you have rights including:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Right to access your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure ("right to be forgotten")</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to withdraw consent</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300">
                  To exercise these rights, please contact our Privacy Office using the information provided at the end of this policy.
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Data Security and Protection
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>5.1 Security Measures:</strong> We implement comprehensive security measures to protect your information:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>256-bit SSL/TLS encryption for data transmission</li>
                  <li>AES-256 encryption for data at rest</li>
                  <li>Multi-factor authentication (MFA)</li>
                  <li>Biometric authentication options</li>
                  <li>Firewalls and intrusion detection systems</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee security training and access controls</li>
                  <li>24/7 fraud monitoring and detection</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>5.2 Physical Security:</strong> Our data centers employ physical security controls including surveillance, access badges, biometric scanners, and 24/7 monitoring.
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>5.3 Breach Notification:</strong> In the event of a data breach that compromises your personal information, we will notify you and relevant authorities as required by law, typically within 72 hours of discovery.
                </p>

                <p className="text-gray-700 dark:text-gray-300">
                  <strong>5.4 Your Responsibilities:</strong> You must protect your account credentials, use strong passwords, enable MFA, avoid public Wi-Fi for banking, keep your devices secure, and report suspicious activity immediately.
                </p>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>6.1 Types of Cookies:</strong> We use various types of cookies:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Track your browsing to provide relevant advertisements</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>6.2 Cookie Management:</strong> You can control cookies through your browser settings. Note that disabling certain cookies may limit website functionality.
                </p>

                <p className="text-gray-700 dark:text-gray-300">
                  <strong>6.3 Third-Party Analytics:</strong> We use services like Google Analytics to analyze website traffic. These services may collect information about your visits to our site and other websites.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Data Retention
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>7.1 Retention Periods:</strong> We retain your information for as long as necessary to:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Maintain your accounts and provide services</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Prevent fraud and maintain security</li>
                  <li>Meet audit and examination requirements</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>7.2 Specific Retention Requirements:</strong> We are required to retain certain records for specific periods:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Account records: 7 years after account closure</li>
                  <li>Transaction records: 5-7 years</li>
                  <li>Identity verification documents: 5 years after relationship ends</li>
                  <li>Tax records: 7 years</li>
                  <li>Loan documents: 7 years after final payment</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300">
                  <strong>7.3 Secure Disposal:</strong> When information is no longer needed, we securely destroy it using methods appropriate to the sensitivity of the data.
                </p>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Children's Privacy
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children without parental consent. Custodial accounts for minors require parental or guardian authorization.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  If we discover that we have inadvertently collected information from a child under 13 without proper consent, we will delete that information immediately.
                </p>
              </div>
            </div>

            {/* International Transfers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. International Data Transfers
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure that international transfers comply with applicable laws and implement appropriate safeguards such as:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Privacy Shield frameworks (where applicable)</li>
                  <li>Adequacy decisions by relevant authorities</li>
                  <li>Binding corporate rules</li>
                </ul>
              </div>
            </div>

            {/* Changes to Policy */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or business operations. Material changes will be communicated through:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4">
                  <li>Email notification to your registered email address</li>
                  <li>Prominent notice on our website</li>
                  <li>In-app notifications</li>
                  <li>Account statement inserts</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  Continued use of our services after changes become effective constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Privacy Office Contact
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    For privacy-related inquiries, to exercise your rights, or to file a complaint:
                  </p>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Email:</strong> privacy@byvaultfinance.com</p>
                    <p><strong>Phone:</strong> +1-469-696-1911</p>
                    <p><strong>Mail:</strong> Privacy Office, ByVault Finance, 123 Financial Plaza, New York, NY 10001</p>
                    <p><strong>Online Form:</strong> Available through your account dashboard</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Note:</strong> We will respond to your request within 30 days. For California residents exercising CCPA rights, we will respond within 45 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">FDIC Insured</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your deposits are insured up to $250,000 per depositor.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Bank-Level Security</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  256-bit encryption and multi-factor authentication protect your data.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-3 mb-2">
                  <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Your Control</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your privacy preferences anytime in account settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;