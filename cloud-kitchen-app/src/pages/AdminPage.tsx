import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="container mt-5 text-center">
      <h1>Admin Dashboard</h1>
      <p className="lead">Manage your cloud kitchen operations.</p>
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="card shadow-sm p-4 mb-4">
            <h3>Recent Orders</h3>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Order #A101 - John Doe
                <span className="badge bg-success">Completed</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Order #A102 - Jane Smith
                <span className="badge bg-warning text-dark">Pending</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Order #A103 - Robert Johnson
                <span className="badge bg-info">In Progress</span>
              </li>
            </ul>
            <button className="btn btn-primary mt-3">View All Orders</button>
          </div>

          <div className="card shadow-sm p-4">
            <h3>Menu Management</h3>
            <p>Add, edit, or remove menu items.</p>
            <button className="btn btn-secondary">Go to Menu Editor</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
