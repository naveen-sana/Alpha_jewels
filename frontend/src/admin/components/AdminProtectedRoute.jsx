import React from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const token = localStorage.getItem('token') || localStorage.getItem('admin_token')

  // Check if token exists
  if (!token && !isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Get user role from context or token
  let role = user?.role || localStorage.getItem('user_role') || ''
  if (!role && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      role = payload.role || payload.roles || ''
    } catch (e) {
      role = 'ADMIN' // Default allow valid token user if token decoding fails
    }
  }

  const normalizedRole = String(role).toUpperCase()
  const isAllowed =
    normalizedRole.includes('ADMIN') ||
    normalizedRole.includes('SUPER_ADMIN') ||
    normalizedRole.includes('MANAGER') ||
    normalizedRole === 'USER' // Allow admin access for user logged into admin portal

  if (!isAllowed) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
        <div className="text-center bg-white p-5 rounded-4 shadow-lg max-w-md border border-danger border-opacity-25">
          <div className="stat-icon-wrapper mx-auto mb-3 bg-danger bg-opacity-10 text-danger" style={{ width: '70px', height: '70px' }}>
            <ShieldAlert size={38} />
          </div>
          <h2 className="font-serif fw-bold text-dark mb-2">403 Access Denied</h2>
          <p className="text-muted mb-4">
            You do not have administrative privileges to access the Alpha Jewels Admin Dashboard. Please contact your Super Administrator.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/admin/login" className="btn btn-outline-dark px-4 py-2 rounded-3 fw-semibold">
              Admin Login
            </Link>
            <Link to="/" className="btn btn-gold-luxury px-4 py-2 rounded-3 fw-semibold d-inline-flex align-items-center gap-2">
              <ArrowLeft size={18} /> Store Front
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default AdminProtectedRoute
