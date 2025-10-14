import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import type { Order } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
    const { cart, getTotalPrice, clearCart, addOrder } = useContext(CartContext)!;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            navigate('/cart');
            return;
        }

        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const totalAmount = getTotalPrice() * 100; // Razorpay expects amount in paisa

        const options = {
            key: 'rzp_test_1DPv2h2aY2L3kZ', // Enter the Key ID generated from the Dashboard
            amount: totalAmount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 means 50000 paise or Rs 500.
            currency: 'INR',
            name: 'Cloud Kitchen',
            description: 'Order Payment',
            handler: function (response: any) {
                const newOrder: Order = {
                    id: response.razorpay_payment_id,
                    customer: formData,
                    items: cart,
                    total: getTotalPrice(),
                    status: 'Received',
                    paymentId: response.razorpay_payment_id,
                };
                addOrder(newOrder);
                clearCart();
                navigate('/order-confirmation', { state: { paymentSuccess: true, order: newOrder } });
            },
            prefill: {
                name: formData.name,
                email: 'test@example.com', // You can add an email field to your form as well
                contact: formData.contact,
            },
            notes: {
                address: formData.address,
            },
            theme: {
                color: '#3399CC',
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Checkout</h1>
            <div className="row">
                <div className="col-md-6">
                    <h4>Delivery Information</h4>
                    <form onSubmit={handlePlaceOrder}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Delivery Address</label>
                            <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contact" className="form-label">Contact Number</label>
                            <input type="text" className="form-control" id="contact" name="contact" value={formData.contact} onChange={handleInputChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Place Order</button>
                    </form>
                </div>
                <div className="col-md-6">
                    <h4>Order Summary</h4>
                    <ul className="list-group mb-3">
                        {cart.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {item.name} x {item.quantity}
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <h4>Total: ${getTotalPrice().toFixed(2)}</h4>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
