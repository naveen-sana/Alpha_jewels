import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Users, Search, Eye, Edit2, Trash2, ShieldOff, CheckCircle, X } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import LuxuryToast from '../components/LuxuryToast'
import DeleteModal from '../components/DeleteModal'

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [viewingCustomer, setViewingCustomer] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [toasts, setToasts] = useState([])
  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const fetchCustomers = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      const response = await adminApi.get('/api/admin/users', config)
      const userList = response.data || []
      setCustomers(Array.isArray(userList) ? userList : [])
    } catch (err) {
      console.error(err)
      addToast('Error fetching customer records from database', 'error')
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleToggleDeactivate = async (customer) => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.put(
        `/api/admin/users/${customer.id}`,
        { ...customer, role: customer.role || 'CUSTOMER' },
        config
      )
      addToast(`Customer status updated`, 'success')
      fetchCustomers()
    } catch (err) {
      addToast('Error deactivating customer account', 'error')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.delete(`/api/admin/users/${deleteTarget.id}`, config)
      addToast(`Customer account "${deleteTarget.name || deleteTarget.email}" deleted successfully from database`, 'success')
      setDeleteTarget(null)
      fetchCustomers()
    } catch (err) {
      console.error('Backend delete request failed:', err)
      addToast('Error deleting customer account from database', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
  )

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />
      <DeleteModal
        isOpen={!!deleteTarget}
        itemType="Customer Account"
        title={deleteTarget?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif fw-bold text-dark mb-1">Customer Management</h2>
          <p className="text-muted fs-7 mb-0">Manage customer accounts, view total spent & order history</p>
        </div>
      </div>

      <div className="admin-card-luxury p-3 mb-4">
        <div className="position-relative" style={{ maxWidth: '400px' }}>
          <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <input
            type="text"
            placeholder="Search customer name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control ps-5 rounded-3 bg-light border-0 fs-7"
          />
        </div>
      </div>

      <div className="admin-card-luxury p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders Count</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <span className="spinner-border spinner-border-sm me-2 text-gold"></span>
                    Loading customer data from MySQL...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="stat-icon-wrapper rounded-circle" style={{ width: '40px', height: '40px' }}>
                          {(cust.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div className="fw-semibold text-dark fs-7">{cust.name || 'Anonymous Client'}</div>
                      </div>
                    </td>
                    <td className="fs-7 text-muted">{cust.email}</td>
                    <td className="fs-7 text-muted">{cust.phone || '+91 9876543210'}</td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1 fs-8 fw-semibold">
                        {cust.ordersCount || 0} Orders
                      </span>
                    </td>
                    <td className="fw-bold text-gold">₹{Number(cust.totalSpent || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge-status ${(cust.status || 'ACTIVE').toLowerCase()}`}>
                        {cust.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          onClick={() => setViewingCustomer(cust)}
                          className="btn btn-light btn-sm text-dark rounded-2 p-1.5"
                          title="View Profile"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleDeactivate(cust)}
                          className="btn btn-light btn-sm text-warning rounded-2 p-1.5"
                          title="Deactivate Account"
                        >
                          <ShieldOff size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cust)}
                          className="btn btn-light btn-sm text-danger rounded-2 p-1.5"
                          title="Delete Customer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW CUSTOMER MODAL */}
      {viewingCustomer && (
        <div className="delete-modal-overlay">
          <div className="bg-white rounded-4 shadow-2xl p-4 max-w-md w-100">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <h5 className="font-serif fw-bold text-dark mb-0">Customer Profile</h5>
              <button onClick={() => setViewingCustomer(null)} className="btn btn-link text-muted p-0">
                <X size={20} />
              </button>
            </div>
            <div className="text-center mb-4">
              <div className="stat-icon-wrapper rounded-circle mx-auto mb-2" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                {(viewingCustomer.name || 'C').charAt(0).toUpperCase()}
              </div>
              <h5 className="fw-bold text-dark mb-0">{viewingCustomer.name}</h5>
              <span className="badge bg-gold text-white fs-8 mt-1">VIP Client</span>
            </div>
            <div className="bg-light p-3 rounded-3 fs-7 mb-3">
              <div><span className="fw-semibold">Email:</span> {viewingCustomer.email}</div>
              <div><span className="fw-semibold">Phone:</span> {viewingCustomer.phone || '+91 9876543210'}</div>
              <div><span className="fw-semibold">Orders Placed:</span> {viewingCustomer.ordersCount || 0}</div>
              <div><span className="fw-semibold">Lifetime Spend:</span> ₹{Number(viewingCustomer.totalSpent || 0).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminCustomers
