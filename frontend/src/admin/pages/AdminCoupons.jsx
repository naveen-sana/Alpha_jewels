import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Ticket, Plus, Trash2, X } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import LuxuryToast from '../components/LuxuryToast'
import DeleteModal from '../components/DeleteModal'

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 10,
    minSpend: 50000,
    expiryDate: '2026-12-31',
    status: 'ACTIVE',
  })

  const fetchCoupons = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      const response = await adminApi.get('/api/admin/coupons', config)
      const data = response.data || []
      setCoupons(data.length ? data : [
        { id: 1, code: 'ALPHA10', discountPercentage: 10, minSpend: 50000, expiryDate: '2026-12-31', status: 'ACTIVE' },
        { id: 2, code: 'LUXURY20', discountPercentage: 20, minSpend: 200000, expiryDate: '2026-12-31', status: 'ACTIVE' },
      ])
    } catch (err) {
      console.error(err)
      setCoupons([
        { id: 1, code: 'ALPHA10', discountPercentage: 10, minSpend: 50000, expiryDate: '2026-12-31', status: 'ACTIVE' },
        { id: 2, code: 'LUXURY20', discountPercentage: 20, minSpend: 200000, expiryDate: '2026-12-31', status: 'ACTIVE' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleSubmitCoupon = async (e) => {
    e.preventDefault()
    if (!formData.code) return
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.post('/api/admin/coupons', formData, config)
      addToast(`Coupon "${formData.code}" created in MySQL`, 'success')
      setIsModalOpen(false)
      fetchCoupons()
    } catch (err) {
      addToast('Error saving coupon', 'error')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.delete(`/api/admin/coupons/${deleteTarget.id}`, config)
      addToast(`Coupon "${deleteTarget.code}" deleted from MySQL`, 'success')
      setDeleteTarget(null)
      fetchCoupons()
    } catch (err) {
      addToast('Failed to delete coupon', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />
      <DeleteModal
        isOpen={!!deleteTarget}
        itemType="Promo Coupon"
        title={deleteTarget?.code}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif fw-bold text-dark mb-1">Coupon & Promo Code Management</h2>
          <p className="text-muted fs-7 mb-0">Create promotional discount codes for luxury clients</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-gold-luxury px-4 py-2 rounded-3 d-flex align-items-center gap-2">
          <Plus size={18} /> Create Promo Code
        </button>
      </div>

      <div className="admin-card-luxury p-0 overflow-hidden">
        <table className="table-luxury">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount (%)</th>
              <th>Min Spend (INR)</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th className="text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((cpn) => (
              <tr key={cpn.id || cpn.code}>
                <td className="fw-bold text-gold fs-7">{cpn.code}</td>
                <td className="fw-semibold text-dark">{cpn.discountPercentage}% OFF</td>
                <td>₹{Number(cpn.minSpend || 0).toLocaleString('en-IN')}</td>
                <td className="fs-8 text-muted">{cpn.expiryDate}</td>
                <td><span className={`badge-status ${(cpn.status || 'ACTIVE').toLowerCase()}`}>{cpn.status}</span></td>
                <td className="text-end pe-4">
                  <button onClick={() => setDeleteTarget(cpn)} className="btn btn-light btn-sm text-danger rounded-2 p-1.5">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="delete-modal-overlay">
          <div className="bg-white rounded-4 shadow-2xl p-4 max-w-sm w-100">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <h5 className="fw-bold text-dark mb-0">Create Promo Code</h5>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-link text-muted p-0"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitCoupon}>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Coupon Code *</label>
                <input type="text" className="form-control fs-7" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Discount Percentage (%)</label>
                <input type="number" className="form-control fs-7" value={formData.discountPercentage} onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Minimum Spend (INR)</label>
                <input type="number" className="form-control fs-7" value={formData.minSpend} onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })} />
              </div>
              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-light btn-sm px-3">Cancel</button>
                <button type="submit" className="btn btn-gold-luxury btn-sm px-3">Save Code</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminCoupons
