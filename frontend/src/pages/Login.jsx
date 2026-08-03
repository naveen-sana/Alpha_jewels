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
    <div className="auth-page position-relative overflow-hidden">
      {/* Login Success Popup Modal */}
      {showSuccessPopup && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-index-modal animate-fade-in"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', zIndex: 9999 }}
        >
          <div 
            className="card border-gold rounded-4 p-4 p-md-5 text-center shadow-2xl animate-scale-up"
            style={{ 
              maxWidth: '440px', 
              width: '90%', 
              background: 'linear-gradient(145deg, #18181b, #09090b)', 
              borderColor: '#d4af37',
              boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.25)' 
            }}
          >
            <div className="mb-3 d-flex justify-content-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '70px', height: '70px', backgroundColor: 'rgba(212, 175, 55, 0.15)', border: '2px solid #d4af37' }}
              >
                <CheckCircle size={40} className="text-gold" />
              </div>
            </div>
            
            <h3 className="font-serif text-gold display-6 mb-2 fw-bold">Login Successful!</h3>
            <p className="text-white fs-6 mb-1">
              User successfully logged in.
            </p>
            <p className="text-white-50 small mb-4">
              Welcome back, <span className="text-gold fw-semibold">{loggedInUser?.fullName || loggedInUser?.email || 'Valued Member'}</span>! Redirecting to boutique...
            </p>

            <button 
              onClick={handleProceedImmediately}
              className="btn btn-gold rounded-3 w-100 py-2.5 text-black fw-bold d-flex align-items-center justify-content-center gap-2"
            >
              <Sparkles size={18} />
              <span>Explore Collection Now</span>
            </button>
          </div>
        </div>
      )}

      <div className="container position-relative z-index-3">
        <div className="row justify-content-start">
          <div className="col-md-8 col-lg-5 col-xl-4 offset-lg-1">
            <div className="auth-card animate-fade-up">
              <div className="auth-card-header text-center">
                <h1 className="font-serif text-gold display-5 fw-bold mb-1">Alpha Jewels</h1>
                <p className="text-light-gold small mb-4 font-light">Haute Joaillerie Member Access</p>
              </div>

              {serverError && <div className="alert alert-danger">{serverError}</div>}

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
                  className="py-3 text-black fw-bold fs-6 rounded-3 shadow-lg"
                >
                  Sign In
                </Button>

                <div className="auth-footer-text text-center mt-4">
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

