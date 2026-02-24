

# Simple Inventory System

A team-based inventory management app for tracking physical products, built with Supabase for persistent data storage and multi-user access.

---

## 1. User Authentication
- Sign up / sign in pages using Supabase Auth (email & password)
- Protected routes — only logged-in users can access the inventory
- Simple user profile display in the header

## 2. Dashboard
- Overview page showing key stats: total items, low stock count, recent activity
- Visual indicators (cards/badges) for items needing attention
- Quick-action buttons to add new items

## 3. Inventory Management (Core CRUD)
- **Item list view** with a table showing: name, SKU, category, quantity, price, status
- **Add/Edit item form** with fields: name, description, SKU, category, quantity, minimum stock level, unit price, and optional image
- **Delete items** with confirmation dialog
- Inline status badges (In Stock, Low Stock, Out of Stock) based on quantity vs. minimum stock level

## 4. Categories & Search
- Create and manage product categories (e.g., Electronics, Furniture, Supplies)
- Search bar to filter items by name or SKU
- Category filter dropdown to narrow results
- Sortable columns in the inventory table

## 5. Low Stock Alerts
- Items automatically flagged when quantity falls below their minimum stock level
- Dedicated "Low Stock" view/filter to see all items needing restock
- Visual warning indicators on the dashboard and in the item list

## 6. Stock History
- Log every stock change (added, removed, adjusted) with timestamp, user, and quantity change
- History view per item showing a timeline of changes
- Notes field for each stock adjustment (e.g., "Received shipment", "Sold 5 units")

## 7. Database Design (Supabase)
- **profiles** table linked to auth users
- **categories** table for organizing items
- **items** table with quantity, min stock level, category, and metadata
- **stock_history** table logging every quantity change with user reference
- Row-level security so all team members can read/write inventory data

