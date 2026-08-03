import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle, Trash2, AlertTriangle, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

const DEFAULT_SEED_ORDERS = [
  {
    orderId: 'SA-A80F0F41-E6C',
    placedOn: '3 August 2026 at 04:20 pm',
    status: 'SUCCESS',
    grandTotal: 9943.00,
    itemCount: 4,
    items: [
      {
        id: 'seed-1',
        name: 'Nothing CF',
        category: 'ADAPTERS',
        specs: '33W',
        price: 2200.00,
        quantity: 1,
        subtotal: 2200.00,
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500'
      },
      {
        id: 'seed-2',
        name: 'Samsung Fast Charge',
        category: 'ADAPTERS',
        specs: '66W',
        price: 3500.00,
        quantity: 1,
        subtotal: 3500.00,
        imageUrl: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500'
      },
      {
        id: 'seed-3',
        name: 'Portronics',
        category: 'ADAPTERS',
        specs: '45W',
        price: 1900.00,
        quantity: 1,
        subtotal: 1900.00,
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500'
      },
      {
        id: 'seed-4',
        name: 'Portronics',
        category: 'USB-C CABLES',
        specs: 'Konnect L POR-1403 Fast Charging 3A Type-C Cable 1.2 Meter with Charge & Sync Function for All Type-C Devices (White)',
        price: 145.00,
        quantity: 1,
        subtotal: 145.00,
        imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500'
      }
    ]
  },
  {
    orderId: 'ORD-948271-AJ',
    placedOn: '1 August 2026 at 11:15 am',
    status: 'SUCCESS',
    grandTotal: 145000.00,
    itemCount: 1,
    items: [
      {
        id: 'seed-5',
        name: 'Royal Heritage Solitaire Necklace',
        category: 'DIAMOND',
        specs: '18K White Gold | 2.5 Carats VVS1 Diamond',
        price: 145000.00,
        quantity: 1,
        subtotal: 145000.00,
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'
      }
    ]
  }
];

const OrderHistory = () => {
  // Safe hook access with fallbacks
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (e) {
    console.warn('Auth hook fallback in OrderHistory:', e);
  }

  let orders = DEFAULT_SEED_ORDERS;
  let deleteOrder = () => {};
  let totalItemsOrdered = 5;

  try {
    const orderCtx = useOrders();
    if (orderCtx && orderCtx.orders) {
      orders = orderCtx.orders;
      deleteOrder = orderCtx.deleteOrder || deleteOrder;
      totalItemsOrdered = orderCtx.totalItemsOrdered || totalItemsOrdered;
    }
  } catch (e) {
    console.warn('Orders hook fallback in OrderHistory:', e);
  }

  let showToast = null;
  try {
    const toastCtx = useToast();
    showToast = toastCtx?.showToast;
  } catch (e) {
    console.warn('Toast hook fallback in OrderHistory:', e);
  }

  const [orderToDelete, setOrderToDelete] = useState(null);

  const username = user?.fullName || user?.email?.split('@')[0] || 'vrashabha13';

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.orderId);
      if (showToast) {
        showToast(`Order #${orderToDelete.orderId} removed from history.`, 'info');
      }
      setOrderToDelete(null);
    }
  };

  return (
    <div className="order-history-page min-vh-100 bg-cream-soft py-4" style={{ paddingBottom: '5rem' }}>
      {/* Luxury Delete Order Confirmation Modal Popup */}
      {orderToDelete && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.75)', 
            backdropFilter: 'blur(12px)', 
            zIndex: 99999 
          }}
        >
          <div 
            className="card border-gold rounded-4 p-4 p-md-5 text-center shadow-2xl animate-scale-up"
            style={{ 
              maxWidth: '480px', 
              width: '90%', 
              background: 'linear-gradient(145deg, #18181b, #09090b)', 
              borderColor: 'rgba(212, 175, 55, 0.4)',
              boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.3)' 
            }}
          >
            <div className="mb-3 d-flex justify-content-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '70px', height: '70px', backgroundColor: 'rgba(220, 53, 69, 0.15)', border: '2px solid #dc3545' }}
              >
                <AlertTriangle size={36} className="text-danger" />
              </div>
            </div>

            <h3 className="font-serif text-white display-6 mb-2 fw-bold">Delete Order History?</h3>
            <p className="text-white-50 fs-6 mb-2">
              Are you sure you want to delete order <span className="text-gold fw-bold">#{orderToDelete.orderId}</span>?
            </p>
            <p className="text-muted small mb-4">
              This action cannot be undone and will permanently remove this record from your profile history.
            </p>

            <div className="d-flex gap-3 justify-content-center">
              <button 
                onClick={() => setOrderToDelete(null)}
                className="btn btn-outline-light rounded-3 px-4 py-2.5 fw-semibold flex-fill"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="btn btn-danger rounded-3 px-4 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 flex-fill"
              >
                <Trash2 size={18} />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Navigation Link matching Reference Image 1 */}
        <div className="mb-3">
          <Link to="/shop" className="text-primary text-decoration-none fw-semibold d-inline-flex align-items-center gap-2 fs-6">
            <ArrowLeft size={18} />
            <span>Back to Shop</span>
          </Link>
        </div>

        {/* Page Title Section matching Reference Image 1 */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-1">
            <div className="bg-light-gold-subtle p-2 rounded-3 border border-gold-soft d-flex align-items-center justify-content-center">
              <Package size={26} className="text-dark" />
            </div>
            <h1 className="display-6 font-serif fw-bold text-dark mb-0">Order History</h1>
          </div>
          <div className="text-muted fs-6 ms-1">
            Logged in as <span className="fw-semibold text-dark">{username}</span> ({totalItemsOrdered} item(s) ordered)
          </div>
        </div>

        {/* List of Orders */}
        {orders.length === 0 ? (
          <div className="card shadow-sm border-0 rounded-4 p-5 text-center bg-white my-5">
            <ShoppingBag size={56} className="text-gold mx-auto mb-3 opacity-50" />
            <h3 className="font-serif fw-bold text-dark mb-2">No Order History Found</h3>
            <p className="text-muted mb-4">You haven't placed any orders yet. Explore our luxury collections!</p>
            <div>
              <Link to="/shop" className="btn btn-gold px-5 py-2.5 rounded-3 fw-bold text-black text-uppercase shadow-sm">
                Shop Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {orders.map((order) => (
              <div 
                key={order.orderId} 
                className="card shadow-sm border border-light-subtle rounded-4 overflow-hidden bg-white hover-shadow-lg transition-all"
              >
                {/* Order Header Summary Bar (Soft Tint Background) matching Reference 1 */}
                <div 
                  className="p-3 px-md-4 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3"
                  style={{ backgroundColor: '#f8fafc' }}
                >
                  <div className="d-flex flex-wrap align-items-center gap-4">
                    <div>
                      <span className="text-muted text-uppercase font-mono small fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                        # ORDER ID
                      </span>
                      <span className="fw-bold text-primary font-mono fs-6">{order.orderId}</span>
                    </div>

                    <div>
                      <span className="text-muted text-uppercase font-mono small fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                        PLACED ON
                      </span>
                      <span className="fw-semibold text-dark fs-6">{order.placedOn}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {/* Status Badge */}
                    <div 
                      className="d-flex align-items-center gap-1.5 px-3 py-1 rounded-pill fw-bold small text-uppercase"
                      style={{ 
                        backgroundColor: '#d1fae5', 
                        color: '#065f46', 
                        border: '1px solid #a7f3d0',
                        fontSize: '0.78rem'
                      }}
                    >
                      <CheckCircle size={14} className="text-success" />
                      <span>{order.status || 'SUCCESS'}</span>
                    </div>

                    {/* Grand Total */}
                    <div className="text-end ms-2">
                      <span className="text-muted text-uppercase font-mono small fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                        GRAND TOTAL
                      </span>
                      <span className="fw-bold text-dark fs-5">
                        ₹{Number(order.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* DELETE ORDER BUTTON */}
                    <button 
                      onClick={() => setOrderToDelete(order)}
                      className="btn btn-outline-danger btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center transition-all ms-2"
                      title="Delete Order History"
                      aria-label="Delete Order"
                      style={{ width: '38px', height: '38px' }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Order Items Section matching Reference 1 */}
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {order.items && order.items.map((item, idx) => (
                      <div 
                        key={item.id || idx} 
                        className="list-group-item p-3 px-md-4 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 border-bottom-light"
                      >
                        {/* Left: Product Thumbnail + Title + Specs */}
                        <div className="d-flex align-items-center gap-3 flex-grow-1 min-width-0">
                          <div 
                            className="flex-shrink-0 rounded-3 overflow-hidden border d-flex align-items-center justify-content-center bg-light"
                            style={{ width: '68px', height: '68px' }}
                          >
                            <img 
                              src={item.imageUrl || item.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'} 
                              alt={item.name}
                              className="w-100 h-100 object-fit-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500';
                              }}
                            />
                          </div>

                          <div className="min-width-0">
                            <h5 className="fw-bold text-dark fs-6 mb-1 text-truncate">{item.name}</h5>
                            
                            {item.category && (
                              <div className="d-inline-flex align-items-center gap-1 text-muted small text-uppercase font-mono mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                                <span className="rounded-1 px-1.5 py-0.5 bg-light border text-secondary fw-semibold">
                                  {item.category}
                                </span>
                              </div>
                            )}

                            {item.specs && (
                              <div className="text-muted small text-truncate" style={{ maxWidth: '420px', fontSize: '0.82rem' }}>
                                {item.specs}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Price columns (PRICE PER UNIT | QUANTITY | SUBTOTAL) */}
                        <div className="d-flex align-items-center gap-4 text-nowrap flex-shrink-0 ms-auto text-end">
                          <div>
                            <span className="text-muted text-uppercase d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                              PRICE PER UNIT
                            </span>
                            <span className="fw-semibold text-dark fs-6">
                              ₹{Number(item.price || item.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div>
                            <span className="text-muted text-uppercase d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                              QUANTITY
                            </span>
                            <span className="fw-bold text-primary fs-6">
                              x {item.quantity || 1}
                            </span>
                          </div>

                          <div className="min-w-100">
                            <span className="text-muted text-uppercase d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                              SUBTOTAL
                            </span>
                            <span className="fw-bold text-dark fs-6">
                              ₹{Number(item.subtotal || ((item.price || 0) * (item.quantity || 1))).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
