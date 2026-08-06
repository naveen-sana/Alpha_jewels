import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Plus, Edit2, Trash2, FolderTree, X, CheckCircle, Package } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import LuxuryToast from '../components/LuxuryToast'
import DeleteModal from '../components/DeleteModal'

function getFallbackCategoryImg(name = '') {
  const n = String(name).toLowerCase();
  if (n.includes('diamond')) return 'https://cdn.shopify.com/s/files/1/0676/7473/4661/files/Why_diamonds_are_popular.jpg?v=1774099242';
  if (n.includes('gold')) return 'https://shop.swarna.com/wp-content/uploads/2026/02/NEC17448_1.jpg';
  if (n.includes('platinum')) return 'https://img.magnific.com/free-photo/shiny-gemstone-ring-platinum-luxury-elegance-captured-generated-by-ai_188544-9991.jpg?semt=ais_test_b&w=740&q=80';
  if (n.includes('silver')) return 'https://s3.amazonaws.com/assets.jewelxy.com/wp-content/uploads/2026/06/21095640/ngevzhDQGn_20230302163648.jpg';
  if (n.includes('necklace')) return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
  return 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80';
}

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [toasts, setToasts] = useState([])
  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    status: 'ACTIVE',
  })

  const fetchCategories = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      const response = await adminApi.get('/api/admin/categories', config)
      const data = response.data || []
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      addToast('Error fetching categories from database', 'error')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat)
      setFormData({
        name: cat.name || '',
        description: cat.description || '',
        imageUrl: cat.imageUrl || getFallbackCategoryImg(cat.name),
        status: cat.status || 'ACTIVE',
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        imageUrl: 'https://cdn.shopify.com/s/files/1/0676/7473/4661/files/Why_diamonds_are_popular.jpg?v=1774099242',
        status: 'ACTIVE',
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      addToast('Category name is required', 'error')
      return
    }

    setIsSaving(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }

    try {
      if (editingCategory) {
        await adminApi.put(`/api/admin/categories/${editingCategory.id}`, formData, config)
        addToast(`Category "${formData.name}" updated in MySQL`, 'success')
      } else {
        await adminApi.post('/api/admin/categories', formData, config)
        addToast(`Category "${formData.name}" created in MySQL`, 'success')
      }
      setIsModalOpen(false)
      fetchCategories()
    } catch (err) {
      addToast('Error saving category to database', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.delete(`/api/admin/categories/${deleteTarget.id}`, config)
      addToast(`Category "${deleteTarget.name}" deleted successfully`, 'success')
      setDeleteTarget(null)
      fetchCategories()
    } catch (err) {
      console.error('Backend delete request failed:', err)
      const errorMsg = err.response?.data?.message || err.response?.data || 'Error deleting category from database'
      addToast(typeof errorMsg === 'string' ? errorMsg : 'Error deleting category from database', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />
      <DeleteModal
        isOpen={!!deleteTarget}
        itemType="Category"
        title={deleteTarget?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif fw-bold text-dark mb-1">Jewellery Category Management</h2>
          <p className="text-muted fs-7 mb-0">Diamond, Gold, Platinum, Silver, Necklaces & Luxury Collections</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-gold-luxury px-4 py-2 rounded-3 d-flex align-items-center gap-2">
          <Plus size={18} /> Create Category
        </button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5 text-muted">
            <span className="spinner-border spinner-border-sm me-2 text-gold"></span>
            Loading categories from database...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            No categories available in the database.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id || cat.name} className="col-12 col-sm-6 col-lg-4">
              <div className="admin-card-luxury p-0 overflow-hidden h-100 d-flex flex-column justify-content-between border rounded-4 bg-white shadow-sm hover-shadow-md transition-all">
                <div>
                  {/* Category Image Header */}
                  <div className="position-relative w-100" style={{ height: '160px', backgroundColor: '#f8f5f0' }}>
                    <img
                      src={cat.imageUrl || getFallbackCategoryImg(cat.name)}
                      alt={cat.name}
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = getFallbackCategoryImg(cat.name)
                      }}
                    />
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100" 
                      style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65))' }}
                    />
                    <div className="position-absolute" style={{ top: '12px', right: '12px' }}>
                      <span className={`badge-status ${(cat.status || 'ACTIVE').toLowerCase()} shadow-sm`}>
                        {cat.status || 'ACTIVE'}
                      </span>
                    </div>
                    <div className="position-absolute" style={{ bottom: '12px', left: '16px' }}>
                      <h4 className="fw-bold font-serif mb-0 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', letterSpacing: '0.03em' }}>
                        {cat.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-muted fs-7 mb-2 line-clamp-2" style={{ minHeight: '38px' }}>
                      {cat.description || 'Luxury jewellery collection'}
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 border-top bg-light">
                  <span className="fs-7 fw-bold text-gold">
                    <Package size={16} className="me-1.5" />
                    {cat.productCount || 0} Items
                  </span>
                  <div className="d-flex gap-2">
                    <button onClick={() => handleOpenModal(cat)} className="btn btn-light btn-sm rounded-2 p-1.5 shadow-sm border" title="Edit Category">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteTarget(cat)} className="btn btn-light btn-sm text-danger rounded-2 p-1.5 shadow-sm border" title="Delete Category">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="delete-modal-overlay">
          <div className="bg-white rounded-4 shadow-2xl p-4 max-w-md w-100">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <h5 className="font-serif fw-bold text-dark mb-0">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h5>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-link text-muted p-0">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Category Name *</label>
                <input
                  type="text"
                  className="form-control fs-7"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Description</label>
                <textarea
                  className="form-control fs-7"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Category Image URL</label>
                <input
                  type="url"
                  className="form-control fs-7"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-light px-4 py-2 rounded-3 fs-7">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="btn btn-gold-luxury px-4 py-2 rounded-3 fs-7">
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminCategories
