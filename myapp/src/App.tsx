import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { History } from './pages/History';
import Handcart from './pages/handcart';
import { AdminGuard } from './components/admin/AdminGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminCategories } from './pages/admin/Categories';
import { AdminBanners } from './pages/admin/Banners';
import { AdminOrders } from './pages/admin/Orders';
import { AdminUsers } from './pages/admin/Users';
import { AdminProducts } from './pages/admin/Products';
import { AdminGallery } from './pages/admin/Gallery';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <LoadingScreen isLoading={loading} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="profile" element={<Profile />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="history" element={<History />} />
              <Route path="90skidspecial" element={<Handcart />} />
            </Route>
            <Route
              path="admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
