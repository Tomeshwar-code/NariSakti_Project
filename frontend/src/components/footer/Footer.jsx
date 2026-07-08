import React from 'react';

function Footer() {
  return (
    <footer className="site-footer" style={{ padding: '24px', background: '#f5f5f5', textAlign: 'center' }}>
      <p>© {new Date().getFullYear()} Narisakti Marketplace. All rights reserved.</p>
    </footer>
  );
}

export default Footer;