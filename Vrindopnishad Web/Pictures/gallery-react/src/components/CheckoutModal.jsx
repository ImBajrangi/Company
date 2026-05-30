import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShoppingBag, Send, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Sparkles, Receipt } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, cartItems, onClearCart }) => {
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [processing, setProcessing] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('upi');

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setProcessing(false);
            setOrderId('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 99;
    const total = subtotal + shipping;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return formData.name && formData.email && formData.phone && formData.address && formData.pincode;
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!isFormValid()) return;
            setStep(2);
        } else if (step === 2) {
            // Process payment mockup
            setProcessing(true);
            setTimeout(() => {
                const generatedId = 'CVR-' + Math.floor(100000 + Math.random() * 900000);
                setOrderId(generatedId);
                setProcessing(false);
                setStep(3);
                onClearCart();
            }, 2500);
        }
    };

    const handlePrevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="checkout-modal-overlay" onClick={(e) => e.target.classList.contains('checkout-modal-overlay') && onClose()}>
            <div className="checkout-modal">
                <div className="checkout-modal-header">
                    <h2 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Poppins' }}>
                        <Sparkles size={20} className="text-gold" />
                        {step === 3 ? "Order Confirmed" : "Sacred Checkout"}
                    </h2>
                    {step !== 3 && (
                        <button className="cart-close-btn" onClick={onClose} aria-label="Close checkout">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="checkout-modal-body">
                    {/* Progress Bar */}
                    {step !== 3 && (
                        <div className="checkout-progress">
                            <div className="checkout-progress-line"></div>
                            <div 
                                className="checkout-progress-line-fill" 
                                style={{ width: step === 1 ? '0%' : '100%' }}
                            ></div>
                            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'complete' : ''}`}>
                                1
                            </div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'complete' : ''}`}>
                                2
                            </div>
                        </div>
                    )}

                    {/* Step 1: Shipping */}
                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Shipping Details</h3>
                            <div className="checkout-form-group">
                                <label className="checkout-label">Full Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    className="checkout-input" 
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="checkout-form-group">
                                    <label className="checkout-label">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className="checkout-input" 
                                        placeholder="name@domain.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className="checkout-form-group">
                                    <label className="checkout-label">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        className="checkout-input" 
                                        placeholder="10-digit number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="checkout-form-group">
                                <label className="checkout-label">Shipping Address</label>
                                <textarea 
                                    name="address" 
                                    className="checkout-input" 
                                    rows="3"
                                    placeholder="House No, Street name, Area details"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    style={{ resize: 'none' }}
                                    required 
                                />
                            </div>
                            <div className="checkout-form-group" style={{ maxWidth: '50%' }}>
                                <label className="checkout-label">Pincode</label>
                                <input 
                                    type="text" 
                                    name="pincode" 
                                    className="checkout-input" 
                                    placeholder="6-digit pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && !processing && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Choose Payment Mode</h3>
                            <div className="payment-options">
                                <div 
                                    className={`payment-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('upi')}
                                >
                                    <div className="payment-circle"></div>
                                    <div className="payment-meta">
                                        <div className="payment-name">UPI (GPay / PhonePe / Paytm)</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Instant verification with secure QR/UPI redirect</div>
                                    </div>
                                </div>
                                <div 
                                    className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <div className="payment-circle"></div>
                                    <div className="payment-meta">
                                        <div className="payment-name">Credit / Debit Card</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>All Indian and International Visa/Mastercards accepted</div>
                                    </div>
                                </div>
                                <div 
                                    className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <div className="payment-circle"></div>
                                    <div className="payment-meta">
                                        <div className="payment-name">Cash on Delivery (COD)</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Pay cash at your doorstep (Extra ₹49 COD fee applies)</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--dark-border)', borderRadius: '12px', padding: '16px', marginTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    <span>Sacred Art Items ({cartItems.length})</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                                </div>
                                {paymentMethod === 'cod' && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        <span>COD Fee</span>
                                        <span>₹49</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700', borderTop: '1px dashed var(--dark-border)', paddingTop: '10px', marginTop: '8px' }}>
                                    <span>Final Payable Amount</span>
                                    <span className="text-gold">₹{total + (paymentMethod === 'cod' ? 49 : 0)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Processing State */}
                    {processing && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '16px' }}>
                            <Loader2 size={48} className="animate-spin text-gold" style={{ color: 'var(--primary-gold)' }} />
                            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Securing Connection...</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>Connecting with Bank and preparing your divine artwork package...</p>
                        </div>
                    )}

                    {/* Step 3: Success Confirmation */}
                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="success-checkmark-wrapper">
                                <div className="success-checkmark">
                                    <CheckCircle2 size={36} />
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Poppins', color: '#3ec74f' }}>Jai Shri Radhe!</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                                    Your order has been received successfully.
                                </p>
                            </div>

                            {/* Digital Receipt */}
                            <div className="receipt-box">
                                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '15px', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <Receipt size={16} /> CHITRA VRINDA RECEIPT
                                </div>
                                <div className="receipt-line">
                                    <span>Order ID</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{orderId}</span>
                                </div>
                                <div className="receipt-line">
                                    <span>Date</span>
                                    <span>{new Date().toLocaleDateString('en-IN')}</span>
                                </div>
                                <div className="receipt-line">
                                    <span>Customer</span>
                                    <span>{formData.name}</span>
                                </div>
                                <div className="receipt-line">
                                    <span>Deliver To</span>
                                    <span style={{ maxWidth: '60%', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formData.address}</span>
                                </div>
                                <div className="receipt-divider"></div>
                                <div className="receipt-line">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="receipt-line">
                                    <span>Shipping</span>
                                    <span>₹{shipping}</span>
                                </div>
                                {paymentMethod === 'cod' && (
                                    <div className="receipt-line">
                                        <span>COD Fee</span>
                                        <span>₹49</span>
                                    </div>
                                )}
                                <div className="receipt-divider"></div>
                                <div className="receipt-total">
                                    <span>TOTAL PAID</span>
                                    <span>₹{total + (paymentMethod === 'cod' ? 49 : 0)}</span>
                                </div>
                            </div>

                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '8px' }}>
                                A confirmation invoice along with delivery tracking links has been sent to <strong>{formData.email}</strong>.
                            </p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {step === 1 && (
                        <button className="btn-checkout-nav prev" onClick={onClose}>
                            Cancel
                        </button>
                    )}
                    {step === 2 && !processing && (
                        <button className="btn-checkout-nav prev" onClick={handlePrevStep}>
                            <ChevronLeft size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                            Back
                        </button>
                    )}

                    {step !== 3 ? (
                        !processing && (
                            <button 
                                className="btn-checkout-nav next"
                                onClick={handleNextStep}
                                disabled={step === 1 && !isFormValid()}
                                style={{ opacity: step === 1 && !isFormValid() ? 0.5 : 1, cursor: step === 1 && !isFormValid() ? 'not-allowed' : 'pointer' }}
                            >
                                {step === 1 ? "Next: Payment" : "Complete Order"}
                                <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
                            </button>
                        )
                    ) : (
                        <button className="checkout-btn" onClick={onClose}>
                            Return to Gallery
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
