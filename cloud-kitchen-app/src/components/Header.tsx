import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Header: React.FC = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">Cloud Kitchen</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/menu">Menu</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/track-order">Track Order</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin">Admin</NavLink>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="btn btn-primary position-relative ms-lg-3">
                <i className="fas fa-shopping-cart me-1"></i>
                Cart
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalItems}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
