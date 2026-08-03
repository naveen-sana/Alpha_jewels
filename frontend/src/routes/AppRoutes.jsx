import { Routes, Route } from 'react-router-dom'
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
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

      {/* Protected Order History Routes - Accessible ONLY After Login */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Orders"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-history"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Order-History"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orderhistory"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/OrderHistory"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MyOrders"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
