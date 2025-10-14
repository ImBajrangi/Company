import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { Order } from '../context/CartContext';

const OrderConfirmationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { paymentSuccess, order } = (location.state as { paymentSuccess: boolean; order: Order }) || {};

    if (!paymentSuccess || !order) {
        // If directly accessed or payment wasn't successful, redirect to home
        React.useEffect(() => {
            navigate('/');
        }, [navigate]);
        return null; // Render nothing while redirecting
    }

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
                <div className="text-center">
                    <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '4rem' }}></i>
                    <h1 className="mb-3">Order Confirmed!</h1>
                    <p className="lead">Thank you for your purchase, {order.customer.name}.</p>
                    <p className="text-muted">Payment ID: <strong>{order.paymentId}</strong></p>
                </div>

                <div className="mt-4">
                    <h4>Order Summary</h4>
                    <ul className="list-group mb-3">
                        {order.items.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {item.name} x {item.quantity}
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <h5>Total: ${order.total.toFixed(2)}</h5>
                </div>

                <div className="mt-4">
                    <h4>Delivery Details</h4>
                    <p>
                        <strong>Address:</strong> {order.customer.address}<br />
                        <strong>Contact:</strong> {order.customer.contact}
                    </p>
                </div>

                <div className="text-center mt-4">
                    <Link to={`/track-order?orderId=${order.id}`} className="btn btn-info me-2">
                        Track Your Order
                    </Link>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
