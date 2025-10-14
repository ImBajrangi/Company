import React from 'react';
import { Link } from 'react-router-dom';
import { menuItems, type MenuItem } from '../data/menuData';
import { useCart } from '../hooks/useCart';

const HomePage: React.FC = () => {
  const { addToCart } = useCart();

  // Taking the first 3 menu items to feature on the homepage
  const featuredItems = menuItems.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-white bg-primary py-5 text-center d-flex align-items-center justify-content-center" style={{ minHeight: '70vh', backgroundImage: 'url(https://via.placeholder.com/1200x800/FFD700/8B4513?text=Delicious+Food+Spread)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <div className="p-5 rounded-3 bg-dark bg-opacity-75">
            <h1 className="display-4 fw-bold mb-3">Taste the Convenience. Love the Food.</h1>
            <p className="fs-5 mb-4">Your culinary journey starts here. Fresh, fast, and flavorful meals delivered to your door.</p>
            <Link to="/menu" className="btn btn-light btn-lg text-primary fw-bold">
              Order Now <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Menu Items Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Our Featured Dishes</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {featuredItems.map((item: MenuItem) => (
              <div className="col d-flex align-items-stretch" key={item.id}>
                <div className="card shadow-sm w-100">
                  <img src={item.imageUrl} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text flex-grow-1">{item.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="fs-5 fw-bold">${item.price.toFixed(2)}</span>
                      <button 
                        className="btn btn-primary btn-sm"
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
          <div className="text-center mt-5">
            <Link to="/menu" className="btn btn-outline-primary btn-lg">
              View Full Menu <i className="fas fa-utensils ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Cloud Kitchen?</h2>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 d-flex flex-column justify-content-center align-items-center bg-white shadow-sm">
                <i className="fas fa-leaf fa-3x text-success mb-3"></i>
                <h3 className="h5">Fresh Ingredients</h3>
                <p className="text-muted">We source only the freshest, high-quality ingredients for your meals.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 d-flex flex-column justify-content-center align-items-center bg-white shadow-sm">
                <i className="fas fa-truck-fast fa-3x text-info mb-3"></i>
                <h3 className="h5">Fast Delivery</h3>
                <p className="text-muted">Get your favorite dishes delivered hot and fresh, right to your doorstep.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 d-flex flex-column justify-content-center align-items-center bg-white shadow-sm">
                <i className="fas fa-utensils fa-3x text-warning mb-3"></i>
                <h3 className="h5">Wide Variety</h3>
                <p className="text-muted">Explore a diverse menu with options to satisfy every craving and diet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
