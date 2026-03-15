import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { Services } from './components/Services';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

export default function App() {
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('ownerToken') || '');

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('ownerToken', token);
    setAdminToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('token');
    setAdminToken('');
  };

  if (isAdminRoute) {
    if (!adminToken) {
      return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    return <AdminPanel token={adminToken} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen font-['Inter',sans-serif]">
      <Navbar />
      <Hero />
      <StatsBar />
      <Services />
      <Gallery />
      <Testimonials />
      <Footer />
    </div>
  );
}
