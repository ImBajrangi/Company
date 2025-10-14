import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import type { Order } from '../context/CartContext';

const AdminPage: React.FC = () => {
  const { orders, setOrders } = useContext(CartContext)!;
  const [orderStatus, setOrderStatus] = useState<{[key: string]: string}>({});

  const handleStatusChange = (orderId: string, status: string) => {
    setOrderStatus(prev => ({...prev, [orderId]: status}));
    // In a real app, you would also update the order in the backend
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Dashboard</h1>
      <div className="card shadow-sm p-4">
        <h3>Current Orders</h3>
        {orders.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {order.customer.name}<br/>
                    <small>{order.customer.address}</small><br/>
                    <small>{order.customer.contact}</small>
                  </td>
                  <td>
                    <ul className="list-unstyled">
                      {order.items.map(item => (
                        <li key={item.id}>{item.name} x {item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Ready for Pickup' ? 'bg-warning text-dark' : 'bg-info'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="form-select"
                      value={orderStatus[order.id] || order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Received">Received</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No current orders.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
