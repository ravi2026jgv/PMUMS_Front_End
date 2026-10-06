// import React, { useEffect, useMemo } from 'react';
// import {
//   BrowserRouter as Router,
//   Navigate,
//   Route,
//   Routes,
//   useLocation,
//   useParams,
// } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline } from '@mui/material';
// import { Toaster } from 'react-hot-toast';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import theme from './theme/theme';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import AnnouncementPopup from './components/AnnouncementPopup';
// import FloatingWhatsApp from './components/FloatingWhatsApp';

// import PortalSelector from './portal/PortalSelector';
// import PortalUpcoming from './portal/PortalUpcoming';
// import PortalNotFound from './portal/PortalNotFound';
// import { PortalProvider, usePortal } from './portal/PortalContext';
// import { getPortalBySlug } from './portal/portalConfig';
// import { resolvePortalPage } from './portal/portalModuleRegistry';

// // Shared/default pages. Portal modules can override any of these page keys.
// import NomineeSahyogPage from './pages/NomineeSahyogPage';
// import Home from './pages/Home';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import ForgotPassword from './pages/auth/ForgotPassword';
// import Profile from './pages/Profile';
// import Dashboard from './pages/Dashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import ManagerDashboard from './pages/ManagerDashboard';
// import About from './pages/About';
// import RoleBasedDashboard from './components/RoleBasedDashboard';
// import QueryManagement from './components/QueryManagement';
// import NonDonorList from './components/NonDonorList';
// import TeachersList from './pages/TeachersList';
// import NiyamawaliPage from './pages/Niyamawali';
// import SahyogList from './pages/SahyogList';
// import AsahyogList from './pages/AsahyogList';
// import ContactUs from './pages/ContactUs';
// import DeathCase from './components/DeathCase';
// import SelfDonation from './pages/SelfDonationPage';
// import ZeroUtrList from './pages/ZeroUtrList';
// import PendingProfilesList from './pages/PendingProfilesList';
// import BinUsersList from './pages/BinUsersList';
// import DeceasedMembersList from './pages/DeceasedMembersList';
// import Blog from './pages/Blog';

// const createPortalQueryClient = () =>
//   new QueryClient({
//     defaultOptions: {
//       queries: {
//         retry: 1,
//         staleTime: 5 * 60 * 1000,
//       },
//     },
//   });

//   const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// };

// const LegacyTab1Redirect = () => {
//   const location = useLocation();
//   return (
//     <Navigate
//       to={`/portal/tab1${location.pathname}${location.search}${location.hash}`}
//       replace
//     />
//   );
// };

// const PortalRoutes = () => {
//   const { portalSlug } = usePortal();
//   const page = (pageKey, SharedPage) =>
//     React.createElement(resolvePortalPage(portalSlug, pageKey, SharedPage));

//   return (
//     <>
//       <Routes>
//         {/* Public routes */}
//         <Route index element={page('home', Home)} />
//         <Route path="login" element={page('login', Login)} />
//         <Route path="register" element={page('register', Register)} />
//         <Route path="forgot-password" element={page('forgotPassword', ForgotPassword)} />
//         <Route path="about" element={page('about', About)} />
//         <Route path="teachers-list" element={page('teachersList', TeachersList)} />
//         <Route path="sahyog-list" element={page('sahyogList', SahyogList)} />
//         <Route path="asahyog-list" element={page('asahyogList', AsahyogList)} />
//         <Route path="niyamawali" element={page('niyamawali', NiyamawaliPage)} />
//         <Route path="nominee-sahyog" element={page('nomineeSahyog', NomineeSahyogPage)} />
//         <Route path="contact-us" element={page('contactUs', ContactUs)} />
//         <Route path="blog" element={page('blog', Blog)} />
//         <Route path="zero-utr-list" element={page('zeroUtrList', ZeroUtrList)} />
//         <Route path="self-donation" element={page('selfDonation', SelfDonation)} />
//         <Route path="pending-profiles" element={page('pendingProfiles', PendingProfilesList)} />
//         <Route path="bin-users" element={page('binUsers', BinUsersList)} />
//         <Route path="deceased-members" element={page('deceasedMembers', DeceasedMembersList)} />

//         {/* Protected routes */}
//         <Route
//           path="sahyog"
//           element={<ProtectedRoute>{page('sahyog', DeathCase)}</ProtectedRoute>}
//         />
//         <Route
//           path="dashboard"
//           element={<ProtectedRoute>{page('dashboard', Dashboard)}</ProtectedRoute>}
//         />
//         <Route
//           path="admin/dashboard"
//           element={
//             <ProtectedRoute requiredRoles={['SUPERADMIN', 'ADMIN']}>
//               {page('adminDashboard', AdminDashboard)}
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="manager/dashboard"
//           element={
//             <ProtectedRoute
//               requiredRoles={['SAMBHAG_MANAGER', 'DISTRICT_MANAGER', 'BLOCK_MANAGER']}
//             >
//               {page('managerDashboard', ManagerDashboard)}
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="sambhag/dashboard"
//           element={
//             <ProtectedRoute requiredRole="SAMBHAG_MANAGER">
//               {page('sambhagDashboard', RoleBasedDashboard)}
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="district/dashboard"
//           element={
//             <ProtectedRoute requiredRole="DISTRICT_MANAGER">
//               {page('districtDashboard', RoleBasedDashboard)}
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="block/dashboard"
//           element={
//             <ProtectedRoute requiredRole="BLOCK_MANAGER">
//               {page('blockDashboard', RoleBasedDashboard)}
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="admin/queries"
//           element={
//             <ProtectedRoute requiredRoles={['SUPERADMIN', 'ADMIN']}>
//               {page('queryManagement', QueryManagement)}
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="admin/non-donors"
//           element={
//             <ProtectedRoute requiredRoles={['SUPERADMIN', 'ADMIN']}>
//               {page('nonDonors', NonDonorList)}
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="profile"
//           element={<ProtectedRoute>{page('profile', Profile)}</ProtectedRoute>}
//         />

//         <Route path="*" element={<PortalNotFound />} />
//       </Routes>

//       <AnnouncementPopup />
//       <FloatingWhatsApp />
//     </>
//   );
// };

// const ActivePortalApplication = ({ portal }) => {
//   const queryClient = useMemo(() => createPortalQueryClient(), [portal.slug]);

//   return (
//     <PortalProvider portal={portal}>
//       <QueryClientProvider client={queryClient}>
//         <AuthProvider>
//           <PortalRoutes />
//         </AuthProvider>
//       </QueryClientProvider>
//     </PortalProvider>
//   );
// };

// const PortalApplication = () => {
//   const { portalSlug } = useParams();
//   const portal = getPortalBySlug(portalSlug);

//   if (!portal) {
//     return <Navigate to="/" replace />;
//   }

//   if (!portal.enabled) {
//     return <PortalUpcoming portal={portal} />;
//   }

//   return <ActivePortalApplication key={portal.slug} portal={portal} />;
// };

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <ScrollToTop />
//         <Routes>
//           <Route path="/" element={<PortalSelector />} />
//           <Route path="/portal/:portalSlug/*" element={<PortalApplication />} />

//           {/* Backward compatibility: current production links open in Portal 1. */}
//           <Route path="/login" element={<LegacyTab1Redirect />} />
//           <Route path="/register" element={<LegacyTab1Redirect />} />
//           <Route path="/forgot-password" element={<LegacyTab1Redirect />} />
//           <Route path="/about" element={<LegacyTab1Redirect />} />
//           <Route path="/teachers-list" element={<LegacyTab1Redirect />} />
//           <Route path="/sahyog-list" element={<LegacyTab1Redirect />} />
//           <Route path="/asahyog-list" element={<LegacyTab1Redirect />} />
//           <Route path="/niyamawali" element={<LegacyTab1Redirect />} />
//           <Route path="/nominee-sahyog" element={<LegacyTab1Redirect />} />
//           <Route path="/contact-us" element={<LegacyTab1Redirect />} />
//           <Route path="/blog" element={<LegacyTab1Redirect />} />
//           <Route path="/zero-utr-list" element={<LegacyTab1Redirect />} />
//           <Route path="/self-donation" element={<LegacyTab1Redirect />} />
//           <Route path="/pending-profiles" element={<LegacyTab1Redirect />} />
//           <Route path="/bin-users" element={<LegacyTab1Redirect />} />
//           <Route path="/deceased-members" element={<LegacyTab1Redirect />} />
//           <Route path="/sahyog" element={<LegacyTab1Redirect />} />
//           <Route path="/dashboard" element={<LegacyTab1Redirect />} />
//           <Route path="/admin/*" element={<LegacyTab1Redirect />} />
//           <Route path="/manager/*" element={<LegacyTab1Redirect />} />
//           <Route path="/sambhag/*" element={<LegacyTab1Redirect />} />
//           <Route path="/district/*" element={<LegacyTab1Redirect />} />
//           <Route path="/block/*" element={<LegacyTab1Redirect />} />
//           <Route path="/profile" element={<LegacyTab1Redirect />} />

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>

//         <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 4000,
//             style: {
//               background: '#363636',
//               color: '#fff',
//             },
//           }}
//         />
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;
import React, { useEffect, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AnnouncementPopup from './components/AnnouncementPopup';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// ============================================================
// TEMPORARILY DISABLED:
// Portal selection screen.
//
// Later, when you want Tab 1 / Tab 2 selection back,
// simply uncomment this import and the original "/" route below.
// ============================================================

// import PortalSelector from './portal/PortalSelector';

import PortalUpcoming from './portal/PortalUpcoming';
import PortalNotFound from './portal/PortalNotFound';
import { PortalProvider, usePortal } from './portal/PortalContext';
import { getPortalBySlug } from './portal/portalConfig';
import { resolvePortalPage } from './portal/portalModuleRegistry';

// Shared/default pages.
// Portal modules can override any of these page keys.
import NomineeSahyogPage from './pages/NomineeSahyogPage';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import About from './pages/About';
import RoleBasedDashboard from './components/RoleBasedDashboard';
import QueryManagement from './components/QueryManagement';
import NonDonorList from './components/NonDonorList';
import TeachersList from './pages/TeachersList';
import NiyamawaliPage from './pages/Niyamawali';
import SahyogList from './pages/SahyogList';
import AsahyogList from './pages/AsahyogList';
import ContactUs from './pages/ContactUs';
import DeathCase from './components/DeathCase';
import SelfDonation from './pages/SelfDonationPage';
import ZeroUtrList from './pages/ZeroUtrList';
import PendingProfilesList from './pages/PendingProfilesList';
import BinUsersList from './pages/BinUsersList';
import DeceasedMembersList from './pages/DeceasedMembersList';
import Blog from './pages/Blog';

const createPortalQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    },
  });

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/**
 * Keeps old URLs working.
 *
 * Example:
 * /login
 *
 * becomes:
 * /portal/tab1/login
 */
const LegacyTab1Redirect = () => {
  const location = useLocation();

  return (
    <Navigate
      to={`/portal/tab1${location.pathname}${location.search}${location.hash}`}
      replace
    />
  );
};

const PortalRoutes = () => {
  const { portalSlug } = usePortal();

  const page = (pageKey, SharedPage) =>
    React.createElement(
      resolvePortalPage(portalSlug, pageKey, SharedPage)
    );

  return (
    <>
      <Routes>
        {/* ====================================================
            PUBLIC ROUTES
        ==================================================== */}

        <Route index element={page('home', Home)} />

        <Route
          path="login"
          element={page('login', Login)}
        />

        <Route
          path="register"
          element={page('register', Register)}
        />

        <Route
          path="forgot-password"
          element={page('forgotPassword', ForgotPassword)}
        />

        <Route
          path="about"
          element={page('about', About)}
        />

        <Route
          path="teachers-list"
          element={page('teachersList', TeachersList)}
        />

        <Route
          path="sahyog-list"
          element={page('sahyogList', SahyogList)}
        />

        <Route
          path="asahyog-list"
          element={page('asahyogList', AsahyogList)}
        />

        <Route
          path="niyamawali"
          element={page('niyamawali', NiyamawaliPage)}
        />

        <Route
          path="nominee-sahyog"
          element={page('nomineeSahyog', NomineeSahyogPage)}
        />

        <Route
          path="contact-us"
          element={page('contactUs', ContactUs)}
        />

        <Route
          path="blog"
          element={page('blog', Blog)}
        />

        <Route
          path="zero-utr-list"
          element={page('zeroUtrList', ZeroUtrList)}
        />

        <Route
          path="self-donation"
          element={page('selfDonation', SelfDonation)}
        />

        <Route
          path="pending-profiles"
          element={page('pendingProfiles', PendingProfilesList)}
        />

        <Route
          path="bin-users"
          element={page('binUsers', BinUsersList)}
        />

        <Route
          path="deceased-members"
          element={page('deceasedMembers', DeceasedMembersList)}
        />

        {/* ====================================================
            PROTECTED ROUTES
        ==================================================== */}

        <Route
          path="sahyog"
          element={
            <ProtectedRoute>
              {page('sahyog', DeathCase)}
            </ProtectedRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              {page('dashboard', Dashboard)}
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute requiredRoles={['SUPERADMIN', 'ADMIN']}>
              {page('adminDashboard', AdminDashboard)}
            </ProtectedRoute>
          }
        />

        <Route
          path="manager/dashboard"
          element={
            <ProtectedRoute
              requiredRoles={[
                'SAMBHAG_MANAGER',
                'DISTRICT_MANAGER',
                'BLOCK_MANAGER',
              ]}
            >
              {page('managerDashboard', ManagerDashboard)}
            </ProtectedRoute>
          }
        />

        <Route
          path="sambhag/dashboard"
          element={
            <ProtectedRoute requiredRole="SAMBHAG_MANAGER">
              {page('sambhagDashboard', RoleBasedDashboard)}
            </ProtectedRoute>
          }
        />

        <Route
          path="district/dashboard"
          element={
            <ProtectedRoute requiredRole="DISTRICT_MANAGER">
              {page('districtDashboard', RoleBasedDashboard)}
            </ProtectedRoute>
          }
        />

        <Route
          path="block/dashboard"
          element={
            <ProtectedRoute requiredRole="BLOCK_MANAGER">
              {page('blockDashboard', RoleBasedDashboard)}
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/queries"
          element={
            <ProtectedRoute requiredRoles={['SUPERADMIN', 'ADMIN']}>
              {page('queryManagement', QueryManagement)}
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/non-donors"
          element={
            <ProtectedRoute requiredRoles={['SUPERADMIN', 'ADMIN']}>
              {page('nonDonors', NonDonorList)}
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              {page('profile', Profile)}
            </ProtectedRoute>
          }
        />

        {/* Portal-specific 404 */}
        <Route
          path="*"
          element={<PortalNotFound />}
        />
      </Routes>

      <AnnouncementPopup />
      <FloatingWhatsApp />
    </>
  );
};

const ActivePortalApplication = ({ portal }) => {
  const queryClient = useMemo(
    () => createPortalQueryClient(),
    [portal.slug]
  );

  return (
    <PortalProvider portal={portal}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PortalRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </PortalProvider>
  );
};

const PortalApplication = () => {
  const { portalSlug } = useParams();

  const portal = getPortalBySlug(portalSlug);

  // Invalid portal
  if (!portal) {
    return <Navigate to="/" replace />;
  }

  // Portal exists but is currently disabled
  if (!portal.enabled) {
    return <PortalUpcoming portal={portal} />;
  }

  return (
    <ActivePortalApplication
      key={portal.slug}
      portal={portal}
    />
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <ScrollToTop />

        <Routes>

          {/* ==================================================
              ORIGINAL PORTAL SELECTION ROUTE

              TEMPORARILY COMMENTED.

              Later, when you need Tab 1 / Tab 2 selection back,
              uncomment PortalSelector import above and this route.
          ================================================== */}

          {/*
          <Route
            path="/"
            element={<PortalSelector />}
          />
          */}


          {/* ==================================================
              TEMPORARY CONFIGURATION

              Open Teacher / Tab 1 directly when user visits:
              https://pmums.com/

              Result:
              /
              ->
              /portal/tab1
          ================================================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/portal/tab1"
                replace
              />
            }
          />


          {/* ==================================================
              PORTAL ROUTES
          ================================================== */}

          <Route
            path="/portal/:portalSlug/*"
            element={<PortalApplication />}
          />


          {/* ==================================================
              BACKWARD COMPATIBILITY

              Existing production URLs continue working.

              Example:
              /login
              becomes
              /portal/tab1/login
          ================================================== */}

          <Route
            path="/login"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/register"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/forgot-password"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/about"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/teachers-list"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/sahyog-list"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/asahyog-list"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/niyamawali"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/nominee-sahyog"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/contact-us"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/blog"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/zero-utr-list"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/self-donation"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/pending-profiles"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/bin-users"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/deceased-members"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/sahyog"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/dashboard"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/admin/*"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/manager/*"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/sambhag/*"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/district/*"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/block/*"
            element={<LegacyTab1Redirect />}
          />

          <Route
            path="/profile"
            element={<LegacyTab1Redirect />}
          />


          {/* ==================================================
              FALLBACK

              Any unknown main URL will go to "/",
              and "/" will then redirect to Teacher / Tab 1.
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;