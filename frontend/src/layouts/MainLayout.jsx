import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <main style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
