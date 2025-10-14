import React, { useState } from 'react';
import { menuItems, categories } from '../data/mockData';
import { useCart } from '../hooks/useCart';

const MenuPage: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  return (
    <div className="container my-5 fade-in">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Explore Our Menu</h1>
        <p className="lead text-muted">Made with love, from our kitchen to your table.</p>
      </div>

      {/* Category Filter */}
      <div className="category-filter text-center mb-5">
        <button className={`btn btn-pills mx-2 ${!selectedCategory ? 'active' : ''}`} onClick={() => handleCategoryFilter(null)}>
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`btn btn-pills mx-2 ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryFilter(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {filteredMenuItems.map(item => (
          <div key={item.id} className="col">
            <div className="card h-100 border-0">
              <img src={item.image} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover', borderRadius: '20px' }} />
              <div className="card-body p-4">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text text-muted">{item.description}</p>
              </div>
              <div className="card-footer bg-transparent border-0 p-4 pt-0">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="h5 mb-0">${item.price.toFixed(2)}</p>
                  <button className="btn btn-primary btn-sm rounded-circle" style={{ width: '40px', height: '40px' }} onClick={() => addToCart(item)}>
                    <i className="fas fa-plus"></i>
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
