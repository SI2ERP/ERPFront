import React from 'react';
import type { CSSProperties } from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  subtitle, 
  headerActions,
  style,
  className 
}) => {
  const cardStyle: CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    ...style
  };

  return (
    <div style={cardStyle} className={className}>
      {(title || headerActions) && (
        <div style={{
          padding: '20px',
          borderBottom: '2px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {title && (
              <h3 style={{ 
                margin: 0, 
                color: '#2d3748',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ 
                margin: '5px 0 0 0', 
                color: '#718096',
                fontSize: '14px'
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div>{headerActions}</div>
          )}
        </div>
      )}
      <div style={{ padding: title || headerActions ? '20px' : '0' }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
