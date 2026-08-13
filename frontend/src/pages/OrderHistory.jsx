import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle, Trash2, AlertTriangle, ShieldCheck, ShoppingBag, FileText, Printer, X, CreditCard, MapPin, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import apiClient from '../api/client';

const DEFAULT_SEED_ORDERS = [
  {
    orderId: 'SA-A80F0F41-E6C',
    placedOn: '3 August 2026 at 04:20 pm',
    status: 'SUCCESS',
    paymentMethod: 'Online Payment (Razorpay)',
    paymentStatus: 'Paid',
    paymentId: 'pay_PZ8920198421',
    shippingAddress: 'Padarupalli, Main Road, SPSR Nellore - 524004 (Ph: 8074066689)',
    grandTotal: 9943.00,
    itemCount: 4,
    items: [
      {
        id: 'seed-1',
        name: 'Nothing Solitaire Ring',
        category: 'RINGS',
        specs: '18K White Gold | 1.0 Carats VVS Diamond',
        price: 2200.00,
        quantity: 1,
        subtotal: 2200.00,
        imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'
      },
      {
        id: 'seed-2',
        name: 'Royal Heritage Gold Chain',
        category: 'CHAINS',
        specs: '22K Gold Filigree Craftsmanship',
        price: 3500.00,
        quantity: 1,
        subtotal: 3500.00,
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'
      },
      {
        id: 'seed-3',
        name: 'Sterling Silver Dangler Earrings',
        category: 'EARRINGS',
        specs: '925 Fine Sterling Silver',
        price: 1900.00,
        quantity: 1,
        subtotal: 1900.00,
        imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'
      },
      {
        id: 'seed-4',
        name: 'Classic Gold Bangle',
        category: 'BANGLES',
        specs: '22K Pure Gold Standard Finish',
        price: 2343.00,
        quantity: 1,
        subtotal: 2343.00,
        imageUrl: 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?w=500'
      }
    ]
  },
  {
    orderId: 'ORD-948271-AJ',
    placedOn: '1 August 2026 at 11:15 am',
    status: 'SUCCESS',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending (COD)',
    paymentId: 'COD_1785684912',
    shippingAddress: 'Padarupalli, Main Road, SPSR Nellore - 524004 (Ph: 8074066689)',
    grandTotal: 14500.00,
    itemCount: 1,
    items: [
      {
        id: 'seed-5',
        name: 'Royal Heritage Solitaire Necklace',
        category: 'DIAMOND',
        specs: '18K White Gold | 2.5 Carats VVS1 Diamond',
        price: 14500.00,
        quantity: 1,
        subtotal: 14500.00,
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
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Review & Rating Modal States
  const [reviewItem, setReviewItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState({});

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('jwt');
        if (!token) return;
        const res = await apiClient.get('/api/reviews/user');
        if (res.data && Array.isArray(res.data)) {
          const map = {};
          res.data.forEach(r => {
            if (r.productId) map[r.productId] = r;
          });
          setSubmittedReviews(map);
        }
      } catch (err) {
        console.warn('User reviews fetch error:', err);
      }
    };
    fetchUserReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewItem) return;

    setIsSubmittingReview(true);
    try {
      const rawId = reviewItem.productId || reviewItem.id || 1;
      const numericId = typeof rawId === 'string' && rawId.startsWith('seed-') ? 1 : Number(rawId);

      await apiClient.post('/api/reviews', {
        productId: numericId,
        rating: rating,
        comment: comment
      });

      if (showToast) {
        showToast('★ Review & Rating submitted successfully!', 'success');
      }

      setSubmittedReviews(prev => ({
        ...prev,
        [rawId]: { rating, comment }
      }));

      setReviewItem(null);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error('Error submitting review:', err);
      if (showToast) {
        showToast(err.response?.data?.error || err.response?.data?.message || 'Failed to submit review.', 'error');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const username = user?.fullName || user?.email?.split('@')[0] || 'Customer';

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.orderId);
      if (showToast) {
        showToast(`Order #${orderToDelete.orderId} removed from history.`, 'info');
      }
      setOrderToDelete(null);
    }
  };

  const handlePrintInvoice = () => {
    const invoiceNode = document.querySelector('.printable-invoice-modal');
    if (!invoiceNode) {
      window.print();
      return;
    }
    const printWin = window.open('', '_blank', 'width=850,height=1100');
    if (!printWin) {
      window.print();
      return;
    }
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tax Invoice - ${invoiceOrder?.orderId || 'Alpha Jewels'}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            @page { size: portrait; margin: 10mm; }
            body { font-family: sans-serif; background: #ffffff !important; color: #000000 !important; margin: 0; padding: 20px; }
            .no-print { display: none !important; }
            .printable-invoice-modal { box-shadow: none !important; border: none !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; }
            .bg-gold { background-color: #d4af37 !important; color: #000000 !important; }
            .border-gold { border-color: #d4af37 !important; }
            .text-gold { color: #b8860b !important; }
          </style>
        </head>
        <body>
          <div class="printable-invoice-modal">
            ${invoiceNode.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="order-history-page min-vh-100 bg-cream-soft py-4" style={{ paddingBottom: '5rem' }}>
      {/* Printable Invoice Styles */}
      <style>
        {`
          @media print {
            body > *:not(#root) { display: none !important; }
            #root > *:not(.order-history-page) { display: none !important; }
            .no-print { display: none !important; }
            @page { size: portrait; margin: 10mm; }
          }
        `}
      </style>

      {/* Customer Module Tax Invoice Modal */}
      {invoiceOrder && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            backdropFilter: 'blur(10px)', 
            zIndex: 99999,
            overflowY: 'auto',
            padding: '1rem'
          }}
        >
          <div 
            className="card border-gold rounded-4 p-4 p-md-5 bg-white shadow-2xl animate-scale-up printable-invoice-modal"
            style={{ 
              maxWidth: '800px', 
              width: '100%', 
              maxHeight: '92vh',
              overflowY: 'auto',
              border: '2px solid #d4af37' 
            }}
          >
            {/* Modal Header Controls (No Print) */}
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4 no-print">
              <div className="d-flex align-items-center gap-2">
                <FileText className="text-gold" size={24} />
                <span className="fw-bold text-dark font-serif fs-5">CUSTOMER TAX INVOICE</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button 
                  onClick={handlePrintInvoice}
                  className="btn btn-gold rounded-3 fw-bold text-black px-3 py-2 d-flex align-items-center gap-2 small shadow-sm"
                >
                  <Printer size={16} />
                  <span>Print / Download PDF</span>
                </button>
                <button 
                  onClick={() => setInvoiceOrder(null)}
                  className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: '38px', height: '38px' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Official Invoice Header */}
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 pb-4 border-bottom">
              <div>
                <h2 className="font-serif fw-bold text-black mb-1" style={{ letterSpacing: '0.05em', color: '#b8860b' }}>
                  ALPHA JEWELS
                </h2>
                <p className="text-muted small mb-0">Fine Bespoke & Certified Luxury Jewelry</p>
                <p className="text-muted small mb-0">Padarupalli Main Road, SPSR Nellore, AP - 524004</p>
                <p className="text-muted small mb-0">GSTIN: 37AAAAA0000A1Z5 | Support: care@alphajewels.com</p>
              </div>
              <div className="text-end">
                <div className="badge bg-gold text-black fw-bold px-3 py-2 mb-2 fs-6">TAX INVOICE</div>
                <div className="text-muted small">Invoice No: <span className="fw-bold text-black">{invoiceOrder.orderId}</span></div>
                <div className="text-muted small">Date: <span className="fw-semibold text-black">{invoiceOrder.placedOn}</span></div>
              </div>
            </div>

            {/* Customer & Payment Info Grid */}
            <div className="row g-3 my-3 p-3 bg-light rounded-3 border">
              <div className="col-md-6 border-end-md">
                <span className="text-gold-dark fw-bold small text-uppercase font-mono d-block mb-1">
                  BILLED TO / SHIPPING RECIPIENT
                </span>
                <div className="fw-bold text-dark fs-6">{username}</div>
                <div className="text-secondary small mt-1" style={{ maxWidth: '320px' }}>
                  {invoiceOrder.shippingAddress || (invoiceOrder.shippingInfo ? `${invoiceOrder.shippingInfo.fullName}, ${invoiceOrder.shippingInfo.address}, ${invoiceOrder.shippingInfo.city} - ${invoiceOrder.shippingInfo.zipCode}` : 'Padarupalli, Main Road, SPSR Nellore - 524004')}
                </div>
              </div>
              <div className="col-md-6 ps-md-4">
                <span className="text-gold-dark fw-bold small text-uppercase font-mono d-block mb-1">
                  PAYMENT & ORDER STATUS
                </span>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-muted">Payment Method:</span>
                  <span className="fw-bold text-black">{invoiceOrder.paymentMethod || 'Online Payment (Razorpay)'}</span>
                </div>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-muted">Payment Status:</span>
                  <span className={`fw-bold ${invoiceOrder.paymentStatus?.includes('Pending') ? 'text-warning' : 'text-success'}`}>
                    {invoiceOrder.paymentStatus || 'Paid'}
                  </span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Transaction ID:</span>
                  <span className="fw-mono text-dark small">{invoiceOrder.paymentId || invoiceOrder.orderId}</span>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive my-3">
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr className="small font-mono text-uppercase text-secondary">
                    <th style={{ width: '50px' }}>#</th>
                    <th>Item Description</th>
                    <th>Category</th>
                    <th className="text-end">Price</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceOrder.items && invoiceOrder.items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="fw-semibold text-muted text-center">{index + 1}</td>
                      <td>
                        <div className="fw-bold text-dark fs-6">{item.name}</div>
                        {item.specs && <div className="text-muted small">{item.specs}</div>}
                      </td>
                      <td>
                        <span className="badge bg-secondary-subtle text-dark border small">
                          {item.category || 'JEWELRY'}
                        </span>
                      </td>
                      <td className="text-end fw-semibold">
                        ₹{Number(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-center fw-bold">{item.quantity || 1}</td>
                      <td className="text-end fw-bold text-dark">
                        ₹{Number(item.subtotal || ((item.price || 0) * (item.quantity || 1))).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Totals */}
            <div className="d-flex justify-content-end my-3">
              <div className="border rounded-3 p-3 bg-light" style={{ minWidth: '280px' }}>
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Subtotal</span>
                  <span className="fw-semibold text-dark">
                    ₹{Number(invoiceOrder.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>GST (3% Included)</span>
                  <span className="fw-semibold text-dark">
                    ₹{((invoiceOrder.grandTotal || 0) * 0.03).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Insured Express Shipping</span>
                  <span className="fw-semibold text-success">FREE</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between pt-1">
                  <span className="fw-bold text-black font-serif fs-6">GRAND TOTAL</span>
                  <span className="fw-bold text-success font-serif fs-5">
                    ₹{Number(invoiceOrder.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Terms */}
            <div className="mt-4 pt-3 border-top text-center text-muted small">
              <p className="mb-1 font-serif fw-semibold text-dark">Thank you for choosing Alpha Jewels.</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.78rem' }}>
                This is a computer-generated official tax invoice. For warranty claims or lifetime maintenance, please produce this invoice ID.
              </p>
            </div>
          </div>
        </div>
      )}

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

      {/* Luxury Rate & Review Modal Popup */}
      {reviewItem && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            backdropFilter: 'blur(12px)', 
            zIndex: 999999 
          }}
        >
          <div 
            className="card border-gold rounded-4 p-4 p-md-5 shadow-2xl animate-scale-up"
            style={{ 
              maxWidth: '520px', 
              width: '92%', 
              background: 'linear-gradient(145deg, #18181b, #09090b)', 
              borderColor: 'rgba(212, 175, 55, 0.5)',
              boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.35)' 
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="font-serif text-white fs-4 fw-bold mb-0 d-flex align-items-center gap-2">
                <Star className="text-warning" fill="#f59e0b" size={24} />
                <span>Rate & Review Product</span>
              </h3>
              <button 
                onClick={() => setReviewItem(null)} 
                className="btn btn-sm btn-outline-light rounded-circle p-1.5 d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Preview */}
            <div className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <img 
                src={reviewItem.imageUrl || reviewItem.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'} 
                alt={reviewItem.name} 
                className="rounded-2 object-fit-cover" 
                style={{ width: '54px', height: '54px' }} 
              />
              <div>
                <h6 className="text-white fw-bold mb-0">{reviewItem.name}</h6>
                <span className="text-white-50 small">{reviewItem.specs || reviewItem.category || 'Luxury Jewellery'}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitReview}>
              {/* Star Selection */}
              <div className="mb-4 text-center">
                <label className="text-white-50 small text-uppercase font-mono mb-2 d-block" style={{ letterSpacing: '1px' }}>Your Rating</label>
                <div className="d-flex justify-content-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="btn p-1 border-0 bg-transparent transition-all"
                      style={{ transform: (hoverRating || rating) >= star ? 'scale(1.2)' : 'scale(1)' }}
                    >
                      <Star 
                        size={32} 
                        className={(hoverRating || rating) >= star ? 'text-warning' : 'text-secondary opacity-50'} 
                        fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'} 
                      />
                    </button>
                  ))}
                </div>
                <div className="text-warning font-serif fw-bold mt-2 fs-6">
                  {rating === 5 && 'Outstanding Luxury Standard!'}
                  {rating === 4 && 'Very Good Quality'}
                  {rating === 3 && 'Average Experience'}
                  {rating === 2 && 'Below Expectation'}
                  {rating === 1 && 'Needs Improvement'}
                </div>
              </div>

              {/* Feedback Text */}
              <div className="mb-4">
                <label className="text-white-50 small text-uppercase font-mono mb-2 d-block" style={{ letterSpacing: '1px' }}>Your Written Feedback</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the craftsmanship, design elegance, and overall satisfaction..."
                  className="form-control text-white border-secondary rounded-3 p-3 small"
                  style={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.2)' }}
                  required
                />
              </div>

              {/* Actions */}
              <div className="d-flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setReviewItem(null)} 
                  className="btn btn-outline-light rounded-3 py-2.5 flex-fill fw-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  className="btn btn-gold text-black rounded-3 py-2.5 flex-fill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg"
                >
                  {isSubmittingReview ? (
                    <span className="spinner-border spinner-border-sm" role="status" />
                  ) : (
                    <>
                      <Star size={18} fill="#000" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
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

                    <div>
                      <span className="text-muted text-uppercase font-mono small fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                        PAYMENT METHOD
                      </span>
                      <span className="fw-semibold text-black fs-6 badge bg-light border text-dark">
                        {order.paymentMethod || 'Online Payment'}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
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
                    <div className="text-end ms-2 me-2">
                      <span className="text-muted text-uppercase font-mono small fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                        GRAND TOTAL
                      </span>
                      <span className="fw-bold text-dark fs-5">
                        ₹{Number(order.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* VIEW INVOICE BUTTON */}
                    <button 
                      onClick={() => setInvoiceOrder(order)}
                      className="btn btn-outline-primary btn-sm rounded-3 px-3 py-1.5 fw-bold d-flex align-items-center gap-1.5 transition-all"
                      title="View / Download Invoice"
                    >
                      <FileText size={15} />
                      <span>Invoice</span>
                    </button>

                    {/* DELETE ORDER BUTTON */}
                    <button 
                      onClick={() => setOrderToDelete(order)}
                      className="btn btn-outline-danger btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center transition-all ms-1"
                      title="Delete Order History"
                      aria-label="Delete Order"
                      style={{ width: '36px', height: '36px' }}
                    >
                      <Trash2 size={16} />
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

                          {/* Rate & Review Button / Badge */}
                          <div className="ms-2">
                            {submittedReviews[item.productId || item.id] ? (
                              <span 
                                className="badge text-dark border border-gold rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1 font-mono"
                                style={{ backgroundColor: '#fffbeb', borderColor: '#f59e0b' }}
                              >
                                <Star size={14} fill="#f59e0b" className="text-warning" />
                                <span>Rated {submittedReviews[item.productId || item.id].rating}/5</span>
                              </span>
                            ) : (
                              <button 
                                onClick={() => {
                                  setReviewItem(item);
                                  setRating(5);
                                  setComment('');
                                }}
                                className="btn btn-outline-warning text-dark border-gold btn-sm rounded-pill fw-bold d-inline-flex align-items-center gap-1.5 px-3 py-1.5 shadow-sm transition-all hover-scale"
                                style={{ borderColor: '#d4af37', backgroundColor: '#fffdf5' }}
                              >
                                <Star size={15} fill="#f59e0b" className="text-warning" />
                                <span>Rate & Review</span>
                              </button>
                            )}
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
