import React, { useState } from 'react';

const OrderTrackingPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [trackingStep, setTrackingStep] = useState(0);

  const handleTrackOrder = () => {
    if (orderId) {
      setOrderStatus('Searching for your order...');
      setTrackingStep(0);
      setTimeout(() => {
        setOrderStatus(`Order #${orderId} is confirmed.`);
        setTrackingStep(1);
        setTimeout(() => {
          setOrderStatus(`Your food is being prepared.`);
          setTrackingStep(2);
          setTimeout(() => {
            setOrderStatus(`Your order is out for delivery.`);
            setTrackingStep(3);
            setTimeout(() => {
              setOrderStatus(`Your order has been delivered.`);
              setTrackingStep(4);
            }, 3000);
          }, 3000);
        }, 3000);
      }, 2000);
    } else {
      setOrderStatus('Please enter a valid Order ID.');
    }
  };

  const steps = ['Confirmed', 'Preparing', 'On its way', 'Delivered'];

  return (
    <div className="container my-5 fade-in">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Order Status</h1>
        <p className="lead text-muted">Follow your order from our kitchen to your door.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="search-bar mb-5">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter your Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary" type="button" onClick={handleTrackOrder}>
              Track
            </button>
          </div>
        </div>
      </div>

      {orderStatus && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-10">
            <div className="card border-0">
              <div className="card-body text-center p-5">
                <p className="h4 mb-5">{orderStatus}</p>
                <div className="tracking-timeline">
                  <div className="progress" style={{ height: '3px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${((trackingStep - 1) / (steps.length - 1)) * 100}%` }}
                      aria-valuenow={trackingStep}
                      aria-valuemin={0}
                      aria-valuemax={steps.length}
                    ></div>
                  </div>
                  <div className="row mt-3">
                    {steps.map((step, index) => (
                      <div key={index} className="col text-center">
                        <div className={`step-icon ${trackingStep > index ? 'completed' : ''}`}>
                          {trackingStep > index ? <i className="fas fa-check"></i> : ''}
                        </div>
                        <p className="mt-2 text-muted"><small>{step}</small></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
