import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, Heart, ShoppingBag, X, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'cart') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Global Luxury Toast Popup Container */}
      <div 
        className="toast-container position-fixed top-0 end-0 p-3 z-index-modal d-flex flex-column gap-2"
        style={{ zIndex: 99999, maxWidth: '400px', width: '90%' }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-popup-card card border-gold rounded-3 p-3 text-white shadow-2xl animate-slide-left d-flex align-items-center justify-content-between gap-3"
            style={{
              background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
              borderColor: '#d4af37',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.25)',
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center p-2 flex-shrink-0"
                style={{
                  backgroundColor: toast.type === 'wishlist' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                  border: `1px solid ${toast.type === 'wishlist' ? '#ef4444' : '#d4af37'}`,
                }}
              >
                {toast.type === 'wishlist' ? (
                  <Heart size={20} className="text-danger fill-danger" />
                ) : toast.type === 'error' ? (
                  <AlertCircle size={20} className="text-warning" />
                ) : (
                  <ShoppingBag size={20} className="text-gold" />
                )}
              </div>
              <div>
                <h6 className="mb-0 fw-bold font-serif text-gold" style={{ fontSize: '0.95rem' }}>
                  {toast.type === 'wishlist' ? 'Wishlist Updated' : toast.type === 'error' ? 'Notice' : 'Shopping Basket'}
                </h6>
                <p className="mb-0 text-white-50 small" style={{ fontSize: '0.85rem' }}>
                  {toast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn btn-link text-white-50 p-0 border-0 hover-gold"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
