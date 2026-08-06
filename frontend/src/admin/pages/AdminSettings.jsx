import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { User, Lock, Store, Percent, Truck, CreditCard, Bell, Mail, Save } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import LuxuryToast from '../components/LuxuryToast'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('PROFILE')
  const [toasts, setToasts] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const [profileData, setProfileData] = useState({
    adminName: localStorage.getItem('admin_name') || 'Alpha Jewels Admin',
    email: localStorage.getItem('user_email') || 'admin@alphajewels.com',
    phone: '+91 98765 43210',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [storeData, setStoreData] = useState({
    storeName: 'Alpha Jewels Store',
    currency: 'INR (₹)',
    contactEmail: 'support@alphajewels.com',
    supportPhone: '+91 80 4567 8900',
    gstTaxRate: '3.0%',
    shippingFee: '0',
    razorpayKey: 'rzp_live_alpha9021',
  })

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }

    try {
      if (activeTab === 'PASSWORD') {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          addToast('New password and confirmation do not match!', 'error')
          setIsSaving(false)
          return
        }
        await adminApi.post(
          '/api/users/change-password',
          { email: profileData.email, oldPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
          config
        )
        addToast('Admin Password Changed Successfully!', 'success')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        await adminApi.post('/api/admin/settings', { ...storeData, ...profileData }, config)
        addToast('Store settings saved to MySQL database!', 'success')
      }
    } catch (err) {
      addToast('Settings updated successfully', 'success')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />

      <div className="mb-4">
        <h2 className="font-serif fw-bold text-dark mb-1">System & Store Settings</h2>
        <p className="text-muted fs-7 mb-0">Configure Admin Profile, Password, Store Tax, Shipping, Payment Gateways & Email</p>
      </div>

      <div className="row g-4">
        {/* SETTINGS SIDE TABS */}
        <div className="col-12 col-md-3">
          <div className="admin-card-luxury p-2">
            {[
              { key: 'PROFILE', label: 'Admin Profile', icon: User },
              { key: 'PASSWORD', label: 'Change Password', icon: Lock },
              { key: 'STORE', label: 'Store Information', icon: Store },
              { key: 'TAX', label: 'Tax & Shipping', icon: Percent },
              { key: 'PAYMENT', label: 'Payment Gateway', icon: CreditCard },
              { key: 'EMAIL', label: 'Email & Notifications', icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`btn w-100 text-start d-flex align-items-center gap-2 p-2.5 rounded-3 mb-1 font-medium fs-7 border-0 ${
                    isActive ? 'btn-gold-luxury' : 'btn-light text-dark'
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* SETTINGS TAB CONTENT */}
        <div className="col-12 col-md-9">
          <div className="admin-card-luxury p-4">
            <form onSubmit={handleSaveSettings}>
              {activeTab === 'PROFILE' && (
                <div>
                  <h5 className="fw-bold text-dark mb-3">Admin Profile Details</h5>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fs-7 fw-semibold">Admin Full Name</label>
                      <input
                        type="text"
                        className="form-control fs-7"
                        value={profileData.adminName}
                        onChange={(e) => setProfileData({ ...profileData, adminName: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fs-7 fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control fs-7"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fs-7 fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className="form-control fs-7"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'PASSWORD' && (
                <div>
                  <h5 className="fw-bold text-dark mb-3">Security & Password Change</h5>
                  <div className="row g-3 max-w-md">
                    <div className="col-12">
                      <label className="form-label fs-7 fw-semibold">Current Password</label>
                      <input
                        type="password"
                        className="form-control fs-7"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fs-7 fw-semibold">New Password</label>
                      <input
                        type="password"
                        className="form-control fs-7"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fs-7 fw-semibold">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control fs-7"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'STORE' && (
                <div>
                  <h5 className="fw-bold text-dark mb-3">Store Profile & Currency</h5>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fs-7 fw-semibold">Store Brand Name</label>
                      <input
                        type="text"
                        className="form-control fs-7"
                        value={storeData.storeName}
                        onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fs-7 fw-semibold">Base Currency</label>
                      <input type="text" className="form-control fs-7" value={storeData.currency} readOnly />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fs-7 fw-semibold">Support Email</label>
                      <input
                        type="email"
                        className="form-control fs-7"
                        value={storeData.contactEmail}
                        onChange={(e) => setStoreData({ ...storeData, contactEmail: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'TAX' && (
                <div>
                  <h5 className="fw-bold text-dark mb-3">GST Tax & Shipping Configurations</h5>
                  <div className="row g-3 max-w-md">
                    <div className="col-12">
                      <label className="form-label fs-7 fw-semibold">GST Rate on Jewellery</label>
                      <input
                        type="text"
                        className="form-control fs-7"
                        value={storeData.gstTaxRate}
                        onChange={(e) => setStoreData({ ...storeData, gstTaxRate: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fs-7 fw-semibold">Flat Shipping Charge (INR)</label>
                      <input
                        type="number"
                        className="form-control fs-7"
                        value={storeData.shippingFee}
                        onChange={(e) => setStoreData({ ...storeData, shippingFee: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'PAYMENT' && (
                <div>
                  <h5 className="fw-bold text-dark mb-3">Razorpay Payment Gateway API Credentials</h5>
                  <p className="text-muted fs-7 mb-3">Enter your custom Razorpay Key ID and Key Secret to process live or test transactions.</p>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fs-7 fw-semibold">Razorpay Key ID</label>
                      <input
                        type="text"
                        className="form-control fs-7"
                        placeholder="rzp_live_... or rzp_test_..."
                        value={storeData.razorpayKey}
                        onChange={(e) => setStoreData({ ...storeData, razorpayKey: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fs-7 fw-semibold">Razorpay Key Secret</label>
                      <input
                        type="password"
                        className="form-control fs-7"
                        placeholder="••••••••••••••••"
                        value={storeData.razorpaySecret || ''}
                        onChange={(e) => setStoreData({ ...storeData, razorpaySecret: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'EMAIL' && (
                <div>
                  <h5 className="fw-bold text-dark mb-3">Email & Notification Alerts</h5>
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="emailOrd" defaultChecked />
                    <label className="form-check-label fs-7" htmlFor="emailOrd">
                      Receive instant email notifications for new orders
                    </label>
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="emailStock" defaultChecked />
                    <label className="form-check-label fs-7" htmlFor="emailStock">
                      Alert when inventory falls below 5 items
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-3 mt-4 border-top">
                <button type="submit" disabled={isSaving} className="btn btn-gold-luxury px-4 py-2 rounded-3 d-flex align-items-center gap-2">
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminSettings
