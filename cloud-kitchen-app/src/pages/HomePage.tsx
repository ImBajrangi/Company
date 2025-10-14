import React from 'react';
import { Link } from 'react-router-dom';
import { menuItems, categories } from '../data/mockData';

const HomePage: React.FC = () => {
  const featuredItems = menuItems.slice(0, 4);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-2 fw-bold">Crave it? Get it.</h1>
              <p className="lead my-4">Your favorite local restaurants, delivered to your door.</p>
              <div className="search-bar">
                <input type="text" className="form-control" placeholder="Find your next meal" />
              </div>
            </div>
            <div className="col-md-6">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Food" className="img-fluid rounded-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="category-section text-center">
        <div className="container">
          <h2 className="mb-5">Order from your favorite categories</h2>
          <div className="row justify-content-center">
            {categories.map(category => (
              <div key={category.id} className="col-lg-2 col-md-3 col-6 mb-4">
                <div className="card category-card border-0 bg-transparent">
                  <img src={category.image} alt={category.name} className="rounded-circle" />
                  <div className="card-body">
                    <h5 className="card-title">{category.name}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="container py-5">
        <h2 className="text-center mb-5">Featured Dishes</h2>
        <div className="row">
          {featuredItems.map(item => (
            <div key={item.id} className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100">
                <img src={item.image} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-muted">{item.description}</p>
                </div>
                <div className="card-footer bg-white border-0 pt-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="h5 mb-0">${item.price.toFixed(2)}</p>
                    <button className="btn btn-primary btn-sm">Add</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
