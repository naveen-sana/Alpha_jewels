const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : ''

  return (
    <div className="loading-spinner-wrapper" role="status" aria-live="polite">
      <div className={`loading-spinner ${sizeClass}`} />
      {label && <span className="loading-spinner-label">{label}</span>}
    </div>
  )
}

export default LoadingSpinner
