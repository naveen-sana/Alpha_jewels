import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Star, Trash2 } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import LuxuryToast from '../components/LuxuryToast'
import DeleteModal from '../components/DeleteModal'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const fetchReviews = async () => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      const response = await adminApi.get('/api/admin/reviews', config)
      const data = response.data || []
      setReviews(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      addToast('Error fetching product reviews from database', 'error')
      setReviews([])
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.delete(`/api/admin/reviews/${deleteTarget.id}`, config)
      addToast(`Review deleted successfully from database`, 'success')
      setDeleteTarget(null)
      fetchReviews()
    } catch (err) {
      console.error('Backend delete request failed:', err)
      addToast('Error deleting review from database', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />
      <DeleteModal
        isOpen={!!deleteTarget}
        itemType="Product Review"
        title={`Review by ${deleteTarget?.customerName}`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      <div className="mb-4">
        <h2 className="font-serif fw-bold text-dark mb-1">Customer Reviews & Ratings</h2>
        <p className="text-muted fs-7 mb-0">Moderate and manage customer feedback for jewellery products</p>
      </div>

      <div className="admin-card-luxury p-0 overflow-hidden">
        <table className="table-luxury">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rev) => (
              <tr key={rev.id}>
                <td className="fw-semibold text-dark fs-7">{rev.customerName}</td>
                <td>
                  <div className="d-flex align-items-center gap-1 text-gold">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="#D4AF37" />
                    ))}
                  </div>
                </td>
                <td className="fs-7 text-muted max-w-xs">{rev.comment}</td>
                <td className="fs-8 text-muted">{rev.date}</td>
                <td><span className="badge-status active">{rev.status || 'APPROVED'}</span></td>
                <td className="text-end pe-4">
                  <button onClick={() => setDeleteTarget(rev)} className="btn btn-light btn-sm text-danger rounded-2 p-1.5">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

export default AdminReviews
