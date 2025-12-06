import React from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  helperText?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  required = false,
  disabled = false,
  loading = false,
  icon,
  helperText
}) => {
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
            pointerEvents: 'none',
            zIndex: 1
          }}>
            {icon}
          </span>
        )}
        
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled || loading}
          style={{
            width: '100%',
            padding: '12px',
            paddingLeft: icon ? '40px' : '12px',
            paddingRight: '36px',
            fontSize: '15px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
            backgroundColor: disabled || loading ? '#f7fafc' : 'white',
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23718096' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
        >
          <option value="">{loading ? '⏳ Cargando...' : placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

export default SelectField;
