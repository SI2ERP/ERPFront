import React from "react";

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
  variant?: "info" | "warning" | "success" | "tip";
  icon?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  children,
  variant = "info",
  icon,
}) => {
  const getVariantStyles = () => {
    const variants = {
      info: {
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        borderColor: "#3b82f6",
        iconDefault: "ℹ️",
      },
      warning: {
        background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        borderColor: "#f59e0b",
        iconDefault: "⚠️",
      },
      success: {
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        borderColor: "#10b981",
        iconDefault: "✅",
      },
      tip: {
        background: "#ecefff",
        borderColor: "#203064ff",
        iconDefault: "💡",
      },
    };
    return variants[variant];
  };

  const styles = getVariantStyles();

  return (
    <div
      style={{
        background: styles.background,
        border: `2px solid ${styles.borderColor}`,
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          margin: "0 0 12px 0",
          fontSize: "16px",
          fontWeight: "700",
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "20px" }}>{icon || styles.iconDefault}</span>
        {title}
      </h3>
      <div
        style={{
          color: "#4b5563",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default InfoBox;
