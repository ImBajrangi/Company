import React from 'react';

const OrderTrackingPage: React.FC = () => {
  return (
    <div className="container mt-5 text-center">
      <h1>Track Your Order</h1>
      <p className="lead">Enter your order ID to see its status.</p>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input type="text" className="form-control form-control-lg" placeholder="Enter Order ID" aria-label="Order ID" />
            <button className="btn btn-primary btn-lg" type="button">Track Order</button>
          </div>
          <div className="card mt-4 p-4 shadow-sm text-start">
            <h5>Order Status:</h5>
            <p><strong>Order ID:</strong> #123456789</p>
            <p><strong>Status:</strong> <span className="badge bg-warning text-dark">Preparing</span></p>
            <p><strong>Estimated Delivery:</strong> 30-45 minutes</p>
            <div className="progress mt-3" style={{ height: '25px' }}>
              <div 
                className="progress-bar bg-info" 
                role="progressbar" 
                style={{ width: '50%' }} 
                aria-valuenow={50} 
                aria-valuemin={0} 
                aria-valuemax={100}
              >
                Order Prepared
              </div>
            </div>
            <small className="text-muted mt-2">Last updated: Just now</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
