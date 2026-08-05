import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import {
  Package,
  FolderTree,
  Users,
  UserCheck,
  ShoppingBag,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Eye,
  ArrowUpRight
} from 'lucide-react'
import { adminApi } from '../services/adminApi'
import LuxuryToast from '../components/LuxuryToast'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const fetchDashboardStats = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    try {
      const response = await adminApi.get('/api/admin/dashboard/stats', config)
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error)
      setStats({
        totalProducts: 0,
        totalCategories: 0,
        totalCustomers: 0,
        totalUsers: 0,
        pendingOrders: 0,
        completedOrders: 0,
        todayRevenue: 0,
        monthlyRevenue: 0,
        yearlyRevenue: 0,
        overallRevenue: 0,
        revenueLineChart: [],
        categoryPieChart: [],
        topSellingJewellery: [],
        latestOrders: [],
        lowStockProducts: [],
        recentCustomers: [],
      })
      addToast('Error fetching database statistics', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif fw-bold text-dark mb-1">Luxury Jewellery Dashboard</h2>
          <p className="text-muted fs-7 mb-0">Live real-time administrative metrics connected to MySQL</p>
        </div>
        <button
          onClick={fetchDashboardStats}
          disabled={loading}
          className="btn btn-outline-dark rounded-3 px-3 py-2 d-flex align-items-center gap-2 fs-7 fw-medium"
        >
          <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
          Refresh Stats
        </button>
      </div>

      {/* STAT CARDS GRID */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card-gold p-3 rounded-4 bg-white border shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fs-7 fw-semibold text-muted">Total Products</span>
              <div className="stat-icon-wrapper p-2 rounded-circle bg-warning bg-opacity-10 text-gold">
                <Package size={22} />
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-0">{stats?.totalProducts || 0}</h3>
            <span className="fs-8 text-success fw-medium">Active Catalogue</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card-gold p-3 rounded-4 bg-white border shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fs-7 fw-semibold text-muted">Total Categories</span>
              <div className="stat-icon-wrapper p-2 rounded-circle bg-info bg-opacity-10 text-info">
                <FolderTree size={22} />
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-0">{stats?.totalCategories || 0}</h3>
            <span className="fs-8 text-muted fw-medium">Jewellery Collections</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card-gold p-3 rounded-4 bg-white border shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fs-7 fw-semibold text-muted">Total Customers</span>
              <div className="stat-icon-wrapper p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                <UserCheck size={22} />
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-0">{stats?.totalCustomers || 0}</h3>
            <span className="fs-8 text-primary fw-medium">Registered Members</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card-gold p-3 rounded-4 bg-white border shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fs-7 fw-semibold text-muted">Monthly Revenue</span>
              <div className="stat-icon-wrapper p-2 rounded-circle bg-success bg-opacity-10 text-success">
                <DollarSign size={22} />
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-0">₹{(stats?.monthlyRevenue || 0).toLocaleString()}</h3>
            <span className="fs-8 text-success fw-medium">Gross Revenue</span>
          </div>
        </div>
      </div>

      {/* QUICK LINKS & MANAGERS */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-dark mb-0 font-serif">Quick Management Access</h5>
              <span className="fs-8 text-gold fw-semibold">Administrative Controls</span>
            </div>
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <Link to="/admin/products" className="text-decoration-none">
                  <div className="p-3 rounded-3 bg-light text-center hover-card-scale border">
                    <Package size={28} className="text-gold mb-2" />
                    <h6 className="fw-bold text-dark fs-7 mb-0">Products</h6>
                  </div>
                </Link>
              </div>
              <div className="col-6 col-md-3">
                <Link to="/admin/categories" className="text-decoration-none">
                  <div className="p-3 rounded-3 bg-light text-center hover-card-scale border">
                    <FolderTree size={28} className="text-info mb-2" />
                    <h6 className="fw-bold text-dark fs-7 mb-0">Categories</h6>
                  </div>
                </Link>
              </div>
              <div className="col-6 col-md-3">
                <Link to="/admin/orders" className="text-decoration-none">
                  <div className="p-3 rounded-3 bg-light text-center hover-card-scale border">
                    <ShoppingBag size={28} className="text-primary mb-2" />
                    <h6 className="fw-bold text-dark fs-7 mb-0">Orders</h6>
                  </div>
                </Link>
              </div>
              <div className="col-6 col-md-3">
                <Link to="/admin/customers" className="text-decoration-none">
                  <div className="p-3 rounded-3 bg-light text-center hover-card-scale border">
                    <Users size={28} className="text-success mb-2" />
                    <h6 className="fw-bold text-dark fs-7 mb-0">Customers</h6>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3 font-serif">Financial Overview</h5>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span className="fs-7 text-muted">Today's Sales</span>
              <strong className="text-success">₹{(stats?.todayRevenue || 0).toLocaleString()}</strong>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span className="fs-7 text-muted">Yearly Revenue</span>
              <strong className="text-dark">₹{(stats?.yearlyRevenue || 0).toLocaleString()}</strong>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2">
              <span className="fs-7 text-muted">Overall Lifetime</span>
              <strong className="text-gold">₹{(stats?.overallRevenue || 0).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
