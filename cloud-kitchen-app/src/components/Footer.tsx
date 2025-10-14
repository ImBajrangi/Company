import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h5>Cloud Kitchen</h5>
            <p className="text-muted">Your favorite food, delivered.</p>
          </div>
          <div className="col-md-3">
            <h5>About</h5>
            <ul className="list-unstyled">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Live Chat</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <div>
              <a href="#" className="me-3"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="me-3"><i className="fab fa-twitter"></i></a>
              <a href="#" className="me-3"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p>&copy; 2025 Cloud Kitchen. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;