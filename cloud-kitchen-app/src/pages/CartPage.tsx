import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container my-5 fade-in">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <img src="https://images.unsplash.com/photo-1575429321389-645c4bba45dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Empty Cart" style={{ width: '250px' }} />
          <h3 className="mt-4">Your cart is empty</h3>
          <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/menu" className="btn btn-primary mt-3">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {cartItems.map(item => (
              <div key={item.id} className="card mb-3 border-0 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-3">
                    <img src={item.image} alt={item.name} className="img-fluid" style={{ height: '100%', objectFit: 'cover', borderRadius: '20px 0 0 20px' }} />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title">{item.name}</h5>
                          <p className="card-text"><small className="text-muted">Quantity: {item.quantity}</small></p>
                        </div>
                        <p className="h5">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button className="btn btn-sm btn-outline-danger mt-3" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                    Subtotal
                    <span>${total.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                    Delivery Fee
                    <span>$5.00</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent h5 fw-bold">
                    Total
                    <span>${(total + 5).toFixed(2)}</span>
                  </li>
                </ul>
                <div className="d-grid mt-4">
                  <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
