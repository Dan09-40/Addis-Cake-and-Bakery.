# 🔧 TROUBLESHOOTING GUIDE - Dashboards & Registration

## ✅ **CURRENT STATUS:**

```
✓ Backend Server:  RUNNING on port 5000 (PID: 19680)
✓ Frontend Server: RUNNING on port 3000 (PID: 8108)
✓ MongoDB:         Connected
✓ Routes:          Configured
```

---

## 🎯 **HOW TO ACCESS EACH PAGE:**

### **1. Login Page**
**URL:** http://localhost:3000/login  
**What you'll see:** Beautiful gradient background with login form

### **2. Register Page**  
**URL:** http://localhost:3000/register  
**What you'll see:** Registration form with all fields

### **3. Customer Dashboard**
**URL:** http://localhost:3000/customer-dashboard  
**Access:** Must be logged in as customer

### **4. Admin Dashboard**
**URL:** http://localhost:3000/admin-dashboard  
**Access:** Must be logged in as admin

---

## ⚠️ **IF PAGES ARE BLANK OR NOT LOADING:**

### **Problem: Blank white page**

**Solution 1: Check Console for Errors**
1. Press `F12` to open Developer Tools
2. Click "Console" tab
3. Look for RED error messages
4. Common errors:
   - "Cannot find module" → Missing dependencies
   - "Network Error" → Backend not running
   - "404 Not Found" → Wrong route

**Solution 2: Clear Browser Cache**
```
1. Press Ctrl + Shift + Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page (F5)
```

**Solution 3: Check LocalStorage**
```
1. Press F12
2. Click "Application" tab
3. Click "Local Storage" → "http://localhost:3000"
4. Click "Clear All"
5. Refresh page
```

---

## 🔍 **STEP-BY-STEP TESTING:**

### **Test 1: Can you access the Login page?**

Open browser and go to: **http://localhost:3000/login**

**Expected Result:**
- Gradient pink/purple background
- White card with "Sign in to your account"
- Email and Password fields
- "Sign in" button
- Demo accounts section at bottom

**If you see this → LOGIN IS WORKING! ✅**

---

### **Test 2: Try Login with Demo Account**

On login page:
- Email: `admin@cakedelivery.com`
- Password: `admin123`
- Click "Sign in"

**Expected Result:**
- Should redirect to: http://localhost:3000/admin-dashboard
- You should see the Admin Dashboard

**If login works → AUTHENTICATION IS WORKING! ✅**

---

### **Test 3: Try Registration**

On login page, click "create a new account"  
OR go directly to: **http://localhost:3000/register**

**Fill in the form:**
```
Full Name: Test User
Email: test@example.com
Phone: 555-123-4567
Address: 123 Test Street
Password: test123
Confirm Password: test123
✓ Check "I agree to Terms"
```

Click "Create Account"

**Expected Result:**
- Should auto-login
- Redirect to Customer Dashboard
- Show welcome message

**If registration works → REGISTRATION IS WORKING! ✅**

---

## 🐛 **COMMON ISSUES & FIXES:**

### **Issue 1: "Something is already running on port 3000"**

**Fix:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /F /PID <PID>

# Restart frontend
cd frontend
npm start
```

---

### **Issue 2: Login shows "Network Error"**

**Cause:** Backend server is not running

**Fix:**
```bash
# Start backend
cd backend
npm run dev
```

You should see:
```
✓ MongoDB Connected
✓ Server is running on port 5000
```

---

### **Issue 3: Registration form doesn't submit**

**Check:**
1. Is backend running on port 5000?
2. Open browser console (F12)
3. Look for errors in Network tab
4. Check if API call is being made to `http://localhost:5000/api/auth/register`

**Fix:**
```bash
# Restart backend
cd backend
npm run dev
```

---

### **Issue 4: Dashboard shows blank after login**

**Possible Causes:**
1. Token not saved properly
2. User object is null
3. Route protection failing

**Fix:**
```javascript
// In browser console (F12):
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

Should show:
- Token: A long string (JWT token)
- User: Object with id, name, email, isAdmin

If shows `null` → Login didn't save properly → Try logging in again

---

### **Issue 5: "Cannot GET /" or 404 errors**

**Cause:** React Router not configured properly

**Fix:** Already fixed! But if it happens again:
1. Make sure you're accessing `/login` not just `/`
2. Clear browser cache
3. Restart frontend server

---

## 📊 **BROWSER CONSOLE TESTS:**

Open browser console (F12) and run these tests:

### **Test A: Check if React Router is working**
```javascript
window.location.href = 'http://localhost:3000/login'
```
Should navigate to login page without page reload

### **Test B: Check if components are imported**
```javascript
// Should not show errors in console
```

### **Test C: Check API connection**
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend OK:', d))
```
Should log: `{message: "Cake Delivery API is running", ...}`

---

## 🎨 **VISUAL CHECKLIST:**

### **Login Page Should Have:**
- [ ] Pink/purple gradient background
- [ ] White centered card
- [ ] "Sign in to your account" heading
- [ ] Email input field
- [ ] Password input field
- [ ] "Sign in" button (pink)
- [ ] "create a new account" link
- [ ] Demo accounts section (gray boxes)

### **Register Page Should Have:**
- [ ] Similar gradient background
- [ ] Larger white card
- [ ] "Create your account" heading
- [ ] 6 input fields (Name, Email, Phone, Address, Password, Confirm)
- [ ] "Create Account" button
- [ ] "Sign in" link

### **Customer Dashboard Should Have:**
- [ ] Header with "My Account"
- [ ] Three tabs (Orders, Profile, Addresses)
- [ ] Order history cards (if logged in as demo user)
- [ ] Or "No orders yet" message

### **Admin Dashboard Should Have:**
- [ ] Header with "Admin Dashboard"
- [ ] "Add New Cake" button
- [ ] Form to add products
- [ ] Table of existing cakes

---

## 🚀 **QUICK RESTART COMMANDS:**

If nothing works, restart everything:

```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Start backend (in one terminal)
cd backend
npm run dev

# 3. Start frontend (in another terminal)
cd frontend
npm start

# 4. Open browser manually
http://localhost:3000/login
```

---

## 📞 **STILL NOT WORKING?**

If you've tried everything and pages still don't load:

### **Provide this information:**
1. **What URL are you accessing?** (e.g., http://localhost:3000/login)
2. **What do you see?** (blank page, error message, etc.)
3. **Browser console errors?** (Press F12 → Console tab → screenshot)
4. **Network tab errors?** (Press F12 → Network tab → screenshot)
5. **Are both servers running?**
   ```bash
   netstat -ano | findstr :5000
   netstat -ano | findstr :3000
   ```

---

## ✅ **SUCCESS INDICATORS:**

You know it's working when:

1. ✅ Can access http://localhost:3000/login without errors
2. ✅ See the login form with gradient background
3. ✅ Can login with demo credentials
4. ✅ Gets redirected to dashboard after login
5. ✅ Can navigate between dashboards
6. ✅ Registration form submits successfully
7. ✅ New user can login after registration

---

**Current Working Configuration:**
- Backend: Port 5000 ✅
- Frontend: Port 3000 ✅
- MongoDB: Connected ✅
- Routes: Configured ✅
- Auth: JWT tokens ✅
- Email: Ready (needs .env config) ✅

**Next Step:** Open http://localhost:3000/login in your browser and test!
