
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tighter text-blue-600 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              STELLARIS <span className="text-slate-900">GOLF</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollTo('problema')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition uppercase tracking-wider">El Problema</button>
            <button onClick={() => scrollTo('solucion')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition uppercase tracking-wider">Solución</button>
            <button onClick={() => scrollTo('opciones')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition uppercase tracking-wider">Opciones</button>
            <button onClick={() => scrollTo('precios')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition uppercase tracking-wider">Precios</button>
            <button 
              onClick={() => scrollTo('demo')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-extrabold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-200"
            >
              Demo en Vivo
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-900 p-2">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-white z-50 p-6 flex flex-col space-y-4 animate-in slide-in-from-right duration-300">
          <button onClick={() => scrollTo('problema')} className="text-left text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">El Problema</button>
          <button onClick={() => scrollTo('solucion')} className="text-left text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Solución</button>
          <button onClick={() => scrollTo('opciones')} className="text-left text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Opciones</button>
          <button onClick={() => scrollTo('precios')} className="text-left text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Precios</button>
          <button onClick={() => scrollTo('demo')} className="bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-lg">
            Probar Demo
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
