import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';

const OrderContext = createContext();

// Clean, luxury jewellery initial seed order
const INITIAL_SEED_ORDERS = [
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

export const OrderProvider = ({ children }) => {
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (e) {
    console.warn('OrderContext Auth fallback:', e);
  }

  const userKey = typeof user === 'string' ? user : (user?.email || user?.fullName || 'guest');
  const storageKey = `alpha_jewels_orders_${userKey}`;

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading order history cache:', e);
    }
    return INITIAL_SEED_ORDERS;
  });

  // Fetch orders from database and sync to localStorage whenever user changes
  useEffect(() => {
    const fetchBackendOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await apiClient.get('/api/orders');
          if (Array.isArray(res.data) && res.data.length > 0) {
            const dbOrders = res.data.map((ord) => ({
              orderId: ord.orderId,
              placedOn: ord.placedOn ? formatDate(ord.placedOn) : newDateString(),
              status: ord.status || 'SUCCESS',
              grandTotal: typeof ord.grandTotal === 'number' ? ord.grandTotal : parseFloat(ord.grandTotal || 0),
              itemCount: ord.itemCount || (ord.items ? ord.items.length : 0),
              items: Array.isArray(ord.items)
                ? ord.items.map((item) => ({
                    id: item.id || item.productId,
                    name: item.name || 'Luxury Jewelry',
                    category: item.category || 'JEWELRY',
                    specs: item.specs || item.description || 'Bespoke Craftsmanship',
                    price: typeof item.price === 'number' ? item.price : parseFloat(item.price || 0),
                    quantity: item.quantity || 1,
                    subtotal: typeof item.subtotal === 'number' ? item.subtotal : parseFloat(item.subtotal || 0),
                    imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
                  }))
                : [],
            }));
            setOrders(dbOrders);
            localStorage.setItem(storageKey, JSON.stringify(dbOrders));
            localStorage.setItem('alpha_jewels_global_orders', JSON.stringify(dbOrders));
            return;
          }
        }
      } catch (err) {
        console.warn('Backend order fetch error, using local storage fallback:', err);
      }

      // Local storage fallback
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setOrders(parsed);
        } else {
          localStorage.setItem(storageKey, JSON.stringify(INITIAL_SEED_ORDERS));
          setOrders(INITIAL_SEED_ORDERS);
        }
      } catch (e) {
        console.error('Error syncing order history cache:', e);
      }
    };

    fetchBackendOrders();
  }, [storageKey, userKey]);

  // Add new order
  const addOrder = async (newOrder) => {
    const formattedOrder = {
      orderId: newOrder.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      placedOn: newDateString(),
      status: newOrder.status || 'SUCCESS',
      grandTotal: newOrder.grandTotal || 0,
      itemCount: newOrder.items ? newOrder.items.length : 0,
      items: newOrder.items || [],
    };

    setOrders((prevOrders) => {
      const filtered = prevOrders.filter((o) => o.orderId !== formattedOrder.orderId);
      const updated = [formattedOrder, ...filtered];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        localStorage.setItem('alpha_jewels_global_orders', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving order cache:', e);
      }
      return updated;
    });

    // Sync to backend database
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await apiClient.post('/api/orders/create', {
          orderId: formattedOrder.orderId,
          grandTotal: formattedOrder.grandTotal,
          status: formattedOrder.status,
          items: formattedOrder.items,
        });
      }
    } catch (e) {
      console.warn('Failed to save order to database:', e);
    }
  };

  // Delete order by orderId
  const deleteOrder = async (orderId) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.filter((o) => o.orderId !== orderId);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        localStorage.setItem('alpha_jewels_global_orders', JSON.stringify(updated));
      } catch (e) {
        console.error('Error deleting order cache:', e);
      }
      return updated;
    });

    // Delete from backend database
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await apiClient.delete(`/api/orders/${orderId}`);
      }
    } catch (e) {
      console.warn('Failed to delete order from database:', e);
    }
  };

  const totalItemsOrdered = orders.reduce((acc, order) => {
    return acc + (order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0);
  }, 0);

  return (
    <OrderContext.Provider value={{ orders, addOrder, deleteOrder, totalItemsOrdered }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    return {
      orders: INITIAL_SEED_ORDERS,
      addOrder: () => {},
      deleteOrder: () => {},
      totalItemsOrdered: 1,
    };
  }
  return context;
};

// Helpers for formatted date
function newDateString() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  return `${dateStr} at ${timeStr}`;
}

function formatDate(dateInput) {
  if (!dateInput) return newDateString();
  const dateObj = new Date(dateInput);
  if (isNaN(dateObj.getTime())) return String(dateInput);
  const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  return `${dateStr} at ${timeStr}`;
}
