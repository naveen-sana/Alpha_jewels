# Project Rules & Workspace Knowledge

## Core Project Architecture

1. **Order History System**:
   - `OrderHistory.jsx`: Dedicated page displaying orders, item breakdowns, totals, and red delete confirmation modal.
   - `OrderContext.jsx`: Order state management with localStorage key `alpha_jewels_orders_<userKey>`.
   - Access to `/orders` is protected by `ProtectedRoute` (requires authentication).

2. **User Profile Dropdown**:
   - `Navbar.jsx`: Unauthenticated view shows `Login` & `Register` buttons. Authenticated view shows avatar initial circle badge with dropdown menu containing `Profile`, `Orders`, and `Logout`.

3. **Frontend Multi-Directory Parity**:
   - Always maintain 100% code parity across `Alpha_jewels/frontend`, `frontend`, and `jewellery-frontend`.
