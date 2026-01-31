import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import Landing from './pages/Landing';
import HomeNew from './pages/HomeNew';
import Login from './pages/Login';
import { useAuth } from './features/auth/AuthContext';
import ProductsEnhanced from './pages/ProductsEnhanced';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import PreferencesSetup from './pages/PreferencesSetup';
import FreshieBot from './pages/FreshieBot';
import KioskLogin from './pages/KioskLogin';
import KioskDashboard from './pages/KioskDashboard';
import KioskCheckout from './pages/KioskCheckout';
import AdminRoute from './features/auth/AdminRoute';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCustomers from './pages/admin/Customers';
import AdminOrders from './pages/admin/Orders';
import AdminAnalytics from './pages/admin/Analytics';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import ShippingDelivery from './pages/ShippingDelivery';

function App() {
  return (
    <Box minH="100vh">
      <ScrollToTop />
      <RenderNavbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeProtected />} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/preferences-setup" element={<PageWrapper><PreferencesSetup /></PageWrapper>} />
        <Route path="/freshiebot" element={<PageWrapper><FreshieBot /></PageWrapper>} />
        <Route path="/products" element={<PageWrapper><ProductsEnhanced /></PageWrapper>} />
        <Route path="/products/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />

        {/* Kiosk Routes */}
        <Route path="/kiosk-login" element={<KioskLogin />} />
        <Route path="/kiosk-dashboard" element={<KioskDashboard />} />
        <Route path="/kiosk-checkout" element={<KioskCheckout />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="orders" element={<AdminOrders />} />
                {/* Fallback to dashboard */}
                <Route path="*" element={<AdminDashboard />} />
              </Routes>
            </AdminRoute>
          }
        />

        <Route path="/about" element={<PageWrapper><Box p={20}>About Page Coming Soon</Box></PageWrapper>} />

        {/* Legal & Info Pages */}
        <Route path="/privacy-policy" element={<PageWrapper><Privacy /></PageWrapper>} />
        <Route path="/terms-of-service" element={<PageWrapper><Terms /></PageWrapper>} />
        <Route path="/cookie-policy" element={<PageWrapper><Cookies /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactUs /></PageWrapper>} />
        <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
        <Route path="/shipping" element={<PageWrapper><ShippingDelivery /></PageWrapper>} />
      </Routes>

      <RenderFooter />
    </Box>
  );
}

const RenderNavbar = () => {
  const location = useLocation();

  // Hide navbar on Kiosk or Admin pages
  if (location.pathname.startsWith('/kiosk') || location.pathname.startsWith('/admin')) {
    return null;
  }
  return <Navbar />;
}

const RenderFooter = () => {
  const location = useLocation();

  // Hide footer on Kiosk or Admin pages
  if (location.pathname.startsWith('/kiosk') || location.pathname.startsWith('/admin')) {
    return null;
  }
  return <Footer />;
}

const PageWrapper = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Home page handles its own spacing
  if (isHomePage) {
    return children;
  }

  // Add padding top for all other pages
  return (
    <Box pt="70px">
      {children}
    </Box>
  );
}

// Home Protected Component - Shows Landing for guests, HomeNew for logged-in users
const HomeProtected = () => {
  const { user } = useAuth();
  
  if (user) {
    return <HomeNew />;
  }
  
  return <Landing />;
}

export default App;
