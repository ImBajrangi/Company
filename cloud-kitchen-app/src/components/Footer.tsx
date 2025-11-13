import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container text-center">
        <span>&copy; {currentYear} CloudKitchen. All rights reserved.</span>
        <div className="mt-2">
          <a href="#" className="text-white me-3">Privacy Policy</a>
          <a href="#" className="text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
