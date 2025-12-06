import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Cargando...', 
  size = 'medium' 
}) => {
  const sizeStyles = {
    small: { fontSize: '16px', padding: '20px' },
    medium: { fontSize: '20px', padding: '40px' },
    large: { fontSize: '24px', padding: '60px' }
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      ...sizeStyles[size]
    }}>
      <div style={{
        display: 'inline-block',
        width: size === 'small' ? '30px' : size === 'medium' ? '40px' : '50px',
        height: size === 'small' ? '30px' : size === 'medium' ? '40px' : '50px',
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '10px'
      }} />
      <h2 style={{ color: '#667eea', fontSize: sizeStyles[size].fontSize }}>
        {message}
      </h2>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
