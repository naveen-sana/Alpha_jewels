import { Link } from 'react-router-dom'
import { User, Mail, Phone, Shield, KeyRound } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { decodeJwtPayload } from '../utils/jwtUtils'
import Button from '../components/Button'

const Profile = () => {
  const { user, token } = useAuth()
  const jwtPayload = decodeJwtPayload(token)

  const profileFields = [
    { label: 'Full Name', value: user?.fullName || '—', icon: User },
    { label: 'Email', value: user?.email || jwtPayload?.email || '—', icon: Mail },
    { label: 'Phone', value: user?.phone || '—', icon: Phone },
    { label: 'Role', value: user?.role || jwtPayload?.role || 'USER', icon: Shield },
  ]

  return (
    <div className="profile-page section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="profile-card animate-fade-up">
              <div className="profile-header">
                <div className="profile-avatar">
                  <User size={40} />
                </div>
                <div>
                  <h1>My Profile</h1>
                  <p className="mb-0">Your account information</p>
                </div>
              </div>

              <div className="profile-fields">
                {profileFields.map(({ label, value, icon: Icon }) => (
                  <div className="profile-field" key={label}>
                    <div className="profile-field-icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className="profile-field-label">{label}</span>
                      <span className="profile-field-value">{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {jwtPayload?.expiresAt && (
                <div className="session-info">
                  <small className="text-muted">
                    Session expires: {jwtPayload.expiresAt.toLocaleString()}
                  </small>
                </div>
              )}

              <div className="profile-actions">
                <Link to="/change-password">
                  <Button variant="gold" icon={KeyRound}>
                    Change Password
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline-gold">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
