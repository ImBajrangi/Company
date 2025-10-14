import React from 'react';
import { menuItems } from '../data/mockData';

// Mock data for recent orders
const recentOrders = [
  { id: 1, customer: 'John Doe', total: 25.50, status: 'Pending' },
  { id: 2, customer: 'Jane Smith', total: 18.75, status: 'In Progress' },
  { id: 3, customer: 'Mike Johnson', total: 32.00, status: 'Completed' },
  { id: 4, customer: 'Emily Davis', total: 45.10, status: 'Pending' },
];

const AdminPage: React.FC = () => {
  return (
    <div className="container my-5 fade-in">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Dashboard</h1>
        <p className="lead text-muted">Overview of your kitchen's activity.</p>
      </div>

      <div className="row">
        {/* Menu Management Section */}
        <div className="col-lg-12 mb-5">
          <div className="card border-0">
            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Menu</h4>
              <button className="btn btn-primary">Add Item</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-borderless table-hover align-middle">
                  <tbody>
                    {menuItems.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }} />
                            <span className="ms-3 fw-bold">{item.name}</span>
                          </div>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-light me-2">Edit</button>
                          <button className="btn btn-sm btn-light text-danger">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="col-lg-12">
          <div className="card border-0">
            <div className="card-header bg-transparent border-0">
              <h4 className="card-title mb-0">Recent Orders</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {recentOrders.map(order => (
                  <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                    <div>
                      <h6 className="mb-0">Order #{order.id}</h6>
                      <small className="text-muted">{order.customer}</small>
                    </div>
                    <div>
                      <span className={`badge bg-${order.status === 'Completed' ? 'success' : order.status === 'In Progress' ? 'warning' : 'danger'}`}>
                        {order.status}
                      </span>
                      <span className="ms-3 fw-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
