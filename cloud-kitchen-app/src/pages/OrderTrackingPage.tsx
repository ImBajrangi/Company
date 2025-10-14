import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import type { Order } from '../context/CartContext';

const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders } = useContext(CartContext)!;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId, orders]);

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'Received': return 25;
      case 'Preparing': return 50;
      case 'Ready for Pickup': return 75;
      case 'Out for Delivery': return 90;
      case 'Delivered': return 100;
      default: return 0;
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Track Your Order</h1>
      {order ? (
        <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <h5>Order ID: {order.id}</h5>
          <p><strong>Status:</strong> <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-info'}`}>{order.status}</span></p>
          
          <div className="progress mt-3" style={{ height: '25px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${getStatusProgress(order.status)}%` }} 
              aria-valuenow={getStatusProgress(order.status)}
              aria-valuemin={0} 
              aria-valuemax={100}
            >
              {order.status}
            </div>
          </div>

          <ul className="timeline mt-4">
            <li className={getStatusProgress(order.status) >= 25 ? 'active' : ''}>Order Received</li>
            <li className={getStatusProgress(order.status) >= 50 ? 'active' : ''}>Preparing</li>
            <li className={getStatusProgress(order.status) >= 75 ? 'active' : ''}>Ready for Pickup</li>
            <li className={getStatusProgress(order.status) >= 90 ? 'active' : ''}>Out for Delivery</li>
            <li className={getStatusProgress(order.status) === 100 ? 'active' : ''}>Delivered</li>
          </ul>

        </div>
      ) : (
        <p className="text-center">Order not found. Please check the order ID.</p>
      )}
    </div>
  );
};

export default OrderTrackingPage;
