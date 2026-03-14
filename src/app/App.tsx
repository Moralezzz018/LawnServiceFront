import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen font-['Inter',sans-serif]">
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <Footer />
    </div>
  );
}
