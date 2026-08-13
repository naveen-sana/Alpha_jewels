import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { UserCheck, Shield, Key, Edit2, Trash2, Search, X, CheckCircle, Power } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import LuxuryToast from '../components/LuxuryToast'
import DeleteModal from '../components/DeleteModal'

import { getToken } from '../../utils/storage'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [resetTarget, setResetTarget] = useState(null)
  const [newPasswordInput, setNewPasswordInput] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [toasts, setToasts] = useState([])
  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const fetchUsers = async () => {
    setLoading(true)
    const token = getToken()
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    try {
      const response = await adminApi.get('/api/admin/users', config)
      const userList = response.data || []
      setUsers(Array.isArray(userList) ? userList : [])
    } catch (err) {
      console.error(err)
      addToast('Error fetching user accounts from database', 'error')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.put(`/api/admin/users/${userId}/role`, { role: newRole }, config)
      addToast(`Role updated to ${newRole}`, 'success')
      fetchUsers()
    } catch (err) {
      addToast('Failed to assign user role', 'error')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!resetTarget || !newPasswordInput) return
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.put(`/api/admin/users/${resetTarget.id}/reset-password`, { newPassword: newPasswordInput }, config)
      addToast(`Password reset successfully for ${resetTarget.name}`, 'success')
      setResetTarget(null)
      setNewPasswordInput('')
    } catch (err) {
      addToast('Error resetting user password', 'error')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.delete(`/api/admin/users/${deleteTarget.id}`, config)
      addToast(`User account "${deleteTarget.name || deleteTarget.email}" deleted successfully from database`, 'success')
      setDeleteTarget(null)
      fetchUsers()
    } catch (err) {
      console.error('Backend delete request failed:', err)
      const detail = err.response?.data?.message || err.response?.data?.error || err.message || 'Error deleting user from database'
      addToast(typeof detail === 'string' ? detail : 'Error deleting user from database', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />
      <DeleteModal
        isOpen={!!deleteTarget}
        itemType="User Account"
        title={deleteTarget?.name || deleteTarget?.email}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif fw-bold text-dark mb-1">User & Role Management</h2>
          <p className="text-muted fs-7 mb-0">Assign Roles: Customer, Admin, Super Admin, Manager. Reset Passwords & Enable/Disable</p>
        </div>
      </div>

      <div className="admin-card-luxury p-3 mb-4">
        <div className="position-relative" style={{ maxWidth: '400px' }}>
          <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <input
            type="text"
            placeholder="Search users..."
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
                <th>User</th>
                <th>Email</th>
                <th>Role Assignment</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <span className="spinner-border spinner-border-sm me-2 text-gold"></span>
                    Loading user roles from MySQL...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((usr) => (
                  <tr key={usr.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="stat-icon-wrapper rounded-circle" style={{ width: '38px', height: '38px' }}>
                          {(usr.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="fw-semibold text-dark fs-7">{usr.name || 'User'}</div>
                      </div>
                    </td>
                    <td className="fs-7 text-muted">{usr.email}</td>
                    <td>
                      <select
                        value={usr.role || 'CUSTOMER'}
                        onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                        className="form-select form-select-sm fs-8 border-0 fw-semibold bg-light"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="MANAGER">Manager</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge-status ${(usr.status || 'ACTIVE').toLowerCase()}`}>
                        {usr.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          onClick={() => setResetTarget(usr)}
                          className="btn btn-light btn-sm text-dark rounded-2 p-1.5"
                          title="Reset Password"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(usr)}
                          className="btn btn-light btn-sm text-danger rounded-2 p-1.5"
                          title="Delete User"
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

      {/* RESET PASSWORD MODAL */}
      {resetTarget && (
        <div className="delete-modal-overlay">
          <div className="bg-white rounded-4 shadow-2xl p-4 max-w-sm w-100">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <h5 className="fw-bold text-dark mb-0">Reset Password</h5>
              <button onClick={() => setResetTarget(null)} className="btn btn-link text-muted p-0">
                <X size={20} />
              </button>
            </div>
            <p className="fs-7 text-muted mb-3">Target user: {resetTarget.email}</p>
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">New Password</label>
                <input
                  type="password"
                  className="form-control fs-7"
                  placeholder="Enter new password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setResetTarget(null)} className="btn btn-light btn-sm px-3">
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold-luxury btn-sm px-3">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminUsers
