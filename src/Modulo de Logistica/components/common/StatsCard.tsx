import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "teal";
  trend?: {
    value: number;
    label: string;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  color = "blue",
  trend,
}) => {
  const getColorStyles = () => {
    const colors = {
      blue: {
        gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        light: "#eff6ff",
      },
      teal: {
        gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        light: "#ecfeff",
      },
      green: {
        gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        light: "#f0fdf4",
      },
      yellow: {
        gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        light: "#fffbeb",
      },
      red: {
        gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        light: "#fef2f2",
      },
      purple: {
        gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        light: "#faf5ff",
      },
    };
    return colors[color];
  };

  const styles = getColorStyles();

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        border: "2px solid #e2e8f0",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "14px",
              color: "#64748b",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "700",
              color: "#1f2937",
            }}
          >
            {value}
          </p>
        </div>
        <div
          style={{
            width: "56px",
            height: "56px",
            background: styles.gradient,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
          }}
        >
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "12px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          {subtitle && (
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px",
                fontWeight: "600",
                color: trend.value >= 0 ? "#10b981" : "#ef4444",
              }}
            >
              <span>{trend.value >= 0 ? "↗" : "↘"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span style={{ color: "#64748b", fontWeight: "400" }}>
                {trend.label}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
