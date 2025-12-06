import React from 'react';

interface BadgeProps {
  variant: 'pendiente' | 'proceso' | 'completado' | 'cancelado' | 'enviado';
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const Badge: React.FC<BadgeProps> = ({ variant, children, size = 'medium' }) => {
  const variantStyles = {
    pendiente: {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      color: 'white'
    },
    proceso: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white'
    },
    completado: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white'
    },
    cancelado: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white'
    },
    enviado: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      color: 'white'
    }
  };

  const sizeStyles = {
    small: {
      padding: '4px 8px',
      fontSize: '11px',
      borderRadius: '4px'
    },
    medium: {
      padding: '6px 12px',
      fontSize: '13px',
      borderRadius: '6px'
    },
    large: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '8px'
    }
  };

  return (
    <span style={{
      display: 'inline-block',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      ...variantStyles[variant],
      ...sizeStyles[size]
    }}>
      {children}
    </span>
  );
};

export default Badge;
