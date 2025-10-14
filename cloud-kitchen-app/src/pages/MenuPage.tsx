import React from 'react';
import { menuItems, type MenuItem } from '../data/menuData'; // Use type-only import for MenuItem
import { useCart } from '../hooks/useCart';

const MenuPage: React.FC = () => {
  const { addToCart } = useCart();

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Our Delicious Menu</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {menuItems.map((item: MenuItem) => (
          <div className="col d-flex align-items-stretch" key={item.id}>
            <div className="card shadow-sm w-100">
              <img src={item.imageUrl} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text flex-grow-1">{item.description}</p>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <span className="fs-5 fw-bold">${item.price.toFixed(2)}</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
