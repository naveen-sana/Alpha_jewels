import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { ShoppingBag, Eye, Trash2, CheckCircle2, Clock, Truck, Package, XCircle, Search, X } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import LuxuryToast from '../components/LuxuryToast'
import DeleteModal from '../components/DeleteModal'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  const [viewingOrder, setViewingOrder] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [toasts, setToasts] = useState([])
  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const fetchOrders = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      const response = await adminApi.get('/api/admin/orders', config)
      const data = response.data || []
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      addToast('Error fetching orders from database', 'error')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.put(`/api/admin/orders/${orderId}/status`, { status: newStatus }, config)
      addToast(`Order ${orderId} status updated to ${newStatus}`, 'success')
      fetchOrders()
    } catch (err) {
      addToast('Failed to update order status', 'error')
    }
  }

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    try {
      await adminApi.put(
        `/api/admin/orders/${orderId}/payment`,
        { paymentStatus: newPaymentStatus },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      )
      addToast(`Payment status updated to ${newPaymentStatus}`, 'success')
      fetchOrders()
    } catch (err) {
      addToast('Failed to update payment status', 'error')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    const targetId = deleteTarget.orderId || deleteTarget.id
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      await adminApi.delete(`/api/admin/orders/${targetId}`, config)
      addToast(`Order ${targetId} deleted successfully from database`, 'success')
      setDeleteTarget(null)
      fetchOrders()
    } catch (err) {
      console.error('Backend delete request failed:', err)
      addToast('Error deleting order from database', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'ALL' || ord.orderStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />
      <DeleteModal
        isOpen={!!deleteTarget}
        itemType="Customer Order"
        title={deleteTarget?.orderId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif fw-bold text-dark mb-1">Customer Order Management</h2>
          <p className="text-muted fs-7 mb-0">Track order lifecycle: Pending, Confirmed, Packed, Shipped, Delivered, Cancelled</p>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="admin-card-luxury p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control ps-5 rounded-3 bg-light border-0 fs-7"
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select rounded-3 bg-light border-0 fs-7"
            >
              <option value="ALL">All Order Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="admin-card-luxury p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items Qty</th>
                <th>Order Date</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Total Amount</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    <span className="spinner-border spinner-border-sm me-2 text-gold"></span>
                    Fetching live orders from MySQL...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    No customer orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="fw-bold text-dark">{order.orderId}</td>
                    <td>
                      <div className="fw-semibold text-dark fs-7">{order.customerName || 'Customer'}</div>
                      <div className="text-muted fs-8">{order.customerEmail || 'client@gmail.com'}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border fw-medium px-2 py-1 fs-8">
                        {order.itemCount || order.items?.length || 1} Items
                      </span>
                    </td>
                    <td className="fs-8 text-muted">{new Date(order.orderDate || Date.now()).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span className="fs-8 fw-medium text-dark">{order.paymentMethod || 'Credit Card'}</span>
                    </td>
                    <td>
                      <select
                        value={order.paymentStatus || 'Paid'}
                        onChange={(e) => handleUpdatePaymentStatus(order.orderId, e.target.value)}
                        className="form-select form-select-sm fs-8 border-0 fw-semibold bg-light"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus || 'Pending'}
                        onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                        className={`form-select form-select-sm fs-8 border-0 fw-bold ${(order.orderStatus || 'Pending').toLowerCase()}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="fw-bold text-gold">₹{Number(order.grandTotal || 0).toLocaleString('en-IN')}</td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="btn btn-light btn-sm text-dark rounded-2 p-1.5"
                          title="View Order Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(order)}
                          className="btn btn-light btn-sm text-danger rounded-2 p-1.5"
                          title="Delete Order"
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

      {/* VIEW ORDER DETAIL MODAL */}
      {viewingOrder && (
        <div className="delete-modal-overlay">
          <div className="bg-white rounded-4 shadow-2xl p-4 max-w-xl w-100 overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <div>
                <h5 className="font-serif fw-bold text-dark mb-0">Order Details ({viewingOrder.orderId})</h5>
                <span className="fs-8 text-muted">Placed on {new Date(viewingOrder.orderDate || Date.now()).toLocaleString('en-IN')}</span>
              </div>
              <button onClick={() => setViewingOrder(null)} className="btn btn-link text-muted p-0">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold text-dark fs-7 mb-2">Customer & Shipping Information</h6>
              <div className="bg-light p-3 rounded-3 fs-7">
                <div><span className="fw-semibold">Name:</span> {viewingOrder.customerName || 'Customer'}</div>
                <div><span className="fw-semibold">Email:</span> {viewingOrder.customerEmail || 'client@gmail.com'}</div>
                <div><span className="fw-semibold">Shipping Address:</span> {viewingOrder.shippingAddress || '123 MG Road, Brigade Towers, Bangalore, Karnataka - 560001'}</div>
              </div>
            </div>

            <h6 className="fw-bold text-dark fs-7 mb-2">Order Items Breakdown</h6>
            <div className="table-responsive mb-4">
              <table className="table align-middle fs-7 mb-0 border">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-semibold">{item.name || 'Jewellery Item'}</td>
                      <td>{item.quantity || 1}</td>
                      <td>₹{Number(item.price || 0).toLocaleString('en-IN')}</td>
                      <td className="fw-bold text-gold">₹{Number(item.subtotal || item.price || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
              <div className="fs-7"><span className="fw-semibold">Payment:</span> {viewingOrder.paymentMethod} ({viewingOrder.paymentStatus})</div>
              <div className="fs-5 fw-bold text-gold">Grand Total: ₹{Number(viewingOrder.grandTotal || 0).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminOrders
