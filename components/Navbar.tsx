
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  // Add effect to handle hash scrolling on page load
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 80;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white/90 backdrop-blur-md py-4 shadow-sm md:bg-transparent md:backdrop-blur-none md:shadow-none md:py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tighter text-blue-600 cursor-pointer" onClick={handleLogoClick}>
              HADES <span className="text-slate-900">GOLF</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollTo('problema')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition uppercase tracking-wider">El Problema</button>
            <button onClick={() => scrollTo('solucion')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition uppercase tracking-wider">Solución</button>
            <button onClick={() => scrollTo('opciones')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition uppercase tracking-wider">Opciones</button>
            <button onClick={() => scrollTo('precios')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition uppercase tracking-wider">Precios</button>
            <Link to="/blog" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition uppercase tracking-wider">Blog</Link>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-900 p-2">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-white z-50 p-6 flex flex-col space-y-4 animate-in slide-in-from-right duration-300 h-[calc(100vh-60px)] overflow-y-auto">
          <button onClick={() => scrollTo('problema')} className="text-left text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">El Problema</button>
          <button onClick={() => scrollTo('solucion')} className="text-left text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Solución</button>
          <button onClick={() => scrollTo('opciones')} className="text-left text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Opciones</button>
          <button onClick={() => scrollTo('precios')} className="text-left text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Precios</button>
          <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-left text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 block">Blog</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
