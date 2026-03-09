/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/KYCReview.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Mail,
  Calendar,
  Sun,
  Moon,
  User,
  MapPin,
  Briefcase,
  Download,
  Eye,
  X,
  AlertCircle,
  Bell
} from "lucide-react";
import { kycService } from "../../../services/kycService";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "../Notification/AdminAlertBell";

const KYCReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [selectedImage, setSelectedImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [reviewComment, setReviewComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchKycDetails = async () => {
    try {
      setLoading(true);
      const response = await kycService.getKYCById?.(id) || await fetchKycFromAdmin(id);
      setKyc(response.kyc || response);
    } catch (error) {
      console.error("Error fetching KYC details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback if getKYCById doesn't exist in service
  const fetchKycFromAdmin = async (kycId) => {
    // You might need to add this to your service
    const response = await fetch(`/api/admin/kyc/${kycId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.json();
  };

  useEffect(() => {
    fetchKycDetails();
  }, [id]);

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      await kycService.reviewKYC(id, {
        status: "verified",
        comment: reviewComment || "KYC verified by admin"
      });
      await fetchKycDetails();
    } catch (error) {
      console.error("Error approving KYC:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    try {
      setSubmitting(true);
      await kycService.reviewKYC(id, {
        status: "rejected",
        rejectionReason: rejectionReason,
        comment: rejectionReason
      });
      setShowRejectModal(false);
      await fetchKycDetails();
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
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${s.bg}`}>
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
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
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
                const a = document.createElement('a');
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
          className="h-40 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
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
      <p className={`text-sm text-gray-900 dark:text-white ${capitalize ? 'capitalize' : ''}`}>
        {value || 'N/A'}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <RefreshCw size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!kyc) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-600 dark:text-gray-400">KYC application not found</p>
        </div>
      </div>
    );
  }

  const user = kyc.user || {};
  const documents = kyc.documents || [];
  // eslint-disable-next-line no-unused-vars
  const firstDoc = documents[0] || {};

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-4"
              >
                <ArrowLeft size={24} className="dark:text-white"  />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 ml-8">
                Review KYC 
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={20} className="dark:text-white" /> : <Moon size={20} />}
                </button>
                 <AdminAlertBell />
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {/* Status Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Mail size={14} /> {user.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                {getStatusBadge(kyc.status)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {kyc.status === 'pending' || kyc.status === 'under_review' ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Review Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
                >
                  {submitting ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Approve Verification
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center gap-2"
                >
                  <XCircle size={16} />
                  Reject Application
                </button>
              </div>
            </div>
          ) : null}

          {/* Rejection Reason */}
          {kyc.status === 'rejected' && kyc.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
              <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Rejection Reason</p>
              <p className="text-sm text-red-700 dark:text-red-400">{kyc.rejectionReason}</p>
            </div>
          )}

          {/* Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Submitted Documents</h3>
            <div className="space-y-6">
              {documents.map((doc, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 capitalize">
                    {doc.type?.replace(/_/g, ' ')} - #{doc.documentNumber}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {doc.frontImage && (
                      <DocumentViewer document={doc.frontImage} title="Front Side" />
                    )}
                    {doc.backImage && (
                      <DocumentViewer document={doc.backImage} title="Back Side" />
                    )}
                    {doc.selfieImage && (
                      <DocumentViewer document={doc.selfieImage} title="Selfie" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          {kyc.personalInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <User size={16} /> Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Full Name" value={kyc.personalInfo.fullName} />
                <InfoRow label="Date of Birth" value={kyc.personalInfo.dateOfBirth ? new Date(kyc.personalInfo.dateOfBirth).toLocaleDateString() : null} />
                <InfoRow label="Nationality" value={kyc.personalInfo.nationality} />
                <InfoRow label="Gender" value={kyc.personalInfo.gender} capitalize />
              </div>
            </div>
          )}

          {/* Address Information */}
          {kyc.addressInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <MapPin size={16} /> Address Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Street Address" value={kyc.addressInfo.streetAddress} />
                <InfoRow label="City" value={kyc.addressInfo.city} />
                <InfoRow label="State" value={kyc.addressInfo.state} />
                <InfoRow label="Postal Code" value={kyc.addressInfo.postalCode} />
                <InfoRow label="Country" value={kyc.addressInfo.country} />
              </div>
            </div>
          )}

          {/* Employment Information */}
          {kyc.employmentInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <Briefcase size={16} /> Employment Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Employment Status" value={kyc.employmentInfo.employmentStatus} capitalize />
                <InfoRow label="Occupation" value={kyc.employmentInfo.occupation} />
                <InfoRow label="Employer" value={kyc.employmentInfo.employerName} />
                <InfoRow label="Annual Income" value={kyc.employmentInfo.annualIncome ? `$${kyc.employmentInfo.annualIncome.toLocaleString()}` : null} />
              </div>
            </div>
          )}

          {/* Verification History */}
          {kyc.verificationHistory && kyc.verificationHistory.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Verification History</h3>
              <div className="space-y-3">
                {kyc.verificationHistory.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                    {entry.status === 'verified' && <CheckCircle size={14} className="text-green-500 mt-0.5" />}
                    {entry.status === 'rejected' && <XCircle size={14} className="text-red-500 mt-0.5" />}
                    {(entry.status === 'pending' || entry.status === 'under_review') && <Clock size={14} className="text-yellow-500 mt-0.5" />}
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium capitalize">{entry.status}</p>
                      {entry.comment && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{entry.comment}</p>}
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        {new Date(entry.timestamp || entry.reviewedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <AdminBottomNav />
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg"
            >
              <X size={20} />
            </button>
            <img src={selectedImage} alt="Document" className="max-w-full max-h-[90vh] object-contain" />
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reject KYC Application</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please provide a reason for rejection
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || submitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {submitting ? "Rejecting..." : "Reject"}
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg"
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

export default KYCReview;