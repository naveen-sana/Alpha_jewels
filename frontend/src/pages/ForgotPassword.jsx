import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import { validateEmail } from '../utils/validators'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const { requestPasswordReset, getErrorMessage } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const { values, errors, touched, handleChange, handleBlur, setAllErrors } = useForm({
    email: '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    setSuccess('')

    const emailError = validateEmail(values.email)
    if (emailError) {
      setAllErrors({ email: emailError })
      return
    }

    setSubmitting(true)

    try {
      const message = await requestPasswordReset(values.email.trim())

      setSuccess(message || "OTP sent successfully.")

      alert("Redirecting...");

      navigate("/verify-otp", {
        state: {
          email: values.email.trim(),
        },
      });
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
                <h1>Forgot Password</h1>
                <p>Enter your email to receive a one-time password (OTP)</p>
              </div>

              {serverError && <div className="alert alert-danger">{serverError}</div>}
              {success && <div className="alert alert-success">{success}</div>}

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

                <Button type="submit" variant="gold" className="w-100" loading={submitting}>
                  Send OTP
                </Button>
              </form>

              <p className="auth-footer-text text-center mt-4 mb-0">
                Remember your password? <Link to="/login">Back to login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
