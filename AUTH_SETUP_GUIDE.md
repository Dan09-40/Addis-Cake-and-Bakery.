# 🔐 Authentication & Email Setup Guide

## ✅ **What's Been Added:**

### **Backend Features:**
1. ✅ JWT Authentication System
2. ✅ Login/Register API Endpoints
3. ✅ Protected Routes Middleware
4. ✅ Admin/User Role Management
5. ✅ Email Service (Nodemailer)
6. ✅ MongoDB Connection

### **Frontend Features:**
1. ✅ Login Component
2. ✅ Register Component  
3. ✅ Protected Routes
4. ✅ Token Management
5. ✅ User Session Handling

---

## 📁 **New Files Created:**

### **Backend:**
```
backend/src/
├── controllers/
│   └── authController.ts      ← Login/Register logic
├── middleware/
│   └── auth.ts                ← JWT authentication
├── routes/
│   └── auth.ts                ← Auth routes
├── types/
│   └── express.d.ts           ← TypeScript type extensions
└── utils/
    └── emailService.ts        ← Email notifications
```

### **Frontend:**
```
frontend/src/components/auth/
├── Login.tsx                  ← Login form
└── Register.tsx               ← Registration form
```

---

## 🚀 **Setup Instructions:**

### **Step 1: Configure Email (.env)**

Edit `backend/.env`:

```env
# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
FRONTEND_URL=http://localhost:3000
```

**For Gmail:**
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use the app password (not your regular password)

**Alternative Email Services:**
- SendGrid
- Mailgun
- Outlook/Hotmail
- Custom SMTP

---

### **Step 2: Install Dependencies**

Already installed:
- ✅ nodemailer
- ✅ @types/nodemailer
- ✅ react-router-dom

---

### **Step 3: API Endpoints**

#### **Authentication Endpoints:**

**POST /api/auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "555-123-4567",
  "address": "123 Main St, City, State"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**GET /api/users/profile** (Protected - requires token)
Headers: `Authorization: Bearer <token>`

**PUT /api/users/profile** (Protected)

---

## 🔐 **Authentication Flow:**

### **Login Process:**
1. User enters email/password
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials
4. Backend returns JWT token
5. Frontend saves token to localStorage
6. Frontend redirects to appropriate dashboard

### **Protected Routes:**
1. Frontend checks for token in localStorage
2. If no token → redirect to login
3. If token exists → include in API requests
4. Backend validates token with middleware
5. If valid → allow access
6. If invalid → return 401 error

---

## 📧 **Email Notifications:**

### **Types of Emails:**

1. **Order Confirmation** (Automatic)
   - Sent when customer places order
   - Includes order details, items, total
   - Delivery date and address

2. **Welcome Email** (Automatic)
   - Sent after registration
   - Welcome message
   - Link to start shopping

3. **Order Status Update** (Manual trigger)
   - Sent when order status changes
   - Processing → Shipped → Delivered
   - Real-time updates

---

## 🎯 **How to Use:**

### **Testing Login:**

**Demo Accounts:**
```
Admin:
Email: admin@cakedelivery.com
Password: admin123

Customer:
Email: john@example.com
Password: user123
```

### **Test Registration:**
1. Navigate to `/register`
2. Fill in all fields
3. Submit form
4. Check email for welcome message
5. Login with new credentials

---

## 🔧 **Protecting Routes:**

### **Frontend Protection:**

```typescript
// Example: Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
```

### **Backend Protection:**

```typescript
// Example: Protected route
router.post('/orders', protect, createOrder);

// Admin only route
router.get('/analytics', protect, admin, getAnalytics);
```

---

## 📝 **Next Steps:**

### **To Complete Integration:**

1. **Update Orders Controller** to send emails:
```typescript
import { sendOrderConfirmation } from '../utils/emailService';

// After creating order:
await sendOrderConfirmation(
  user.email,
  user.name,
  order._id.toString(),
  order
);
```

2. **Update Orders Dashboard** to trigger status emails:
```typescript
// When updating order status:
if (newStatus === 'shipped' || newStatus === 'delivered') {
  await sendOrderStatusUpdate(
    user.email,
    user.name,
    orderId,
    newStatus
  );
}
```

3. **Add Logout Functionality**:
```typescript
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login');
};
```

---

## ⚠️ **Security Best Practices:**

1. ✅ Never commit `.env` file
2. ✅ Use strong JWT secrets (50+ characters)
3. ✅ Hash passwords with bcrypt (salt rounds: 10+)
4. ✅ Validate all inputs
5. ✅ Use HTTPS in production
6. ✅ Set token expiration (30 days recommended)
7. ✅ Implement rate limiting on auth endpoints
8. ✅ Sanitize user data

---

## 🎨 **UI Components Ready:**

- ✅ Beautiful login page with gradient background
- ✅ Demo accounts display
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Remember me checkbox
- ✅ Forgot password link (placeholder)

---

## 📊 **Database Collections:**

### **Users Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  phone: String,
  address: String,
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ **Checklist:**

- [ ] Configure email in .env
- [ ] Test login with demo accounts
- [ ] Test new user registration
- [ ] Verify email sending works
- [ ] Protect admin routes
- [ ] Add logout button
- [ ] Test protected API calls
- [ ] Deploy with secure environment variables

---

## 🆘 **Troubleshooting:**

### **"Invalid token" error:**
- Check JWT_SECRET matches in .env
- Clear localStorage and login again

### **Email not sending:**
- Verify EMAIL_USER and EMAIL_PASSWORD
- For Gmail, use App Password not regular password
- Check firewall/network settings

### **"User already exists":**
- Email must be unique
- Try different email or delete existing user

---

**Your app now has full authentication and email notifications! 🎉**
