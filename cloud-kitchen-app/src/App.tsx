import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage'; // Import CheckoutPage
import OrderConfirmationPage from './pages/OrderConfirmationPage'; // Import OrderConfirmationPage
// import { CartProvider } from './context/CartContext'; // Remove this import as it's provided in main.tsx
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      {/* <CartProvider> Remove this redundant CartProvider */}
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 fade-in">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} /> {/* Add Checkout Route */}
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} /> {/* Add Order Confirmation Route */}
              <Route path="/track-order" element={<OrderTrackingPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      {/* </CartProvider> */}
    </Router>
  );
};

export default App;
