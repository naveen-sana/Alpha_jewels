import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const OrderContext = createContext();

const INITIAL_SEED_ORDERS = [
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading order history:', e);
    }
    return INITIAL_SEED_ORDERS;
  });

  // Sync to localStorage whenever userKey changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        localStorage.setItem(storageKey, JSON.stringify(INITIAL_SEED_ORDERS));
        setOrders(INITIAL_SEED_ORDERS);
      } else {
        const parsed = JSON.parse(saved);
        setOrders(Array.isArray(parsed) ? parsed : INITIAL_SEED_ORDERS);
      }
    } catch (e) {
      console.error('Error syncing order history:', e);
    }
  }, [storageKey]);

  // Add new order
  const addOrder = (newOrder) => {
    const formattedOrder = {
      orderId: newOrder.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      placedOn: newDateString(),
      status: newOrder.status || 'SUCCESS',
      grandTotal: newOrder.grandTotal || 0,
      itemCount: newOrder.items ? newOrder.items.length : 0,
      items: newOrder.items || [],
    };

    setOrders((prevOrders) => {
      const updated = [formattedOrder, ...prevOrders];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving order:', e);
      }
      return updated;
    });
  };

  // Delete order by orderId
  const deleteOrder = (orderId) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.filter((o) => o.orderId !== orderId);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.error('Error deleting order:', e);
      }
      return updated;
    });
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
      totalItemsOrdered: 5,
    };
  }
  return context;
};

// Helper for formatted date
function newDateString() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  return `${dateStr} at ${timeStr}`;
}
