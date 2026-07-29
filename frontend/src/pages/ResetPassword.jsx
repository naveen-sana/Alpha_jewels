import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import {
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { completePasswordReset, getErrorMessage } = useAuth();

  // Get email and OTP from VerifyOtp page
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setAllErrors,
  } = useForm({
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const nextErrors = {
      newPassword: validatePassword(values.newPassword),
      confirmPassword: validateConfirmPassword(
        values.newPassword,
        values.confirmPassword
      ),
    };

    const filtered = Object.fromEntries(
      Object.entries(nextErrors).filter(([, msg]) => msg)
    );

    if (Object.keys(filtered).length > 0) {
      setAllErrors(filtered);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");
    setSuccess("");

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const message = await completePasswordReset({
        email,
        otp,
        newPassword: values.newPassword,
      });

      setSuccess(message || "Password reset successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-xl-4">
            <div className="auth-card animate-fade-up">

              <div className="auth-card-header text-center">
                <h1>Reset Password</h1>
                <p>Create your new password</p>
              </div>

              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}

              {success && (
                <div className="alert alert-success">{success}</div>
              )}

              <form onSubmit={handleSubmit}>

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
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  placeholder="Confirm password"
                  required
                  showPasswordToggle
                />

                <Button
                  type="submit"
                  variant="gold"
                  className="w-100"
                  loading={submitting}
                >
                  Reset Password
                </Button>

              </form>

              <p className="auth-footer-text text-center mt-4">
                <Link to="/login">Back to Login</Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;