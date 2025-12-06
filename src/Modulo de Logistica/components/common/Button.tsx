import React from "react";
import type { CSSProperties } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
  style?: CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const getVariantStyles = (): CSSProperties => {
    const variants = {
      primary: {
        background: "#000000",
        color: "#ffffff",
        border: "none",
      },
      secondary: {
        background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
        color: "white",
        border: "none",
      },
      success: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        border: "none",
      },
      danger: {
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        color: "white",
        border: "none",
      },
      warning: {
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "white",
        border: "none",
      },
      ghost: {
        background: "transparent",
        color: "#667eea",
        border: "2px solid #667eea",
      },
    };
    return variants[variant];
  };

  const getSizeStyles = (): CSSProperties => {
    const sizes = {
      small: { padding: "8px 16px", fontSize: "13px" },
      medium: { padding: "10px 20px", fontSize: "14px" },
      large: { padding: "12px 24px", fontSize: "16px" },
    };
    return sizes[size];
  };

  const baseStyles: CSSProperties = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    borderRadius: "8px",
    fontWeight: "600",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "transform 0.2s, opacity 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "inherit",
    opacity: disabled || loading ? 0.85 : 1,
    width: fullWidth ? "100%" : "auto",
    ...style,
  };

  // Override styles when disabled or loading to use a gray tone
  if (disabled || loading) {
    Object.assign(baseStyles, {
      background: "#808080",
      color: "#d3d3d3",
      boxShadow: "none",
      cursor: "not-allowed",
    });
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = "scale(1.02)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading ? "⏳" : icon && <span>{icon}</span>}
      <span>{loading ? "Cargando..." : children}</span>
    </button>
  );
};

export default Button;
