# 🎨 Admin Frontend Guide

## ✅ What I Created

I've built a simple admin dashboard frontend that connects to your backend API. Here's what's included:

### Pages Created:
1. **`/admin`** - Admin Dashboard (overview)
2. **`/admin/products`** - View all products
3. **`/admin/products/new`** - Create new product
4. **`/admin/categories`** - Manage categories
5. **`/admin/custom-requests`** - View customer requests

---

## 🚀 How to Use

### Step 1: Make Sure Backend is Running

In your server folder:
```bash
cd server
npm run dev
```

Server should be running on `http://localhost:4000`

### Step 2: Start the Frontend

In your client folder:
```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 3: Login as Admin

1. Go to `http://localhost:3000/auth/sign-in`
2. Use admin credentials:
   - **Email:** `getabalewkemaw@gmail.com`
   - **Password:** `Admin@12345`
3. After login, go to `http://localhost:3000/admin`

---

## 📱 Features

### Admin Dashboard (`/admin`)
- Overview of your store
- Quick stats (products, categories, requests)
- Quick links to manage everything

### Products Page (`/admin/products`)
- View all products in a grid
- Search products
- See product status (Active/Inactive)
- Edit or delete products
- Click "Add Product" to create new

### Add Product Page (`/admin/products/new`)
- Simple form to create products
- Fields:
  - Title (required)
  - Description
  - Price (required)
  - Currency (USD, EUR, ETB)
  - Active checkbox
  - Featured checkbox

### Categories Page (`/admin/categories`)
- View all categories in a table
- Click "Add Category" to create new
- Modal popup for quick creation
- Edit or delete categories

### Custom Requests Page (`/admin/custom-requests`)
- View all customer design requests
- Filter by status:
  - All
  - Submitted
  - In Progress
  - Completed
  - Rejected
- View request details

---

## 🔐 Security

The admin pages are protected:
- Only users with `role: "admin"` can access
- Uses your existing Better Auth authentication
- Automatically redirects non-admins to `/dashboard`

---

## 🎨 Design

- Clean, modern UI with Tailwind CSS
- Responsive (works on mobile, tablet, desktop)
- Uses Lucide icons
- Consistent with your existing design
- Professional color scheme (indigo/purple)

---

## 🔧 How It Works

### Authentication
- Uses your existing `useAuth` hook
- Checks `isAdmin` before showing pages
- Sends cookies with API requests

### API Calls
- Connects to `http://localhost:4000` (from `.env.local`)
- Uses `credentials: "include"` to send auth cookies
- Handles loading and error states

### Data Flow
```
Frontend → API Request (with cookie) → Backend → Database → Response → Frontend
```

---

## 📝 Environment Setup

Make sure your `client/.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🎯 Quick Test

1. **Start both servers** (backend and frontend)
2. **Login as admin** at `/auth/sign-in`
3. **Go to** `http://localhost:3000/admin`
4. **Click "Products"** → "Add Product"
5. **Fill the form** and click "Create Product"
6. **You should see** your new product in the list!

---

## 🐛 Troubleshooting

### Problem: "Unauthorized" error
**Solution:** 
- Make sure you're logged in as admin
- Check that backend is running
- Clear cookies and login again

### Problem: Can't access `/admin` pages
**Solution:**
- Make sure you logged in with admin email: `getabalewkemaw@gmail.com`
- Check that user role is "admin" in database
- Run `npm run seed` in server folder

### Problem: API calls fail
**Solution:**
- Check backend is running on port 4000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check browser console for errors

### Problem: Page shows loading forever
**Solution:**
- Check backend API is responding
- Open browser DevTools → Network tab
- See if API calls are succeeding

---

## 🎨 Customization

Want to change colors or styling?

All pages use Tailwind CSS classes. Main colors:
- **Primary:** `indigo-600` (buttons, links)
- **Success:** `green-600` (active status)
- **Warning:** `yellow-600` (pending)
- **Danger:** `red-600` (delete, inactive)

To change, just replace the color names in the files!

---

## 📚 Next Steps

You can extend this by:
1. Adding product image upload UI
2. Adding edit product page
3. Adding statistics/charts
4. Adding bulk actions
5. Adding filters and sorting
6. Adding pagination

---

## 🎉 You're All Set!

Your admin dashboard is ready to use! It's simple, clean, and connects directly to your backend API.

**Happy Managing! 🚀**
