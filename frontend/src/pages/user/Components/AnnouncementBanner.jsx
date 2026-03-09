// src/components/AnnouncementBanner.jsx
import { useState, useEffect } from "react";
import { X, Info, AlertTriangle, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { announcementService } from "../../../services/announcementService";

const typeConfig = {
  info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-200",
    textColor: "text-blue-800 dark:text-blue-300",
    badgeBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    titleColor: "text-yellow-900 dark:text-yellow-200",
    textColor: "text-yellow-800 dark:text-yellow-300",
    badgeBg: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-900 dark:text-green-200",
    textColor: "text-green-800 dark:text-green-300",
    badgeBg: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-900 dark:text-red-200",
    textColor: "text-red-800 dark:text-red-300",
    badgeBg: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
  },
  maintenance: {
    icon: Clock,
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
    titleColor: "text-purple-900 dark:text-purple-200",
    textColor: "text-purple-800 dark:text-purple-300",
    badgeBg: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  },
};

const SingleAnnouncement = ({ announcement, onDismiss }) => {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[announcement.type] || typeConfig.info;
  const Icon = config.icon;
  const isLong = announcement.content?.length > 120;

  return (
    <div className={`rounded-xl border p-4 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon size={18} className={config.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className={`text-sm font-semibold ${config.titleColor}`}>
              {announcement.title}
            </p>
            {announcement.priority === "critical" && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badgeBg}`}>
                Critical
              </span>
            )}
            {announcement.priority === "high" && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badgeBg}`}>
                Important
              </span>
            )}
          </div>
          <p className={`text-xs leading-relaxed ${config.textColor}`}>
            {isLong && !expanded
              ? announcement.content.substring(0, 120) + "..."
              : announcement.content}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`mt-1 flex items-center gap-1 text-xs font-medium ${config.iconColor}`}
            >
              {expanded ? (
                <><ChevronUp size={14} /> Show less</>
              ) : (
                <><ChevronDown size={14} /> Read more</>
              )}
            </button>
          )}
        </div>
        <button
          onClick={() => onDismiss(announcement._id)}
          className={`flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${config.iconColor}`}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("dismissedAnnouncements") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await announcementService.getUserAnnouncements();
        const list = response.announcements || response || [];
        setAnnouncements(list);
      } catch (err) {
        if (err.status !== 403 && err.status !== 401) {
          console.error("Failed to fetch announcements:", err);
        }
      }
    };
    fetch();
  }, []);

  const handleDismiss = async (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    sessionStorage.setItem("dismissedAnnouncements", JSON.stringify(updated));

    try {
      await announcementService.markAsRead(id);
    } catch {
      // silently fail — dismiss is still applied locally
    }
  };

  const visible = announcements.filter((a) => !dismissed.includes(a._id));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {visible.map((announcement) => (
        <SingleAnnouncement
          key={announcement._id}
          announcement={announcement}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

export default AnnouncementBanner;