import React, { useEffect, useRef } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQty, onRemove, onCheckout }) => {
    const drawerRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Disable document scroll
            document.body.style.overflow = 'hidden';

            // Animation
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
            gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: 'power3.out' });
        } else {
            document.body.style.overflow = '';
            
            // Animation
            gsap.to(drawerRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' });
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' });
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const subtotal = calculateSubtotal();
    const shipping = subtotal > 1000 ? 0 : subtotal === 0 ? 0 : 99;
    const total = subtotal + shipping;

    return (
        <>
            {/* Overlay */}
            <div 
                ref={overlayRef}
                className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
                style={{ opacity: 0 }}
            />

            {/* Side Drawer */}
            <div 
                ref={drawerRef}
                className={`cart-drawer ${isOpen ? 'active' : ''}`}
                style={{ transform: 'translateX(100%)' }}
            >
                <div className="cart-header">
                    <h2 className="cart-title">
                        <ShoppingBag size={22} className="text-gold" />
                        Divine Cart ({cartItems.length})
                    </h2>
                    <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items-container">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty-state">
                            <ShoppingBag size={64} className="cart-empty-icon" />
                            <h3>Your cart is empty</h3>
                            <p>Bring sacred essence and divine vibes to your space.</p>
                            <button className="checkout-btn" style={{ marginTop: '16px', maxWidth: '240px' }} onClick={onClose}>
                                Continue Browsing
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.cartId} className="cart-item">
                                <img src={item.image} alt={item.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <div>
                                        <h3 className="cart-item-name">{item.title}</h3>
                                        <p className="cart-item-spec">
                                            {item.mediaType} • {item.size}
                                        </p>
                                    </div>
                                    <div className="cart-item-bottom">
                                        <div className="quantity-controller">
                                            <button 
                                                className="qty-btn"
                                                onClick={() => onUpdateQty(item.cartId, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="qty-val">{item.quantity}</span>
                                            <button 
                                                className="qty-btn"
                                                onClick={() => onUpdateQty(item.cartId, item.quantity + 1)}
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <span className="cart-item-price">₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                                <button 
                                    className="cart-item-remove-btn"
                                    onClick={() => onRemove(item.cartId)}
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? <span style={{ color: '#3ec74f' }}>FREE</span> : `₹${shipping}`}</span>
                        </div>
                        <div className="cart-summary-total">
                            <span>Total</span>
                            <span className="text-gold">₹{total}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="checkout-btn" onClick={onCheckout}>
                                Proceed to Checkout
                                <ArrowRight size={18} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#888' }}>
                                <ShieldCheck size={14} color="#3ec74f" /> Secure Checkout & SSL Encrypted
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
