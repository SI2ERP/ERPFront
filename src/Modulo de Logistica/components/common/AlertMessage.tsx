import React from "react";

interface AlertMessageProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  message,
  onClose,
}) => {
  const getAlertStyles = () => {
    const baseStyles = {
      padding: "16px 20px",
      borderRadius: "8px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    };

    const typeStyles = {
      success: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        border: "1px solid transparent",
      },
      // Error: very light red background, normal red border, dark red text
      error: {
        background: "#fff5f5",
        color: "#991b1b",
        border: "1px solid #ef4444",
      },
      warning: {
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "white",
        border: "1px solid transparent",
      },
      info: {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
        border: "1px solid transparent",
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };
    return icons[type];
  };

  return (
    <div style={getAlertStyles()}>
      <span>
        {getIcon()} {message}
      </span>
      {onClose && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={onClose}
            style={{
              // Taller button, limited width to max 1/3 of the alert box
              height: "40px",
              maxWidth: "33%",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              // Style the button differently when alert is error vs others
              background: type === "error" ? "#fff" : "transparent",
              color:
                type === "error"
                  ? "#ef4444"
                  : type === "success"
                  ? "white"
                  : "white",
              border: type === "error" ? "1px solid #ef4444" : "none",
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertMessage;
