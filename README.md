# PMUMS Frontend Application

**प्राथमिक-माध्यमिक-उच्च-माध्यमिक शिक्षक संघ, मध्यप्रदेश**  
*शिक्षक कल्याण कोष योजना - एकता में शक्ति*

## Project Overview

PMUMS is a non-profit teacher welfare organization for Madhya Pradesh government education department employees. When a teacher/employee dies unexpectedly, PMUMS provides financial assistance to their family through voluntary donations from other teachers across the state.

## Tech Stack

- **Frontend Framework**: React 18
- **Styling**: Custom CSS Utilities + Material-UI (MUI)
- **Routing**: React Router v6
- **State Management**: Context API + React Query
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Material-UI Icons

## Features Implemented ✅

### 🏗️ Core Infrastructure
- [x] Complete project scaffolding with modern React setup
- [x] Material-UI theme with PMUMS branding colors
- [x] Custom CSS utilities for blue and white theme styling
- [x] Responsive layout with Header/Footer components
- [x] API service with interceptors for auth and error handling
- [x] Authentication context with JWT token management
- [x] Protected route wrapper for authenticated pages
- [x] Toast notification system

### 🔐 Authentication System
- [x] Login page with form validation
- [x] Multi-step registration form with:
  - Personal information (name, email, phone, DOB)
  - Work details (employee ID, designation, district/block)
  - Account security (password with confirmation)
- [x] District and Block selection dropdowns
- [x] Password strength validation
- [x] Token-based authentication with auto-logout on expiry

### 🏠 Public Pages
- [x] Modern home page with:
  - Hero section with PMUMS mission
  - Statistics dashboard (members, helped families, donations)
  - Active death cases with donation progress bars
  - Mission statement and values
- [x] Fully responsive design for mobile/tablet/desktop

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend API running on `http://localhost:8080` (configurable)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env
```

3. **Start development server**:
```bash
npm start
```

The app will open at `http://localhost:3000`

## API Integration

The frontend expects these backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Locations
- `GET /api/locations/districts` - Get all districts
- `GET /api/locations/blocks/{districtId}` - Get blocks by district

## Next Steps 🚀

### Phase 1: Core User Features (Week 1-2)
- [ ] User Dashboard with contribution summary
- [ ] Receipt Upload page with file preview
- [ ] My Contributions page with status tracking
- [ ] User Profile management

### Phase 2: Death Case Management (Week 3)
- [ ] Death Cases listing page
- [ ] Case details with donation progress
- [ ] Create new death case form (for family/admin)

### Phase 3: Admin Features (Week 4)
- [ ] Admin Dashboard with analytics
- [ ] Receipt verification interface
- [ ] User management and reports

## Styling Approach

We use **Custom CSS Utilities + Material-UI**:
- **Custom CSS Utilities**: Hand-crafted utility classes for the blue/white theme
- **Material-UI**: For complex components (forms, tables, modals)
- **Responsive Design**: Mobile-first approach with CSS media queries

### Blue & White Theme
- **Primary Colors**: Deep blue (#1565c0) for headers, buttons, and accents  
- **Background**: Pure white (#ffffff) for clean, professional look
- **Utilities**: Custom classes like `.bg-primary-600`, `.text-primary-700`, etc.

---

**Built with ❤️ for the PMUMS community**  
*सेवा, सहयोग और शिक्षक-कल्याण*

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
