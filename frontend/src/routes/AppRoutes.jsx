import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import Home from '../pages/Home'
import Register from '../pages/Register'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import ChangePassword from '../pages/ChangePassword'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import NotFound from '../pages/NotFound'
import VerifyOtp from "../pages/VerifyOtp"
import Shop from '../pages/Shop'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import OrderHistory from '../pages/OrderHistory'

// Admin Module Imports
import AdminLogin from '../admin/pages/AdminLogin'
import AdminDashboard from '../admin/pages/AdminDashboard'
import AdminProducts from '../admin/pages/AdminProducts'
import AdminCategories from '../admin/pages/AdminCategories'
import AdminOrders from '../admin/pages/AdminOrders'
import AdminCustomers from '../admin/pages/AdminCustomers'
import AdminUsers from '../admin/pages/AdminUsers'
import AdminAnalytics from '../admin/pages/AdminAnalytics'
import AdminReports from '../admin/pages/AdminReports'
import AdminReviews from '../admin/pages/AdminReviews'
import AdminCoupons from '../admin/pages/AdminCoupons'
import AdminSettings from '../admin/pages/AdminSettings'
import AdminProtectedRoute from '../admin/components/AdminProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Store Front Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Home/" element={<Home />} />
      <Route path="/HOME" element={<Home />} />
      <Route path="/HOME/" element={<Home />} />
      <Route path="/index" element={<Home />} />
      <Route path="/index.html" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/UserCartPage" element={<Cart />} />

      {/* Protected Checkout */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      {/* Protected Customer Order History Routes */}
      <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/Orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/Order-History" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/orderhistory" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/OrderHistory" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/MyOrders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

      {/* ========================================== */}
      {/* LUXURY ADMIN PORTAL ROUTES                 */}
      {/* ========================================== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/login/" element={<AdminLogin />} />
      <Route path="/admin/Login" element={<AdminLogin />} />
      <Route path="/admin/Login/" element={<AdminLogin />} />
      <Route path="/Admin/login" element={<AdminLogin />} />
      <Route path="/Admin/login/" element={<AdminLogin />} />
      <Route path="/Admin/Login" element={<AdminLogin />} />
      <Route path="/Admin/Login/" element={<AdminLogin />} />
      <Route path="/ADMIN/LOGIN" element={<AdminLogin />} />
      <Route path="/ADMIN/LOGIN/" element={<AdminLogin />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/adminlogin/" element={<AdminLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-login/" element={<AdminLogin />} />
      <Route path="/admin/signin" element={<AdminLogin />} />
      <Route path="/admin/signin/" element={<AdminLogin />} />
      <Route path="/admin/auth" element={<AdminLogin />} />
      <Route path="/admin/auth/" element={<AdminLogin />} />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/Admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/Admin/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/ADMIN" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/ADMIN/" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/admin/dashboard/" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/Admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/Admin/dashboard/" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/admin/Dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/Admin/Dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

      <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
      <Route path="/admin/products/" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
      <Route path="/Admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
      <Route path="/admin/Products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
      <Route path="/Admin/Products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />

      <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
      <Route path="/admin/categories/" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
      <Route path="/Admin/categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
      <Route path="/admin/Categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />

      <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
      <Route path="/admin/orders/" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
      <Route path="/Admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
      <Route path="/admin/Orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />

      <Route path="/admin/customers" element={<AdminProtectedRoute><AdminCustomers /></AdminProtectedRoute>} />
      <Route path="/admin/customers/" element={<AdminProtectedRoute><AdminCustomers /></AdminProtectedRoute>} />
      <Route path="/Admin/customers" element={<AdminProtectedRoute><AdminCustomers /></AdminProtectedRoute>} />
      <Route path="/admin/Customers" element={<AdminProtectedRoute><AdminCustomers /></AdminProtectedRoute>} />

      <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
      <Route path="/admin/users/" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
      <Route path="/Admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
      <Route path="/admin/Users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />

      <Route path="/admin/analytics" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />
      <Route path="/admin/analytics/" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />
      <Route path="/Admin/analytics" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />
      <Route path="/admin/Analytics" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />

      <Route path="/admin/reports" element={<AdminProtectedRoute><AdminReports /></AdminProtectedRoute>} />
      <Route path="/admin/reports/" element={<AdminProtectedRoute><AdminReports /></AdminProtectedRoute>} />
      <Route path="/Admin/reports" element={<AdminProtectedRoute><AdminReports /></AdminProtectedRoute>} />
      <Route path="/admin/Reports" element={<AdminProtectedRoute><AdminReports /></AdminProtectedRoute>} />

      <Route path="/admin/reviews" element={<AdminProtectedRoute><AdminReviews /></AdminProtectedRoute>} />
      <Route path="/admin/reviews/" element={<AdminProtectedRoute><AdminReviews /></AdminProtectedRoute>} />
      <Route path="/Admin/reviews" element={<AdminProtectedRoute><AdminReviews /></AdminProtectedRoute>} />
      <Route path="/admin/Reviews" element={<AdminProtectedRoute><AdminReviews /></AdminProtectedRoute>} />

      <Route path="/admin/coupons" element={<AdminProtectedRoute><AdminCoupons /></AdminProtectedRoute>} />
      <Route path="/admin/coupons/" element={<AdminProtectedRoute><AdminCoupons /></AdminProtectedRoute>} />
      <Route path="/Admin/coupons" element={<AdminProtectedRoute><AdminCoupons /></AdminProtectedRoute>} />
      <Route path="/admin/Coupons" element={<AdminProtectedRoute><AdminCoupons /></AdminProtectedRoute>} />

      <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
      <Route path="/admin/settings/" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
      <Route path="/Admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
      <Route path="/admin/Settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />

      {/* Admin Catch-All Wildcard */}
      <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/Admin/*" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
