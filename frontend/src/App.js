import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminGamesPage from './pages/admin/GamesPage';
import AdminGameFormPage from './pages/admin/GameFormPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminOrderDetailPage from './pages/admin/OrderDetailPage';
import AdminSalesReportPage from './pages/admin/SalesReportPage';
import AdminUsersReportPage from './pages/admin/UsersReportPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container-custom py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/game/:id" element={<GameDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Routes - Any authenticated user */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles="Admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles="Admin">
                  <AdminUsersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/games" element={
                <ProtectedRoute roles="Admin">
                  <AdminGamesPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/games/new" element={
                <ProtectedRoute roles="Admin">
                  <AdminGameFormPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/games/edit/:id" element={
                <ProtectedRoute roles="Admin">
                  <AdminGameFormPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute roles="Admin">
                  <AdminOrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders/:id" element={
                <ProtectedRoute roles="Admin">
                  <AdminOrderDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports/sales" element={
                <ProtectedRoute roles="Admin">
                  <AdminSalesReportPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports/users" element={
                <ProtectedRoute roles="Admin">
                  <AdminUsersReportPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
