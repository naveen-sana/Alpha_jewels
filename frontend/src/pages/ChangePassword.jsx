import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import { validatePassword, validateConfirmPassword, validateRequired } from '../utils/validators'

const ChangePassword = () => {
  const navigate = useNavigate()
  const { user, updatePassword, getErrorMessage } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const { values, errors, touched, handleChange, handleBlur, setAllErrors } = useForm({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const validateForm = () => {
    const nextErrors = {
      oldPassword: validateRequired(values.oldPassword, 'Current password'),
      newPassword: validatePassword(values.newPassword),
      confirmPassword: validateConfirmPassword(values.newPassword, values.confirmPassword),
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
      // Backend ChangePasswordRequest: email, oldPassword, newPassword
      const message = await updatePassword({
        email: user?.email,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })

      setSuccess(message || 'Password changed successfully!')
      setTimeout(() => navigate('/dashboard'), 2000)
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
                <h1>Change Password</h1>
                <p>Update your account password securely</p>
              </div>

              {serverError && <div className="alert alert-danger">{serverError}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <Input
                  label="Current Password"
                  name="oldPassword"
                  value={values.oldPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.oldPassword}
                  touched={touched.oldPassword}
                  placeholder="Enter current password"
                  required
                  icon={Lock}
                  showPasswordToggle
                  autoComplete="current-password"
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.newPassword}
                  touched={touched.newPassword}
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
                  placeholder="Re-enter new password"
                  required
                  showPasswordToggle
                  autoComplete="new-password"
                />

                <Button type="submit" variant="gold" className="w-100" loading={submitting}>
                  Update Password
                </Button>
              </form>

              <p className="auth-footer-text text-center mt-4 mb-0">
                <Link to="/dashboard">Back to dashboard</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
