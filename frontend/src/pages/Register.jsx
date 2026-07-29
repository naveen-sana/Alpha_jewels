import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
} from '../utils/validators'

const Register = () => {
  const navigate = useNavigate()
  const { register, getErrorMessage } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const { values, errors, touched, handleChange, handleBlur, setAllErrors } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const validateForm = () => {
    const nextErrors = {
      firstName: validateRequired(values.firstName, 'First name'),
      lastName: validateRequired(values.lastName, 'Last name'),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
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
    setSuccess('')

    if (!validateForm()) return

    setSubmitting(true)

    try {
      // Backend User entity expects fullName, not separate first/last names
      const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`.trim()

      await register({
        fullName,
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
      })

      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1800)
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
          <div className="col-lg-6 col-xl-5">
            <div className="auth-card animate-fade-up">
              <div className="auth-card-header text-center">
                <h1>Create Account</h1>
                <p>Join Alpha Jewels and discover luxury collections</p>
              </div>

              {serverError && <div className="alert alert-danger">{serverError}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.firstName}
                      touched={touched.firstName}
                      placeholder="John"
                      required
                      icon={User}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.lastName}
                      touched={touched.lastName}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

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
                  label="Mobile Number"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  touched={touched.phone}
                  placeholder="+91 98765 43210"
                  required
                  icon={Phone}
                  autoComplete="tel"
                />

                <Input
                  label="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  touched={touched.password}
                  placeholder="Minimum 8 characters"
                  required
                  icon={Lock}
                  showPasswordToggle
                  autoComplete="new-password"
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  placeholder="Re-enter password"
                  required
                  showPasswordToggle
                  autoComplete="new-password"
                />

                <Button type="submit" variant="gold" className="w-100 mt-2" loading={submitting}>
                  Register
                </Button>
              </form>

              <p className="auth-footer-text text-center mt-4 mb-0">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
