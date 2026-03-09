/* eslint-disable react-hooks/exhaustive-deps */
// src/components/admin/KYCTab.jsx
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Image,
  Download,
  Eye,
  X,
  RefreshCw,
  Shield,
  User,
  MapPin,
  Briefcase,
} from "lucide-react";
import { kycService } from "../../../services/kycService";

const KYCTab = ({ userId, onRefresh }) => {
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

 const fetchKyc = async () => {
  try {
    setLoading(true);
    console.log("🔍 Fetching KYC for user:", userId);
    
    const response = await kycService.getKYCByUserId(userId);
    console.log("📥 KYC Response:", response);
    
    // Handle different response structures
    if (response?.kyc) {
      // If response has kyc property
      setKyc(response.kyc);
    } else if (response?.data?.kyc) {
      // If response has data.kyc
      setKyc(response.data.kyc);
    } else if (response?.applications) {
      // If response has applications array (from fallback)
      const userKyc = response.applications.find(app => 
        app.user?._id === userId || app.user === userId
      );
      setKyc(userKyc || null);
    } else if (Array.isArray(response)) {
      // If response is an array
      const userKyc = response.find(app => 
        app.user?._id === userId || app.user === userId
      );
      setKyc(userKyc || null);
    } else {
      // No KYC found
      setKyc(null);
    }
  } catch (error) {
    console.error("❌ Error fetching KYC:", error);
    setKyc(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (userId) {
      fetchKyc();
    }
  }, [userId]);

  const handleApprove = async () => {
    if (!kyc?._id) return;
    try {
      setSubmitting(true);
      await kycService.reviewKYC(kyc._id, {
        status: "verified",
        comment: "KYC verified by admin",
      });
      await fetchKyc();
      onRefresh?.();
    } catch (error) {
      console.error("Error approving KYC:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || !kyc?._id) return;
    try {
      setSubmitting(true);
      await kycService.reviewKYC(kyc._id, {
        status: "rejected",
        rejectionReason: rejectReason,
        comment: rejectReason,
      });
      await fetchKyc();
      setShowRejectModal(false);
      setRejectReason("");
      onRefresh?.();
    } catch (error) {
      console.error("Error rejecting KYC:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      verified: {
        bg: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        icon: CheckCircle,
        label: "Verified",
      },
      pending: {
        bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
        icon: Clock,
        label: "Pending",
      },
      under_review: {
        bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
        icon: Clock,
        label: "Under Review",
      },
      rejected: {
        bg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        icon: XCircle,
        label: "Rejected",
      },
    };
    const s = map[status] || map.pending;
    const Icon = s.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${s.bg}`}
      >
        <Icon size={12} />
        {s.label}
      </span>
    );
  };

  const DocumentViewer = ({ document, title }) => {
    if (!document?.url) return null;

    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700/60 px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedImage(document.url)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="View"
            >
              <Eye size={16} className="text-gray-500" />
            </button>
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = document.url;
                a.download = `${title}.jpg`;
                a.click();
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="Download"
            >
              <Download size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div
          className="h-32 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setSelectedImage(document.url)}
        >
          <img
            src={document.url}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  };

  const InfoRow = ({ label, value, capitalize }) => (
    <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p
        className={`text-sm text-gray-900 dark:text-white ${capitalize ? "capitalize" : ""}`}
      >
        {value || "N/A"}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex justify-center items-center">
          <RefreshCw size={24} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            Loading KYC details...
          </span>
        </div>
      </div>
    );
  }

  if (!kyc) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <FileText
          size={48}
          className="mx-auto mb-3 text-gray-300 dark:text-gray-600"
        />
        <p className="text-gray-500 dark:text-gray-400">
          No KYC submission found for this user
        </p>
      </div>
    );
  }

  // eslint-disable-next-line no-unused-vars
  const user = kyc.user || {};
  const documents = kyc.documents || [];

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              KYC Status
            </h3>
            <div className="mt-2">{getStatusBadge(kyc.status)}</div>
          </div>
          {(kyc.status === "pending" || kyc.status === "under_review") && (
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>
          )}
          {kyc.status === "verified" && kyc.reviewedAt && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Verified on: {new Date(kyc.reviewedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {kyc.status === "rejected" && kyc.rejectionReason && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              Rejection Reason:
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {kyc.rejectionReason}
            </p>
          </div>
        )}
      </div>

      {/* Documents */}
      {documents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Image size={16} /> Submitted Documents
          </h3>
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {doc.type?.replace(/_/g, " ")}
                  </p>
                  {doc.documentNumber && (
                    <p className="text-xs text-gray-500">
                      #{doc.documentNumber}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {doc.frontImage?.url && (
                    <DocumentViewer document={doc.frontImage} title="Front" />
                  )}
                  {doc.backImage?.url && (
                    <DocumentViewer document={doc.backImage} title="Back" />
                  )}
                  {doc.selfieImage?.url && (
                    <DocumentViewer document={doc.selfieImage} title="Selfie" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Information */}
      {kyc.personalInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <User size={16} /> Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Full Name" value={kyc.personalInfo.fullName} />
            <InfoRow
              label="Date of Birth"
              value={
                kyc.personalInfo.dateOfBirth
                  ? new Date(kyc.personalInfo.dateOfBirth).toLocaleDateString()
                  : null
              }
            />
            <InfoRow label="Nationality" value={kyc.personalInfo.nationality} />
            <InfoRow
              label="Gender"
              value={kyc.personalInfo.gender}
              capitalize
            />
          </div>
        </div>
      )}

      {/* Address Information */}
      {kyc.addressInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <MapPin size={16} /> Address Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow
              label="Street Address"
              value={kyc.addressInfo.streetAddress}
            />
            <InfoRow label="City" value={kyc.addressInfo.city} />
            <InfoRow label="State" value={kyc.addressInfo.state} />
            <InfoRow label="Postal Code" value={kyc.addressInfo.postalCode} />
            <InfoRow label="Country" value={kyc.addressInfo.country} />
          </div>
          {kyc.addressInfo.proofOfAddress?.url && (
            <div className="mt-4">
              <DocumentViewer
                document={kyc.addressInfo.proofOfAddress}
                title="Proof of Address"
              />
            </div>
          )}
        </div>
      )}

      {/* Employment Information */}
      {kyc.employmentInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Briefcase size={16} /> Employment Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow
              label="Employment Status"
              value={kyc.employmentInfo.employmentStatus}
              capitalize
            />
            <InfoRow label="Occupation" value={kyc.employmentInfo.occupation} />
            <InfoRow label="Employer" value={kyc.employmentInfo.employerName} />
            <InfoRow
              label="Annual Income"
              value={
                kyc.employmentInfo.annualIncome
                  ? `$${kyc.employmentInfo.annualIncome.toLocaleString()}`
                  : null
              }
            />
            <InfoRow
              label="Source of Funds"
              value={kyc.employmentInfo.sourceOfFunds}
            />
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
            <img
              src={selectedImage}
              alt="Document"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Reject KYC Verification
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please provide a reason for rejecting this KYC application.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || submitting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50"
              >
                {submitting ? "Rejecting..." : "Reject KYC"}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCTab;
