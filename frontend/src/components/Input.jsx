import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  autoComplete,
  icon: Icon,
  showPasswordToggle = false,
  className = '',
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type
  const showError = touched && error

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-gold ms-1">*</span>}
        </label>
      )}

      <div className={`input-wrapper ${Icon ? 'has-icon' : ''} ${showPasswordToggle ? 'has-toggle' : ''}`}>
        {Icon && (
          <span className="input-icon">
            <Icon size={18} />
          </span>
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`form-control luxury-input ${showError ? 'is-invalid' : ''}`}
          aria-invalid={Boolean(showError)}
          aria-describedby={showError ? `${name}-error` : undefined}
          {...rest}
        />

        {showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {showError && (
        <div id={`${name}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  )
}

export default Input
