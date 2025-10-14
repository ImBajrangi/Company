import React, { useContext } from 'react';
import { useCart, CartContext } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    } else {
      alert('Your cart is empty. Add items before proceeding to checkout.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <ul className="list-group mb-4">
              {cartItems.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }} className="rounded" />
                    <div>
                      <h6 className="my-0">{item.name}</h6>
                      <small className="text-muted">${item.price.toFixed(2)} each</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="btn-group btn-group-sm me-2" role="group" aria-label="Quantity controls">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span className="btn btn-light quantity-display">{item.quantity}</span>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>
                    <span className="text-nowrap me-3">${(item.price * item.quantity).toFixed(2)}</span>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="card p-3 shadow-sm">
              <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <button className="btn btn-success btn-lg w-100 mt-3" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
