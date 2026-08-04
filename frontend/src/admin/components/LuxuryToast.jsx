import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const LuxuryToast = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="luxury-toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`luxury-toast ${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={20} className="text-success" />}
          {toast.type === 'error' && <AlertCircle size={20} className="text-danger" />}
          {(toast.type === 'info' || !toast.type) && <Info size={20} className="text-gold" />}
          <span className="flex-grow-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="btn btn-link text-white p-0 opacity-75 hover-opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default LuxuryToast
