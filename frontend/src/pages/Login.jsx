import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, CheckCircle, Sparkles } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import { validateEmail, validatePassword } from '../utils/validators'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, rememberedEmail, getErrorMessage } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  const from = location.state?.from || '/shop'

  const { values, errors, touched, handleChange, handleBlur, setAllErrors } = useForm({
    email: rememberedEmail || '',
    password: '',
    rememberMe: Boolean(rememberedEmail),
  })

  const validateForm = () => {
    const nextErrors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    }

    const filtered = Object.fromEntries(
      Object.entries(nextErrors).filter(([, msg]) => msg)
    )

    if (Object.keys(filtered).length > 0) {
      setAllErrors(filtered)
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    if (!validateForm()) return

    setSubmitting(true)

    try {
      const userData = await login(
        { email: values.email.trim(), password: values.password },
        values.rememberMe
      )
      setLoggedInUser(userData)
      setShowSuccessPopup(true)
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 1600)
    } catch (error) {
      setServerError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleProceedImmediately = () => {
    navigate(from, { replace: true })
  }

  return (
    <div className="auth-page position-relative overflow-hidden min-vh-100 d-flex align-items-center justify-content-center">
      {/* Luxury Animated Background Glow */}
      <div 
        className="position-absolute top-50 start-50 translate-middle rounded-circle pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          zIndex: 1
        }}
      />

      {/* Login Success Popup Modal */}
      {showSuccessPopup && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.82)', 
            backdropFilter: 'blur(16px)', 
            zIndex: 99999 
          }}
        >
          <div 
            className="card rounded-4 p-4 p-md-5 text-center shadow-2xl animate-scale-up position-relative overflow-hidden"
            style={{ 
              maxWidth: '460px', 
              width: '90%', 
              background: 'linear-gradient(145deg, rgba(28, 25, 23, 0.96), rgba(12, 10, 9, 0.99))', 
              border: '1px solid rgba(212, 175, 55, 0.5)',
              boxShadow: '0 30px 60px -12px rgba(212, 175, 55, 0.35), inset 0 0 20px rgba(212, 175, 55, 0.08)' 
            }}
          >
            {/* Ambient Shimmer Bar Top */}
            <div 
              className="position-absolute top-0 start-0 w-100" 
              style={{ 
                height: '4px', 
                background: 'linear-gradient(90deg, #d4af37, #fef08a, #d4af37)' 
              }} 
            />

            <div className="mb-4 d-flex justify-content-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center position-relative"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: 'rgba(212, 175, 55, 0.12)', 
                  border: '2px solid #d4af37',
                  boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)'
                }}
              >
                <CheckCircle size={44} className="text-gold" />
              </div>
            </div>
            
            <h3 className="font-serif text-gold display-6 mb-2 fw-bold" style={{ letterSpacing: '0.5px' }}>
              Welcome Back
            </h3>
            <p className="text-white fs-6 mb-2 font-serif">
              Authentication Granted
            </p>
            <p className="text-white-50 small mb-4">
              Welcome, <span className="text-gold fw-bold">{loggedInUser?.fullName || loggedInUser?.email || 'Valued Member'}</span>! Preparing your bespoke jewelry experience...
            </p>

            <button 
              onClick={handleProceedImmediately}
              className="btn btn-gold rounded-3 w-100 py-3 text-black fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg transition-all"
              style={{ letterSpacing: '1px' }}
            >
              <Sparkles size={18} />
              <span>EXPLORE BOUTIQUE NOW</span>
            </button>
          </div>
        </div>
      )}

      <div className="container position-relative z-index-3 py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5 col-xl-4">
            <div 
              className="auth-card animate-fade-up p-4 p-md-5 rounded-4 shadow-2xl"
              style={{
                background: 'linear-gradient(165deg, rgba(24, 24, 27, 0.95), rgba(9, 9, 11, 0.98))',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.15)'
              }}
            >
              <div className="auth-card-header text-center mb-4">
                <div 
                  className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '56px', height: '56px', backgroundColor: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.4)' }}
                >
                  <Sparkles size={28} className="text-gold" />
                </div>
                <h1 className="font-serif text-gold display-5 fw-bold mb-1">Alpha Jewels</h1>
                <p className="text-light-gold small font-light text-uppercase tracking-wider" style={{ letterSpacing: '1px' }}>
                  Haute Joaillerie Member Access
                </p>
              </div>

              {serverError && <div className="alert alert-danger rounded-3">{serverError}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                  placeholder="email@example.com"
                  required
                  icon={Mail}
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  touched={touched.password}
                  placeholder="••••••••"
                  required
                  icon={Lock}
                  autoComplete="current-password"
                />

                <div className="d-flex justify-content-between align-items-center mb-4 fs-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      name="rememberMe"
                      checked={values.rememberMe}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-light-gold" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  fullWidth
                  loading={submitting}
                  className="py-3 text-black fw-bold fs-6 rounded-3 shadow-lg text-uppercase tracking-wider"
                >
                  Sign In
                </Button>

                <div className="auth-footer-text text-center mt-4 text-white-50">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-gold fw-bold ms-1">
                    Sign Up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


