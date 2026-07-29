import { Link } from 'react-router-dom'
import { LayoutDashboard, User, KeyRound, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'

const quickLinks = [
  { to: '/profile', icon: User, label: 'View Profile', text: 'Manage your account details' },
  { to: '/change-password', icon: KeyRound, label: 'Change Password', text: 'Update your security credentials' },
]

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="dashboard-page section-padding">
      <div className="container">
        <div className="dashboard-header animate-fade-up">
          <div>
            <span className="dashboard-badge">
              <ShieldCheck size={16} /> Secure Area
            </span>
            <h1 className="dashboard-title">
              Welcome{user?.fullName ? `, ${user.fullName}` : ''}!
            </h1>
            <p className="dashboard-subtitle">
              You are signed in as <strong>{user?.email}</strong>
              {user?.role && (
                <span className="role-badge ms-2">{user.role}</span>
              )}
            </p>
          </div>
          <LayoutDashboard size={48} className="text-gold dashboard-icon" />
        </div>

        <div className="row g-4 mt-2">
          <div className="col-lg-4">
            <div className="stat-card animate-fade-up delay-1">
              <h6>Account Status</h6>
              <p className="stat-value text-success">Active</p>
              <small className="text-muted">JWT session authenticated</small>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="stat-card animate-fade-up delay-2">
              <h6>Member Role</h6>
              <p className="stat-value">{user?.role || 'USER'}</p>
              <small className="text-muted">Assigned by backend</small>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="stat-card animate-fade-up delay-3">
              <h6>Phone</h6>
              <p className="stat-value stat-value-sm">{user?.phone || 'Not provided'}</p>
              <small className="text-muted">From registration profile</small>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-4">
          {quickLinks.map(({ to, icon: Icon, label, text }, index) => (
            <div className="col-md-6" key={to}>
              <div className={`quick-link-card animate-fade-up delay-${index + 1}`}>
                <div className="quick-link-icon">
                  <Icon size={24} />
                </div>
                <div>
                  <h5>{label}</h5>
                  <p>{text}</p>
                  <Link to={to}>
                    <Button variant="outline-gold" className="mt-2">
                      Go
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
