import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  Layers,
  X,
  Upload
} from 'lucide-react'
import { adminApi } from '../services/adminApi'
import LuxuryToast from '../components/LuxuryToast'
import DeleteModal from '../components/DeleteModal'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Quick Price / Stock Edit Modal State
  const [quickEditProduct, setQuickEditProduct] = useState(null)
  const [quickStock, setQuickStock] = useState('')
  const [quickPrice, setQuickPrice] = useState('')

  // Toast Notifications State
  const [toasts, setToasts] = useState([])
  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rings',
    description: '',
    price: '',
    discount: '0',
    stock: '10',
    weight: '10g',
    metalType: 'Gold',
    goldPurity: '22K',
    diamondDetails: 'VS1 / G-H Color',
    stoneDetails: 'Natural Diamond',
    certificateNumber: '',
    sku: '',
    imageUrl: '',
    status: 'ACTIVE',
  })

  // Fetch Products & Categories from Backend REST API
  const fetchProducts = async () => {
    setLoading(true)
    localStorage.removeItem('alpha_jewels_admin_products')
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    
    try {
      const resProd = await adminApi.get('/api/admin/products', config)
      const prodList = Array.isArray(resProd.data) ? resProd.data : []
      setProducts(prodList)
    } catch (err) {
      console.error('Error fetching products from database:', err)
      addToast('Error fetching products from MySQL database', 'error')
      setProducts([])
    }

    try {
      const resCat = await adminApi.get('/api/admin/categories', config)
      const catList = Array.isArray(resCat.data) ? resCat.data : []
      setCategories(catList)
    } catch (err) {
      console.error('Error fetching categories from database:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle Add or Edit Form Open
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name || '',
        category: product.category || 'Rings',
        description: product.description || '',
        price: product.price || '',
        discount: product.discount || '0',
        stock: product.stock || '10',
        weight: product.weight || '10g',
        metalType: product.metalType || 'Gold',
        goldPurity: product.goldPurity || '22K',
        diamondDetails: product.diamondDetails || 'VS1 / G-H Color',
        stoneDetails: product.stoneDetails || 'Natural Diamond',
        certificateNumber: product.certificateNumber || '',
        sku: product.sku || '',
        imageUrl: product.imageUrl || '',
        status: product.status || 'ACTIVE',
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        category: categories[0]?.name || 'Rings',
        description: '',
        price: '',
        discount: '0',
        stock: '10',
        weight: '10g',
        metalType: 'Gold',
        goldPurity: '22K',
        diamondDetails: 'VS1 / G-H Color',
        stoneDetails: 'Natural Diamond',
        certificateNumber: 'CERT-' + Math.floor(100000 + Math.random() * 900000),
        sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
        imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
        status: 'ACTIVE',
      })
    }
    setIsModalOpen(true)
  }

  const cleanImageUrl = (url) => {
    if (!url) return ''
    const matches = url.match(/https?:\/\/[^\s"']+/g)
    return matches && matches.length > 0 ? matches[matches.length - 1] : url
  }

  // Handle Product Form Submit (Create / Update in MySQL)
  const handleSubmitProduct = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.stock) {
      addToast('Please fill all required fields (Name, Price, Stock)', 'error')
      return
    }

    setIsSaving(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    const cleanedData = { ...formData, imageUrl: cleanImageUrl(formData.imageUrl) }

    try {
      if (editingProduct) {
        await adminApi.put(`/api/admin/products/${editingProduct.id}`, cleanedData, config)
        addToast(`Jewellery "${formData.name}" updated successfully in MySQL!`, 'success')
      } else {
        await adminApi.post('/api/admin/products', cleanedData, config)
        addToast(`Jewellery "${formData.name}" created and saved in MySQL!`, 'success')
      }

      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      console.error('Save product error:', err)
      const detail = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save product in database.'
      addToast(typeof detail === 'string' ? detail : 'Failed to save product in database.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle Active/Disable status
  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.patch(`/api/admin/products/${product.id}/status`, { status: newStatus }, config)
      addToast(`Product status changed to ${newStatus}`, 'success')
      fetchProducts()
    } catch (err) {
      addToast('Error updating product status', 'error')
    }
  }

  // Quick Price / Stock Submit
  const handleSaveQuickEdit = async () => {
    if (!quickEditProduct) return
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await Promise.all([
        adminApi.patch(`/api/admin/products/${quickEditProduct.id}/stock`, { stock: Number(quickStock) }, config),
        adminApi.patch(`/api/admin/products/${quickEditProduct.id}/price`, { price: Number(quickPrice) }, config),
      ])
      addToast(`Stock and price updated for "${quickEditProduct.name}"`, 'success')
      setQuickEditProduct(null)
      fetchProducts()
    } catch (err) {
      addToast('Error updating stock/price', 'error')
    }
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.delete(`/api/admin/products/${deleteTarget.id}`, config)
      addToast(`Jewellery "${deleteTarget.name}" deleted successfully from database`, 'success')
      setDeleteTarget(null)
      fetchProducts()
    } catch (err) {
      console.error('Backend delete request failed:', err)
      addToast('Failed to delete product from database', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter products by search and dropdowns
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />
      <DeleteModal
        isOpen={!!deleteTarget}
        itemType="Jewellery Product"
        title={deleteTarget?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      {/* HEADER BAR */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif fw-bold text-dark mb-1">Jewellery Product Management</h2>
          <p className="text-muted fs-7 mb-0">Add, edit, manage inventory and pricing in MySQL</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-gold-luxury px-4 py-2 rounded-3 d-flex align-items-center gap-2">
          <Plus size={18} /> Add Jewellery
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="admin-card-luxury p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                placeholder="Search jewellery name, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control ps-5 rounded-3 bg-light border-0 fs-7"
              />
            </div>
          </div>
          <div className="col-6 col-md-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select rounded-3 bg-light border-0 fs-7"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select rounded-3 bg-light border-0 fs-7"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="admin-card-luxury p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Jewellery Item</th>
                <th>Category</th>
                <th>Price & Discount</th>
                <th>Stock</th>
                <th>Specs (Metal / Purity)</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <span className="spinner-border spinner-border-sm me-2 text-gold"></span>
                    Loading jewellery inventory from MySQL...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No jewellery products match your search query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={product.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80'}
                          alt={product.name}
                          className="rounded-3 border object-fit-cover"
                          style={{ width: '48px', height: '48px' }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80'
                          }}
                        />
                        <div>
                          <div className="fw-semibold text-dark fs-7">{product.name}</div>
                          <div className="text-muted fs-8">SKU: {product.sku || 'SKU-001'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark fw-medium fs-8 px-2.5 py-1 rounded-2 border">
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-gold fs-7">
                        ₹{Number(product.price || 0).toLocaleString('en-IN')}
                      </div>
                      {product.discount > 0 && <div className="text-success fs-8">{product.discount}% OFF</div>}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setQuickEditProduct(product)
                          setQuickStock(product.stock)
                          setQuickPrice(product.price)
                        }}
                        className={`btn btn-sm py-1 px-2 rounded-2 border-0 fw-semibold fs-8 ${
                          product.stock <= 5 ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'
                        }`}
                        title="Click to update stock"
                      >
                        {product.stock} in stock
                      </button>
                    </td>
                    <td>
                      <div className="fs-8 text-muted">{product.metalType || 'Gold'} ({product.goldPurity || '22K'})</div>
                      <div className="fs-8 text-muted">{product.weight || '10g'}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`badge-status border-0 bg-transparent ${(product.status || 'ACTIVE').toLowerCase()}`}
                      >
                        {product.status || 'ACTIVE'}
                      </button>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="btn btn-light btn-sm text-dark rounded-2 p-1.5"
                          title="Edit Jewellery"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="btn btn-light btn-sm text-danger rounded-2 p-1.5"
                          title="Delete Jewellery"
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

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="delete-modal-overlay">
          <div className="bg-white rounded-4 shadow-2xl p-4 max-w-md w-100 overflow-y-auto" style={{ maxWidth: '600px', maxHeight: '85vh' }}>
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <h5 className="font-serif fw-bold text-dark mb-0">
                {editingProduct ? 'Edit Jewellery Item' : 'Add New Jewellery Item'}
              </h5>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-link text-muted p-0">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct}>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label className="form-label fs-7 fw-semibold">Product Name *</label>
                  <input
                    type="text"
                    className="form-control fs-7"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fs-7 fw-semibold">Category *</label>
                  <select
                    className="form-select fs-7"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fs-7 fw-semibold">Description</label>
                  <textarea
                    className="form-control fs-7"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label fs-7 fw-semibold">Price (INR) *</label>
                  <input
                    type="number"
                    className="form-control fs-7"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label fs-7 fw-semibold">Discount (%)</label>
                  <input
                    type="number"
                    className="form-control fs-7"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label fs-7 fw-semibold">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-control fs-7"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label fs-7 fw-semibold">Metal Type</label>
                  <select
                    className="form-select fs-7"
                    value={formData.metalType}
                    onChange={(e) => setFormData({ ...formData, metalType: e.target.value })}
                  >
                    <option value="Gold">Gold</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Silver">Silver</option>
                  </select>
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label fs-7 fw-semibold">Gold Purity</label>
                  <input
                    type="text"
                    className="form-control fs-7"
                    value={formData.goldPurity}
                    onChange={(e) => setFormData({ ...formData, goldPurity: e.target.value })}
                  />
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label fs-7 fw-semibold">Gross Weight</label>
                  <input
                    type="text"
                    className="form-control fs-7"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fs-7 fw-semibold">Diamond Details</label>
                  <input
                    type="text"
                    className="form-control fs-7"
                    value={formData.diamondDetails}
                    onChange={(e) => setFormData({ ...formData, diamondDetails: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fs-7 fw-semibold">Certificate Number</label>
                  <input
                    type="text"
                    className="form-control fs-7"
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fs-7 fw-semibold">Image URL</label>
                  <input
                    type="url"
                    className="form-control fs-7"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-light px-4 py-2 rounded-3 fs-7">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="btn btn-gold-luxury px-4 py-2 rounded-3 fs-7">
                  {isSaving ? 'Saving to Database...' : 'Save Jewellery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PRICE & STOCK EDIT MODAL */}
      {quickEditProduct && (
        <div className="delete-modal-overlay">
          <div className="bg-white rounded-4 shadow-lg p-4 max-w-sm w-100">
            <h5 className="fw-bold text-dark mb-3">Update Inventory</h5>
            <p className="fs-7 text-muted mb-3">{quickEditProduct.name}</p>
            <div className="mb-3">
              <label className="form-label fs-7 fw-semibold">Stock Quantity</label>
              <input
                type="number"
                className="form-control fs-7"
                value={quickStock}
                onChange={(e) => setQuickStock(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fs-7 fw-semibold">Price (INR)</label>
              <input
                type="number"
                className="form-control fs-7"
                value={quickPrice}
                onChange={(e) => setQuickPrice(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button onClick={() => setQuickEditProduct(null)} className="btn btn-light btn-sm px-3">
                Cancel
              </button>
              <button onClick={handleSaveQuickEdit} className="btn btn-gold-luxury btn-sm px-3">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProducts
