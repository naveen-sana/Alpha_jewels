import React, { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Gem,
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  UserCheck,
  LineChart,
  FileText,
  Star,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Mail,
  ChevronDown,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const adminName = user?.fullName || localStorage.getItem('admin_name') || 'Admin User'
  const adminEmail = user?.email || localStorage.getItem('user_email') || 'admin@alphajewels.com'

  const handleLogout = async () => {
    localStorage.removeItem('admin_token')
    if (logout) await logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Products', path: '/admin/products', icon: Package },
    { title: 'Categories', path: '/admin/categories', icon: FolderTree },
    { title: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { title: 'Customers', path: '/admin/customers', icon: Users },
    { title: 'Users', path: '/admin/users', icon: UserCheck },
    { title: 'Business Analytics', path: '/admin/analytics', icon: LineChart },
    { title: 'Reports', path: '/admin/reports', icon: FileText },
    { title: 'Reviews', path: '/admin/reviews', icon: Star },
    { title: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { title: 'Settings', path: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="admin-mode">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-25">
          <Link to="/admin/dashboard" className="d-flex align-items-center gap-2 text-decoration-none min-w-0 overflow-hidden">
            <Gem size={24} className="text-gold flex-shrink-0" />
            {!collapsed && (
              <span className="font-serif fw-bold text-white text-truncate" style={{ fontSize: '1.05rem' }}>
                Alpha Jewels <span className="text-gold">Admin</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-link text-muted p-1 d-none d-lg-block hover-text-white"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="btn btn-link text-muted p-1 d-lg-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-grow-1 py-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`nav-link-admin ${isActive ? 'active' : ''}`}
                title={collapsed ? item.title : ''}
              >
                <Icon size={20} className={isActive ? 'text-gold' : ''} />
                {!collapsed && <span className="nav-text">{item.title}</span>}
              </NavLink>
            )
          })}
        </div>

        {/* Sidebar Footer - Clean Storefront Link without Bottom Logout */}
        <div className="p-3 border-top border-secondary border-opacity-25">
          <Link
            to="/shop"
            className="nav-link-admin text-muted text-decoration-none d-flex align-items-center gap-2 py-2"
          >
            <ExternalLink size={18} className="text-gold" />
            {!collapsed && <span className="nav-text text-white-50">View Storefront</span>}
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className={`admin-main-wrapper ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* STICKY TOP HEADER NAV */}
        <header className="admin-header-nav">
          <div className="d-flex align-items-center gap-3 w-100 justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="btn btn-light d-lg-none p-2 rounded-3"
              >
                <Menu size={20} />
              </button>

              {/* Global Search Bar */}
              <div className="position-relative d-none d-md-block" style={{ width: '280px' }}>
                <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="form-control ps-5 rounded-pill bg-light border-0 fs-7"
                />
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="d-flex align-items-center gap-3">
              {/* Notifications */}
              <div className="position-relative">
                <button
                  onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); setShowProfileMenu(false); }}
                  className="btn btn-light rounded-circle p-2 position-relative"
                >
                  <Bell size={18} className="text-dark" />
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                </button>

                {showNotifications && (
                  <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg p-3 z-3 border border-light" style={{ width: '300px' }}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="fw-bold mb-0">Notifications</h6>
                      <span className="badge bg-gold text-white fs-8">3 New</span>
                    </div>
                    <ul className="list-unstyled mb-0 fs-7 text-muted">
                      <li className="py-2 border-bottom">✨ New Order #ORD-8823 received</li>
                      <li className="py-2 border-bottom">⚠️ Royal Choker stock low (2 left)</li>
                      <li className="py-2">👤 New customer registered</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="position-relative">
                <button
                  onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); setShowProfileMenu(false); }}
                  className="btn btn-light rounded-circle p-2 position-relative"
                >
                  <Mail size={18} className="text-dark" />
                </button>

                {showMessages && (
                  <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg p-3 z-3 border border-light" style={{ width: '280px' }}>
                    <h6 className="fw-bold mb-2">Messages</h6>
                    <p className="fs-7 text-muted mb-0">No new unread messages from customers.</p>
                  </div>
                )}
              </div>

              {/* Admin Profile Dropdown */}
              <div className="position-relative">
                <button
                  onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowMessages(false); }}
                  className="btn btn-light rounded-pill p-1 pe-3 d-flex align-items-center gap-2"
                >
                  <div className="stat-icon-wrapper rounded-circle" style={{ width: '36px', height: '36px' }}>
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-start d-none d-sm-block">
                    <div className="fw-semibold text-dark fs-7 lh-1">{adminName}</div>
                    <span className="text-muted fs-8">Super Admin</span>
                  </div>
                  <ChevronDown size={14} className="text-muted" />
                </button>

                {showProfileMenu && (
                  <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg p-2 z-3 border border-light" style={{ width: '220px' }}>
                    <div className="p-2 border-bottom">
                      <div className="fw-bold text-dark fs-7">{adminName}</div>
                      <div className="text-muted fs-8">{adminEmail}</div>
                    </div>
                    <Link to="/admin/settings" className="dropdown-item py-2 fs-7 rounded-2 text-dark text-decoration-none d-block">
                      Profile & Settings
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item py-2 fs-7 rounded-2 text-danger text-start w-100 bg-transparent border-0">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT BODY */}
        <main className="p-4 flex-grow-1">{children}</main>

        {/* FOOTER */}
        <footer className="bg-white border-top py-3 px-4 text-center text-muted fs-7">
          &copy; {new Date().getFullYear()} Alpha Jewels Admin Portal. All Rights Reserved. Connected to Spring Boot & MySQL DB.
        </footer>
      </div>
    </div>
  )
}

export default AdminLayout
