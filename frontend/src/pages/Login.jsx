import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
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
      await login(
        { email: values.email.trim(), password: values.password },
        values.rememberMe
      )
      navigate(from, { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-xl-4">
            <div className="auth-card animate-fade-up">
              <div className="auth-card-header text-center">
                <h1>Welcome Back</h1>
                <p>Sign in to your Alpha Jewels account</p>
              </div>

              {serverError && <div className="alert alert-danger">{serverError}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                  placeholder="you@example.com"
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
                  placeholder="Enter your password"
                  required
                  icon={Lock}
                  showPasswordToggle
                  autoComplete="current-password"
                />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={values.rememberMe}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember login
                    </label>
                  </div>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" variant="gold" className="w-100" loading={submitting}>
                  Sign In
                </Button>
              </form>

              <p className="auth-footer-text text-center mt-4 mb-0">
                New to Alpha? <Link to="/register">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
