import LoadingSpinner from './LoadingSpinner'

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...rest
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`btn luxury-btn btn-${variant} ${loading ? 'is-loading' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <LoadingSpinner size="sm" label="" />
      ) : (
        <>
          {Icon && <Icon size={18} className="btn-icon" />}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}

export default Button
