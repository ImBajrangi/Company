import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../hooks/useCart';

const OrderConfirmationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    const { paymentSuccess, paymentId } = location.state || {};

    useEffect(() => {
        // Clear the cart only if payment was successful
        if (paymentSuccess) {
            clearCart();
        }
    }, [paymentSuccess, clearCart]);

    if (!paymentSuccess) {
        // If directly accessed or payment wasn't successful, redirect to home or cart
        useEffect(() => {
            alert('No successful payment found. Redirecting to home.');
            navigate('/');
        }, [navigate]);
        return null; // Render nothing while redirecting
    }

    return (
        <div className="container mt-5 text-center">
            <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
                <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '4rem' }}></i>
                <h1 className="mb-3">Order Confirmed!</h1>
                <p className="lead">Thank you for your purchase.</p>
                {paymentId && (
                    <p className="text-muted">Payment ID: <strong>{paymentId}</strong></p>
                )}
                <p>Your order has been placed successfully and will be processed shortly.</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
