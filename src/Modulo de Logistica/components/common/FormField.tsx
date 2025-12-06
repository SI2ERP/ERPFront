import React from 'react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'date' | 'number' | 'email' | 'tel' | 'textarea';
  name: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: string;
  helperText?: string;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  icon,
  helperText,
  rows = 3
}) => {
  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    paddingLeft: icon ? '40px' : '12px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
    backgroundColor: disabled ? '#f7fafc' : 'white'
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label 
        htmlFor={name}
        style={{ 
          display: 'block',
          fontSize: '15px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#2d3748'
        }}
      >
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            pointerEvents: 'none'
          }}>
            {icon}
          </span>
        )}
        
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            style={{
              ...inputStyles,
              resize: 'vertical',
              minHeight: '80px'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            style={inputStyles}
            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          />
        )}
      </div>
      
      {helperText && (
        <p style={{
          fontSize: '13px',
          color: '#718096',
          marginTop: '6px',
          marginBottom: 0
        }}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;
