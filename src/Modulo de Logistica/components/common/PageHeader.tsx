import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  actions?: React.ReactNode;
  gradient?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  gradient = false,
}) => {
  const headerStyles: React.CSSProperties = gradient
    ? {
        background: "linear-gradient(135deg, #000000ff 0%, #040305ff 100%)",
        color: "white",
        padding: "24px",
        borderRadius: "12px",
        marginBottom: "24px",
      }
    : {
        marginBottom: "24px",
      };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: gradient ? "flex-start" : "center",
        ...headerStyles,
      }}
    >
      <div>
        <h1
          style={{
            margin: "0 0 8px 0",
            fontSize: gradient ? "28px" : "32px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {icon && (
            <span
              style={
                {
                  // fontSize: gradient ? "32px" : "36px"
                }
              }
            >
              {icon}
            </span>
          )}
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              // opacity: gradient ? 0.9 : 0.7,
              color: gradient ? "white" : "#000000ff",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
