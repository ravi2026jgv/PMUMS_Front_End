# Role-Based Authentication Implementation Guide

## Overview
This document explains the role-based authentication system implemented in the frontend and what needs to be verified/configured in your Spring Boot backend.

## Frontend Implementation Complete ✅

### 1. **Admin Dashboard Created**
- Location: `src/pages/AdminDashboard.js`
- Route: `/admin/dashboard`
- Features:
  - Admin-specific statistics display
  - User management interface
  - Recent users table with actions
  - Quick action panels for user management, reports, and settings

### 2. **Role-Based Route Protection**
- Updated `ProtectedRoute.js` to accept `requiredRole` parameter
- Routes can now be protected by specific roles
- Unauthorized access shows a proper error message in Hindi

### 3. **Updated Authentication Context**
- `AuthContext.js` now logs role information from login response
- Console logs help debug role extraction

### 4. **Navigation Updates**
- Header component shows "ADMIN DASHBOARD" button for admin users
- Mobile menu also includes admin dashboard link for admins
- Different styling (red background) for admin button

### 5. **Login Redirect Logic**
- Admin users (role === 'ADMIN') → `/admin/dashboard`
- Regular users → previous page or home page
- Prevents admins from being redirected to regular dashboard

## Backend Requirements ⚠️

### **CRITICAL: Check Your Backend Response**

Your Spring Boot backend MUST return role information in the login response. Here's what to verify:

#### 1. **User Entity Should Have Role Field**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    private String id;
    
    private String username;
    private String password;
    private String name;
    
    // IMPORTANT: Role field
    @Enumerated(EnumType.STRING)
    private Role role; // or String role;
    
    // ... other fields
}
```

#### 2. **Role Enum (Recommended)**
```java
public enum Role {
    USER,
    ADMIN
}
```

#### 3. **Login Response Must Include Role**
Your AuthController should return:
```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // Authenticate user
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()
        )
    );
    
    // Get user details
    User user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Generate JWT token
    String token = jwtTokenProvider.generateToken(authentication);
    
    // IMPORTANT: Return user object with role
    return ResponseEntity.ok(new LoginResponse(
        token,
        user.getId(),
        user.getUsername(),
        user.getName(),
        user.getEmail(),
        user.getRole() // <-- MUST include role
    ));
}
```

#### 4. **Expected Login Response Format**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "PMUMS202458108",
    "username": "admin",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"    // <-- This field is CRITICAL
  }
}
```

OR if you use `roles` as an array:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "PMUMS202458108",
    "username": "admin",
    "name": "Admin User",
    "email": "admin@example.com",
    "roles": ["ADMIN", "USER"]    // <-- Array format also supported
  }
}
```

### **How to Add Role Field to Existing Users Database**

If your database doesn't have a role column yet:

#### SQL Migration:
```sql
-- Add role column to users table
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'USER';

-- Set admin role for specific user (change username as needed)
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';

-- Or update by employee ID
UPDATE users SET role = 'ADMIN' WHERE username = 'your-admin-employee-id';
```

### **Testing the Implementation**

#### 1. **Test Admin Login**
- Credentials: 
  - Employee ID: `admin` (or your admin username)
  - Password: (your admin password)
- Expected Behavior:
  - Login successful
  - Automatically redirected to `/admin/dashboard`
  - See "ADMIN DASHBOARD" button in header (red background)
  - Can access admin-specific features

#### 2. **Test Regular User Login**
- Credentials: Regular user credentials
- Expected Behavior:
  - Login successful
  - Redirected to home page or previous page
  - See only "DASHBOARD" button in header
  - Cannot access `/admin/dashboard` (shows access denied)

#### 3. **Test Unauthorized Access**
- As regular user, try to access: `http://localhost:3000/admin/dashboard`
- Expected Behavior:
  - Shows access denied message in Hindi
  - Displays required role vs user's actual role

### **Debugging Steps**

#### 1. **Check Browser Console After Login**
Look for these logs:
```
Login API response: {...}
Extracted token: eyJhbGciOiJIUzI1Ni...
Extracted user data: {...}
User role: ADMIN  // <-- This should show the role
```

#### 2. **If Role is Undefined**
- Check backend response using browser Network tab
- Verify the `/auth/login` response includes `role` field
- Check if it's named `role`, `roles`, `userRole`, or something else
- Update frontend if needed to match your backend's field name

#### 3. **If Role Exists But Access Still Denied**
- Check console for role comparison logs
- Verify role value matches exactly (case-sensitive)
- Common issues:
  - Backend returns `"admin"` but frontend checks for `"ADMIN"`
  - Role is nested deeper in response object

### **Frontend Code Locations**

If you need to modify role checking:

1. **Role Extraction**: `src/context/AuthContext.js` line 79-82
2. **Role-Based Routing**: `src/components/ProtectedRoute.js` line 23-30
3. **Login Redirect**: `src/pages/auth/Login.js` line 49-59
4. **Header Navigation**: `src/components/Layout/Header.js` line 168-180
5. **Route Protection**: `src/App.js` line 46-52

## Routes Summary

| Route | Access | Role Required |
|-------|--------|---------------|
| `/` | Public | None |
| `/login` | Public | None |
| `/register` | Public | None |
| `/about` | Public | None |
| `/teachers-list` | Public | None |
| `/dashboard` | Protected | Any authenticated user |
| `/profile` | Protected | Any authenticated user |
| `/admin/dashboard` | Protected | ADMIN only |

## Next Steps

1. ✅ Verify your backend returns `role` field in login response
2. ✅ Add role column to database if missing
3. ✅ Set at least one user as ADMIN in database
4. ✅ Test admin login → should redirect to `/admin/dashboard`
5. ✅ Test regular user login → should redirect to home
6. ✅ Test unauthorized access → should show access denied

## Support

If you encounter issues:
1. Check browser console for role value
2. Check Network tab for actual API response
3. Verify database has role column with correct values
4. Ensure backend includes role in JWT token payload (optional but recommended)

---

**Implementation Status**: ✅ Complete on Frontend
**Backend Status**: ⚠️ Requires Verification
