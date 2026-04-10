import { useState } from "react";
import { FiAlertTriangle, FiX, FiExternalLink } from "react-icons/fi";

const MaintenanceBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "linear-gradient(90deg, #1a0a00 0%, #3d1a00 40%, #1a0a00 100%)",
        borderBottom: "1px solid rgba(251, 146, 60, 0.4)",
        boxShadow: "0 2px 20px rgba(251, 146, 60, 0.15)",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Pulse indicator */}
        <span style={{ position: "relative", flexShrink: 0, display: "flex", alignItems: "center" }}>
          <span
            style={{
              display: "block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#fb923c",
              animation: "banner-pulse 1.5s ease-in-out infinite",
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              backgroundColor: "#fb923c",
              animation: "banner-ping 1.5s ease-in-out infinite",
              opacity: 0.6,
            }}
          />
        </span>

        {/* Icon */}
        <FiAlertTriangle style={{ color: "#fb923c", flexShrink: 0, fontSize: "15px" }} />

        {/* Message */}
        <span
          style={{
            color: "#fcd9a0",
            fontSize: "13px",
            fontWeight: 500,
            flex: 1,
            minWidth: "200px",
          }}
        >
          <span style={{ color: "#fb923c", fontWeight: 700 }}>⚠️ Service Notice:</span>{" "}
          The database is currently undergoing migration due to regional infrastructure disruptions.
          Full functionality will be restored shortly.
          {" "}
          <a
            href="https://www.linkedin.com/posts/abdisa-ketema_opentowork-fullstackdeveloper-backenddeveloper-activity-7430751665605120000-KNGn?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFlC6BQBwRrR4lGkdw9fWFJZJEUEaaI3VHg"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#60a5fa",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#93c5fd")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#60a5fa")}
          >
            View Project on LinkedIn <FiExternalLink style={{ fontSize: "11px" }} />
          </a>
        </span>

        {/* Dismiss button */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss banner"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f9fafb")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          <FiX style={{ fontSize: "16px" }} />
        </button>
      </div>

      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes banner-ping {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(2); opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes banner-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default MaintenanceBanner;
