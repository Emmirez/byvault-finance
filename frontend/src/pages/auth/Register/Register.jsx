/* eslint-disable no-unused-vars */
// src/pages/auth/Register/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header/Header.jsx";
import {
  User,
  Mail,
  Lock,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Calendar, // Add this import
} from "lucide-react";
import { useLanguageContext } from "../../../contexts/LanguageContext";
import { useAuth } from "../../../contexts/AuthContext";

const CreateAccount = () => {
  const navigate = useNavigate();
  const { t } = useLanguageContext();
  const { register, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "", // Add this line
    address: "",
    currency: "USD",
    accountType: "savings",
    transactionPin: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "", // Add this line
    transactionPin: "",
    password: "",
    confirmPassword: "",
  });

  const steps = [
    { id: 1, title: "Personal", icon: User },
    { id: 2, title: "Contact", icon: Mail },
    { id: 3, title: "Account", icon: CreditCard },
    { id: 4, title: "Security", icon: Shield },
  ];

  // Enhanced validation function that validates all steps
  const validateAllSteps = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      dateOfBirth: "", // Add this line
      transactionPin: "",
      password: "",
      confirmPassword: "",
    };
    setError("");

    // Validate Step 1
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
      isValid = false;
    }

    // Validate Step 2
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else {
      const cleanedPhone = formData.phone.replace(/[^\d+]/g, "");
      if (cleanedPhone.length < 10) {
        newErrors.phone = "Phone number must be at least 10 digits";
        isValid = false;
      } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
        isValid = false;
      }
    }

    // Date of Birth validation
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
      isValid = false;
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (age < 18 || (age === 18 && monthDiff < 0)) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
        isValid = false;
      } else if (age > 120) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
        isValid = false;
      }
    }

    // Validate Step 3
    if (!formData.transactionPin.trim()) {
      newErrors.transactionPin = "Transaction PIN is required";
      isValid = false;
    } else if (formData.transactionPin.length !== 4) {
      newErrors.transactionPin = "PIN must be 4 digits";
      isValid = false;
    } else if (!/^\d+$/.test(formData.transactionPin)) {
      newErrors.transactionPin = "PIN must contain only numbers";
      isValid = false;
    }

    // Validate Step 4
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  // Step validation function
  const validateStep = (step) => {
    let isValid = true;
    const newErrors = { ...formErrors };
    setError("");

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
        isValid = false;
      } else {
        newErrors.firstName = "";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      } else {
        newErrors.lastName = "";
      }

      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
        isValid = false;
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
        isValid = false;
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username =
          "Username can only contain letters, numbers, and underscores";
        isValid = false;
      } else {
        newErrors.username = "";
      }
    }

    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
        isValid = false;
      } else {
        newErrors.email = "";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
        isValid = false;
      } else {
        const cleanedPhone = formData.phone.replace(/[^\d+]/g, "");
        if (cleanedPhone.length < 10) {
          newErrors.phone = "Phone number must be at least 10 digits";
          isValid = false;
        } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
          newErrors.phone = "Please enter a valid phone number";
          isValid = false;
        } else {
          newErrors.phone = "";
        }
      }

      // Validate Date of Birth in step 2
      if (!formData.dateOfBirth.trim()) {
        newErrors.dateOfBirth = "Date of birth is required";
        isValid = false;
      } else {
        const dob = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (age < 18 || (age === 18 && monthDiff < 0)) {
          newErrors.dateOfBirth = "You must be at least 18 years old";
          isValid = false;
        } else if (age > 120) {
          newErrors.dateOfBirth = "Please enter a valid date of birth";
          isValid = false;
        } else {
          newErrors.dateOfBirth = "";
        }
      }
    }

    if (step === 3) {
      if (!formData.transactionPin.trim()) {
        newErrors.transactionPin = "Transaction PIN is required";
        isValid = false;
      } else if (formData.transactionPin.length !== 4) {
        newErrors.transactionPin = "PIN must be 4 digits";
        isValid = false;
      } else if (!/^\d+$/.test(formData.transactionPin)) {
        newErrors.transactionPin = "PIN must contain only numbers";
        isValid = false;
      } else {
        newErrors.transactionPin = "";
      }
    }

    if (step === 4) {
      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
        isValid = false;
      } else {
        newErrors.password = "";
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      } else {
        newErrors.confirmPassword = "";
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    setError("");

    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }

    if (
      name === "confirmPassword" &&
      formData.password &&
      value !== formData.password
    ) {
      setFormErrors({
        ...formErrors,
        confirmPassword: "Passwords do not match",
      });
    } else if (name === "confirmPassword") {
      setFormErrors({
        ...formErrors,
        confirmPassword: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all steps before submission
    if (!validateAllSteps()) {
      // Check which fields have errors
      const errorFields = Object.entries(formErrors)
        .filter(([key, value]) => value)
        .map(([key]) => key);

      if (errorFields.length > 0) {
        setError(`Please fix the following fields: ${errorFields.join(", ")}`);
      } else {
        setError("Please fill in all required fields correctly.");
      }

      // Jump to the first step with an error
      if (formErrors.firstName || formErrors.lastName || formErrors.username) {
        setCurrentStep(1);
      } else if (
        formErrors.email ||
        formErrors.phone ||
        formErrors.dateOfBirth
      ) {
        setCurrentStep(2);
      } else if (formErrors.transactionPin) {
        setCurrentStep(3);
      } else if (formErrors.password || formErrors.confirmPassword) {
        setCurrentStep(4);
      }
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);
    setError("");

    // Prepare data for API
    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      middleName: formData.middleName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dateOfBirth: formData.dateOfBirth, // Add this line
      address: formData.address.trim(),
      currency: formData.currency,
      accountType: formData.accountType,
      transactionPin: formData.transactionPin,
      password: formData.password,
    };

    try {
      // Use the register function from AuthContext
      const result = await register(userData);

      if (result.success) {
        // Handle successful registration
        setSuccess(true);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is being submitted or auth is loading
  const isProcessing = isLoading || authLoading;

  // If registration was successful
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
          <div className="w-full max-w-md mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Registration Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your account has been created successfully. You will be
                redirected to your dashboard shortly.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Header />

      {/* Error Message Display */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Full height container - Fixed for mobile */}
      <div className="w-full overflow-x-hidden">
        <div className="flex items-start justify-center min-h-[calc(100vh-4rem)] px-3 py-7 sm:px-4 sm:py-8">
          <div className="w-full max-w-md mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-5 sm:mb-7">
              <h1 className="text-xl sm:text-xl font-bold text-blue-600 mb-1">
                Start your free account
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                Step {currentStep} of 4
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-6 sm:mb-8 px-1">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;

                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                            isCompleted
                              ? "border-blue-600 text-white"
                              : isCurrent
                                ? "border-blue-600 text-white"
                                : "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          } ${isCompleted || isCurrent ? "bg-blue-600" : ""}`}
                        >
                          {isCompleted ? (
                            <CheckCircle
                              size={14}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          ) : (
                            <Icon
                              size={12}
                              className="sm:w-[16px] sm:h-[16px]"
                            />
                          )}
                        </div>
                        <span
                          className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold ${
                            isCurrent || isCompleted
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="flex-1 h-1 mx-1 sm:mx-1.5 -mt-6 sm:-mt-8 relative z-0">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              currentStep > step.id
                                ? "bg-blue-600"
                                : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 w-full min-h-[380px] sm:min-h-[420px]">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-3 sm:space-y-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        <User className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          Personal Information
                        </h2>
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                          Tell us about yourself
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 ${
                          formErrors.firstName
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-30 focus:outline-none transition-all`}
                        placeholder="Jane"
                        disabled={isProcessing}
                        required
                      />
                      {formErrors.firstName && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 ${
                          formErrors.lastName
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-30 focus:outline-none transition-all`}
                        placeholder="Dane"
                        disabled={isProcessing}
                        required
                      />
                      {formErrors.lastName && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-30 focus:outline-none transition-all"
                        placeholder="David"
                        disabled={isProcessing}
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 ${
                          formErrors.username
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-30 focus:outline-none transition-all`}
                        placeholder="john_doe"
                        disabled={isProcessing}
                        required
                      />
                      {formErrors.username && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.username}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <div className="space-y-3 sm:space-y-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        <Mail className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          Contact Information
                        </h2>
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                          How can we reach you?
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 ${
                          formErrors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-30 focus:outline-none transition-all`}
                        placeholder="your.email@example.com"
                        disabled={isProcessing}
                        required
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 ${
                          formErrors.phone
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-30 focus:outline-none transition-all`}
                        placeholder="+1 (555) 000-0000"
                        disabled={isProcessing}
                        required
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth Field */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute  top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          max={new Date().toISOString().split("T")[0]}
                          className={`w-full pl-10 pr-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 ${
                            formErrors.dateOfBirth
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600"
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-30 focus:outline-none transition-all`}
                          disabled={isProcessing}
                          required
                        />
                      </div>
                      {formErrors.dateOfBirth && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.dateOfBirth}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                        You must be at least 18 years old
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-30 focus:outline-none transition-all resize-none"
                        placeholder="123 Main Street, City, Country"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Account Setup */}
                {currentStep === 3 && (
                  <div className="space-y-3 sm:space-y-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        <CreditCard className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          Account Setup
                        </h2>
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                          Choose your account preferences
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Currency *
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-30 focus:outline-none transition-all"
                        disabled={isProcessing}
                        required
                      >
                        <option value="USD">🇺🇸 USD - US Dollar</option>
                        <option value="EUR">🇪🇺 EUR - Euro</option>
                        <option value="GBP">🇬🇧 GBP - British Pound</option>
                        <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
                        <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                        <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
                        <option value="CHF">🇨🇭 CHF - Swiss Franc</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Account Type *
                      </label>
                      <select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-30 focus:outline-none transition-all"
                        disabled={isProcessing}
                        required
                      >
                        <option value="savings">Savings Account</option>
                        <option value="checking">Checking Account</option>
                        <option value="business">Business Account</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Transaction PIN *
                      </label>
                      <input
                        type="password"
                        name="transactionPin"
                        value={formData.transactionPin}
                        onChange={handleInputChange}
                        maxLength={4}
                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 ${
                          formErrors.transactionPin
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-30 focus:outline-none transition-all`}
                        placeholder="4-digit PIN"
                        disabled={isProcessing}
                        required
                      />
                      {formErrors.transactionPin && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.transactionPin}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Security Setup */}
                {currentStep === 4 && (
                  <div className="space-y-3 sm:space-y-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        <Shield className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          Security Setup
                        </h2>
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                          Secure your account
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 ${
                          formErrors.password
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-30 focus:outline-none transition-all`}
                        placeholder="Create strong password"
                        disabled={isProcessing}
                        required
                      />
                      {formErrors.password && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border-2 ${
                          formErrors.confirmPassword
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-30 focus:outline-none transition-all`}
                        placeholder="Confirm your password"
                        disabled={isProcessing}
                        required
                      />
                      {formErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-md sm:rounded-lg">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded focus:ring-blue-600"
                        style={{ accentColor: "#2563eb" }}
                        disabled={isProcessing}
                        required
                      />
                      <label className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                        I agree to the{" "}
                        <a
                          href="/terms-conditions"
                          className="font-bold hover:underline text-blue-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy-policy"
                          className="font-bold hover:underline text-blue-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-4 sm:pt-5 border-t-2 border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isProcessing}
                    className={`px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                      currentStep === 1 || isProcessing
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    Previous
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isProcessing}
                      className="px-4 py-2 sm:px-6 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-blue-700 hover:border-blue-800 focus:ring-blue-600 disabled:opacity-70"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-4 py-2 sm:px-6 sm:py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs sm:text-sm font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-1 sm:gap-2 border-2 border-green-700 hover:border-green-800 disabled:opacity-70 min-w-[140px]"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                          <span className="whitespace-nowrap">
                            Create Account
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>

              {/* Sign In Link */}
              <div className="text-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-0.5 py-0.5 text-blue-600"
                    disabled={isProcessing}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 sm:mt-6 text-center px-2">
              <div className="inline-flex items-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full border border-gray-300 dark:border-gray-700">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-green-600" />
                {t("landing.trustBadges.ssl256Bit")}
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-center text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 mb-4 sm:mb-0">
              © 2026 Byvault-Finance. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
