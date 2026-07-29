import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'

const VerifyOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const maskedEmail = useMemo(() => {
    const [name, domain] = email.split('@')
    if (!name || !domain) return email
    return `${name.slice(0, 3)}${'•'.repeat(Math.max(3, name.length - 3))}@${domain}`
  }, [email])

  const handleOtpChange = (event) => {
    const nextOtp = event.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(nextOtp)
    if (error) setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email) {
      setError('Start from the Forgot Password page so we know where to send your OTP.')
      return
    }

    if (otp.length !== 6) {
      setError('Enter the complete 6-digit OTP sent to your email.')
      return
    }

    navigate('/reset-password', { state: { email, otp } })
  }

  return (
    <div className="auth-page otp-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="auth-card otp-card animate-fade-up">
              <div className="otp-icon" aria-hidden="true">
                <ShieldCheck size={30} strokeWidth={1.8} />
              </div>

              <div className="auth-card-header text-center">
                <h1>Verify your OTP</h1>
                <p>We sent a six-digit security code to</p>
              </div>

              {email ? (
                <div className="otp-email-pill">
                  <Mail size={16} />
                  <span>{maskedEmail}</span>
                </div>
              ) : (
                <div className="alert alert-danger">No email address was provided.</div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <label className="form-label otp-label" htmlFor="otp">One-time password</label>
                <div className={`otp-input-shell ${error ? 'is-invalid' : ''}`}>
                  <KeyRound size={19} aria-hidden="true" />
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength="6"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="000000"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'otp-error' : 'otp-help'}
                    autoFocus
                  />
                </div>
                <p id="otp-help" className="otp-help">Enter the code exactly as it appears in your email.</p>
                {error && <div id="otp-error" className="invalid-feedback d-block">{error}</div>}

                <Button type="submit" variant="gold" className="w-100 mt-3" icon={ArrowRight}>
                  Continue
                </Button>
              </form>

              <p className="auth-footer-text text-center mt-4 mb-0">
                Didn&apos;t receive a code? <Link to="/forgot-password">Send a new OTP</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp
