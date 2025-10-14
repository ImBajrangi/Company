import React, { useEffect, useContext } from 'react';
import { CartContext } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
    const { cart, getTotalPrice } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
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

        const displayRazorpay = async () => {
            const res = await loadRazorpayScript();

            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // In a real application, you would make an API call to your backend
            // to create an order and get an order ID from Razorpay.
            // For now, we'll simulate this.
            const totalAmount = getTotalPrice() * 100; // Razorpay expects amount in paisa

            const options = {
                key: 'rzp_test_RTQH29QuP5UmW', // Enter the Key ID generated from the Dashboard
                amount: totalAmount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 means 50000 paise or Rs 500.
                currency: 'INR',
                name: 'Cloud Kitchen',
                description: 'Order Payment',
                // This 'order_id' would typically come from your backend
                // order_id: 'order_xxxxxxxxxxxxxx',
                handler: function (response: any) {
                    // This function is executed after successful payment
                    // In a real application, you would send this response to your backend for signature verification.
                    // If verification is successful, you would then update your order status in the database.
                    console.log('Payment successful:', response);
                    alert('Payment Successful! Redirecting to order confirmation...');
                    navigate('/order-confirmation', { state: { paymentSuccess: true, paymentId: response.razorpay_payment_id } });
                },
                prefill: {
                    name: 'John Doe', // User's name
                    email: 'john.doe@example.com', // User's email
                    contact: '9999999999', // User's phone number
                },
                notes: {
                    address: 'Razorpay Corporate Office',
                },
                theme: {
                    color: '#3399CC',
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        };

        displayRazorpay();
    }, [cart, navigate, getTotalPrice]);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Processing your payment...</h1>
            <p className="text-center">Please do not close this window.</p>
        </div>
    );
};

export default CheckoutPage;
